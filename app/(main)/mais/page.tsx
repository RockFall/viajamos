"use client";

import { useState } from "react";
import Link from "next/link";
import { useTrip } from "@/context/TripProvider";
import {
  ESSENTIAL_TYPE_LABELS,
  DOCUMENT_TYPE_LABELS,
  CHECKLIST_TYPE_LABELS,
  PRIORITY_LABELS,
} from "@/lib/labels";
import { tableHref } from "@/components/settings/SettingsHub";
import { QuickActions } from "@/components/ui/QuickActions";
import {
  MapPin,
  FileText,
  CheckSquare,
  ListTodo,
  Handshake,
  BookHeart,
  Download,
  Settings,
  ChevronRight,
  AlertTriangle,
  Pencil,
} from "lucide-react";
import type { TableId } from "@/lib/settings/table-registry";

type Section =
  | "menu"
  | "addresses"
  | "documents"
  | "checklists"
  | "tasks"
  | "agreements"
  | "memories";

const menuItems: {
  id: Section;
  label: string;
  icon: React.ElementType;
  adminTable?: TableId;
}[] = [
  {
    id: "addresses",
    label: "Endereços essenciais",
    icon: MapPin,
    adminTable: "essential_places",
  },
  {
    id: "documents",
    label: "Documentos e links",
    icon: FileText,
    adminTable: "travel_documents",
  },
  {
    id: "checklists",
    label: "Checklists",
    icon: CheckSquare,
    adminTable: "trip_content",
  },
  { id: "tasks", label: "Pendências", icon: ListTodo, adminTable: "trip_tasks" },
  {
    id: "agreements",
    label: "Combinados importantes",
    icon: Handshake,
    adminTable: "agreements",
  },
  { id: "memories", label: "Memórias", icon: BookHeart, adminTable: "memories" },
];

function ManageLink({ table }: { table: TableId }) {
  return (
    <Link
      href={tableHref(table)}
      className="inline-flex items-center gap-1.5 rounded-xl border border-terracotta/30 bg-terracotta/5 px-3 py-2 text-sm font-medium text-terracotta"
    >
      <Pencil size={14} />
      Gerenciar no admin
    </Link>
  );
}

