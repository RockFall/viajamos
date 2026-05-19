"use client";

import { useTrip } from "@/context/TripProvider";
import { DayHeader } from "@/components/layout/DayHeader";
import { PersonNextPlanCard } from "@/components/cards/PersonNextPlanCard";
import { CollectivePlanCard } from "@/components/cards/CollectivePlanCard";
import { BoardingPassCard } from "@/components/cards/BoardingPassCard";
import {
  getNextCollectiveEvent,
  getNextEventForPerson,
  isTravelDay,
} from "@/lib/itinerary";
import { getTomorrow } from "@/lib/dates";
import { flights, travelTimeline, checklists } from "@/lib/data";
import type { FamilyMemberId } from "@/types";
import { AlertCircle, Calendar, CheckSquare } from "lucide-react";

export default function AgoraPage() {
  const {
    today,
    itineraryEvents,
    tasks,
    family,
    tripDays,
    config,
    checklistStates,
    toggleChecklistItem,
  } = useTrip();

  const travelMode = isTravelDay(today, config.startDate, config.endDate);
  const dayInfo = tripDays.find((d) => d.date === today);
  const familyIds = family.map((m) => m.id) as FamilyMemberId[];
  const collectiveEvent = getNextCollectiveEvent(
    itineraryEvents,
    familyIds,
    today
  );
  const tomorrow = getTomorrow(today);
  const tomorrowDay = tripDays.find((d) => d.date === tomorrow);
  const tomorrowEvents = itineraryEvents
    .filter((e) => e.date === tomorrow && e.status !== "cancelled")
    .slice(0, 3);
  const urgentTasks = tasks.filter(
    (t) => t.status === "open" && t.priority === "high"
  );
  const dayFlights = flights.filter((f) => f.date === today);
  const dayTimeline = travelTimeline.filter((t) => t.date === today);
  const travelChecklist = checklists.find((c) => c.type === "travel_day");

  if (travelMode) {
    return (
      <div className="animate-fade-in space-y-6">
        <DayHeader
          date={today}
          theme={dayInfo?.theme ?? "Dia de viagem"}
          weather={dayInfo?.weather}
          baseAddress={config.baseAddress}
        />
        <section>
          <h2 className="mb-3 text-lg font-bold">Cartões de embarque</h2>
          <div className="space-y-4">
            {dayFlights.map((f) => (
              <BoardingPassCard key={f.id} flight={f} />
            ))}
          </div>
        </section>
        <section>
          <h2 className="mb-3 text-lg font-bold">Linha do tempo</h2>
          <div className="card p-4">
            {dayTimeline.map((item, i) => (
              <div key={item.id} className="flex gap-3 pb-4 last:pb-0">
                <div className="flex flex-col items-center">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-teal text-xs font-bold text-white">
                    {i + 1}
                  </div>
                  {i < dayTimeline.length - 1 && (
                    <div className="mt-1 h-full w-0.5 bg-teal/30" />
                  )}
                </div>
                <div className="pb-2">
                  <p className="font-semibold text-teal-dark">{item.time}</p>
                  <p className="text-sm">{item.label}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
        {travelChecklist && (
          <section>
            <h2 className="mb-3 flex items-center gap-2 text-lg font-bold">
              <CheckSquare size={20} />
              Checklist rápido
            </h2>
            <div className="card space-y-2 p-4">
              {travelChecklist.items.map((item) => (
                <label
                  key={item.id}
                  className="flex cursor-pointer items-center gap-3"
                >
                  <input
                    type="checkbox"
                    checked={checklistStates[item.id] ?? false}
                    onChange={() => toggleChecklistItem(item.id)}
                    className="h-5 w-5 rounded accent-teal"
                  />
                  <span
                    className={
                      checklistStates[item.id]
                        ? "text-muted line-through"
                        : ""
                    }
                  >
                    {item.label}
                  </span>
                </label>
              ))}
            </div>
          </section>
        )}
        <section className="card p-4">
          <h2 className="mb-2 font-bold">Informações importantes</h2>
          <p className="text-sm">
            <strong>Hospedagem:</strong> {config.baseAddress}
          </p>
          <p className="mt-1 text-sm">
            <strong>Transporte:</strong> Uber até a casa / aeroporto
          </p>
        </section>
      </div>
    );
  }

  return (
    <div className="animate-fade-in space-y-6">
      <DayHeader
        date={today}
        theme={dayInfo?.theme ?? "Miami"}
        weather={dayInfo?.weather}
        baseAddress={config.baseAddress}
      />

      <section>
        <h2 className="mb-3 text-lg font-bold">Próximo por pessoa</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {family.map((member) => (
            <PersonNextPlanCard
              key={member.id}
              member={member}
              event={getNextEventForPerson(
                itineraryEvents,
                member.id,
                today
              )}
            />
          ))}
        </div>
      </section>

      {collectiveEvent && (
        <section>
          <CollectivePlanCard event={collectiveEvent} />
        </section>
      )}

      {urgentTasks.length > 0 && (
        <section className="card border-l-4 border-coral p-4">
          <h2 className="mb-2 flex items-center gap-2 font-bold text-coral">
            <AlertCircle size={18} />
            Pendências urgentes
          </h2>
          <ul className="space-y-1">
            {urgentTasks.map((t) => (
              <li key={t.id} className="text-sm">
                • {t.title}
              </li>
            ))}
          </ul>
        </section>
      )}

      {tomorrowDay && (
        <section className="card p-4">
          <h2 className="mb-2 flex items-center gap-2 font-bold">
            <Calendar size={18} className="text-teal" />
            Amanhã — {tomorrowDay.title}
          </h2>
          <p className="text-sm text-muted">{tomorrowDay.theme}</p>
          {tomorrowEvents.length > 0 && (
            <ul className="mt-2 space-y-1 text-sm">
              {tomorrowEvents.map((e) => (
                <li key={e.id}>
                  {e.startTime && `${e.startTime} — `}
                  {e.title}
                </li>
              ))}
            </ul>
          )}
        </section>
      )}
    </div>
  );
}
