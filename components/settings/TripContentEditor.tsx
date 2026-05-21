"use client";

import { useEffect, useMemo, useState } from "react";
import { useTrip } from "@/context/TripProvider";
import { generateId } from "@/lib/itinerary";
import { getTripPhase } from "@/lib/trip-phase";
import type {
  Checklist,
  ChecklistItem,
  ChecklistType,
  FamilyMemberId,
  Flight,
  FlightStatus,
  TravelTimelineItem,
  TripDay,
} from "@/types";
import { Plus, Trash2, Save, Plane } from "lucide-react";

const inputClass =
  "mt-1 w-full rounded-xl border border-border bg-card px-3 py-2 text-sm";
const labelClass = "text-xs font-medium text-muted-foreground";

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <div>
      <label className={labelClass}>{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={inputClass}
      />
    </div>
  );
}

const CHECKLIST_SECTIONS: { type: ChecklistType; title: string }[] = [
  { type: "before_trip", title: "Pré-viagem (Agora)" },
  { type: "travel_day", title: "Dia do voo (Agora)" },
  { type: "daily", title: "Checklist diário" },
  { type: "return", title: "Dia de volta" },
];

const FLIGHT_STATUSES: FlightStatus[] = [
  "pending",
  "confirmed",
  "boarding",
  "delayed",
];

