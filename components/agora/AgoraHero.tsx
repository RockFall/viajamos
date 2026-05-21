import Image from "next/image";
import type { ReactNode } from "react";
import { WeatherWidget } from "./WeatherWidget";
import type { WeatherArea } from "@/lib/weather";

interface AgoraHeroProps {
  theme: string;
  /** Data selecionada para clima (YYYY-MM-DD) */
  weatherDate: string;
  weatherArea?: WeatherArea;
  showWeather?: boolean;
  eyebrow?: string;
  dateRail?: ReactNode;
}

function themeLines(theme: string): [string, string?] {
  const parts = theme.split(/[,·]/).map((s) => s.trim()).filter(Boolean);
  if (parts.length >= 2) {
    return [parts[0], parts.slice(1).join(", ")];
  }
  const words = theme.split(" ");
  if (words.length > 4) {
    const mid = Math.ceil(words.length / 2);
    return [words.slice(0, mid).join(" "), words.slice(mid).join(" ")];
  }
  return [theme];
}

export function AgoraHero({
  theme,
  weatherDate,
  weatherArea = "Miami",
  showWeather = true,
  eyebrow,
  dateRail,
}: AgoraHeroProps) {
  const [line1, line2] = themeLines(theme);

  return (
    <div className="relative">
      <div className="relative h-[248px] w-full overflow-hidden">
        <Image
          src="/images/hero-botanical.jpg"
          alt="Folhagem tropical sobre parede terracota ao pôr do sol em Miami"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/10 to-background" />
        <div className="absolute inset-x-0 top-0 flex flex-col px-6 pt-10 pb-14">
          {dateRail ? (
            <div className="mb-4 w-full">{dateRail}</div>
          ) : eyebrow ? (
            <span className="mb-4 text-[10px] font-bold uppercase tracking-[0.25em] text-warm-black/80">
              {eyebrow}
            </span>
          ) : null}

          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1 pr-1">
              <h1 className="font-serif text-[34px] leading-[0.92] tracking-tight text-warm-black drop-shadow-sm">
                {line1}
                {line2 ? (
                  <>
                    <br />
                    {line2}
                  </>
                ) : null}
              </h1>
            </div>
            {showWeather && (
              <WeatherWidget
                area={weatherArea}
                date={weatherDate}
                variant="light"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
