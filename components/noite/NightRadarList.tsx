"use client";

import type { NightEvent } from "@/types";
import { NightVenueRow } from "./NightVenueRow";

interface NightRadarListProps {
  events: NightEvent[];
  onSelectEvent: (event: NightEvent) => void;
}

export function NightRadarList({ events, onSelectEvent }: NightRadarListProps) {
  if (events.length === 0) return null;

  return (
    <section className="min-w-0">
      <div className="flex items-end justify-between border-b border-sand-50/10 pb-3">
        <h3 className="font-serif text-2xl tracking-tight text-sand-50">
          Radar
        </h3>
        <span className="text-[10px] uppercase tracking-[0.2em] text-sand-200/50">
          {events.length} {events.length === 1 ? "lugar" : "lugares"}
        </span>
      </div>
      <ul className="mt-5 space-y-3">
        {events.map((event) => (
          <NightVenueRow
            key={event.id}
            event={event}
            onSelect={() => onSelectEvent(event)}
          />
        ))}
      </ul>
    </section>
  );
}