export default function MaisPage() {
  const {
    tasks,
    toggleTask,
    checklistStates,
    toggleChecklistItem,
    memories,
    updateMemory,
    exportState,
    essentialPlaces,
    travelDocuments,
    checklists,
    agreements,
    tripDays,
    dataSource,
  } = useTrip();
  const [section, setSection] = useState<Section>("menu");

  const exportJson = () => {
    const blob = new Blob([exportState()], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `miami-hub-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const currentMenu = menuItems.find((m) => m.id === section);

  if (section !== "menu") {
    return (
      <div className="space-y-4 pb-4">
        <button
          type="button"
          onClick={() => setSection("menu")}
          className="text-sm text-coral"
        >
          ← Voltar
        </button>

        {currentMenu?.adminTable && (
          <ManageLink table={currentMenu.adminTable} />
        )}

        {section === "addresses" && (
          <>
            <h1 className="text-xl font-bold">Endereços essenciais</h1>
            <div className="space-y-3">
              {essentialPlaces.map((place) => (
                <div key={place.id} className="card p-4">
                  <span className="text-xs text-teal">
                    {ESSENTIAL_TYPE_LABELS[place.type]}
                  </span>
                  <h3 className="font-semibold">{place.name}</h3>
                  <p className="text-sm text-muted">{place.address}</p>
                  {place.notes && (
                    <p className="mt-1 text-xs text-muted">{place.notes}</p>
                  )}
                  <QuickActions
                    googleMapsUrl={place.googleMapsUrl}
                    appleMapsUrl={place.appleMapsUrl}
                    uberUrl={place.uberUrl}
                    compact
                  />
                </div>
              ))}
            </div>
          </>
        )}

        {section === "documents" && (
          <>
            <h1 className="text-xl font-bold">Documentos e links</h1>
            <div className="space-y-3">
              {travelDocuments.map((doc) => (
                <div key={doc.id} className="card p-4">
                  <span className="text-xs text-muted">
                    {DOCUMENT_TYPE_LABELS[doc.type]}
                  </span>
                  <h3 className="font-semibold">{doc.title}</h3>
                  {doc.notes && (
                    <p className="text-sm text-muted">{doc.notes}</p>
                  )}
                  {doc.url && (
                    <a
                      href={doc.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 inline-block text-sm text-coral"
                    >
                      Abrir link →
                    </a>
                  )}
                </div>
              ))}
            </div>
          </>
        )}

        {section === "checklists" && (
          <>
            <h1 className="text-xl font-bold">Checklists</h1>
            {checklists.map((cl) => (
              <div key={cl.id} className="card p-4">
                <h3 className="font-semibold">
                  {CHECKLIST_TYPE_LABELS[cl.type]}
                </h3>
                <p className="text-xs text-muted">{cl.title}</p>
                <div className="mt-3 space-y-2">
                  {cl.items.map((item) => (
                    <label
                      key={item.id}
                      className="flex cursor-pointer items-center gap-3"
                    >
                      <input
                        type="checkbox"
                        checked={checklistStates[item.id] ?? false}
                        onChange={() => toggleChecklistItem(item.id)}
                        className="h-5 w-5 accent-teal"
                      />
                      <span
                        className={
                          checklistStates[item.id]
                            ? "text-muted line-through"
                            : "text-sm"
                        }
                      >
                        {item.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </>
        )}

        {section === "tasks" && (
          <>
            <h1 className="text-xl font-bold">Pendências</h1>
            <div className="space-y-2">
              {tasks.map((task) => (
                <label
                  key={task.id}
                  className="card flex cursor-pointer items-start gap-3 p-4"
                >
                  <input
                    type="checkbox"
                    checked={task.status === "done"}
                    onChange={() => toggleTask(task.id)}
                    className="mt-0.5 h-5 w-5 accent-teal"
                  />
                  <div>
                    <p
                      className={
                        task.status === "done"
                          ? "text-muted line-through"
                          : "font-medium"
                      }
                    >
                      {task.title}
                    </p>
                    <p className="text-xs text-muted">
                      {PRIORITY_LABELS[task.priority]}
                      {task.dueDate && ` · até ${task.dueDate}`}
                    </p>
                  </div>
                </label>
              ))}
            </div>
          </>
        )}

        {section === "agreements" && (
          <>
            <h1 className="text-xl font-bold">Combinados importantes</h1>
            <ul className="space-y-3">
              {agreements
                .sort((a, b) => a.order - b.order)
                .map((a) => (
                  <li key={a.id} className="card p-4 text-sm">
                    {a.text}
                  </li>
                ))}
            </ul>
          </>
        )}

        {section === "memories" && (
          <>
            <h1 className="text-xl font-bold">Memórias</h1>
            {memories.map((mem) => {
              const day = tripDays.find((d) => d.id === mem.dayId);
              return (
                <div key={mem.id} className="card space-y-2 p-4">
                  <h3 className="font-semibold">{day?.title ?? mem.date}</h3>
                  {(
                    [
                      ["bestMoment", "Melhor momento"],
                      ["bestFood", "Melhor comida"],
                      ["favoritePlace", "Lugar favorito"],
                      ["notes", "Nota do dia"],
                    ] as const
                  ).map(([key, label]) => (
                    <div key={key}>
                      <label className="text-xs text-muted">{label}</label>
                      <input
                        value={(mem[key] as string) ?? ""}
                        onChange={(e) =>
                          updateMemory(mem.id, { [key]: e.target.value })
                        }
                        className="mt-0.5 w-full rounded-lg border px-2 py-1 text-sm"
                      />
                    </div>
                  ))}
                  <div>
                    <label className="text-xs text-muted">Nota (1-5)</label>
                    <input
                      type="number"
                      min={0}
                      max={5}
                      value={mem.rating ?? 0}
                      onChange={(e) =>
                        updateMemory(mem.id, {
                          rating: Number(e.target.value),
                        })
                      }
                      className="mt-0.5 w-20 rounded-lg border px-2 py-1 text-sm"
                    />
                  </div>
                </div>
              );
            })}
          </>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-4">
      <header>
        <h1 className="text-2xl font-bold text-ocean">Mais</h1>
        <p className="text-sm text-muted">Utilidades da viagem</p>
      </header>

      {dataSource === "fallback" && (
        <div className="flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
          <AlertTriangle size={18} className="mt-0.5 shrink-0" />
          <p>
            Dados locais (JSON). Abra{" "}
            <Link href="/mais/configuracoes" className="font-medium underline">
              Configurações
            </Link>{" "}
            após conectar o Supabase para editar na nuvem.
          </p>
        </div>
      )}

      <ul className="space-y-2">
        {menuItems.map(({ id, label, icon: Icon }) => (
          <li key={id}>
            <button
              type="button"
              onClick={() => setSection(id)}
              className="card flex w-full items-center justify-between p-4 text-left transition hover:shadow-md"
            >
              <span className="flex items-center gap-3">
                <Icon size={20} className="text-teal" />
                <span className="font-medium">{label}</span>
              </span>
              <ChevronRight size={18} className="text-muted" />
            </button>
          </li>
        ))}
        <li>
          <Link
            href="/mais/configuracoes"
            className="card flex w-full items-center justify-between border-terracotta/20 p-4 transition hover:shadow-md"
          >
            <span className="flex items-center gap-3">
              <Settings size={20} className="text-terracotta" />
              <span className="font-medium">Configurações</span>
            </span>
            <ChevronRight size={18} className="text-muted" />
          </Link>
        </li>
      </ul>

      <button
        type="button"
        onClick={exportJson}
        className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-teal py-3 text-sm font-medium text-teal-dark"
      >
        <Download size={18} />
        Exportar JSON do estado atual
      </button>
    </div>
  );
}
