"use client";

import type { FamilyMember, ItineraryEvent } from "@/types";
import { STATUS_LABELS } from "@/lib/labels";
import { QuickActions } from "@/components/ui/QuickActions";
import { Clock, MapPin } from "lucide-react";

interface PersonNextPlanCardProps {
  member: FamilyMember;
  event: ItineraryEvent | null;
}

export function PersonNextPlanCard({ member, event }: PersonNextPlanCardProps) {
  return (
    <div
      className="card p-4 animate-fade-in"
      style={{ borderLeft: `4px solid ${member.color}` }}
    >
      <div className="flex items-center gap-2">
        <span
          className="flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold text-white"
          style={{ backgroundColor: member.color }}
        >
          {member.shortName[0]}
        </span>
        <h3 className="font-semibold">{member.shortName}</h3>
      </div>
      {event ? (
        <>
          <p className="mt-2 font-medium">{event.title}</p>
          <div className="mt-1 space-y-1 text-sm text-muted">
            {event.leaveBy && (
              <span className="flex items-center gap-1">
                <Clock size={13} />
                Sair: {event.leaveBy}
              </span>
            )}
            {event.locationName && (
              <span className="flex items-center gap-1">
                <MapPin size={13} />
                {event.locationName}
              </span>
            )}
            <span className="inline-block rounded-full bg-teal/10 px-2 py-0.5 text-xs text-teal-dark">
              {STATUS_LABELS[event.status]}
            </span>
          </div>
          <QuickActions
            googleMapsUrl={event.googleMapsUrl}
            appleMapsUrl={event.appleMapsUrl}
            uberUrl={event.uberUrl}
            websiteUrl={event.websiteUrl}
            ticketUrl={event.ticketUrl}
            reservationUrl={event.reservationUrl}
            compact
          />
        </>
      ) : (
        <p className="mt-2 text-sm text-muted">
          Livre por agora · sugestão: descanso ou caminhada perto
        </p>
      )}
    </div>
  );
}
