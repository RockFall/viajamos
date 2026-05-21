import type { TripDay } from "@/types";

export type WeatherArea = "Miami" | "Islamorada" | "Travel";

export const WEATHER_COORDS: Record<
  WeatherArea,
  { lat: number; lon: number; label: string }
> = {
  Miami: { lat: 25.7617, lon: -80.1918, label: "Miami" },
  Islamorada: { lat: 24.9243, lon: -80.6278, label: "Islamorada" },
  Travel: { lat: 25.7617, lon: -80.1918, label: "Miami" },
};

export function weatherAreaFromTripDay(
  area?: TripDay["area"]
): WeatherArea {
  if (area === "Islamorada") return "Islamorada";
  if (area === "Miami") return "Miami";
  return "Travel";
}

/** WMO weather code → rótulo curto em português (maiúsculas na UI) */
export function wmoCodeToLabel(code: number): string {
  if (code === 0) return "Céu limpo";
  if (code === 1) return "Quase limpo";
  if (code === 2) return "Parcialmente nublado";
  if (code === 3) return "Nublado";
  if (code === 45 || code === 48) return "Neblina";
  if (code >= 51 && code <= 57) return "Garoa";
  if (code >= 61 && code <= 67) return "Chuva";
  if (code >= 71 && code <= 77) return "Frio / granizo";
  if (code >= 80 && code <= 82) return "Pancadas de chuva";
  if (code >= 85 && code <= 86) return "Chuva de neve";
  if (code >= 95 && code <= 99) return "Tempestade";
  return "Tempo variável";
}

export type WeatherIconKind =
  | "sun"
  | "cloud-sun"
  | "cloud"
  | "fog"
  | "rain"
  | "storm"
  | "snow";

export function wmoCodeToIconKind(code: number): WeatherIconKind {
  if (code === 0) return "sun";
  if (code === 1 || code === 2) return "cloud-sun";
  if (code === 3) return "cloud";
  if (code === 45 || code === 48) return "fog";
  if (code >= 51 && code <= 67) return "rain";
  if (code >= 71 && code <= 86) return "rain";
  if (code >= 95) return "storm";
  return "cloud-sun";
}

export interface LiveWeather {
  tempC: number;
  label: string;
  icon: WeatherIconKind;
  area: WeatherArea;
  date: string;
}

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

export function parseWeatherDate(raw: string | null): string | null {
  if (!raw || !DATE_RE.test(raw)) return null;
  return raw;
}

/** Hoje no fuso da viagem (Florida) */
export function getWeatherTodayISO(): string {
  return new Date().toLocaleDateString("en-CA", {
    timeZone: "America/New_York",
  });
}

export function compareWeatherDates(a: string, b: string): number {
  return a.localeCompare(b);
}

type DailyApiResponse = {
  daily?: {
    time?: string[];
    weather_code?: (number | null)[];
    temperature_2m_max?: (number | null)[];
    temperature_2m_min?: (number | null)[];
  };
  current?: {
    temperature_2m?: number;
    weather_code?: number;
  };
};

export async function fetchWeatherForDate(
  area: WeatherArea,
  date: string
): Promise<LiveWeather | null> {
  const { lat, lon } = WEATHER_COORDS[area];
  const today = getWeatherTodayISO();
  const cmp = compareWeatherDates(date, today);

  if (cmp === 0) {
    const current = await fetchForecastCurrent(lat, lon);
    if (current) {
      return { ...current, area, date };
    }
  }

  if (cmp > 0) {
    const daily = await fetchForecastDaily(lat, lon, date);
    if (daily) return { ...daily, area, date };
  }

  const archive = await fetchArchiveDaily(lat, lon, date);
  if (archive) return { ...archive, area, date };

  return null;
}

async function fetchForecastCurrent(
  lat: number,
  lon: number
): Promise<Omit<LiveWeather, "area" | "date"> | null> {
  const url = new URL("https://api.open-meteo.com/v1/forecast");
  url.searchParams.set("latitude", String(lat));
  url.searchParams.set("longitude", String(lon));
  url.searchParams.set("current", "temperature_2m,weather_code");
  url.searchParams.set("timezone", "America/New_York");

  const res = await fetch(url.toString(), { next: { revalidate: 900 } });
  if (!res.ok) return null;

  const data = (await res.json()) as DailyApiResponse;
  const tempC = Math.round(data.current?.temperature_2m ?? 0);
  const code = data.current?.weather_code ?? 0;
  return {
    tempC,
    label: wmoCodeToLabel(code),
    icon: wmoCodeToIconKind(code),
  };
}

async function fetchForecastDaily(
  lat: number,
  lon: number,
  date: string
): Promise<Omit<LiveWeather, "area" | "date"> | null> {
  const url = new URL("https://api.open-meteo.com/v1/forecast");
  url.searchParams.set("latitude", String(lat));
  url.searchParams.set("longitude", String(lon));
  url.searchParams.set(
    "daily",
    "weather_code,temperature_2m_max,temperature_2m_min"
  );
  url.searchParams.set("timezone", "America/New_York");
  url.searchParams.set("start_date", date);
  url.searchParams.set("end_date", date);

  const res = await fetch(url.toString(), { next: { revalidate: 3600 } });
  if (!res.ok) return null;

  return parseDailyRow((await res.json()) as DailyApiResponse, date);
}

async function fetchArchiveDaily(
  lat: number,
  lon: number,
  date: string
): Promise<Omit<LiveWeather, "area" | "date"> | null> {
  const url = new URL("https://archive-api.open-meteo.com/v1/archive");
  url.searchParams.set("latitude", String(lat));
  url.searchParams.set("longitude", String(lon));
  url.searchParams.set(
    "daily",
    "weather_code,temperature_2m_max,temperature_2m_min"
  );
  url.searchParams.set("timezone", "America/New_York");
  url.searchParams.set("start_date", date);
  url.searchParams.set("end_date", date);

  const res = await fetch(url.toString(), { next: { revalidate: 86400 } });
  if (!res.ok) return null;

  return parseDailyRow((await res.json()) as DailyApiResponse, date);
}

function parseDailyRow(
  data: DailyApiResponse,
  date: string
): Omit<LiveWeather, "area" | "date"> | null {
  const daily = data.daily;
  if (!daily?.time?.length) return null;

  const idx = daily.time.indexOf(date);
  if (idx < 0) return null;

  const code = daily.weather_code?.[idx] ?? 0;
  const max = daily.temperature_2m_max?.[idx];
  const min = daily.temperature_2m_min?.[idx];
  const tempC = Math.round(
    max != null ? max : min != null ? min : 0
  );

  return {
    tempC,
    label: wmoCodeToLabel(code ?? 0),
    icon: wmoCodeToIconKind(code ?? 0),
  };
}
