const MS_DAY = 24 * 60 * 60 * 1000;

export type TripPhase = "pre" | "travel" | "trip" | "post";

function parseDay(dateStr: string): Date {
  return new Date(dateStr + "T12:00:00");
}

export function diffDays(from: string, to: string): number {
  const a = parseDay(from).getTime();
  const b = parseDay(to).getTime();
  return Math.round((a - b) / MS_DAY);
}

export function addDays(dateStr: string, delta: number): string {
  const d = parseDay(dateStr);
  d.setDate(d.getDate() + delta);
  return d.toISOString().split("T")[0];
}

export function getTripPhase(
  date: string,
  startDate: string,
  endDate: string
): TripPhase {
  if (date < startDate) return "pre";
  if (date === startDate || date === endDate) return "travel";
  if (date > endDate) return "post";
  return "trip";
}

export function getDateBounds(startDate: string, endDate: string) {
  return {
    min: addDays(startDate, -3),
    max: addDays(endDate, 1),
  };
}

export function getRelativeDayTag(selected: string, today: string): string {
  if (selected === today) return "Hoje";
  const d = diffDays(selected, today);
  if (d === 1) return "Amanhã";
  if (d === -1) return "Ontem";
  if (d > 0) return `+${d} dias`;
  return `${d} dias`;
}

export function getCountdownParts(fromDate: string, toDate: string) {
  const from = parseDay(fromDate).getTime();
  const to = parseDay(toDate).getTime();
  const totalSec = Math.max(0, Math.floor((to - from) / 1000));
  const days = Math.floor(totalSec / 86400);
  const hours = Math.floor((totalSec % 86400) / 3600);
  const minutes = Math.floor((totalSec % 3600) / 60);
  return { days, hours, minutes };
}
