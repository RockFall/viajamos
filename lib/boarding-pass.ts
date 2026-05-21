import type { Flight, TripDay } from "@/types";

export interface BoardingPassDisplay {
  airline: string;
  subtitle: string;
  groupBadge: string;
  fromCode: string;
  fromCity: string;
  toCode: string;
  toCity: string;
  departureTime: string;
  arrivalTime: string;
  duration: string | null;
  gate: string;
  boardingTime: string;
  seat: string;
  stubFourthLabel: string;
  stubFourthValue: string;
  isPending: boolean;
}

const PLACEHOLDER = /^(a definir|—|-|\s*)$/i;

function isPlaceholder(value?: string | null): boolean {
  if (!value) return true;
  return PLACEHOLDER.test(value.trim());
}

/** IATA curto: "BHZ/CNF" → CNF, "MIA" → MIA */
export function airportCode(raw: string): string {
  const trimmed = raw.trim();
  if (trimmed.includes("/")) {
    const parts = trimmed.split("/").map((p) => p.trim());
    const last = parts[parts.length - 1];
    if (last.length >= 3) return last.slice(0, 3).toUpperCase();
  }
  const token = trimmed.replace(/[^A-Za-z]/g, "");
  return token.slice(0, 3).toUpperCase() || "—";
}

function citiesFromRoute(route: string): { from: string; to: string } {
  const parts = route.split(/\s*→\s*/);
  if (parts.length >= 2) {
    return { from: parts[0].trim(), to: parts[1].trim() };
  }
  return { from: "Origem", to: "Destino" };
}

function parseClock(time: string): number | null {
  const m = time.trim().match(/^(\d{1,2}):(\d{2})$/);
  if (!m) return null;
  return parseInt(m[1], 10) * 60 + parseInt(m[2], 10);
}

function formatDuration(departure: string, arrival: string): string | null {
  const dep = parseClock(departure);
  const arr = parseClock(arrival);
  if (dep == null || arr == null) return null;
  let diff = arr - dep;
  if (diff < 0) diff += 24 * 60;
  const h = Math.floor(diff / 60);
  const min = diff % 60;
  if (h === 0) return `${min}min`;
  if (min === 0) return `${h}h`;
  return `${h}h${String(min).padStart(2, "0")}`;
}

function pickField(
  flights: Flight[],
  key: keyof Pick<
    Flight,
    | "gate"
    | "boardingTime"
    | "seat"
    | "terminal"
    | "departureTime"
    | "arrivalTime"
    | "flightNumber"
  >
): string {
  for (const f of flights) {
    const v = f[key];
    if (v && !isPlaceholder(v)) return v;
  }
  const first = flights[0]?.[key];
  return first && !isPlaceholder(first) ? first : "A definir";
}

export function buildBoardingPassDisplay(
  flights: Flight[],
  dayInfo?: TripDay,
  isReturn?: boolean
): BoardingPassDisplay {
  const lead = flights[0];
  const route =
    lead?.route ??
    (isReturn ? "Miami → Belo Horizonte" : "Belo Horizonte → Miami");
  const { from: fromCity, to: toCity } = citiesFromRoute(route);

  const fromRaw = lead?.from ?? (isReturn ? "MIA" : "BHZ/CNF");
  const toRaw = lead?.to ?? (isReturn ? "BHZ/CNF" : "MIA");

  const flightNumber = pickField(flights, "flightNumber");
  const departureTime = pickField(flights, "departureTime");
  const arrivalTime = pickField(flights, "arrivalTime");
  const gate = pickField(flights, "gate");
  const boardingTime = pickField(flights, "boardingTime");
  const seat = pickField(flights, "seat");
  const terminal = pickField(flights, "terminal");

  const pending =
    !lead ||
    [flightNumber, departureTime, gate, boardingTime].every(isPlaceholder);

  const airline = route;
  const duration =
    !isPlaceholder(departureTime) && !isPlaceholder(arrivalTime)
      ? formatDuration(departureTime, arrivalTime)
      : null;

  return {
    airline: pending
      ? isReturn
        ? "Volta · Miami → BH"
        : "Ida · BH → Miami"
      : airline,
    subtitle: pending
      ? "Cartão de viagem · detalhes em breve"
      : `Cartão de embarque · ${flightNumber}`,
    groupBadge: "FAMÍLIA",
    fromCode: airportCode(fromRaw),
    fromCity,
    toCode: airportCode(toRaw),
    toCity,
    departureTime: isPlaceholder(departureTime) ? "—" : departureTime,
    arrivalTime: isPlaceholder(arrivalTime) ? "—" : arrivalTime,
    duration,
    gate: isPlaceholder(gate) ? "—" : gate,
    boardingTime: isPlaceholder(boardingTime) ? "—" : boardingTime,
    seat: isPlaceholder(seat) ? "—" : seat,
    stubFourthLabel: isPlaceholder(terminal) ? "Bag" : "Terminal",
    stubFourthValue: isPlaceholder(terminal)
      ? String(flights.length || 4)
      : terminal,
    isPending: pending,
  };
}

/** Texto dinâmico abaixo do título no dia do voo */
export function buildTravelDaySubtitle(
  display: BoardingPassDisplay,
  dayInfo?: TripDay,
  now = new Date()
): string {
  if (dayInfo?.theme && !display.isPending) {
    return dayInfo.theme;
  }
  if (display.isPending) {
    return (
      dayInfo?.theme ??
      "Preencha horários e assentos quando tiver o bilhete — o cartão já está pronto."
    );
  }

  const dep = parseClock(display.departureTime);
  if (dep == null) return dayInfo?.theme ?? "Acompanhe embarque e linha do dia.";

  const depDate = new Date(now);
  depDate.setHours(Math.floor(dep / 60), dep % 60, 0, 0);
  const diffMs = depDate.getTime() - now.getTime();
  if (diffMs > 0 && diffMs < 48 * 60 * 60 * 1000) {
    const h = Math.floor(diffMs / 3600000);
    const m = Math.floor((diffMs % 3600000) / 60000);
    if (h > 0) return `Decolagem em ${h}h${String(m).padStart(2, "0")}.`;
    return `Decolagem em ${m} min.`;
  }

  return dayInfo?.theme ?? "Acompanhe embarque, timeline e checklist do dia.";
}
