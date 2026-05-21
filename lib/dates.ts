const LOCALE = "pt-BR";

/** Data local de hoje em YYYY-MM-DD */
export function getTodayISO(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

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

/** Ex.: { dayMonth: "23 mai", weekday: "Sex" } — destaque no roteiro */
export function formatRoteiroDate(dateStr: string): {
  dayMonth: string;
  weekday: string;
} {
  const date = new Date(dateStr + "T12:00:00");
  const day = date.getDate();
  const month = date.toLocaleDateString(LOCALE, { month: "short" });
  const weekday = date
    .toLocaleDateString(LOCALE, { weekday: "short" })
    .replace(/\.$/, "");
  const cap = weekday.charAt(0).toUpperCase() + weekday.slice(1);
  return { dayMonth: `${day} ${month}`, weekday: cap };
}

/** Ex.: "sex., 23 mai" — label compacto do hero */
export function formatHeroDate(dateStr: string): string {
  const date = new Date(dateStr + "T12:00:00");
  const weekday = date.toLocaleDateString(LOCALE, { weekday: "short" });
  const day = date.getDate();
  const month = date.toLocaleDateString(LOCALE, { month: "short" });
  const cap = weekday.charAt(0).toUpperCase() + weekday.slice(1);
  return `${cap}, ${day} ${month}`;
}

/** Extrai temperatura de strings como "29°C · Ensolarado" */
export function parseWeatherTemp(weather?: string): string | null {
  if (!weather) return null;
  const match = weather.match(/(\d+)\s*°?\s*C/i);
  return match ? `${match[1]}°` : null;
}

export function parseWeatherLabel(weather?: string): string | null {
  if (!weather) return null;
  const parts = weather.split("·").map((s) => s.trim());
  if (parts.length > 1) return parts.slice(1).join(" · ");
  if (!weather.match(/\d+\s*°?\s*C/i)) return weather;
  return null;
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
