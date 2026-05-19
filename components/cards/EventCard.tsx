"use client";

import type { ItineraryEvent } from "@/types";
import { getFamilyMember } from "@/lib/data";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { CategoryChip } from "@/components/ui/CategoryChip";
import { QuickActions } from "@/components/ui/QuickActions";
import { Clock, MapPin, Pencil, Trash2 } from "lucide-react";

interface EventCardProps {
  event: ItineraryEvent;
  onEdit?: () => void;
  onDelete?: () => void;
  onStatusChange?: (status: ItineraryEvent["status"]) => void;
}

export function EventCard({ event, onEdit, onDelete, onStatusChange }: EventCardProps) {
  return (
    <div className="card p-4">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1">
          {event.groupLabel && (
            <p className="mb-1 text-xs font-medium text-purple-600">
              {event.groupLabel}
            </p>
          )}
          <div className="flex flex-wrap items-center gap-2">
            {event.startTime && (
              <span className="flex items-center gap-1 text-sm font-semibold text-ocean">
                <Clock size={14} />
                {event.startTime}
              </span>
            )}
            <CategoryChip category={event.category} />
            <StatusBadge status={event.status} />
          </div>
          <h4 className="mt-1 font-semibold">{event.title}</h4>
          {event.description && (
            <p className="mt-0.5 text-sm text-muted">{event.description}</p>
          )}
          {event.locationName && (
            <p className="mt-1 flex items-center gap-1 text-sm text-muted">
              <MapPin size={13} />
              {event.locationName}
            </p>
          )}
          <div className="mt-2 flex flex-wrap gap-1">
            {event.people.map((id) => {
              const m = getFamilyMember(id);
              return m ? (
                <span
                  key={id}
                  className="rounded-full px-2 py-0.5 text-xs text-white"
                  style={{ backgroundColor: m.color }}
                >
                  {m.shortName}
                </span>
              ) : null;
            })}
          </div>
        </div>
        <div className="flex gap-1">
          {onEdit && (
            <button
              type="button"
              onClick={onEdit}
              className="rounded-lg p-1.5 text-muted hover:bg-zinc-100"
              aria-label="Editar"
            >
              <Pencil size={16} />
            </button>
          )}
          {onDelete && (
            <button
              type="button"
              onClick={onDelete}
              className="rounded-lg p-1.5 text-red-400 hover:bg-red-50"
              aria-label="Excluir"
            >
              <Trash2 size={16} />
            </button>
          )}
        </div>
      </div>
      {onStatusChange && (
        <select
          value={event.status}
          onChange={(e) =>
            onStatusChange(e.target.value as ItineraryEvent["status"])
          }
          className="mt-2 w-full rounded-lg border border-zinc-200 px-2 py-1 text-xs"
        >
          <option value="idea">Ideia</option>
          <option value="planned">Planejado</option>
          <option value="reserved">Reservado</option>
          <option value="booked">Comprado</option>
          <option value="done">Feito</option>
          <option value="cancelled">Cancelado</option>
        </select>
      )}
      <QuickActions
        googleMapsUrl={event.googleMapsUrl}
        appleMapsUrl={event.appleMapsUrl}
        uberUrl={event.uberUrl}
        websiteUrl={event.websiteUrl}
        ticketUrl={event.ticketUrl}
        reservationUrl={event.reservationUrl}
        compact
      />
    </div>
  );
}
