"use client";

import type { ItineraryEvent } from "@/types";
import { EntityImage } from "@/components/ui/EntityImage";
import { QuickActions } from "@/components/ui/QuickActions";

export function CollectivePlanHero({ event }: { event: ItineraryEvent }) {
  return (
    <div className="overflow-hidden rounded-[28px] bg-card shadow-[0_25px_50px_-25px_rgba(60,30,20,0.25)] ring-1 ring-border">
      <div className="relative">
        <div className="relative aspect-[4/3] w-full">
          <EntityImage
            kind="itinerary-events"
            entityId={event.id}
            category={event.category}
            alt={event.title}
            fill
            className="object-cover"
            sizes="(max-width: 512px) 100vw, 512px"
          />
        </div>
        <div className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-background/85 px-2.5 py-1 backdrop-blur-md">
          <span className="size-1.5 rounded-full bg-terracotta" />
          <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-warm-black">
            Plano coletivo
          </span>
        </div>
      </div>
      <div className="p-6">
        <div className="flex items-baseline justify-between gap-4">
          <h2 className="font-serif text-3xl leading-[1.05] tracking-tight text-balance text-warm-black">
            {event.title}
          </h2>
          {event.startTime && (
            <span className="shrink-0 font-serif text-xl italic text-terracotta">
              {event.startTime}
            </span>
          )}
        </div>
        {event.description && (
          <p className="mt-3 text-[15px] leading-relaxed text-pretty text-muted-foreground">
            {event.description}
          </p>
        )}
        <QuickActions
          googleMapsUrl={event.googleMapsUrl}
          appleMapsUrl={event.appleMapsUrl}
          uberUrl={event.uberUrl}
          websiteUrl={event.websiteUrl}
          ticketUrl={event.ticketUrl}
          reservationUrl={event.reservationUrl}
          className="mt-5"
        />
      </div>
    </div>
  );
}
