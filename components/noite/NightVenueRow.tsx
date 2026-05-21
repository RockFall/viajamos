"use client";

import type { NightEvent } from "@/types";
import { NIGHT_TYPE_LABELS } from "@/lib/labels";
import { isHotNightEvent } from "@/lib/night-radar";

interface NightVenueRowProps {
  event: NightEvent;
  onSelect?: () => void;
}

export function NightVenueRow({ event, onSelect }: NightVenueRowProps) {
  const vibe =
    event.notes ??
    [event.priceInfo, event.dressCode].filter(Boolean).join(" · ");

  const timeLabel = event.endTime
    ? `${event.startTime} – ${event.endTime}`
    : event.startTime;

  const content = (
    <div className="flex items-start justify-between gap-3">
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-terracotta">
            {NIGHT_TYPE_LABELS[event.type]}
          </span>
          {isHotNightEvent(event) && (
            <span className="rounded-full bg-terracotta/15 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-[0.15em] text-terracotta">
              Hot
            </span>
          )}
        </div>
        <h4 className="mt-1.5 font-serif text-[20px] leading-tight tracking-tight text-sand-50">
          {event.title}
        </h4>
        <p className="mt-0.5 text-xs text-sand-200/50">{event.venue}</p>
        {vibe && (
          <p className="mt-1 line-clamp-2 text-[12px] text-sand-200/60">{vibe}</p>
        )}
      </div>
      <div className="shrink-0 text-right">
        <p className="font-serif text-sm italic text-sand-100">{timeLabel}</p>
        {event.neighborhood && (
          <p className="mt-1 text-[10px] uppercase tracking-[0.15em] text-sand-200/50">
            {event.neighborhood}
          </p>
        )}
      </div>
    </div>
  );

  if (onSelect) {
    return (
      <li>
        <button
          type="button"
          onClick={onSelect}
          className="group w-full rounded-2xl bg-sand-50/[0.03] p-4 text-left ring-1 ring-sand-50/10 transition hover:bg-sand-50/[0.06]"
        >
          {content}
        </button>
      </li>
    );
  }

  return (
    <li className="rounded-2xl bg-sand-50/[0.03] p-4 ring-1 ring-sand-50/10">
      {content}
    </li>
  );
}
