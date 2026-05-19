"use client";

import { useState, useMemo } from "react";
import { nightEvents, tripDays } from "@/lib/data";
import { NightEventCard } from "@/components/cards/NightEventCard";
import { AddToItineraryModal } from "@/components/forms/AddToItineraryModal";
import { NIGHT_TYPE_LABELS } from "@/lib/labels";
import type { NightEvent, NightEventType } from "@/types";

const NIGHT_SECTIONS: NightEventType[] = [
  "jazz",
  "electronic",
  "bar",
  "late_food",
];

export default function NoitePage() {
  const tripNights = tripDays.filter(
    (d) => !d.isTravelDay || d.date !== "2026-05-23"
  );
  const [selectedDate, setSelectedDate] = useState(
    tripNights[1]?.date ?? "2026-05-24"
  );
  const [selectedEvent, setSelectedEvent] = useState<NightEvent | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const dayEvents = useMemo(
    () => nightEvents.filter((e) => e.date === selectedDate),
    [selectedDate]
  );

  return (
    <div className="night-page -mx-4 -mt-4 px-4 pt-4 pb-8">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-white">Radar da Noite</h1>
        <p className="text-sm text-slate-400">Jazz · Eletrônica · Bares</p>
      </header>

      <div className="no-scrollbar mb-6 flex gap-2 overflow-x-auto">
        {tripNights.map((day) => (
          <button
            key={day.id}
            type="button"
            onClick={() => setSelectedDate(day.date)}
            className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition ${
              selectedDate === day.date
                ? "bg-purple-600 text-white"
                : "bg-white/10 text-slate-300"
            }`}
          >
            {day.date.slice(8)}/{day.date.slice(5, 7)}
          </button>
        ))}
      </div>

      {NIGHT_SECTIONS.map((type) => {
        const sectionEvents = dayEvents.filter((e) => e.type === type);
        if (sectionEvents.length === 0) return null;
        return (
          <section key={type} className="mb-8">
            <h2 className="mb-3 text-lg font-semibold text-purple-300">
              {NIGHT_TYPE_LABELS[type]}
            </h2>
            <div className="space-y-4">
              {sectionEvents.map((event) => (
                <NightEventCard
                  key={event.id}
                  event={event}
                  onAddToItinerary={() => {
                    setSelectedEvent(event);
                    setModalOpen(true);
                  }}
                />
              ))}
            </div>
          </section>
        );
      })}

      {dayEvents.length === 0 && (
        <p className="text-center text-slate-500">
          Nenhum evento cadastrado para esta noite.
        </p>
      )}

      <AddToItineraryModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setSelectedEvent(null);
        }}
        nightEvent={selectedEvent}
      />
    </div>
  );
}
