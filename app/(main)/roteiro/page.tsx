"use client";

import { useState } from "react";
import { useTrip } from "@/context/TripProvider";
import { DayCanvas } from "@/components/cards/DayCanvas";
import { RoteiroHeader } from "@/components/roteiro/RoteiroHeader";
import { EventFormModal } from "@/components/forms/EventFormModal";
import type { ItineraryEvent } from "@/types";

export default function RoteiroPage() {
  const {
    today,
    tripDays,
    dayAlternatives,
    itineraryEvents,
    tasks,
    deleteEvent,
    isHydrated,
  } = useTrip();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<ItineraryEvent | null>(null);
  const [defaultDate, setDefaultDate] = useState<string>();

  const openAdd = (date?: string) => {
    setEditingEvent(null);
    setDefaultDate(date);
    setModalOpen(true);
  };

  const openEdit = (event: ItineraryEvent) => {
    setEditingEvent(event);
    setModalOpen(true);
  };

  const eventCount = itineraryEvents.filter(
    (e) => e.status !== "cancelled"
  ).length;

  if (!isHydrated) {
    return (
      <div className="miami-gradient -mx-4 -mt-4 flex min-h-screen items-center justify-center pb-36 text-muted-foreground">
        <p className="text-sm">Carregando roteiro…</p>
      </div>
    );
  }

  return (
    <div className="miami-gradient -mx-4 -mt-4 min-h-screen pb-36 text-warm-black">
      <RoteiroHeader
        dayCount={tripDays.length}
        eventCount={eventCount}
      />

      <div className="mx-auto max-w-[48ch] space-y-6 px-6">
        {tripDays.map((day, index) => {
          const dayTasks = tasks
            .filter((t) => t.status === "open" && t.dueDate === day.date)
            .map((t) => t.title);
          return (
            <DayCanvas
              key={day.id}
              day={day}
              dayIndex={index}
              today={today}
              events={itineraryEvents}
              alternatives={dayAlternatives.filter((a) => a.dayId === day.id)}
              pendingTasks={dayTasks}
              onAddEvent={() => openAdd(day.date)}
              onEditEvent={openEdit}
              onDeleteEvent={deleteEvent}
            />
          );
        })}
      </div>

      <EventFormModal
        key={editingEvent?.id ?? `new-${defaultDate ?? ""}`}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        event={editingEvent}
        defaultDate={defaultDate}
      />
    </div>
  );
}
