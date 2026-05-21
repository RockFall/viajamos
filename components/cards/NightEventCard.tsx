"use client";

import type { NightEvent } from "@/types";
import { EntityImage } from "@/components/ui/EntityImage";
import { NIGHT_TYPE_LABELS, INTENSITY_LABELS } from "@/lib/labels";
import { QuickActions } from "@/components/ui/QuickActions";
import { Clock, MapPin, Plus, Shirt } from "lucide-react";

interface NightEventCardProps {
  event: NightEvent;
  onAddToItinerary: () => void;
}

export function NightEventCard({ event, onAddToItinerary }: NightEventCardProps) {
  return (
    <article className="night-card overflow-hidden rounded-2xl text-sand-50">
      <div className="relative aspect-[16/10] w-full">
        <EntityImage
          kind="night-events"
          entityId={event.id}
          category={event.type}
          alt={event.title}
          fill
          className="object-cover opacity-90"
          sizes="320px"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-warm-black via-warm-black/40 to-transparent" />
      </div>
      <div className="p-4">
      <div className="flex items-start justify-between">
        <span className="rounded-full bg-terracotta/15 px-2.5 py-0.5 text-xs font-medium text-terracotta">
          {NIGHT_TYPE_LABELS[event.type]}
        </span>
        {event.buyAhead && (
          <span className="text-xs text-terracotta">Comprar antes</span>
        )}
      </div>
      <h3 className="mt-2 text-lg font-bold">{event.title}</h3>
      <p className="text-sm text-sand-200/60">{event.venue}</p>
      <div className="mt-3 space-y-1 text-sm text-sand-200/70">
        <span className="flex items-center gap-1">
          <Clock size={14} />
          {event.startTime}
          {event.endTime && ` – ${event.endTime}`}
        </span>
        {event.neighborhood && (
          <span className="flex items-center gap-1">
            <MapPin size={14} />
            {event.neighborhood}
          </span>
        )}
        {event.priceInfo && <p>{event.priceInfo}</p>}
        {event.dressCode && (
          <span className="flex items-center gap-1">
            <Shirt size={14} />
            {event.dressCode}
          </span>
        )}
        <span className="text-xs text-sand-200/50">
          {INTENSITY_LABELS[event.intensity]}
        </span>
      </div>
      <QuickActions
        googleMapsUrl={event.googleMapsUrl}
        appleMapsUrl={event.appleMapsUrl}
        uberUrl={event.uberUrl}
        websiteUrl={event.websiteUrl}
        ticketUrl={event.ticketUrl}
        compact
      />
      <button
        type="button"
        onClick={onAddToItinerary}
        className="mt-3 flex w-full items-center justify-center gap-1 rounded-full bg-terracotta py-2 text-sm font-semibold text-sand-50"
      >
        <Plus size={16} />
        Adicionar ao roteiro
      </button>
      </div>
    </article>
  );
}
