import Image from "next/image";
import type { ReactNode } from "react";
import { parseWeatherLabel, parseWeatherTemp } from "@/lib/dates";

interface AgoraHeroProps {
  date: string;
  theme: string;
  weather?: string;
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
  date,
  theme,
  weather,
  eyebrow,
  dateRail,
}: AgoraHeroProps) {
  const [line1, line2] = themeLines(theme);
  const temp = parseWeatherTemp(weather);
  const weatherLabel = parseWeatherLabel(weather);

  return (
    <div className="relative">
      <div className="relative h-[260px] w-full overflow-hidden">
        <Image
          src="/images/hero-botanical.jpg"
          alt="Folhagem tropical sobre parede terracota ao pôr do sol em Miami"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/10 to-background" />
        <div className="absolute inset-x-0 top-0 px-6 pt-10">
          <div className="flex items-start gap-3 text-warm-black">
            <div className="min-w-0 flex-1">
              {dateRail ? (
                <div className="mb-4">{dateRail}</div>
              ) : eyebrow ? (
                <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-warm-black/80">
                  {eyebrow}
                </span>
              ) : null}
              <h1 className="font-serif mt-2 text-[44px] leading-[0.9] tracking-tight text-warm-black drop-shadow-sm">
                {line1}
                {line2 ? (
                  <>
                    <br />
                    {line2}
                  </>
                ) : null}
              </h1>
            </div>
            {(temp || weatherLabel) && (
              <div
                className="flex w-[6.75rem] shrink-0 flex-col items-end justify-start rounded-2xl bg-background/70 px-2.5 py-2.5 text-right backdrop-blur-md ring-1 ring-warm-black/5"
                aria-label={
                  weather
                    ? `Clima: ${weather}`
                    : temp
                      ? `Temperatura: ${temp}`
                      : undefined
                }
              >
                {temp && (
                  <p className="font-serif text-2xl italic leading-none tabular-nums">
                    {temp}
                  </p>
                )}
                {weatherLabel && (
                  <p className="mt-1.5 text-[10px] leading-snug text-muted-foreground">
                    {weatherLabel}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
