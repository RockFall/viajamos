"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useTrip } from "@/context/TripProvider";
import { generateId } from "@/lib/itinerary";
import { TABLE_BY_ID, type TableId } from "@/lib/settings/table-registry";
import { DynamicRecordForm } from "./DynamicRecordForm";
import { TableRecordList } from "./TableRecordList";
import { Save, Trash2 } from "lucide-react";

type Entity = { id: string } & Record<string, unknown>;

const ID_PREFIX: Partial<Record<TableId, string>> = {
  family_members: "fam",
  trip_days: "day",
  day_alternative_plans: "alt",
  essential_places: "place",
  travel_documents: "doc",
  trip_tasks: "task",
  agreements: "agr",
  memories: "mem",
};

function emptyFromFields(
  tableId: TableId,
  fields: { key: string; type: string }[]
): Entity {
  const base: Entity = { id: generateId(ID_PREFIX[tableId] ?? "rec") };
  for (const f of fields) {
    if (f.key === "id") continue;
    if (f.type === "boolean") base[f.key] = false;
    else if (f.type === "stringArray" || f.type === "planIdsMulti")
      base[f.key] = [];
    else if (f.type === "number") base[f.key] = 0;
    else if (f.key === "status") base[f.key] = "open";
    else if (f.key === "priority") base[f.key] = "medium";
    else if (f.key === "order") base[f.key] = 1;
    else base[f.key] = "";
  }
  return base;
}

export function GenericTableEditor({
  tableId,
  onFlash,
}: {
  tableId: TableId;
  onFlash: (msg: string) => void;
}) {
  const table = TABLE_BY_ID[tableId];
  const trip = useTrip();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [draft, setDraft] = useState<Record<string, unknown> | null>(null);

  const records = useMemo((): Entity[] => {
    if (tableId === "checklist_item_states") {
      return Object.entries(trip.checklistStates).map(([itemId, checked]) => ({
        id: itemId,
        itemId,
        checked,
      }));
    }
    const key = table.dataKey as keyof typeof trip;
    const value = trip[key];
    if (Array.isArray(value)) return value as unknown as Entity[];
    return [];
  }, [tableId, table.dataKey, trip]);

  const listLabel = useCallback(
    (r: Entity) => {
      const k = table.listLabelKey;
      const v = r[k];
      if (v != null && String(v).length > 0) return String(v);
      return r.id;
    },
    [table.listLabelKey]
  );

  useEffect(() => {
    if (table.singleton) {
      setDraft({ ...(trip.config as unknown as Record<string, unknown>) });
      setSelectedId("default");
      return;
    }
    if (!selectedId) {
      setDraft(null);
      return;
    }
    const found = records.find((r) => r.id === selectedId);
    setDraft(found ? { ...found } : null);
  }, [selectedId, records, table.singleton, trip.config]);

  const saveHandlers: Record<
    string,
    (entity: Record<string, unknown>) => void
  > = {
    family_members: (e) => trip.saveFamilyMember(e as never),
    trip_days: (e) => trip.saveTripDay(e as never),
    day_alternative_plans: (e) => trip.saveDayAlternative(e as never),
    essential_places: (e) => trip.saveEssentialPlace(e as never),
    travel_documents: (e) => trip.saveTravelDocument(e as never),
    trip_tasks: (e) => trip.saveTask(e as never),
    agreements: (e) => trip.saveAgreement(e as never),
    memories: (e) => trip.saveMemory(e as never),
  };

  const deleteHandlers: Record<string, (id: string) => void> = {
    family_members: trip.deleteFamilyMember,
    trip_days: trip.deleteTripDay,
    day_alternative_plans: trip.deleteDayAlternative,
    essential_places: trip.deleteEssentialPlace,
    travel_documents: trip.deleteTravelDocument,
    trip_tasks: trip.deleteTask,
    agreements: trip.deleteAgreement,
    memories: trip.deleteMemory,
  };

  const handleSave = () => {
    if (!draft || table.readOnly) return;
    if (table.singleton && tableId === "trip_config") {
      trip.saveTripConfig(draft as never);
      onFlash("Configuração salva");
      return;
    }
    const save = saveHandlers[tableId];
    if (!save) return;
    save(draft);
    onFlash("Salvo");
  };

  const handleDelete = () => {
    if (!selectedId || table.readOnly || table.singleton) return;
    if (!confirm("Excluir este registro?")) return;
    const del = deleteHandlers[tableId];
    if (del) {
      del(selectedId);
      setSelectedId(null);
      setDraft(null);
      onFlash("Excluído");
    }
  };

  const handleNew = () => {
    const empty = emptyFromFields(tableId, table.fields);
    setSelectedId(empty.id);
    setDraft(empty);
  };

  if (table.singleton) {
    return (
      <div className="card space-y-4 p-4">
        {draft && (
          <>
            <DynamicRecordForm
              fields={table.fields}
              draft={draft}
              onChange={setDraft}
            />
            <button
              type="button"
              onClick={handleSave}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-terracotta py-2.5 text-sm font-medium text-white"
            >
              <Save size={16} />
              Salvar
            </button>
          </>
        )}
      </div>
    );
  }

  if (table.readOnly) {
    return (
      <div className="grid gap-4 md:grid-cols-2">
        <TableRecordList
          records={records}
          listLabel={(r) =>
            `${r.id} — ${r.checked ? "marcado" : "pendente"}`
          }
          selectedId={selectedId}
          onSelect={setSelectedId}
          readOnly
        />
        <div className="card p-4 text-sm text-muted-foreground">
          Estados de checklist são alterados ao marcar itens na seção
          Checklists do app ou no editor de viagem.
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-[minmax(0,280px)_1fr]">
      <TableRecordList
        records={records}
        listLabel={listLabel}
        selectedId={selectedId}
        onSelect={setSelectedId}
        onNew={handleNew}
      />
      <div className="card min-w-0 space-y-4 p-4">
        {draft ? (
          <>
            <DynamicRecordForm
              fields={table.fields}
              draft={draft}
              onChange={setDraft}
            />
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleSave}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-terracotta py-2.5 text-sm font-medium text-white"
              >
                <Save size={16} />
                Salvar
              </button>
              {selectedId && (
                <button
                  type="button"
                  onClick={handleDelete}
                  className="flex items-center justify-center gap-2 rounded-xl border border-red-200 px-4 py-2.5 text-sm text-red-600"
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>
          </>
        ) : (
          <p className="py-8 text-center text-sm text-muted-foreground">
            Selecione um registro ou crie um novo
          </p>
        )}
      </div>
    </div>
  );
}
