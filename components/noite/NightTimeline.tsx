"use client";

import type { NightEvent } from "@/types";
import { NIGHT_TYPE_LABELS } from "@/lib/labels";
import { isHotNightEvent } from "@/lib/night-radar";
import { NightTypeIcon } from "@/components/ui/NightIcons";

interface NightTimelineProps {
  events: NightEvent[];
  onSelectEvent: (event: NightEvent) => void;
}

export function NightTimeline({ events, onSelectEvent }: NightTimelineProps) {
  if (events.length === 0) return null;

  return (
    <section className="min-w-0">
      <div className="flex items-end justify-between border-b border-sand-50/10 pb-3">
        <h3 className="font-serif text-2xl tracking-tight text-sand-50">
          Linha do horário
        </h3>
        <span className="text-[10px] uppercase tracking-[0.2em] text-sand-200/50">
          {events.length} {events.length === 1 ? "parada" : "paradas"}
        </span>
      </div>
      <ol className="relative mt-6 space-y-0">
        <div
          className="absolute bottom-2 left-[27px] top-2 w-px bg-sand-50/15"
          aria-hidden
        />
        {events.map((event, index) => (
          <li key={event.id} className="relative flex gap-4 pb-6 last:pb-0">
            <div className="relative z-10 flex w-14 shrink-0 flex-col items-center pt-1">
              <span
                className={`size-3 rounded-full ring-2 ring-warm-black ${
                  isHotNightEvent(event)
                    ? "bg-terracotta"
                    : "bg-sand-50/30"
                }`}
              />
              <p className="mt-2 font-serif text-sm italic leading-none text-terracotta">
                {event.startTime}
              </p>
            </div>
            <button
              type="button"
              onClick={() => onSelectEvent(event)}
              className="min-w-0 flex-1 rounded-2xl bg-sand-50/[0.04] p-4 text-left ring-1 ring-sand-50/10 transition hover:bg-sand-50/[0.06]"
            >
              <div className="flex items-start gap-3">
                <div className="grid size-9 shrink-0 place-items-center rounded-xl bg-sand-50/10 text-terracotta">
                  <NightTypeIcon type={event.type} size={16} strokeWidth={2} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[9px] font-bold uppercase tracking-[0.15em] text-terracotta">
                      {NIGHT_TYPE_LABELS[event.type]}
                    </span>
                    {isHotNightEvent(event) && (
                      <span className="rounded-full bg-terracotta/15 px-1.5 py-0.5 text-[8px] font-bold uppercase text-terracotta">
                        Hot
                      </span>
                    )}
                  </div>
                  <p className="font-serif mt-1 text-lg leading-tight text-sand-50">
                    {event.title}
                  </p>
                  <p className="mt-0.5 text-xs text-sand-200/55">
                    {event.venue}
                    {event.neighborhood && ` · ${event.neighborhood}`}
                  </p>
                </div>
              </div>
              {index < events.length - 1 && (
                <p className="mt-2 text-[10px] text-sand-200/40">
                  {event.endTime ? `até ${event.endTime}` : ""}
                </p>
              )}
            </button>
          </li>
        ))}
      </ol>
    </section>
  );
}
