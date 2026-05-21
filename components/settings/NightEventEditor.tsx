"use client";

import { useCallback, useEffect, useState } from "react";
import { useTrip } from "@/context/TripProvider";
import { generateId } from "@/lib/itinerary";
import {
  INTENSITY_OPTIONS,
  NIGHT_TYPE_OPTIONS,
  PLAN_STATUS_OPTIONS,
} from "@/lib/settings/table-registry";
import { inputClass, labelClass, selectClass, textareaClass } from "@/lib/settings/form-ui";
import type { NightEvent } from "@/types";
import { Save, Trash2 } from "lucide-react";
import { TableRecordList } from "./TableRecordList";

function emptyNight(): NightEvent {
  return {
    id: generateId("night"),
    date: "",
    type: "bar",
    title: "",
    venue: "",
    startTime: "21:00",
    intensity: "moderate",
    status: "candidate",
  };
}

export function NightEventEditor({
  onFlash,
}: {
  onFlash: (msg: string) => void;
}) {
  const { nightEvents, tripDays, saveNightEvent, deleteNightEvent } =
    useTrip();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [draft, setDraft] = useState<NightEvent | null>(null);

  useEffect(() => {
    if (!selectedId) {
      setDraft(null);
      return;
    }
    const found = nightEvents.find((e) => e.id === selectedId);
    setDraft(found ? { ...found } : null);
  }, [selectedId, nightEvents]);

  const listLabel = useCallback((e: NightEvent) => {
    const d = e.date.slice(8, 10) + "/" + e.date.slice(5, 7);
    return `${d} · ${e.title}`;
  }, []);

  const patch = (updates: Partial<NightEvent>) => {
    setDraft((d) => (d ? { ...d, ...updates } : d));
  };

  return (
    <div className="grid gap-4 md:grid-cols-[minmax(0,280px)_1fr]">
      <TableRecordList
        records={nightEvents}
        listLabel={listLabel}
        selectedId={selectedId}
        onSelect={setSelectedId}
        onNew={() => {
          const n = {
            ...emptyNight(),
            date: tripDays[0]?.date ?? "",
          };
          setSelectedId(n.id);
          setDraft(n);
        }}
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
            <div>
              <label className={labelClass}>Local / venue</label>
              <input
                value={draft.venue}
                onChange={(e) => patch({ venue: e.target.value })}
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
                <label className={labelClass}>Tipo</label>
                <select
                  value={draft.type}
                  onChange={(e) =>
                    patch({ type: e.target.value as NightEvent["type"] })
                  }
                  className={selectClass}
                >
                  {Object.entries(NIGHT_TYPE_OPTIONS).map(([k, v]) => (
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
                  value={draft.startTime}
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
                <label className={labelClass}>Intensidade</label>
                <select
                  value={draft.intensity}
                  onChange={(e) =>
                    patch({
                      intensity: e.target.value as NightEvent["intensity"],
                    })
                  }
                  className={selectClass}
                >
                  {Object.entries(INTENSITY_OPTIONS).map(([k, v]) => (
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
                      status: e.target.value as NightEvent["status"],
                    })
                  }
                  className={selectClass}
                >
                  {Object.entries(PLAN_STATUS_OPTIONS).map(([k, v]) => (
                    <option key={k} value={k}>
                      {v}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className={labelClass}>Bairro</label>
              <input
                value={draft.neighborhood ?? ""}
                onChange={(e) => patch({ neighborhood: e.target.value })}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Preço / ingresso</label>
              <input
                value={draft.priceInfo ?? ""}
                onChange={(e) => patch({ priceInfo: e.target.value })}
                className={inputClass}
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
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={draft.buyAhead ?? false}
                onChange={(e) => patch({ buyAhead: e.target.checked })}
                className="accent-terracotta"
              />
              Comprar antes
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  if (!draft.title || !draft.venue) return;
                  saveNightEvent(draft);
                  onFlash("Evento salvo");
                }}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-terracotta py-2.5 text-sm font-medium text-white"
              >
                <Save size={16} />
                Salvar
              </button>
              <button
                type="button"
                onClick={() => {
                  if (!selectedId || !confirm("Excluir?")) return;
                  deleteNightEvent(selectedId);
                  setSelectedId(null);
                  onFlash("Excluído");
                }}
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
