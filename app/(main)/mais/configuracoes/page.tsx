"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { SettingsShell } from "@/components/settings/SettingsShell";
import { SettingsHub } from "@/components/settings/SettingsHub";
import { TableEditorView } from "@/components/settings/TableEditorView";
import { TABLE_BY_ID, type TableId } from "@/lib/settings/table-registry";
import { useTrip } from "@/context/TripProvider";
import { Download } from "lucide-react";

function ConfiguracoesContent() {
  const searchParams = useSearchParams();
  const tableParam = searchParams.get("table");
  const tableId =
    tableParam && tableParam in TABLE_BY_ID
      ? (tableParam as TableId)
      : null;
  const [flash, setFlash] = useState<string | null>(null);
  const { exportState, today, realToday, isDateSimulated, setMockToday, resetToday, tripDays, config, dataSource } =
    useTrip();

  const showFlash = (msg: string) => {
    setFlash(msg);
    setTimeout(() => setFlash(null), 2000);
  };

  const exportJson = () => {
    const blob = new Blob([exportState()], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `miami-hub-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!tableId) {
    return (
      <SettingsShell
        title="Configurações"
        subtitle="Gerencie todos os dados da viagem no banco"
        backHref="/mais"
        backLabel="Mais"
        flash={flash}
      >
        <SettingsHub />

        <div className="card space-y-3 p-4">
          <h2 className="text-sm font-semibold">App</h2>
          <p className="text-xs text-muted-foreground">
            Fonte:{" "}
            <span className="font-semibold text-terracotta">
              {dataSource === "supabase" ? "Supabase" : "JSON local"}
            </span>
          </p>
          <div>
            <label className="text-sm font-medium">Simular data</label>
            <select
              value={today}
              onChange={(e) => {
                const next = e.target.value;
                if (next === realToday) resetToday();
                else setMockToday(next);
              }}
              className="mt-1 w-full rounded-xl border px-3 py-2 text-sm"
            >
              <option value={realToday}>Hoje real</option>
              {[config.startDate, config.endDate]
                .filter((d) => !tripDays.some((td) => td.date === d))
                .map((date) => (
                  <option key={date} value={date}>
                    {date.slice(8, 10)}/{date.slice(5, 7)} — especial
                  </option>
                ))}
              {tripDays.map((d) => (
                <option key={d.id} value={d.date}>
                  {d.date.slice(8, 10)}/{d.date.slice(5, 7)} — {d.title}
                </option>
              ))}
            </select>
          </div>
          {isDateSimulated && (
            <button
              type="button"
              onClick={resetToday}
              className="w-full rounded-xl bg-secondary py-2 text-sm font-medium"
            >
              Voltar para data real
            </button>
          )}
        </div>

        <button
          type="button"
          onClick={exportJson}
          className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-teal py-3 text-sm font-medium text-teal-dark"
        >
          <Download size={18} />
          Exportar JSON
        </button>
      </SettingsShell>
    );
  }

  const table = TABLE_BY_ID[tableId];

  return (
    <SettingsShell
      title={table.label}
      subtitle={table.description}
      flash={flash}
    >
      <TableEditorView tableId={tableId} onFlash={showFlash} />
    </SettingsShell>
  );
}

export default function ConfiguracoesPage() {
  return (
    <Suspense
      fallback={
        <div className="p-4 text-sm text-muted-foreground">Carregando…</div>
      }
    >
      <ConfiguracoesContent />
    </Suspense>
  );
}
