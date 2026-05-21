import type { LucideIcon } from "lucide-react";
import {
  Users,
  Settings2,
  Calendar,
  Plane,
  Clock,
  CheckSquare,
  Map,
  Shuffle,
  Lightbulb,
  Moon,
  MapPin,
  FileText,
  ListTodo,
  Handshake,
  BookHeart,
  Database,
} from "lucide-react";
import {
  TRIGGER_LABELS,
  BEST_FOR_LABELS,
  CATEGORY_LABELS,
  CHECKLIST_TYPE_LABELS,
  DOCUMENT_TYPE_LABELS,
  ESSENTIAL_TYPE_LABELS,
  INTENSITY_LABELS,
  NIGHT_TYPE_LABELS,
  PERIOD_LABELS,
  PLAN_STATUS_LABELS,
  POSSIBLE_CATEGORY_LABELS,
  PRIORITY_LABELS,
  STATUS_LABELS,
} from "@/lib/labels";
import type { FullTripData } from "@/lib/supabase/queries";

export type TableGroup =
  | "viagem"
  | "roteiro"
  | "planos"
  | "noite"
  | "utilidades"
  | "sistema";

export type TableId =
  | "trip_config"
  | "family_members"
  | "trip_days"
  | "trip_content"
  | "itinerary_events"
  | "day_alternative_plans"
  | "possible_plans"
  | "night_events"
  | "essential_places"
  | "travel_documents"
  | "trip_tasks"
  | "agreements"
  | "memories"
  | "checklist_item_states";

export type FieldType =
  | "text"
  | "textarea"
  | "date"
  | "time"
  | "number"
  | "boolean"
  | "enum"
  | "stringArray"
  | "familyMulti"
  | "daySelect"
  | "planIdsMulti";

export interface FieldDef {
  key: string;
  label: string;
  type: FieldType;
  required?: boolean;
  options?: Record<string, string>;
  placeholder?: string;
}

export interface TableDef {
  id: TableId;
  label: string;
  description: string;
  group: TableGroup;
  icon: LucideIcon;
  dataKey: keyof FullTripData | "trip_content";
  listLabelKey: string;
  singleton?: boolean;
  readOnly?: boolean;
  dedicatedEditor?: "itinerary" | "possible_plan" | "night_event" | "trip_content";
  fields: FieldDef[];
}

export const GROUP_LABELS: Record<TableGroup, string> = {
  viagem: "Viagem",
  roteiro: "Roteiro",
  planos: "Planos",
  noite: "Noite",
  utilidades: "Utilidades",
  sistema: "Sistema",
};

