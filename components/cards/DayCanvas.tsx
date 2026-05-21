"use client";

import { useState } from "react";
import type { DayAlternativePlan, ItineraryEvent, TripDay } from "@/types";
import { formatDateShort } from "@/lib/dates";
import { TRIGGER_LABELS } from "@/lib/labels";
import { getEventsForPeriod, getGroupedEvents } from "@/lib/itinerary";
import { buildWhatsAppUrl, generateDayShareText } from "@/lib/whatsapp";
import { PeriodSection } from "./PeriodSection";
import { EventCard } from "./EventCard";
import { Share2, Plus, ChevronDown, ChevronUp } from "lucide-react";

const PERIODS = ["morning", "afternoon", "night", "late_night"] as const;

interface DayCanvasProps {
  day: TripDay;
  events: ItineraryEvent[];
  alternatives: DayAlternativePlan[];
  pendingTasks: string[];
  onAddEvent: () => void;
  onEditEvent: (event: ItineraryEvent) => void;
  onDeleteEvent: (id: string) => void;
  onStatusChange: (id: string, status: ItineraryEvent["status"]) => void;
}

export function DayCanvas({
  day,
  events,
  alternatives,
  pendingTasks,
  onAddEvent,
  onEditEvent,
  onDeleteEvent,
  onStatusChange,
}: DayCanvasProps) {
  const [expanded, setExpanded] = useState(true);
  const [showAlternatives, setShowAlternatives] = useState(false);
  const dayEvents = events.filter((e) => e.date === day.date);
  const groups = getGroupedEvents(dayEvents);
  const groupedIds = new Set<string>();

  const shareDay = () => {
    const text = generateDayShareText(
      day.date,
      day.theme,
      dayEvents.map((e) => ({
        startTime: e.startTime,
        title: e.title,
        locationName: e.locationName,
        status: e.status,
      })),
      pendingTasks
    );
    window.open(buildWhatsAppUrl(text), "_blank");
  };

  return (
    <article className="card-elevated overflow-hidden animate-fade-in">
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="gradient-miami w-full px-5 py-4 text-left text-white"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium opacity-90">
              {formatDateShort(day.date)}
            </p>
            <h2 className="text-xl font-bold">{day.title}</h2>
            <p className="text-sm opacity-90">{day.theme}</p>
            {day.baseName && (
              <p className="mt-1 text-xs opacity-85">
                Base: {day.baseName}
                {day.baseAddress ? ` · ${day.baseAddress}` : ""}
              </p>
            )}
          </div>
          {expanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </div>
      </button>

      {expanded && (
        <div className="space-y-6 p-4">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={shareDay}
              className="flex flex-1 items-center justify-center gap-1 rounded-xl bg-green-50 py-2 text-sm font-medium text-green-700"
            >
              <Share2 size={16} />
              WhatsApp
            </button>
            <button
              type="button"
              onClick={onAddEvent}
              className="flex flex-1 items-center justify-center gap-1 rounded-xl bg-coral/10 py-2 text-sm font-medium text-coral"
            >
              <Plus size={16} />
              Adicionar
            </button>
          </div>

          {PERIODS.map((period) => (
            <PeriodSection
              key={period}
              period={period}
              events={getEventsForPeriod(dayEvents, day.date, period)}
              groupedIds={groupedIds}
              onEdit={onEditEvent}
              onDelete={onDeleteEvent}
              onStatusChange={onStatusChange}
            />
          ))}

          {groups.size > 0 && (
            <section>
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-purple-600">
                Planos em paralelo
              </h3>
              {Array.from(groups.entries()).map(([groupId, groupEvents]) => (
                <div
                  key={groupId}
                  className="mb-4 rounded-xl border-2 border-dashed border-purple-200 bg-purple-50/50 p-3"
                >
                  <div className="mb-2 flex items-center gap-2 text-xs font-medium text-purple-700">
                    <span>⑂</span>
                    {groupEvents[0]?.groupLabel ?? "Grupos separados"}
                  </div>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {groupEvents.map((event) => {
                      groupedIds.add(event.id);
                      return (
                        <EventCard
                          key={event.id}
                          event={event}
                          onEdit={() => onEditEvent(event)}
                          onDelete={() => onDeleteEvent(event.id)}
                          onStatusChange={(s) => onStatusChange(event.id, s)}
                        />
                      );
                    })}
                  </div>
                </div>
              ))}
            </section>
          )}

          {alternatives.length > 0 && (
            <section>
              <button
                type="button"
                onClick={() => setShowAlternatives(!showAlternatives)}
                className="text-sm font-medium text-sunset-pink"
              >
                {showAlternatives ? "▼" : "▶"} Plano B ({alternatives.length})
              </button>
              {showAlternatives && (
                <div className="mt-2 space-y-2">
                  {alternatives.map((alt) => (
                    <div
                      key={alt.id}
                      className="rounded-xl bg-amber-50 p-3 text-sm"
                    >
                      <span className="font-medium">
                        {TRIGGER_LABELS[alt.trigger]}
                      </span>
                      <p className="font-semibold">{alt.title}</p>
                      <p className="text-muted">{alt.description}</p>
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}
        </div>
      )}
    </article>
  );
}
