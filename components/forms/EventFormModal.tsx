"use client";

import { useState } from "react";
import type {
  ItineraryEvent,
  EventPeriod,
  EventCategory,
  EventStatus,
  FamilyMemberId,
} from "@/types";
import { useTrip } from "@/context/TripProvider";
import { X } from "lucide-react";

interface EventFormModalProps {
  open: boolean;
  onClose: () => void;
  event?: ItineraryEvent | null;
  defaultDate?: string;
}

const CATEGORIES: EventCategory[] = [
  "food",
  "music",
  "museum",
  "shopping",
  "walk",
  "travel",
  "rest",
  "event",
];
const STATUSES: EventStatus[] = [
  "idea",
  "planned",
  "reserved",
  "booked",
  "done",
  "cancelled",
];

function buildInitialForm(
  event: ItineraryEvent | null | undefined,
  defaultDate: string | undefined,
  fallbackDate: string,
  familyIds: FamilyMemberId[]
): Partial<ItineraryEvent> {
  if (event) return { ...event };
  return {
    date: defaultDate ?? fallbackDate,
    period: "afternoon",
    category: "food",
    status: "planned",
    people: familyIds,
  };
}

function EventFormModalInner({
  onClose,
  event,
  defaultDate,
}: Omit<EventFormModalProps, "open">) {
  const { family, addEvent, updateEvent, tripDays } = useTrip();
  const familyIds = family.map((m) => m.id);
  const [form, setForm] = useState<Partial<ItineraryEvent>>(() =>
    buildInitialForm(event, defaultDate, tripDays[0]?.date ?? "", familyIds)
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.date || !form.period || !form.category || !form.status)
      return;

    const payload = {
      title: form.title,
      description: form.description,
      date: form.date,
      startTime: form.startTime,
      endTime: form.endTime,
      period: form.period,
      locationName: form.locationName,
      address: form.address,
      neighborhood: form.neighborhood,
      category: form.category,
      people: (form.people ?? []) as FamilyMemberId[],
      status: form.status,
      googleMapsUrl: form.googleMapsUrl,
      websiteUrl: form.websiteUrl,
      ticketUrl: form.ticketUrl,
      reservationUrl: form.reservationUrl,
      notes: form.notes,
      leaveBy: form.leaveBy,
    };

    if (event) {
      updateEvent(event.id, payload);
    } else {
      addEvent(payload);
    }
    onClose();
  };

  const togglePerson = (id: FamilyMemberId) => {
    const current = form.people ?? [];
    setForm({
      ...form,
      people: current.includes(id)
        ? current.filter((p) => p !== id)
        : [...current, id],
    });
  };

  return (
    <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-5 shadow-xl">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-bold">
          {event ? "Editar plano" : "Novo plano"}
        </h2>
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg p-1 hover:bg-zinc-100"
        >
          <X size={20} />
        </button>
      </div>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          required
          placeholder="Título"
          value={form.title ?? ""}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="w-full rounded-xl border px-3 py-2 text-sm"
        />
        <textarea
          placeholder="Descrição"
          value={form.description ?? ""}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="w-full rounded-xl border px-3 py-2 text-sm"
          rows={2}
        />
        <select
          value={form.date ?? ""}
          onChange={(e) => setForm({ ...form, date: e.target.value })}
          className="w-full rounded-xl border px-3 py-2 text-sm"
        >
          {tripDays.map((d) => (
            <option key={d.id} value={d.date}>
              {d.title} — {d.date}
            </option>
          ))}
        </select>
        <div className="grid grid-cols-2 gap-2">
          <input
            type="time"
            value={form.startTime ?? ""}
            onChange={(e) => setForm({ ...form, startTime: e.target.value })}
            className="rounded-xl border px-3 py-2 text-sm"
          />
          <input
            type="time"
            value={form.leaveBy ?? ""}
            onChange={(e) => setForm({ ...form, leaveBy: e.target.value })}
            className="rounded-xl border px-3 py-2 text-sm"
            placeholder="Sair de casa"
          />
        </div>
        <select
          value={form.period ?? "afternoon"}
          onChange={(e) =>
            setForm({ ...form, period: e.target.value as EventPeriod })
          }
          className="w-full rounded-xl border px-3 py-2 text-sm"
        >
          <option value="morning">Manhã</option>
          <option value="afternoon">Tarde</option>
          <option value="night">Noite</option>
          <option value="late_night">Madrugada</option>
        </select>
        <select
          value={form.category ?? "food"}
          onChange={(e) =>
            setForm({ ...form, category: e.target.value as EventCategory })
          }
          className="w-full rounded-xl border px-3 py-2 text-sm"
        >
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <select
          value={form.status ?? "planned"}
          onChange={(e) =>
            setForm({ ...form, status: e.target.value as EventStatus })
          }
          className="w-full rounded-xl border px-3 py-2 text-sm"
        >
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <input
          placeholder="Local"
          value={form.locationName ?? ""}
          onChange={(e) => setForm({ ...form, locationName: e.target.value })}
          className="w-full rounded-xl border px-3 py-2 text-sm"
        />
        <input
          placeholder="Link Google Maps"
          value={form.googleMapsUrl ?? ""}
          onChange={(e) => setForm({ ...form, googleMapsUrl: e.target.value })}
          className="w-full rounded-xl border px-3 py-2 text-sm"
        />
        <div>
          <p className="mb-1 text-xs text-muted">Quem vai?</p>
          <div className="flex flex-wrap gap-2">
            {family.map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => togglePerson(m.id)}
                className={`rounded-full px-3 py-1 text-sm font-medium ${
                  (form.people ?? []).includes(m.id)
                    ? "text-white"
                    : "bg-zinc-100 text-zinc-600"
                }`}
                style={
                  (form.people ?? []).includes(m.id)
                    ? { backgroundColor: m.color }
                    : undefined
                }
              >
                {m.shortName}
              </button>
            ))}
          </div>
        </div>
        <button
          type="submit"
          className="w-full rounded-xl bg-coral py-3 font-semibold text-white"
        >
          {event ? "Salvar" : "Adicionar"}
        </button>
      </form>
    </div>
  );
}

export function EventFormModal({
  open,
  onClose,
  event,
  defaultDate,
}: EventFormModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/50 p-4 sm:items-center">
      <EventFormModalInner
        key={event?.id ?? `new-${defaultDate ?? ""}`}
        onClose={onClose}
        event={event}
        defaultDate={defaultDate}
      />
    </div>
  );
}
