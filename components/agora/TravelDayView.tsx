"use client";

import type { ReactNode } from "react";
import { useMemo } from "react";
import { useTrip } from "@/context/TripProvider";
import {
  buildBoardingPassDisplay,
  buildTravelDaySubtitle,
} from "@/lib/boarding-pass";
import { BoardingPassCard } from "./BoardingPassCard";
import { FamilySeatsGrid } from "./FamilySeatsGrid";
import { IntegratedDateRail } from "./IntegratedDateRail";
import { SectionLabel } from "./SectionLabel";

interface TravelDayViewProps {
  selectedDate: string;
  today: string;
  dateRailProps: {
    onPrev: () => void;
    onNext: () => void;
    onToday: () => void;
    canPrev: boolean;
    canNext: boolean;
  };
}

export function TravelDayView({
  selectedDate,
  today,
  dateRailProps,
}: TravelDayViewProps) {
  const {
    family,
    flights,
    travelTimeline,
    checklists,
    checklistStates,
    toggleChecklistItem,
    tripDays,
  } = useTrip();

  const dayInfo = tripDays.find((d) => d.date === selectedDate);
  const dayFlights = flights.filter((f) => f.date === selectedDate);
  const dayTimeline = travelTimeline.filter((t) => t.date === selectedDate);
  const travelChecklist = checklists.find((c) => c.type === "travel_day");
  const isReturn = dayInfo?.isReturnDay;

  const boardingPass = useMemo(
    () => buildBoardingPassDisplay(dayFlights, dayInfo, isReturn),
    [dayFlights, dayInfo, isReturn]
  );

  const subtitle = useMemo(
    () => buildTravelDaySubtitle(boardingPass, dayInfo),
    [boardingPass, dayInfo]
  );

  const dateRail: ReactNode = (
    <IntegratedDateRail
      selectedDate={selectedDate}
      today={today}
      variant="dark"
      {...dateRailProps}
    />
  );

  return (
    <main className="relative mx-auto max-w-[48ch] space-y-8 px-6 pb-8 pt-10 text-sand-50">
      <div className="pointer-events-none absolute -top-20 right-0 size-80 rounded-full bg-terracotta/15 blur-[120px]" />

      <header className="relative">
        <div className="mb-6">{dateRail}</div>
        <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-terracotta">
          {isReturn ? "Dia de volta" : "Dia do voo"}
        </p>
        <h1 className="font-serif mt-2 text-[44px] leading-[0.9] tracking-tight">
          Boa
          <br />
          <em className="italic text-terracotta">viagem</em>
        </h1>
        <p className="mt-4 max-w-[34ch] text-sm leading-relaxed text-sand-200/65">
          {subtitle}
        </p>
      </header>

      <BoardingPassCard pass={boardingPass} />

      <section>
        <SectionLabel left="Quem senta onde" tone="dark" />
        <FamilySeatsGrid family={family} flights={dayFlights} />
      </section>

      {dayTimeline.length > 0 && (
        <section>
          <SectionLabel left="Linha do dia" tone="dark" />
          <ol className="mt-5 space-y-3">
            {dayTimeline.map((item, index) => {
              const done =
                item.time !== "A definir" &&
                new Date(`${selectedDate}T${item.time}`) < new Date();
              return (
                <li
                  key={item.id}
                  className="flex items-start gap-4 rounded-2xl bg-sand-50/[0.04] p-4 ring-1 ring-sand-50/10"
                >
                  <div className="w-14 shrink-0 text-right">
                    <p
                      className={`font-serif text-lg italic ${
                        done ? "text-sand-200/40" : "text-terracotta"
                      }`}
                    >
                      {item.time}
                    </p>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p
                      className={`font-serif text-[18px] leading-tight ${
                        done ? "line-through text-sand-200/50" : ""
                      }`}
                    >
                      {item.label}
                    </p>
                    {item.subtitle && (
                      <p className="mt-1 text-[12px] text-sand-200/60">
                        {item.subtitle}
                      </p>
                    )}
                    {!item.subtitle && index === 0 && item.isDeparture && (
                      <p className="mt-1 text-[12px] text-sand-200/60">
                        Primeiro passo do dia
                      </p>
                    )}
                  </div>
                </li>
              );
            })}
          </ol>
        </section>
      )}

      {travelChecklist && (
        <section>
          <SectionLabel left="Checklist rápido" tone="dark" />
          <div className="mt-5 space-y-2 rounded-[24px] bg-sand-50/[0.04] p-4 ring-1 ring-sand-50/10">
            {travelChecklist.items.map((item) => (
              <label
                key={item.id}
                className="flex cursor-pointer items-center gap-3"
              >
                <input
                  type="checkbox"
                  checked={checklistStates[item.id] ?? false}
                  onChange={() => toggleChecklistItem(item.id)}
                  className="size-5 rounded accent-terracotta"
                />
                <span
                  className={
                    checklistStates[item.id]
                      ? "text-sand-200/50 line-through"
                      : "text-sm"
                  }
                >
                  {item.label}
                </span>
              </label>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
