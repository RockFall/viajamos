"use client";

import type { ItineraryEvent } from "@/types";
import { EntityImage } from "@/components/ui/EntityImage";
import { STATUS_LABELS, CATEGORY_LABELS } from "@/lib/labels";
import { CategoryIcon } from "@/components/ui/EventIcons";
import { FamilyAvatars } from "@/components/ui/FamilyAvatars";
import { QuickActions } from "@/components/ui/QuickActions";
import { Clock, MapPin, Pencil, Trash2 } from "lucide-react";

const STATUS_PILL: Record<ItineraryEvent["status"], string> = {
  idea: "bg-sand-200 text-warm-black/70",
  planned: "bg-secondary text-warm-black ring-1 ring-border",
  reserved: "bg-terracotta/15 text-terracotta-deep",
  booked: "bg-terracotta text-white",
  done: "bg-sand-200 text-muted-foreground line-through",
  cancelled: "bg-red-50 text-red-600",
};

interface EventCardProps {
  event: ItineraryEvent;
  onEdit?: () => void;
  onDelete?: () => void;
}

export function EventCard({
  event,
  onEdit,
  onDelete,
}: EventCardProps) {
  const isCancelled = event.status === "cancelled";

  return (
    <div
      className={`overflow-hidden rounded-[20px] bg-card/90 ring-1 ring-border ${
        isCancelled ? "opacity-60" : ""
      }`}
    >
      <div className="relative aspect-[21/9] w-full">
        <EntityImage
          kind="itinerary-events"
          entityId={event.id}
          category={event.category}
          alt={event.title}
          fill
          className="object-cover"
          sizes="512px"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-card via-card/20 to-transparent" />
      </div>
      <div className="p-4">
      <div className="flex items-start gap-3">
        {event.startTime && (
          <div className="w-14 shrink-0 text-right">
            <p className="font-serif text-lg italic leading-none text-terracotta">
              {event.startTime}
            </p>
          </div>
        )}

        <div className="min-w-0 flex-1">
          {event.groupLabel && (
            <p className="mb-1 text-[9px] font-bold uppercase tracking-[0.2em] text-terracotta">
              {event.groupLabel}
            </p>
          )}
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-sand-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-warm-black/70">
              <CategoryIcon
                category={event.category}
                size={11}
                strokeWidth={2.25}
                className="shrink-0 text-terracotta-deep"
              />
              {CATEGORY_LABELS[event.category]}
            </span>
            <span
              className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${STATUS_PILL[event.status]}`}
            >
              {STATUS_LABELS[event.status]}
            </span>
          </div>
          <h4 className="font-serif mt-1.5 text-lg leading-tight text-warm-black">
            {event.title}
          </h4>
          {event.description && (
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
              {event.description}
            </p>
          )}
          {event.locationName && (
            <p className="mt-2 flex items-center gap-1 text-[11px] text-muted-foreground">
              <MapPin size={12} className="shrink-0 text-terracotta" />
              {event.locationName}
            </p>
          )}
          {event.leaveBy && (
            <p className="mt-1 flex items-center gap-1 text-[11px] text-muted-foreground">
              <Clock size={12} className="shrink-0" />
              Sair às {event.leaveBy}
            </p>
          )}
        </div>

        <div className="flex shrink-0 flex-col items-end gap-2">
          <FamilyAvatars people={event.people} size="sm" ringClass="ring-card" />
          <div className="flex gap-0.5">
            {onEdit && (
              <button
                type="button"
                onClick={onEdit}
                className="rounded-lg p-1.5 text-muted-foreground transition hover:bg-sand-100"
                aria-label="Editar"
              >
                <Pencil size={15} />
              </button>
            )}
            {onDelete && (
              <button
                type="button"
                onClick={onDelete}
                className="rounded-lg p-1.5 text-terracotta transition hover:bg-terracotta/10"
                aria-label="Excluir"
              >
                <Trash2 size={15} />
              </button>
            )}
          </div>
        </div>
      </div>

      <QuickActions
        googleMapsUrl={event.googleMapsUrl}
        appleMapsUrl={event.appleMapsUrl}
        uberUrl={event.uberUrl}
        websiteUrl={event.websiteUrl}
        ticketUrl={event.ticketUrl}
        reservationUrl={event.reservationUrl}
        compact
        className="mt-4"
      />
      </div>
    </div>
  );
}
