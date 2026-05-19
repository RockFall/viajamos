"use client";

import { useState } from "react";
import type {
  PossiblePlan,
  NightEvent,
  EventPeriod,
  EventStatus,
  FamilyMemberId,
  EventCategory,
} from "@/types";
import { useTrip } from "@/context/TripProvider";
import { POSSIBLE_CATEGORY_LABELS } from "@/lib/labels";
import { X } from "lucide-react";

const categoryMap: Record<string, EventCategory> = {
  restaurant: "food",
  cafe: "food",
  jazz: "music",
  electronic_music: "music",
  museum: "museum",
  gallery: "museum",
  shopping: "shopping",
  walk: "walk",
  bar: "event",
  experience: "event",
  rainy_day: "event",
  nearby: "walk",
  late_night: "event",
};

interface AddToItineraryModalProps {
  open: boolean;
  onClose: () => void;
  plan?: PossiblePlan | null;
  nightEvent?: NightEvent | null;
}

export function AddToItineraryModal({
  open,
  onClose,
  plan,
  nightEvent,
}: AddToItineraryModalProps) {
  const { family, tripDays, addEvent, setPossiblePlanStatus } = useTrip();
  const source = plan ?? nightEvent;
  const [date, setDate] = useState(nightEvent?.date ?? tripDays[1]?.date ?? "");
  const [period, setPeriod] = useState<EventPeriod>(
    nightEvent ? "night" : plan?.periods[0] ?? "afternoon"
  );
  const [startTime, setStartTime] = useState(nightEvent?.startTime ?? "20:00");
  const [people, setPeople] = useState<FamilyMemberId[]>(
    family.map((m) => m.id)
  );
  const [status, setStatus] = useState<EventStatus>("planned");
  const [notes, setNotes] = useState("");

  if (!open || !source) return null;

  const title = "title" in source ? source.title : "";
  const category =
    plan?.category
      ? categoryMap[plan.category] ?? "event"
      : nightEvent?.type === "jazz" || nightEvent?.type === "electronic"
        ? "music"
        : "event";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addEvent({
      title,
      description: plan?.description,
      date,
      startTime,
      period,
      locationName: plan ? plan.neighborhood : nightEvent?.venue,
      address: plan?.address,
      neighborhood: plan?.neighborhood ?? nightEvent?.neighborhood,
      category,
      people,
      status,
      notes,
      googleMapsUrl: source.googleMapsUrl,
      appleMapsUrl: source.appleMapsUrl,
      uberUrl: source.uberUrl,
      websiteUrl: source.websiteUrl,
      ticketUrl: source.ticketUrl,
      reservationUrl: plan?.reservationUrl,
    });
    if (plan) setPossiblePlanStatus(plan.id, "added_to_itinerary");
    onClose();
  };

  const togglePerson = (id: FamilyMemberId) => {
    setPeople((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/50 p-4 sm:items-center">
      <div className="w-full max-w-lg rounded-2xl bg-white p-5 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold">Adicionar ao roteiro</h2>
          <button type="button" onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        <p className="mb-4 font-medium">{title}</p>
        {plan && (
          <p className="mb-4 text-sm text-muted">
            {POSSIBLE_CATEGORY_LABELS[plan.category]}
          </p>
        )}
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="text-xs text-muted">Quando?</label>
            <select
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="mt-1 w-full rounded-xl border px-3 py-2 text-sm"
            >
              {tripDays.map((d) => (
                <option key={d.id} value={d.date}>
                  {d.title}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs text-muted">Período</label>
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value as EventPeriod)}
              className="mt-1 w-full rounded-xl border px-3 py-2 text-sm"
            >
              <option value="morning">Manhã</option>
              <option value="afternoon">Tarde</option>
              <option value="night">Noite</option>
              <option value="late_night">Madrugada</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-muted">Horário</label>
            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="mt-1 w-full rounded-xl border px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="text-xs text-muted">Quem vai?</label>
            <div className="mt-1 flex flex-wrap gap-2">
              {family.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => togglePerson(m.id)}
                  className={`rounded-full px-3 py-1 text-sm ${
                    people.includes(m.id) ? "text-white" : "bg-zinc-100"
                  }`}
                  style={
                    people.includes(m.id)
                      ? { backgroundColor: m.color }
                      : undefined
                  }
                >
                  {m.shortName}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs text-muted">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as EventStatus)}
              className="mt-1 w-full rounded-xl border px-3 py-2 text-sm"
            >
              <option value="planned">Planejado</option>
              <option value="reserved">Reservado</option>
              <option value="booked">Comprar ingresso / Comprado</option>
            </select>
          </div>
          <textarea
            placeholder="Observações"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full rounded-xl border px-3 py-2 text-sm"
            rows={2}
          />
          <button
            type="submit"
            className="w-full rounded-xl bg-coral py-3 font-semibold text-white"
          >
            Adicionar ao roteiro
          </button>
        </form>
      </div>
    </div>
  );
}