export function TripContentEditor() {
  const {
    tripDays,
    config,
    family,
    flights,
    travelTimeline,
    checklists,
    updateTripDay,
    saveFlightsBulk,
    saveTravelTimelineItem,
    deleteTravelTimelineItem,
    updateChecklist,
    ensureFlightsForDate,
  } = useTrip();

  const travelDates = useMemo(
    () =>
      [config.startDate, config.endDate].filter(
        (d, i, arr) => arr.indexOf(d) === i
      ),
    [config.startDate, config.endDate]
  );

  const [selectedDate, setSelectedDate] = useState(config.startDate);
  const [savedFlash, setSavedFlash] = useState<string | null>(null);

  const dayInfo = tripDays.find((d) => d.date === selectedDate);
  const phase = getTripPhase(
    selectedDate,
    config.startDate,
    config.endDate
  );
  const isFlightDay = phase === "travel";

  const dayFlights = useMemo(
    () => flights.filter((f) => f.date === selectedDate),
    [flights, selectedDate]
  );
  const dayTimeline = useMemo(
    () => travelTimeline.filter((t) => t.date === selectedDate),
    [travelTimeline, selectedDate]
  );

  const [dayDraft, setDayDraft] = useState<Partial<TripDay>>({});
  const [sharedFlight, setSharedFlight] = useState({
    route: "",
    from: "",
    to: "",
    flightNumber: "",
    gate: "",
    boardingTime: "",
    departureTime: "",
    arrivalTime: "",
    terminal: "",
    status: "pending" as FlightStatus,
  });
  const [seatDrafts, setSeatDrafts] = useState<
    Partial<Record<FamilyMemberId, string>>
  >({});

  const flash = (msg: string) => {
    setSavedFlash(msg);
    setTimeout(() => setSavedFlash(null), 2000);
  };

  useEffect(() => {
    if (dayInfo) {
      setDayDraft({
        title: dayInfo.title,
        theme: dayInfo.theme,
        weather: dayInfo.weather ?? "",
      });
    }
    const lead = dayFlights[0];
    if (lead) {
      setSharedFlight({
        route: lead.route,
        from: lead.from,
        to: lead.to,
        flightNumber: lead.flightNumber,
        gate: lead.gate ?? "",
        boardingTime: lead.boardingTime ?? "",
        departureTime: lead.departureTime,
        arrivalTime: lead.arrivalTime ?? "",
        terminal: lead.terminal ?? "",
        status: lead.status,
      });
    } else {
      const isReturn = dayInfo?.isReturnDay;
      setSharedFlight({
        route: isReturn ? "Miami → Belo Horizonte" : "Belo Horizonte → Miami",
        from: isReturn ? "MIA" : "BHZ/CNF",
        to: isReturn ? "BHZ/CNF" : "MIA",
        flightNumber: "A definir",
        gate: "",
        boardingTime: "",
        departureTime: "A definir",
        arrivalTime: "A definir",
        terminal: "",
        status: "pending",
      });
    }
    const seats: Partial<Record<FamilyMemberId, string>> = {};
    for (const m of family) {
      const f = dayFlights.find((fl) => fl.passengerId === m.id);
      seats[m.id] = f?.seat ?? "";
    }
    setSeatDrafts(seats);
  }, [selectedDate, dayInfo, dayFlights, family]);

  const saveDayInfo = () => {
    if (!dayInfo) return;
    updateTripDay(dayInfo.id, {
      title: dayDraft.title ?? dayInfo.title,
      theme: dayDraft.theme ?? dayInfo.theme,
      weather: dayDraft.weather || undefined,
    });
    flash("Dia atualizado");
  };

  const saveAllFlights = () => {
    const isReturn = dayInfo?.isReturnDay;
    const toSave: Flight[] = family.map((member) => {
      const existing = dayFlights.find((f) => f.passengerId === member.id);
      const id =
        existing?.id ??
        `flt-${member.id}-${isReturn ? "ret" : "out"}-${selectedDate.slice(5, 7)}`;
      return {
        id,
        passengerId: member.id,
        passengerName: member.name.toUpperCase(),
        route: sharedFlight.route,
        from: sharedFlight.from,
        to: sharedFlight.to,
        flightNumber: sharedFlight.flightNumber,
        seat: seatDrafts[member.id]?.trim() || undefined,
        terminal: sharedFlight.terminal || undefined,
        gate: sharedFlight.gate || undefined,
        boardingTime: sharedFlight.boardingTime || undefined,
        departureTime: sharedFlight.departureTime,
        arrivalTime: sharedFlight.arrivalTime || undefined,
        date: selectedDate,
        status: sharedFlight.status,
        confirmationCode: existing?.confirmationCode,
      };
    });
    saveFlightsBulk(toSave);
    flash("Voos salvos no Supabase");
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-muted-foreground">
          Edite tudo o que aparece na Agora (dia do voo, linha do dia, checklists)
          e nos textos de cada dia. As alterações são salvas no Supabase.
        </p>
        {savedFlash && (
          <p className="mt-2 text-sm font-medium text-terracotta">{savedFlash}</p>
        )}
      </div>

      <div>
        <label className={labelClass}>Qual dia editar?</label>
        <select
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className={inputClass}
        >
          {tripDays.map((d) => (
            <option key={d.id} value={d.date}>
              {d.date.slice(8, 10)}/{d.date.slice(5, 7)} — {d.title}
              {(d.isTravelDay || d.isReturnDay) ? " ✈" : ""}
            </option>
          ))}
        </select>
      </div>

      {/* Texto do dia */}
      <section className="card space-y-3 p-4">
        <h2 className="font-semibold">Texto do dia (Agora / hero)</h2>
        <Field
          label="Título do dia"
          value={dayDraft.title ?? ""}
          onChange={(v) => setDayDraft((d) => ({ ...d, title: v }))}
        />
        <Field
          label="Tema / subtítulo (aparece no hero e no dia do voo)"
          value={dayDraft.theme ?? ""}
          onChange={(v) => setDayDraft((d) => ({ ...d, theme: v }))}
        />
        <Field
          label="Clima (ex.: 29°C · Ensolarado)"
          value={dayDraft.weather ?? ""}
          onChange={(v) => setDayDraft((d) => ({ ...d, weather: v }))}
        />
        <button
          type="button"
          onClick={saveDayInfo}
          disabled={!dayInfo}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-terracotta py-2.5 text-sm font-medium text-primary-foreground"
        >
          <Save size={16} />
          Salvar texto do dia
        </button>
      </section>

      {/* Cartão de viagem */}
      {isFlightDay && (
        <section className="card space-y-3 p-4">
          <div className="flex items-center gap-2">
            <Plane size={18} className="text-terracotta" />
            <h2 className="font-semibold">Cartão de viagem / voos</h2>
          </div>
          <p className="text-xs text-muted-foreground">
            Dados compartilhados do cartão. Assentos são por pessoa.
          </p>

          {dayFlights.length === 0 && (
            <button
              type="button"
              onClick={() => {
                ensureFlightsForDate(selectedDate);
                flash("Registros criados — preencha e salve");
              }}
              className="w-full rounded-xl border-2 border-dashed border-terracotta/40 py-3 text-sm font-medium text-terracotta"
            >
              Criar bilhetes para toda a família
            </button>
          )}

          <Field
            label="Rota (ex.: Belo Horizonte → Miami)"
            value={sharedFlight.route}
            onChange={(v) => setSharedFlight((s) => ({ ...s, route: v }))}
          />
          <div className="grid grid-cols-2 gap-2">
            <Field
              label="Origem (código)"
              value={sharedFlight.from}
              onChange={(v) => setSharedFlight((s) => ({ ...s, from: v }))}
            />
            <Field
              label="Destino (código)"
              value={sharedFlight.to}
              onChange={(v) => setSharedFlight((s) => ({ ...s, to: v }))}
            />
          </div>
          <Field
            label="Número do voo"
            value={sharedFlight.flightNumber}
            onChange={(v) =>
              setSharedFlight((s) => ({ ...s, flightNumber: v }))
            }
          />
          <div className="grid grid-cols-2 gap-2">
            <Field
              label="Decolagem"
              value={sharedFlight.departureTime}
              onChange={(v) =>
                setSharedFlight((s) => ({ ...s, departureTime: v }))
              }
              placeholder="06:45"
            />
            <Field
              label="Pouso"
              value={sharedFlight.arrivalTime}
              onChange={(v) =>
                setSharedFlight((s) => ({ ...s, arrivalTime: v }))
              }
              placeholder="14:30"
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Field
              label="Embarque"
              value={sharedFlight.boardingTime}
              onChange={(v) =>
                setSharedFlight((s) => ({ ...s, boardingTime: v }))
              }
            />
            <Field
              label="Portão"
              value={sharedFlight.gate}
              onChange={(v) => setSharedFlight((s) => ({ ...s, gate: v }))}
            />
          </div>
          <Field
            label="Terminal"
            value={sharedFlight.terminal}
            onChange={(v) => setSharedFlight((s) => ({ ...s, terminal: v }))}
          />
          <div>
            <label className={labelClass}>Status</label>
            <select
              value={sharedFlight.status}
              onChange={(e) =>
                setSharedFlight((s) => ({
                  ...s,
                  status: e.target.value as FlightStatus,
                }))
              }
              className={inputClass}
            >
              {FLIGHT_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <p className="text-xs font-medium text-muted-foreground">
            Assento por pessoa
          </p>
          {family.map((m) => (
            <Field
              key={m.id}
              label={m.shortName}
              value={seatDrafts[m.id] ?? ""}
              onChange={(v) =>
                setSeatDrafts((s) => ({ ...s, [m.id]: v }))
              }
              placeholder="18A"
            />
          ))}

          <button
            type="button"
            onClick={saveAllFlights}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-terracotta py-2.5 text-sm font-medium text-primary-foreground"
          >
            <Save size={16} />
            Salvar cartão e voos
          </button>
        </section>
      )}

      {/* Linha do dia */}
      <TimelineSection
        date={selectedDate}
        items={dayTimeline}
        onSave={saveTravelTimelineItem}
        onDelete={deleteTravelTimelineItem}
        onFlash={flash}
      />

      {/* Checklists */}
      {CHECKLIST_SECTIONS.map(({ type, title }) => {
        const cl = checklists.find((c) => c.type === type);
        if (!cl) return null;
        const show =
          type === "before_trip" ||
          type === "daily" ||
          (type === "travel_day" && isFlightDay) ||
          (type === "return" && dayInfo?.isReturnDay);
        if (!show && type !== "travel_day" && type !== "return") return null;
        if (type === "travel_day" && !isFlightDay) return null;
        if (type === "return" && !dayInfo?.isReturnDay) return null;

        return (
          <ChecklistSection
            key={cl.id}
            checklist={cl}
            sectionTitle={title}
            onSave={(updated) => {
              updateChecklist(cl.id, updated);
              flash(`Checklist "${cl.title}" salvo`);
            }}
          />
        );
      })}

      <p className="text-xs text-muted-foreground">
        Datas de voo rápidas:{" "}
        {travelDates.map((d) => (
          <button
            key={d}
            type="button"
            onClick={() => setSelectedDate(d)}
            className="mr-2 text-terracotta underline"
          >
            {d.slice(8, 10)}/{d.slice(5, 7)}
          </button>
        ))}
      </p>
    </div>
  );
}

function TimelineSection({
  date,
  items,
  onSave,
  onDelete,
  onFlash,
}: {
  date: string;
  items: TravelTimelineItem[];
  onSave: (item: TravelTimelineItem) => void;
  onDelete: (id: string) => void;
  onFlash: (msg: string) => void;
}) {
  return (
    <TimelineSectionEditor
      key={date}
      date={date}
      items={items}
      onSave={onSave}
      onDelete={onDelete}
      onFlash={onFlash}
    />
  );
}

function TimelineSectionEditor({
  date,
  items,
  onSave,
  onDelete,
  onFlash,
}: {
  date: string;
  items: TravelTimelineItem[];
  onSave: (item: TravelTimelineItem) => void;
  onDelete: (id: string) => void;
  onFlash: (msg: string) => void;
}) {
  const [drafts, setDrafts] = useState<TravelTimelineItem[]>(() =>
    items.map((i) => ({ ...i }))
  );

  const addItem = () => {
    const item: TravelTimelineItem = {
      id: generateId("tl"),
      time: "12:00",
      label: "Novo passo",
      subtitle: "",
      date,
      isDeparture: false,
    };
    setDrafts((d) => [...d, item]);
    onSave(item);
    onFlash("Passo adicionado");
  };

  const updateLocal = (id: string, patch: Partial<TravelTimelineItem>) => {
    setDrafts((d) =>
      d.map((item) => (item.id === id ? { ...item, ...patch } : item))
    );
  };

  const saveItem = (item: TravelTimelineItem) => {
    onSave(item);
    onFlash("Linha do dia salva");
  };

  return (
    <section className="card space-y-3 p-4">
      <h2 className="font-semibold">Linha do dia</h2>
      <p className="text-xs text-muted-foreground">
        Passos do dia do voo (e de deslocamentos). Horário, título e detalhe.
      </p>

      {drafts.length === 0 && (
        <p className="text-sm text-muted-foreground">
          Nenhum passo nesta data. Adicione o primeiro.
        </p>
      )}

      {drafts.map((item) => (
        <div
          key={item.id}
          className="space-y-2 rounded-xl border border-border/80 bg-secondary/30 p-3"
        >
          <div className="grid grid-cols-[1fr_auto] gap-2">
            <Field
              label="Horário"
              value={item.time}
              onChange={(v) => updateLocal(item.id, { time: v })}
              placeholder="06:00"
            />
            <div className="flex items-end">
              <label className="flex items-center gap-2 pb-2 text-xs">
                <input
                  type="checkbox"
                  checked={item.isDeparture ?? false}
                  onChange={(e) =>
                    updateLocal(item.id, { isDeparture: e.target.checked })
                  }
                  className="accent-terracotta"
                />
                1º passo
              </label>
            </div>
          </div>
          <Field
            label="Título"
            value={item.label}
            onChange={(v) => updateLocal(item.id, { label: v })}
          />
          <Field
            label="Detalhe (subtítulo)"
            value={item.subtitle ?? ""}
            onChange={(v) => updateLocal(item.id, { subtitle: v || undefined })}
            placeholder="Uber XL · placa GHJ-4521"
          />
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => saveItem(item)}
              className="flex flex-1 items-center justify-center gap-1 rounded-lg bg-terracotta/90 py-2 text-xs font-medium text-primary-foreground"
            >
              <Save size={14} />
              Salvar
            </button>
            <button
              type="button"
              onClick={() => {
                onDelete(item.id);
                setDrafts((d) => d.filter((x) => x.id !== item.id));
                onFlash("Passo removido");
              }}
              className="rounded-lg border border-border px-3 py-2 text-xs text-muted-foreground"
              aria-label="Remover"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={addItem}
        className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border py-3 text-sm font-medium"
      >
        <Plus size={16} />
        Adicionar passo
      </button>
    </section>
  );
}

function ChecklistSection({
  checklist,
  sectionTitle,
  onSave,
}: {
  checklist: Checklist;
  sectionTitle: string;
  onSave: (c: Checklist) => void;
}) {
  return (
    <ChecklistSectionEditor
      key={checklist.id}
      checklist={checklist}
      sectionTitle={sectionTitle}
      onSave={onSave}
    />
  );
}

function ChecklistSectionEditor({
  checklist,
  sectionTitle,
  onSave,
}: {
  checklist: Checklist;
  sectionTitle: string;
  onSave: (c: Checklist) => void;
}) {
  const [items, setItems] = useState<ChecklistItem[]>(() =>
    checklist.items.map((i) => ({ ...i }))
  );
  const [title, setTitle] = useState(checklist.title);

  const addItem = () => {
    setItems((list) => [
      ...list,
      { id: generateId("cl"), label: "Novo item" },
    ]);
  };

  const save = () => {
    onSave({ ...checklist, title, items });
  };

  return (
    <section className="card space-y-3 p-4">
      <h2 className="font-semibold">{sectionTitle}</h2>
      <Field label="Título da lista" value={title} onChange={setTitle} />
      {items.map((item, index) => (
        <div key={item.id} className="flex gap-2">
          <input
            value={item.label}
            onChange={(e) =>
              setItems((list) =>
                list.map((it, i) =>
                  i === index ? { ...it, label: e.target.value } : it
                )
              )
            }
            className={`${inputClass} mt-0 flex-1`}
          />
          <button
            type="button"
            onClick={() => setItems((list) => list.filter((_, i) => i !== index))}
            className="mt-1 shrink-0 rounded-lg border border-border p-2"
            aria-label="Remover item"
          >
            <Trash2 size={14} />
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={addItem}
        className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-border py-2 text-sm"
      >
        <Plus size={14} />
        Item
      </button>
      <button
        type="button"
        onClick={save}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-secondary py-2.5 text-sm font-medium ring-1 ring-border"
      >
        <Save size={16} />
        Salvar checklist
      </button>
    </section>
  );
}
