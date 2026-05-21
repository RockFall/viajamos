"use client";

import { useState } from "react";
import type { DayAlternativePlan, ItineraryEvent, TripDay } from "@/types";
import { formatRoteiroDate } from "@/lib/dates";
import { TRIGGER_LABELS } from "@/lib/labels";
import { getEventsForPeriod, getGroupedEvents } from "@/lib/itinerary";
import { buildWhatsAppUrl, generateDayShareText } from "@/lib/whatsapp";
import { SectionLabel } from "@/components/agora/SectionLabel";
import { PeriodSection } from "./PeriodSection";
import { EventCard } from "./EventCard";
import { Share2, Plus, ChevronDown, ChevronUp } from "lucide-react";

const PERIODS = ["morning", "afternoon", "night", "late_night"] as const;

const AREA_LABELS: Record<string, string> = {
  Miami: "Miami",
  Islamorada: "Keys",
  Travel: "Viagem",
};

interface DayCanvasProps {
  day: TripDay;
  dayIndex: number;
  today?: string;
  events: ItineraryEvent[];
  alternatives: DayAlternativePlan[];
  pendingTasks: string[];
  onAddEvent: () => void;
  onEditEvent: (event: ItineraryEvent) => void;
  onDeleteEvent: (id: string) => void;
}

export function DayCanvas({
  day,
  dayIndex,
  today,
  events,
  alternatives,
  pendingTasks,
  onAddEvent,
  onEditEvent,
  onDeleteEvent,
}: DayCanvasProps) {
  const [expanded, setExpanded] = useState(dayIndex <= 2);
  const [showAlternatives, setShowAlternatives] = useState(false);
  const dayEvents = events.filter((e) => e.date === day.date);
  const groups = getGroupedEvents(dayEvents);
  const groupedIds = new Set<string>();
  const eventCount = dayEvents.filter((e) => e.status !== "cancelled").length;

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

  const isTravel = day.isTravelDay || day.isReturnDay;
  const isToday = today === day.date;
  const { dayMonth, weekday } = formatRoteiroDate(day.date);

  return (
    <article className="overflow-hidden rounded-[28px] bg-card shadow-[0_20px_40px_-25px_rgba(60,30,20,0.2)] ring-1 ring-border animate-fade-in">
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className={`w-full px-5 py-5 text-left transition-colors ${
          isTravel
            ? "bg-warm-black text-sand-50"
            : "bg-gradient-to-br from-sand-100 to-sand-50 text-warm-black"
        }`}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div
              className={`flex items-end justify-between gap-3 border-b pb-3 ${
                isTravel ? "border-sand-50/15" : "border-warm-black/10"
              }`}
            >
              <div className="flex min-w-0 flex-wrap items-baseline gap-x-3 gap-y-1">
                <span
                  className={`font-serif text-4xl leading-none tracking-tight ${
                    isTravel ? "text-sand-50" : "text-warm-black"
                  }`}
                >
                  {dayMonth}
                </span>
                <span
                  className={`text-[11px] font-semibold uppercase tracking-[0.2em] ${
                    isTravel ? "text-sand-200/70" : "text-muted-foreground"
                  }`}
                >
                  {weekday}
                </span>
                {isToday && (
                  <span className="rounded-full bg-terracotta px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-[0.2em] text-white">
                    Hoje
                  </span>
                )}
              </div>
              {day.area && (
                <span
                  className={`shrink-0 text-[10px] font-semibold uppercase tracking-[0.2em] ${
                    isTravel ? "text-sand-200/60" : "text-muted-foreground"
                  }`}
                >
                  {AREA_LABELS[day.area] ?? day.area}
                </span>
              )}
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span
                className={`text-[9px] font-bold uppercase tracking-[0.2em] ${
                  isTravel ? "text-terracotta" : "text-terracotta-deep"
                }`}
              >
                Dia {String(dayIndex + 1).padStart(2, "0")}
              </span>
              <span
                className={`text-[9px] ${
                  isTravel ? "text-sand-100/60" : "text-muted-foreground"
                }`}
              >
                · {eventCount} {eventCount === 1 ? "plano" : "planos"}
              </span>
            </div>

            <h2
              className={`mt-2 font-serif text-xl leading-tight tracking-tight ${
                isTravel ? "text-sand-50" : "text-warm-black"
              }`}
            >
              {day.title}
            </h2>
            <p
              className={`mt-1 text-sm leading-snug ${
                isTravel ? "text-sand-100/80" : "text-muted-foreground"
              }`}
            >
              {day.theme}
            </p>
            {day.baseName && expanded && (
              <p
                className={`mt-2 text-[11px] ${
                  isTravel ? "text-sand-100/60" : "text-muted-foreground"
                }`}
              >
                {day.baseName}
                {day.baseAddress ? ` · ${day.baseAddress}` : ""}
              </p>
            )}
          </div>
          <span
            className={`shrink-0 rounded-full p-1.5 ${
              isTravel ? "bg-white/10" : "bg-card ring-1 ring-border"
            }`}
          >
            {expanded ? (
              <ChevronUp size={18} className={isTravel ? "text-sand-50" : ""} />
            ) : (
              <ChevronDown
                size={18}
                className={isTravel ? "text-sand-50" : ""}
              />
            )}
          </span>
        </div>
      </button>

      {expanded && (
        <div className="space-y-6 p-5">
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={shareDay}
              className="flex items-center justify-center gap-1.5 rounded-full bg-warm-black py-2.5 text-[11px] font-semibold tracking-tight text-sand-50 transition active:scale-[0.98]"
            >
              <Share2 size={14} />
              WhatsApp
            </button>
            <button
              type="button"
              onClick={onAddEvent}
              className="flex items-center justify-center gap-1.5 rounded-full bg-secondary py-2.5 text-[11px] font-semibold tracking-tight text-warm-black ring-1 ring-border transition hover:bg-accent active:scale-[0.98]"
            >
              <Plus size={14} />
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
            />
          ))}

          {groups.size > 0 && (
            <section>
              <SectionLabel left="Planos em paralelo" />
              <div className="mt-4 space-y-4">
                {Array.from(groups.entries()).map(([groupId, groupEvents]) => (
                  <div
                    key={groupId}
                    className="rounded-[20px] border border-dashed border-terracotta/30 bg-accent/40 p-4"
                  >
                    <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-terracotta-deep">
                      {groupEvents[0]?.groupLabel ?? "Grupos separados"}
                    </p>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {groupEvents.map((event) => {
                        groupedIds.add(event.id);
                        return (
                          <EventCard
                            key={event.id}
                            event={event}
                            onEdit={() => onEditEvent(event)}
                            onDelete={() => onDeleteEvent(event.id)}
                          />
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {alternatives.length > 0 && (
            <section>
              <button
                type="button"
                onClick={() => setShowAlternatives(!showAlternatives)}
                className="text-[10px] font-bold uppercase tracking-[0.2em] text-terracotta"
              >
                {showAlternatives ? "▼" : "▶"} Plano B ({alternatives.length})
              </button>
              {showAlternatives && (
                <div className="mt-3 space-y-2">
                  {alternatives.map((alt) => (
                    <div
                      key={alt.id}
                      className="rounded-[20px] bg-sand-100 p-4 ring-1 ring-border"
                    >
                      <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-terracotta">
                        {TRIGGER_LABELS[alt.trigger]}
                      </span>
                      <p className="font-serif mt-1 text-base font-medium text-warm-black">
                        {alt.title}
                      </p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {alt.description}
                      </p>
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
