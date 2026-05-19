"use client";

import type { NightEvent } from "@/types";
import { NIGHT_TYPE_LABELS, INTENSITY_LABELS } from "@/lib/labels";
import { QuickActions } from "@/components/ui/QuickActions";
import { Clock, MapPin, Plus, Shirt } from "lucide-react";

interface NightEventCardProps {
  event: NightEvent;
  onAddToItinerary: () => void;
}

export function NightEventCard({ event, onAddToItinerary }: NightEventCardProps) {
  return (
    <article className="night-card rounded-2xl p-4">
      <div className="flex items-start justify-between">
        <span className="rounded-full bg-purple-500/20 px-2.5 py-0.5 text-xs font-medium text-purple-300">
          {NIGHT_TYPE_LABELS[event.type]}
        </span>
        {event.buyAhead && (
          <span className="text-xs text-amber-400">Comprar antes</span>
        )}
      </div>
      <h3 className="mt-2 text-lg font-bold text-white">{event.title}</h3>
      <p className="text-sm text-slate-400">{event.venue}</p>
      <div className="mt-3 space-y-1 text-sm text-slate-300">
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
        <span className="text-xs text-slate-500">
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
        className="mt-3 flex w-full items-center justify-center gap-1 rounded-xl bg-purple-600 py-2 text-sm font-semibold text-white"
      >
        <Plus size={16} />
        Adicionar ao roteiro
      </button>
    </article>
  );
}
