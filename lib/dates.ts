const LOCALE = "pt-BR";

export function formatDate(dateStr: string, options?: Intl.DateTimeFormatOptions): string {
  const date = new Date(dateStr + "T12:00:00");
  return date.toLocaleDateString(LOCALE, {
    day: "numeric",
    month: "long",
    ...options,
  });
}

export function formatDateShort(dateStr: string): string {
  const date = new Date(dateStr + "T12:00:00");
  return date.toLocaleDateString(LOCALE, {
    day: "2-digit",
    month: "2-digit",
  });
}

export function formatWeekday(dateStr: string): string {
  const date = new Date(dateStr + "T12:00:00");
  return date.toLocaleDateString(LOCALE, { weekday: "long" });
}

export function formatDayHeader(dateStr: string): string {
  const date = new Date(dateStr + "T12:00:00");
  const weekday = date.toLocaleDateString(LOCALE, { weekday: "long" });
  const dayMonth = date.toLocaleDateString(LOCALE, {
    day: "numeric",
    month: "long",
  });
  return `${weekday}, ${dayMonth}`;
}

export function compareDates(a: string, b: string): number {
  return a.localeCompare(b);
}

export function compareTimes(a?: string, b?: string): number {
  if (!a && !b) return 0;
  if (!a) return 1;
  if (!b) return -1;
  return a.localeCompare(b);
}

export function getTomorrow(dateStr: string): string {
  const date = new Date(dateStr + "T12:00:00");
  date.setDate(date.getDate() + 1);
  return date.toISOString().split("T")[0];
}

export function isDateInRange(
  date: string,
  start: string,
  end: string
): boolean {
  return date >= start && date <= end;
}
