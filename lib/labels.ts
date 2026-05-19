import type {
  AlternativeTrigger,
  BestFor,
  ChecklistType,
  DocumentType,
  EssentialPlaceType,
  EventCategory,
  EventPeriod,
  EventStatus,
  Intensity,
  NightEventType,
  PossiblePlanCategory,
  PossiblePlanStatus,
  TaskPriority,
} from "@/types";

export const PERIOD_LABELS: Record<EventPeriod, string> = {
  morning: "Manhã",
  afternoon: "Tarde",
  night: "Noite",
  late_night: "Madrugada",
};

export const PERIOD_ICONS: Record<EventPeriod, string> = {
  morning: "☀️",
  afternoon: "🌤",
  night: "🌙",
  late_night: "✨",
};

export const STATUS_LABELS: Record<EventStatus, string> = {
  idea: "Ideia",
  planned: "Planejado",
  reserved: "Reservado",
  booked: "Comprado",
  done: "Feito",
  cancelled: "Cancelado",
};

export const STATUS_COLORS: Record<EventStatus, string> = {
  idea: "bg-slate-100 text-slate-600",
  planned: "bg-sky-100 text-sky-700",
  reserved: "bg-teal-100 text-teal-700",
  booked: "bg-emerald-100 text-emerald-700",
  done: "bg-zinc-100 text-zinc-500",
  cancelled: "bg-red-100 text-red-600",
};

export const CATEGORY_LABELS: Record<EventCategory, string> = {
  food: "Comida",
  music: "Música",
  museum: "Museu",
  shopping: "Compras",
  walk: "Passeio",
  travel: "Viagem",
  rest: "Descanso",
  event: "Evento",
};

export const CATEGORY_COLORS: Record<EventCategory, string> = {
  food: "bg-orange-100 text-orange-700",
  music: "bg-purple-100 text-purple-700",
  museum: "bg-blue-100 text-blue-700",
  shopping: "bg-pink-100 text-pink-700",
  walk: "bg-green-100 text-green-700",
  travel: "bg-cyan-100 text-cyan-700",
  rest: "bg-zinc-100 text-zinc-600",
  event: "bg-amber-100 text-amber-700",
};

export const POSSIBLE_CATEGORY_LABELS: Record<PossiblePlanCategory, string> = {
  restaurant: "Restaurante",
  cafe: "Café",
  jazz: "Jazz",
  electronic_music: "Eletrônica",
  museum: "Museu",
  gallery: "Galeria",
  shopping: "Compras",
  walk: "Passeio",
  bar: "Bar",
  experience: "Experiência",
  rainy_day: "Dia de chuva",
  nearby: "Perto de casa",
  late_night: "Madrugada",
};

export const INTENSITY_LABELS: Record<Intensity, string> = {
  light: "Leve",
  moderate: "Moderado",
  intense: "Intenso",
};

export const BEST_FOR_LABELS: Record<BestFor, string> = {
  family: "Família",
  parents: "Pais",
  caio: "Caio",
  sister: "Irmã",
  caio_sister: "Caio + Irmã",
  everyone: "Todos",
};

export const PLAN_STATUS_LABELS: Record<PossiblePlanStatus, string> = {
  candidate: "Candidato",
  shortlisted: "Favorito",
  added_to_itinerary: "No roteiro",
  discarded: "Descartado",
};

export const TRIGGER_LABELS: Record<AlternativeTrigger, string> = {
  rain: "🌧 Chuva",
  tired: "😴 Cansaço",
  late_start: "⏰ Atraso",
  too_hot: "🔥 Calor",
  reservation_failed: "❌ Reserva falhou",
  extra_energy: "⚡ Energia extra",
};

export const NIGHT_TYPE_LABELS: Record<NightEventType, string> = {
  jazz: "Jazz",
  electronic: "Eletrônica",
  bar: "Bares",
  late_food: "Comida tardia",
};

export const ESSENTIAL_TYPE_LABELS: Record<EssentialPlaceType, string> = {
  lodging: "Hospedagem",
  airport: "Aeroporto",
  pharmacy: "Farmácia",
  market: "Mercado",
  hospital: "Hospital",
  shopping: "Shopping",
  consulate: "Consulado",
  meeting_point: "Ponto de encontro",
  parking: "Estacionamento",
};

export const DOCUMENT_TYPE_LABELS: Record<DocumentType, string> = {
  flight: "Voos",
  lodging: "Hospedagem",
  ticket: "Ingressos",
  reservation: "Reservas",
  insurance: "Seguro",
  car_rental: "Aluguel de carro",
  other: "Outros",
};

export const CHECKLIST_TYPE_LABELS: Record<ChecklistType, string> = {
  before_trip: "Antes da viagem",
  travel_day: "Dia de viagem",
  daily: "Diário",
  return: "Volta",
};

export const PRIORITY_LABELS: Record<TaskPriority, string> = {
  low: "Baixa",
  medium: "Média",
  high: "Alta",
};

export const PRICE_LABELS: Record<number, string> = {
  1: "$",
  2: "$$",
  3: "$$$",
  4: "$$$$",
};