export const TABLES: TableDef[] = [
  {
    id: "trip_config",
    label: "Configuração da viagem",
    description: "Destino, datas e endereço base",
    group: "viagem",
    icon: Settings2,
    dataKey: "config",
    listLabelKey: "destination",
    singleton: true,
    fields: [
      { key: "destination", label: "Destino", type: "text", required: true },
      { key: "baseAddress", label: "Endereço base", type: "text", required: true },
      { key: "startDate", label: "Data início", type: "date", required: true },
      { key: "endDate", label: "Data fim", type: "date", required: true },
      { key: "mockToday", label: "Data simulada (padrão)", type: "date" },
    ],
  },
  {
    id: "family_members",
    label: "Família",
    description: "Membros e cores dos avatares",
    group: "viagem",
    icon: Users,
    dataKey: "family",
    listLabelKey: "name",
    fields: [
      { key: "id", label: "ID", type: "text", required: true },
      { key: "name", label: "Nome", type: "text", required: true },
      { key: "shortName", label: "Nome curto", type: "text", required: true },
      { key: "color", label: "Cor (hex)", type: "text", required: true },
    ],
  },
  {
    id: "trip_days",
    label: "Dias da viagem",
    description: "Título, tema e base por dia",
    group: "viagem",
    icon: Calendar,
    dataKey: "tripDays",
    listLabelKey: "title",
    fields: [
      { key: "date", label: "Data", type: "date", required: true },
      { key: "title", label: "Título", type: "text", required: true },
      { key: "theme", label: "Tema", type: "text", required: true },
      {
        key: "area",
        label: "Área",
        type: "enum",
        options: { Miami: "Miami", Islamorada: "Islamorada", Travel: "Viagem" },
      },
      { key: "baseName", label: "Nome da base", type: "text" },
      { key: "baseAddress", label: "Endereço da base", type: "text" },
      { key: "weather", label: "Clima (texto)", type: "text" },
      { key: "isTravelDay", label: "Dia de voo", type: "boolean" },
      { key: "isReturnDay", label: "Dia de volta", type: "boolean" },
    ],
  },
  {
    id: "trip_content",
    label: "Viagem, voos e checklists",
    description: "Voos, timeline e checklists por data",
    group: "viagem",
    icon: Plane,
    dataKey: "trip_content",
    listLabelKey: "title",
    dedicatedEditor: "trip_content",
    fields: [],
  },
  {
    id: "itinerary_events",
    label: "Eventos do roteiro",
    description: "Programação por dia e período",
    group: "roteiro",
    icon: Map,
    dataKey: "itineraryEvents",
    listLabelKey: "title",
    dedicatedEditor: "itinerary",
    fields: [],
  },
  {
    id: "day_alternative_plans",
    label: "Planos alternativos",
    description: "Gatilhos e planos B por dia",
    group: "roteiro",
    icon: Shuffle,
    dataKey: "dayAlternatives",
    listLabelKey: "title",
    fields: [
      { key: "dayId", label: "Dia", type: "daySelect", required: true },
      {
        key: "trigger",
        label: "Gatilho",
        type: "enum",
        required: true,
        options: TRIGGER_LABELS as Record<string, string>,
      },
      { key: "title", label: "Título", type: "text", required: true },
      { key: "description", label: "Descrição", type: "textarea", required: true },
      { key: "planItemIds", label: "IDs dos planos", type: "planIdsMulti" },
    ],
  },
  {
    id: "possible_plans",
    label: "Planos possíveis",
    description: "Ideias para Planos e radar",
    group: "planos",
    icon: Lightbulb,
    dataKey: "possiblePlans",
    listLabelKey: "title",
    dedicatedEditor: "possible_plan",
    fields: [],
  },
  {
    id: "night_events",
    label: "Eventos da noite",
    description: "Jazz, bares e programação noturna",
    group: "noite",
    icon: Moon,
    dataKey: "nightEvents",
    listLabelKey: "title",
    dedicatedEditor: "night_event",
    fields: [],
  },
  {
    id: "essential_places",
    label: "Endereços essenciais",
    description: "Farmácia, aeroporto, hospedagem…",
    group: "utilidades",
    icon: MapPin,
    dataKey: "essentialPlaces",
    listLabelKey: "name",
    fields: [
      { key: "name", label: "Nome", type: "text", required: true },
      {
        key: "type",
        label: "Tipo",
        type: "enum",
        required: true,
        options: ESSENTIAL_TYPE_LABELS as Record<string, string>,
      },
      { key: "address", label: "Endereço", type: "text", required: true },
      {
        key: "area",
        label: "Área",
        type: "enum",
        options: { Miami: "Miami", Islamorada: "Islamorada", Travel: "Viagem" },
      },
      { key: "baseName", label: "Base", type: "text" },
      { key: "notes", label: "Notas", type: "textarea" },
      { key: "googleMapsUrl", label: "Google Maps", type: "text" },
      { key: "appleMapsUrl", label: "Apple Maps", type: "text" },
      { key: "uberUrl", label: "Uber", type: "text" },
    ],
  },
  {
    id: "travel_documents",
    label: "Documentos e links",
    description: "Reservas, ingressos, seguro",
    group: "utilidades",
    icon: FileText,
    dataKey: "travelDocuments",
    listLabelKey: "title",
    fields: [
      { key: "title", label: "Título", type: "text", required: true },
      {
        key: "type",
        label: "Tipo",
        type: "enum",
        required: true,
        options: DOCUMENT_TYPE_LABELS as Record<string, string>,
      },
      { key: "url", label: "URL", type: "text" },
      { key: "notes", label: "Notas", type: "textarea" },
    ],
  },
  {
    id: "trip_tasks",
    label: "Pendências",
    description: "Tarefas da viagem",
    group: "utilidades",
    icon: ListTodo,
    dataKey: "tasks",
    listLabelKey: "title",
    fields: [
      { key: "title", label: "Título", type: "text", required: true },
      { key: "dueDate", label: "Prazo", type: "date" },
      { key: "relatedPlanId", label: "Plano relacionado (ID)", type: "text" },
      {
        key: "assignedTo",
        label: "Responsável",
        type: "enum",
        options: {
          caio: "Caio",
          geovanin: "Geovanin",
          adelaide: "Adelaide",
          sofia: "Sofia",
        },
      },
      {
        key: "status",
        label: "Status",
        type: "enum",
        required: true,
        options: { open: "Aberta", done: "Concluída" },
      },
      {
        key: "priority",
        label: "Prioridade",
        type: "enum",
        required: true,
        options: PRIORITY_LABELS as Record<string, string>,
      },
    ],
  },
  {
    id: "agreements",
    label: "Combinados",
    description: "Regras importantes da família",
    group: "utilidades",
    icon: Handshake,
    dataKey: "agreements",
    listLabelKey: "text",
    fields: [
      { key: "text", label: "Texto", type: "textarea", required: true },
      { key: "order", label: "Ordem", type: "number", required: true },
    ],
  },
  {
    id: "memories",
    label: "Memórias",
    description: "Registro por dia da viagem",
    group: "utilidades",
    icon: BookHeart,
    dataKey: "memories",
    listLabelKey: "date",
    fields: [
      { key: "dayId", label: "Dia", type: "daySelect", required: true },
      { key: "date", label: "Data", type: "date", required: true },
      { key: "bestMoment", label: "Melhor momento", type: "textarea" },
      { key: "bestFood", label: "Melhor comida", type: "text" },
      { key: "favoritePlace", label: "Lugar favorito", type: "text" },
      { key: "rating", label: "Nota (0-5)", type: "number" },
      { key: "notes", label: "Notas", type: "textarea" },
      { key: "photoUrl", label: "URL da foto", type: "text" },
    ],
  },
  {
    id: "checklist_item_states",
    label: "Estados de checklist",
    description: "Somente leitura — marque nos checklists",
    group: "sistema",
    icon: Database,
    dataKey: "checklistStates",
    listLabelKey: "id",
    readOnly: true,
    fields: [],
  },
];

export const TABLE_BY_ID = Object.fromEntries(
  TABLES.map((t) => [t.id, t])
) as Record<TableId, TableDef>;

export const PERIOD_OPTIONS = PERIOD_LABELS as Record<string, string>;
export const CATEGORY_OPTIONS = CATEGORY_LABELS as Record<string, string>;
export const STATUS_OPTIONS = STATUS_LABELS as Record<string, string>;
export const POSSIBLE_CATEGORY_OPTIONS =
  POSSIBLE_CATEGORY_LABELS as Record<string, string>;
export const INTENSITY_OPTIONS = INTENSITY_LABELS as Record<string, string>;
export const BEST_FOR_OPTIONS = BEST_FOR_LABELS as Record<string, string>;
export const PLAN_STATUS_OPTIONS = PLAN_STATUS_LABELS as Record<string, string>;
export const NIGHT_TYPE_OPTIONS = NIGHT_TYPE_LABELS as Record<string, string>;
export const CHECKLIST_TYPE_OPTIONS =
  CHECKLIST_TYPE_LABELS as Record<string, string>;
