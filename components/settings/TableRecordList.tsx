"use client";

import { Plus, Search } from "lucide-react";
import { useMemo, useState } from "react";

export function TableRecordList<T extends { id: string }>({
  records,
  listLabel,
  selectedId,
  onSelect,
  onNew,
  readOnly,
}: {
  records: T[];
  listLabel: (record: T) => string;
  selectedId: string | null;
  onSelect: (id: string) => void;
  onNew?: () => void;
  readOnly?: boolean;
}) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return records;
    return records.filter((r) =>
      listLabel(r).toLowerCase().includes(q)
    );
  }, [records, query, listLabel]);

  return (
    <div className="card flex flex-col overflow-hidden p-0 md:max-h-[70vh]">
      <div className="border-b border-border p-3 space-y-2">
        <div className="relative">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar…"
            className="w-full rounded-xl border border-border bg-card py-2 pl-9 pr-3 text-sm"
          />
        </div>
        {!readOnly && onNew && (
          <button
            type="button"
            onClick={onNew}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-terracotta py-2 text-sm font-medium text-white"
          >
            <Plus size={16} />
            Novo registro
          </button>
        )}
      </div>
      <ul className="flex-1 overflow-y-auto divide-y divide-border">
        {filtered.length === 0 ? (
          <li className="p-4 text-center text-sm text-muted-foreground">
            Nenhum registro
          </li>
        ) : (
          filtered.map((record) => (
            <li key={record.id}>
              <button
                type="button"
                onClick={() => onSelect(record.id)}
                className={`w-full px-4 py-3 text-left text-sm transition ${
                  selectedId === record.id
                    ? "bg-terracotta/10 font-medium text-terracotta"
                    : "hover:bg-secondary/50"
                }`}
              >
                {listLabel(record)}
              </button>
            </li>
          ))
        )}
      </ul>
      <p className="border-t border-border px-3 py-2 text-xs text-muted-foreground">
        {filtered.length} de {records.length}
      </p>
    </div>
  );
}
