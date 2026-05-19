"use client";

import { useState } from "react";
import { useTrip } from "@/context/TripProvider";
import { dayAlternatives } from "@/lib/data";
import { DayCanvas } from "@/components/cards/DayCanvas";
import { EventFormModal } from "@/components/forms/EventFormModal";
import type { ItineraryEvent } from "@/types";

export default function RoteiroPage() {
  const {
    tripDays,
    itineraryEvents,
    tasks,
    updateEvent,
    deleteEvent,
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

  return (
    <div className="space-y-6 pb-4">
      <header>
        <h1 className="text-2xl font-bold text-ocean">Roteiro</h1>
        <p className="text-sm text-muted">
          Canvas visual por dia — toque para expandir
        </p>
      </header>

      <div className="space-y-8">
        {tripDays.map((day) => {
          const dayTasks = tasks
            .filter((t) => t.status === "open" && t.dueDate === day.date)
            .map((t) => t.title);
          return (
            <DayCanvas
              key={day.id}
              day={day}
              events={itineraryEvents}
              alternatives={dayAlternatives.filter((a) => a.dayId === day.id)}
              pendingTasks={dayTasks}
              onAddEvent={() => openAdd(day.date)}
              onEditEvent={openEdit}
              onDeleteEvent={deleteEvent}
              onStatusChange={(id, status) => updateEvent(id, { status })}
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
