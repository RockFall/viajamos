"use client";

import { useCallback, useEffect, useState } from "react";
import { useTrip } from "@/context/TripProvider";
import { generateId } from "@/lib/itinerary";
import {
  BEST_FOR_OPTIONS,
  INTENSITY_OPTIONS,
  PERIOD_OPTIONS,
  PLAN_STATUS_OPTIONS,
  POSSIBLE_CATEGORY_OPTIONS,
} from "@/lib/settings/table-registry";
import { inputClass, labelClass, selectClass, textareaClass } from "@/lib/settings/form-ui";
import type { BestFor, EventPeriod, PossiblePlan } from "@/types";
import { RESTAURANT_CUISINE_LABELS } from "@/lib/labels";
import { RESTAURANT_CUISINES } from "@/lib/planos/restaurant-cuisines";
import { Save, Trash2 } from "lucide-react";
import { TableRecordList } from "./TableRecordList";

function emptyPlan(): PossiblePlan {
  return {
    id: generateId("plan"),
    title: "",
    description: "",
    category: "restaurant",
    periods: ["afternoon"],
    intensity: "moderate",
    bestFor: ["family"],
    tags: [],
    status: "candidate",
  };
}

export function PossiblePlanEditor({
  onFlash,
}: {
  onFlash: (msg: string) => void;
}) {
  const { possiblePlans, savePossiblePlan, deletePossiblePlan } = useTrip();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [draft, setDraft] = useState<PossiblePlan | null>(null);

  useEffect(() => {
    if (!selectedId) {
      setDraft(null);
      return;
    }
    const found = possiblePlans.find((p) => p.id === selectedId);
    setDraft(found ? { ...found } : null);
  }, [selectedId, possiblePlans]);

  const listLabel = useCallback((p: PossiblePlan) => p.title, []);

  const patch = (updates: Partial<PossiblePlan>) => {
    setDraft((d) => (d ? { ...d, ...updates } : d));
  };

  const togglePeriod = (period: EventPeriod) => {
    if (!draft) return;
    const periods = draft.periods.includes(period)
      ? draft.periods.filter((p) => p !== period)
      : [...draft.periods, period];
    patch({ periods });
  };

  const toggleBestFor = (bf: BestFor) => {
    if (!draft) return;
    const bestFor = draft.bestFor.includes(bf)
      ? draft.bestFor.filter((b) => b !== bf)
      : [...draft.bestFor, bf];
    patch({ bestFor });
  };

  return (
    <div className="grid gap-4 md:grid-cols-[minmax(0,280px)_1fr]">
      <TableRecordList
        records={possiblePlans}
        listLabel={listLabel}
        selectedId={selectedId}
        onSelect={setSelectedId}
        onNew={() => {
          const p = emptyPlan();
          setSelectedId(p.id);
          setDraft(p);
        }}
      />
      <div className="card min-w-0 max-h-[75vh] space-y-3 overflow-y-auto p-4">
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
              <label className={labelClass}>Subtítulo</label>
              <input
                value={draft.subtitle ?? ""}
                onChange={(e) => patch({ subtitle: e.target.value })}
                className={inputClass}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>Categoria</label>
                <select
                  value={draft.category}
                  onChange={(e) => {
                    const category = e.target.value as PossiblePlan["category"];
                    patch({
                      category,
                      ...(category !== "restaurant" ? { cuisine: undefined } : {}),
                    });
                  }}
                  className={selectClass}
                >
                  {Object.entries(POSSIBLE_CATEGORY_OPTIONS).map(([k, v]) => (
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
                      status: e.target.value as PossiblePlan["status"],
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
            {draft.category === "restaurant" && (
              <div>
                <label className={labelClass}>Cozinha</label>
                <select
                  value={draft.cuisine ?? ""}
                  onChange={(e) =>
                    patch({
                      cuisine: e.target.value
                        ? (e.target.value as PossiblePlan["cuisine"])
                        : undefined,
                    })
                  }
                  className={selectClass}
                >
                  <option value="">—</option>
                  {RESTAURANT_CUISINES.map((c) => (
                    <option key={c} value={c}>
                      {RESTAURANT_CUISINE_LABELS[c]}
                    </option>
                  ))}
                </select>
              </div>
            )}
            <div>
              <label className={labelClass}>Intensidade</label>
              <select
                value={draft.intensity}
                onChange={(e) =>
                  patch({
                    intensity: e.target.value as PossiblePlan["intensity"],
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
              <span className={labelClass}>Períodos</span>
              <div className="mt-2 flex flex-wrap gap-2">
                {(
                  Object.entries(PERIOD_OPTIONS) as [EventPeriod, string][]
                ).map(([k, v]) => (
                  <label
                    key={k}
                    className="flex items-center gap-1 rounded-full border px-3 py-1 text-sm"
                  >
                    <input
                      type="checkbox"
                      checked={draft.periods.includes(k)}
                      onChange={() => togglePeriod(k)}
                      className="accent-terracotta"
                    />
                    {v}
                  </label>
                ))}
              </div>
            </div>
            <div>
              <span className={labelClass}>Ideal para</span>
              <div className="mt-2 flex flex-wrap gap-2">
                {(
                  Object.entries(BEST_FOR_OPTIONS) as [BestFor, string][]
                ).map(([k, v]) => (
                  <label
                    key={k}
                    className="flex items-center gap-1 rounded-full border px-2 py-1 text-xs"
                  >
                    <input
                      type="checkbox"
                      checked={draft.bestFor.includes(k)}
                      onChange={() => toggleBestFor(k)}
                      className="accent-terracotta"
                    />
                    {v}
                  </label>
                ))}
              </div>
            </div>
            <div>
              <label className={labelClass}>Descrição</label>
              <textarea
                value={draft.description}
                onChange={(e) => patch({ description: e.target.value })}
                className={textareaClass}
              />
            </div>
            <div>
              <label className={labelClass}>Por que ir</label>
              <textarea
                value={draft.whyGo ?? ""}
                onChange={(e) => patch({ whyGo: e.target.value })}
                className={textareaClass}
              />
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
              <label className={labelClass}>Tags (vírgulas)</label>
              <input
                value={draft.tags.join(", ")}
                onChange={(e) =>
                  patch({
                    tags: e.target.value
                      .split(",")
                      .map((s) => s.trim())
                      .filter(Boolean),
                  })
                }
                className={inputClass}
              />
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={draft.isNearby ?? false}
                onChange={(e) => patch({ isNearby: e.target.checked })}
                className="accent-terracotta"
              />
              Perto da base
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  if (!draft.title) return;
                  savePossiblePlan(draft);
                  onFlash("Plano salvo");
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
                  deletePossiblePlan(selectedId);
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
            Selecione ou crie um plano
          </p>
        )}
      </div>
    </div>
  );
}
