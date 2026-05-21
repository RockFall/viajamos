"use client";

import { useCallback, useEffect, useState } from "react";
import { useTrip } from "@/context/TripProvider";
import { generateId } from "@/lib/itinerary";
import {
  CATEGORY_OPTIONS,
  PERIOD_OPTIONS,
  STATUS_OPTIONS,
} from "@/lib/settings/table-registry";
import { inputClass, labelClass, selectClass, textareaClass } from "@/lib/settings/form-ui";
import type { ItineraryEvent } from "@/types";
import { Save, Trash2 } from "lucide-react";
import { TableRecordList } from "./TableRecordList";

function emptyEvent(): ItineraryEvent {
  return {
    id: generateId("evt"),
    title: "",
    date: "",
    period: "morning",
    category: "experience",
    people: [],
    status: "planned",
  };
}

export function ItineraryEventEditor({
  onFlash,
}: {
  onFlash: (msg: string) => void;
}) {
  const { itineraryEvents, family, tripDays, saveEvent, deleteEvent } =
    useTrip();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [draft, setDraft] = useState<ItineraryEvent | null>(null);

  useEffect(() => {
    if (!selectedId) {
      setDraft(null);
      return;
    }
    const found = itineraryEvents.find((e) => e.id === selectedId);
    setDraft(found ? { ...found } : null);
  }, [selectedId, itineraryEvents]);

  const listLabel = useCallback((e: ItineraryEvent) => {
    const d = e.date.slice(8, 10) + "/" + e.date.slice(5, 7);
    return `${d} · ${e.title}`;
  }, []);

  const patch = (updates: Partial<ItineraryEvent>) => {
    setDraft((d) => (d ? { ...d, ...updates } : d));
  };

  const handleNew = () => {
    const first = tripDays[0]?.date ?? "";
    const ev = { ...emptyEvent(), date: first };
    setSelectedId(ev.id);
    setDraft(ev);
  };

  const handleSave = () => {
    if (!draft?.title || !draft.date) return;
    saveEvent(draft);
    onFlash("Evento salvo");
  };

  const handleDelete = () => {
    if (!selectedId || !confirm("Excluir evento?")) return;
    deleteEvent(selectedId);
    setSelectedId(null);
    onFlash("Excluído");
  };

  return (
    <div className="grid gap-4 md:grid-cols-[minmax(0,280px)_1fr]">
      <TableRecordList
        records={itineraryEvents}
        listLabel={listLabel}
        selectedId={selectedId}
        onSelect={setSelectedId}
        onNew={handleNew}
      />
      <div className="card min-w-0 space-y-3 p-4">
        {draft ? (
          <>
            <div>
              <label className={labelClass}>Título</label>
              <input
                value={draft.title}
                onChange={(e) => patch({ title: e.target.value })}
                className={inputClass}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>Data</label>
                <input
                  type="date"
                  value={draft.date}
                  onChange={(e) => patch({ date: e.target.value })}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Período</label>
                <select
                  value={draft.period}
                  onChange={(e) =>
                    patch({ period: e.target.value as ItineraryEvent["period"] })
                  }
                  className={selectClass}
                >
                  {Object.entries(PERIOD_OPTIONS).map(([k, v]) => (
                    <option key={k} value={k}>
                      {v}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>Início</label>
                <input
                  type="time"
                  value={draft.startTime ?? ""}
                  onChange={(e) => patch({ startTime: e.target.value })}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Fim</label>
                <input
                  type="time"
                  value={draft.endTime ?? ""}
                  onChange={(e) => patch({ endTime: e.target.value })}
                  className={inputClass}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>Categoria</label>
                <select
                  value={draft.category}
                  onChange={(e) =>
                    patch({
                      category: e.target.value as ItineraryEvent["category"],
                    })
                  }
                  className={selectClass}
                >
                  {Object.entries(CATEGORY_OPTIONS).map(([k, v]) => (
                    <option key={k} value={k}>
                      {v}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelClass}>Status</label>
                <select
                  value={draft.status}
                  onChange={(e) =>
                    patch({
                      status: e.target.value as ItineraryEvent["status"],
                    })
                  }
                  className={selectClass}
                >
                  {Object.entries(STATUS_OPTIONS).map(([k, v]) => (
                    <option key={k} value={k}>
                      {v}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <span className={labelClass}>Quem vai</span>
              <div className="mt-2 flex flex-wrap gap-2">
                {family.map((m) => (
                  <label
                    key={m.id}
                    className="flex items-center gap-1 rounded-full border px-3 py-1 text-sm"
                  >
                    <input
                      type="checkbox"
                      checked={draft.people.includes(m.id)}
                      onChange={(e) => {
                        const people = e.target.checked
                          ? [...draft.people, m.id]
                          : draft.people.filter((p) => p !== m.id);
                        patch({ people });
                      }}
                      className="accent-terracotta"
                    />
                    {m.shortName}
                  </label>
                ))}
              </div>
            </div>
            <div>
              <label className={labelClass}>Local</label>
              <input
                value={draft.locationName ?? ""}
                onChange={(e) => patch({ locationName: e.target.value })}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Endereço</label>
              <input
                value={draft.address ?? ""}
                onChange={(e) => patch({ address: e.target.value })}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Descrição</label>
              <textarea
                value={draft.description ?? ""}
                onChange={(e) => patch({ description: e.target.value })}
                className={textareaClass}
              />
            </div>
            <div>
              <label className={labelClass}>Notas</label>
              <textarea
                value={draft.notes ?? ""}
                onChange={(e) => patch({ notes: e.target.value })}
                className={textareaClass}
              />
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleSave}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-terracotta py-2.5 text-sm font-medium text-white"
              >
                <Save size={16} />
                Salvar
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="rounded-xl border border-red-200 px-4 py-2.5 text-red-600"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </>
        ) : (
          <p className="py-8 text-center text-sm text-muted-foreground">
            Selecione ou crie um evento
          </p>
        )}
      </div>
    </div>
  );
}
