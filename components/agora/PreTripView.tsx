"use client";

import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { useTrip } from "@/context/TripProvider";
import { FAMILY_INITIALS } from "@/lib/family-initials";
import { getCountdownParts } from "@/lib/trip-phase";
import { AgoraHero } from "./AgoraHero";
import { SectionLabel } from "./SectionLabel";

function CountUnit({
  value,
  label,
  big,
}: {
  value: number;
  label: string;
  big?: boolean;
}) {
  return (
    <div>
      <p
        className={`font-serif tabular-nums tracking-tight text-sand-50 ${
          big ? "text-6xl" : "text-5xl"
        }`}
      >
        {String(value).padStart(2, "0")}
      </p>
      <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.2em] text-sand-200/60">
        {label}
      </p>
    </div>
  );
}

interface PreTripViewProps {
  selectedDate: string;
  dateRail: ReactNode;
}

export function PreTripView({ selectedDate, dateRail }: PreTripViewProps) {
  const {
    config,
    family,
    tasks,
    checklists,
    checklistStates,
    toggleChecklistItem,
    itineraryEvents,
  } = useTrip();

  const { days, hours, minutes } = getCountdownParts(
    selectedDate,
    config.startDate
  );
  const beforeChecklist = checklists.find((c) => c.type === "before_trip");
  const preTripTasks = tasks.filter(
    (t) => !t.dueDate || t.dueDate <= config.startDate
  );
  const openPreTasks = preTripTasks.filter((t) => t.status === "open");

  const firstNightEvent = itineraryEvents
    .filter(
      (e) =>
        e.date >= config.startDate &&
        e.status !== "cancelled" &&
        (e.category === "food" || e.period === "night")
    )
    .sort((a, b) => a.date.localeCompare(b.date))[0];

  const readiness = family.map((member) => {
    const memberTasks = preTripTasks.filter((t) => t.assignedTo === member.id);
    const open = memberTasks.filter((t) => t.status === "open");
    const progress =
      memberTasks.length === 0
        ? 100
        : Math.round(
            ((memberTasks.length - open.length) / memberTasks.length) * 100
          );
    return {
      member,
      progress,
      status: open[0]?.title ?? "Tudo pronto",
    };
  });

  const openChecklist =
    beforeChecklist?.items.filter((i) => !checklistStates[i.id]).length ?? 0;

  return (
    <>
      <AgoraHero
        date={selectedDate}
        theme={
          days <= 1
            ? "Quase embarcando"
            : "Miami à vista"
        }
        eyebrow={dateRail ? undefined : "Contagem regressiva"}
        dateRail={dateRail}
      />

      <main className="mx-auto mt-8 max-w-[48ch] space-y-10 px-6">
        <section className="relative overflow-hidden rounded-[28px] bg-warm-black text-sand-50">
          <div className="absolute -right-16 -top-16 size-64 rounded-full bg-terracotta/25 blur-3xl" />
          <div className="absolute -bottom-20 -left-10 size-56 rounded-full bg-terracotta-deep/20 blur-3xl" />
          <div className="relative p-7">
            <div className="flex items-center gap-2">
              <span className="size-1.5 animate-pulse rounded-full bg-terracotta" />
              <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-terracotta">
                Faltam
              </span>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-3 text-center">
              <CountUnit value={days} label="dias" big />
              <CountUnit value={hours} label="horas" />
              <CountUnit value={minutes} label="min" />
            </div>
            <p className="mt-6 max-w-[34ch] text-[13px] leading-relaxed text-sand-200/70">
              Decolagem dia{" "}
              <strong className="text-sand-50">
                {config.startDate.slice(8, 10)} mai
              </strong>
              . Confira voos e transferes em <Link href="/mais" className="text-terracotta underline">Mais</Link>.
            </p>
          </div>
        </section>

        {beforeChecklist && (
          <section>
            <SectionLabel
              left="Antes de embarcar"
              right={`${openChecklist} abertas`}
            />
            <div className="mt-5 overflow-hidden rounded-[24px] bg-card ring-1 ring-border">
              {beforeChecklist.items.map((item, i) => (
                <label
                  key={item.id}
                  className={`flex cursor-pointer items-center gap-3 px-4 py-3.5 ${
                    i < beforeChecklist.items.length - 1
                      ? "border-b border-border/60"
                      : ""
                  }`}
                >
                  <span
                    className={`grid size-5 shrink-0 place-items-center rounded-md ring-1 ${
                      checklistStates[item.id]
                        ? "bg-terracotta ring-terracotta"
                        : "bg-card ring-warm-black/20"
                    }`}
                  >
                    {checklistStates[item.id] && (
                      <span className="text-[10px] font-bold text-white">
                        ✓
                      </span>
                    )}
                  </span>
                  <span
                    className={`flex-1 text-sm font-medium tracking-tight ${
                      checklistStates[item.id]
                        ? "text-muted-foreground line-through"
                        : ""
                    }`}
                  >
                    {item.label}
                  </span>
                </label>
              ))}
            </div>
          </section>
        )}

        {openPreTasks.length > 0 && (
          <section>
            <SectionLabel left="Pendências pré-viagem" />
            <div className="mt-5 overflow-hidden rounded-[24px] bg-card ring-1 ring-border">
              {openPreTasks.slice(0, 6).map((task, i) => (
                <div
                  key={task.id}
                  className={`px-4 py-3.5 ${
                    i < Math.min(openPreTasks.length, 6) - 1
                      ? "border-b border-border/60"
                      : ""
                  }`}
                >
                  <p className="text-sm font-medium tracking-tight">
                    {task.title}
                  </p>
                  {task.dueDate && (
                    <p className="mt-0.5 text-[11px] text-muted-foreground">
                      Até {task.dueDate.slice(8, 10)}/{task.dueDate.slice(5, 7)}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        <section>
          <SectionLabel left="Quem está pronto" />
          <div className="mt-5 grid grid-cols-2 gap-3">
            {readiness.map(({ member, progress, status }) => (
              <div
                key={member.id}
                className="rounded-[20px] bg-card p-4 ring-1 ring-border"
              >
                <div className="flex items-center gap-3">
                  <div className="grid size-9 place-items-center rounded-full bg-sand-200 font-serif text-base italic text-warm-black ring-2 ring-card">
                    {FAMILY_INITIALS[member.id]}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold tracking-tight">
                      {member.shortName}
                    </p>
                    <p className="truncate text-[11px] text-muted-foreground">
                      {status}
                    </p>
                  </div>
                </div>
                <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-sand-200">
                  <div
                    className="h-full bg-terracotta transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="mt-1.5 text-[10px] font-bold uppercase tracking-[0.15em] text-terracotta">
                  {progress}%
                </p>
              </div>
            ))}
          </div>
        </section>

        {firstNightEvent && (
          <section className="relative overflow-hidden rounded-[28px] bg-card ring-1 ring-border">
            <div className="relative aspect-[16/9] w-full">
              <Image
                src="/images/dinner-mandolin.jpg"
                alt={firstNightEvent.title}
                fill
                className="object-cover"
                sizes="(max-width: 512px) 100vw, 512px"
              />
            </div>
            <div className="p-6">
              <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-terracotta">
                Primeiro destaque
              </p>
              <h3 className="font-serif mt-2 text-2xl leading-tight">
                {firstNightEvent.title}
              </h3>
              {firstNightEvent.description && (
                <p className="mt-2 max-w-[36ch] text-[13px] leading-relaxed text-muted-foreground">
                  {firstNightEvent.description}
                </p>
              )}
            </div>
          </section>
        )}
      </main>
    </>
  );
}
