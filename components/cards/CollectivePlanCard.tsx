"use client";

import type { ItineraryEvent } from "@/types";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { QuickActions } from "@/components/ui/QuickActions";
import { Users, Clock, MapPin } from "lucide-react";

export function CollectivePlanCard({ event }: { event: ItineraryEvent }) {
  return (
    <div className="card-elevated gradient-card border border-teal/20 p-5">
      <div className="flex items-center gap-2 text-teal-dark">
        <Users size={18} />
        <span className="text-sm font-semibold uppercase tracking-wide">
          Plano da família
        </span>
      </div>
      <h3 className="mt-2 text-xl font-bold">{event.title}</h3>
      {event.description && (
        <p className="mt-1 text-sm text-muted">{event.description}</p>
      )}
      <div className="mt-3 flex flex-wrap gap-3 text-sm">
        {event.startTime && (
          <span className="flex items-center gap-1">
            <Clock size={14} />
            {event.startTime}
            {event.leaveBy && ` · Sair ${event.leaveBy}`}
          </span>
        )}
        {event.locationName && (
          <span className="flex items-center gap-1">
            <MapPin size={14} />
            {event.locationName}
          </span>
        )}
      </div>
      <div className="mt-2">
        <StatusBadge status={event.status} />
      </div>
      <QuickActions
        googleMapsUrl={event.googleMapsUrl}
        appleMapsUrl={event.appleMapsUrl}
        uberUrl={event.uberUrl}
        websiteUrl={event.websiteUrl}
        ticketUrl={event.ticketUrl}
        reservationUrl={event.reservationUrl}
      />
    </div>
  );
}
