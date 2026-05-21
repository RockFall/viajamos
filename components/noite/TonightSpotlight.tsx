"use client";

import type { NightEvent } from "@/types";
import { EntityImage } from "@/components/ui/EntityImage";
import { NIGHT_TYPE_LABELS } from "@/lib/labels";
import { QuickActions } from "@/components/ui/QuickActions";

interface TonightSpotlightProps {
  event: NightEvent;
  onAddToItinerary: () => void;
}

export function TonightSpotlight({
  event,
  onAddToItinerary,
}: TonightSpotlightProps) {
  const timeLabel = event.endTime
    ? `${event.startTime} – ${event.endTime}`
    : event.startTime;

  return (
    <section className="overflow-hidden rounded-[28px] bg-sand-50/[0.04] ring-1 ring-sand-50/10 backdrop-blur-sm">
      <div className="relative aspect-[21/9] w-full">
        <EntityImage
          kind="night-events"
          entityId={event.id}
          category={event.type}
          alt={event.title}
          fill
          className="object-cover opacity-80"
          sizes="512px"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-warm-black via-warm-black/50 to-warm-black/20" />
      </div>
      <div className="p-6">
      <div className="flex items-center justify-between gap-3">
        <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-terracotta">
          Esta noite
        </span>
        <span className="font-serif text-sm italic text-sand-200/60">
          {timeLabel}
        </span>
      </div>
      <p className="mt-2 text-[9px] font-bold uppercase tracking-[0.2em] text-terracotta/80">
        {NIGHT_TYPE_LABELS[event.type]}
        {event.neighborhood && ` · ${event.neighborhood}`}
      </p>
      <h2 className="mt-2 font-serif text-3xl leading-[1.05] tracking-tight text-sand-50">
        {event.title}
      </h2>
      <p className="mt-1 text-sm text-sand-200/70">{event.venue}</p>
      {event.notes && (
        <p className="mt-3 text-[14px] leading-relaxed text-sand-200/70">
          {event.notes}
        </p>
      )}
      {!event.notes && event.priceInfo && (
        <p className="mt-3 text-[14px] leading-relaxed text-sand-200/70">
          {event.priceInfo}
        </p>
      )}
      <QuickActions
        googleMapsUrl={event.googleMapsUrl}
        appleMapsUrl={event.appleMapsUrl}
        uberUrl={event.uberUrl}
        websiteUrl={event.websiteUrl}
        ticketUrl={event.ticketUrl}
        className="mt-4 min-w-0"
      />
      <button
        type="button"
        onClick={onAddToItinerary}
        className="mt-4 w-full rounded-full bg-terracotta py-2.5 text-[10px] font-bold uppercase tracking-[0.18em] text-sand-50 transition active:scale-[0.98]"
      >
        Virar evento no roteiro
      </button>
      </div>
    </section>
  );
}
