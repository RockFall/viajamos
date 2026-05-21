"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useTrip } from "@/context/TripProvider";
import {
  GROUP_LABELS,
  TABLES,
  type TableDef,
  type TableGroup,
  type TableId,
} from "@/lib/settings/table-registry";
import type { FullTripData } from "@/lib/supabase/queries";
import { ChevronRight } from "lucide-react";

function getCount(
  table: TableDef,
  data: ReturnType<typeof useTrip>
): number | string {
  if (table.id === "trip_content") return "—";
  if (table.singleton) return "1";
  if (table.id === "checklist_item_states") {
    return Object.keys(data.checklistStates).length;
  }
  const key = table.dataKey as keyof FullTripData;
  const value = data[key];
  if (Array.isArray(value)) return value.length;
  if (value && typeof value === "object") return 1;
  return 0;
}

export function SettingsHub() {
  const trip = useTrip();

  const byGroup = useMemo(() => {
    const map = new Map<TableGroup, TableDef[]>();
    for (const t of TABLES) {
      const list = map.get(t.group) ?? [];
      list.push(t);
      map.set(t.group, list);
    }
    return map;
  }, []);

  const groups: TableGroup[] = [
    "viagem",
    "roteiro",
    "planos",
    "noite",
    "utilidades",
    "sistema",
  ];

  return (
    <div className="space-y-6">
      {groups.map((group) => {
        const tables = byGroup.get(group) ?? [];
        if (tables.length === 0) return null;
        return (
          <section key={group}>
            <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {GROUP_LABELS[group]}
            </h2>
            <ul className="space-y-2">
              {tables.map((table) => {
                const Icon = table.icon;
                const count = getCount(table, trip);
                return (
                  <li key={table.id}>
                    <Link
                      href={`/mais/configuracoes?table=${table.id}`}
                      className="card flex items-center justify-between gap-3 p-4 transition hover:shadow-md"
                    >
                      <span className="flex min-w-0 items-center gap-3">
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-terracotta/10 text-terracotta">
                          <Icon size={20} />
                        </span>
                        <span className="min-w-0">
                          <span className="block font-medium">{table.label}</span>
                          <span className="block truncate text-xs text-muted-foreground">
                            {table.description}
                          </span>
                        </span>
                      </span>
                      <span className="flex shrink-0 items-center gap-1 text-sm text-muted-foreground">
                        <span className="tabular-nums">{count}</span>
                        <ChevronRight size={18} />
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>
        );
      })}
    </div>
  );
}

export function tableHref(id: TableId): string {
  return `/mais/configuracoes?table=${id}`;
}
