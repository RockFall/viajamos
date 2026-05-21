"use client";

import { useEffect, useState, type ComponentType } from "react";
import {
  Cloud,
  CloudFog,
  CloudRain,
  CloudSun,
  CloudLightning,
  Sun,
} from "lucide-react";
import type { LiveWeather, WeatherArea, WeatherIconKind } from "@/lib/weather";

const ICONS: Record<
  WeatherIconKind,
  ComponentType<{ size?: number; className?: string; strokeWidth?: number }>
> = {
  sun: Sun,
  "cloud-sun": CloudSun,
  cloud: Cloud,
  fog: CloudFog,
  rain: CloudRain,
  storm: CloudLightning,
  snow: Cloud,
};

interface WeatherWidgetProps {
  area: WeatherArea;
  /** Dia selecionado (YYYY-MM-DD) — previsão ou histórico conforme a data */
  date: string;
  variant?: "light" | "dark";
}

export function WeatherWidget({
  area,
  date,
  variant = "light",
}: WeatherWidgetProps) {
  const [weather, setWeather] = useState<LiveWeather | null>(null);
  const [loading, setLoading] = useState(true);
  const dark = variant === "dark";

  useEffect(() => {
    let cancelled = false;
    setWeather(null);
    setLoading(true);

    fetch(
      `/api/weather?area=${encodeURIComponent(area)}&date=${encodeURIComponent(date)}`
    )
      .then((res) => (res.ok ? res.json() : null))
      .then((data: LiveWeather | null) => {
        if (!cancelled && data?.tempC != null) setWeather(data);
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [area, date]);

  const shell = dark
    ? "bg-sand-50/10 text-sand-50 ring-sand-50/15"
    : "bg-background/70 text-warm-black ring-warm-black/5";

  if (loading && !weather) {
    return (
      <div
        className={`flex h-[3.25rem] w-[6.75rem] shrink-0 items-center justify-end rounded-2xl px-2.5 backdrop-blur-md ring-1 ${shell}`}
        aria-hidden
      >
        <span
          className={`text-[10px] uppercase tracking-widest ${
            dark ? "text-sand-200/50" : "text-muted-foreground"
          }`}
        >
          …
        </span>
      </div>
    );
  }

  if (!weather) return null;

  const Icon = ICONS[weather.icon] ?? Sun;

  return (
    <div
      className={`flex w-[6.75rem] shrink-0 flex-col items-end justify-start rounded-2xl px-2.5 py-2 backdrop-blur-md ring-1 ${shell}`}
      aria-label={`Clima do dia ${date}: ${weather.tempC} graus, ${weather.label}`}
    >
      <div className="flex items-center gap-1.5">
        <Icon
          size={18}
          strokeWidth={1.75}
          className={dark ? "text-terracotta" : "text-terracotta-deep"}
          aria-hidden
        />
        <p className="font-serif text-2xl italic leading-none tabular-nums">
          {weather.tempC}°
        </p>
      </div>
      <p
        className={`mt-1 max-w-full text-right text-[9px] font-bold uppercase leading-snug tracking-[0.12em] ${
          dark ? "text-sand-200/70" : "text-muted-foreground"
        }`}
      >
        {weather.label}
      </p>
    </div>
  );
}
