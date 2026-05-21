"use client";

import Link from "next/link";
import type { TripDay } from "@/types";
import { TripDayImage } from "@/components/ui/EntityImage";
import { SectionLabel } from "./SectionLabel";

interface NextUpSectionProps {
  tomorrowDay?: TripDay;
  tomorrowPreview?: { time?: string; title: string; detail?: string };
  urgentCount: number;
  urgentItems: string[];
  vibe?: string;
}

export function NextUpSection({
  tomorrowDay,
  tomorrowPreview,
  urgentCount,
  urgentItems,
  vibe,
}: NextUpSectionProps) {
  if (!tomorrowDay && urgentCount === 0 && !vibe) return null;

  return (
    <section>
      <SectionLabel left="A seguir" />
      <div className="mt-5 grid grid-cols-5 gap-3">
        {tomorrowDay && (
          <div className="col-span-3 overflow-hidden rounded-[24px] bg-card ring-1 ring-border">
            <div className="relative aspect-[4/3] w-full">
              <TripDayImage
                dayId={tomorrowDay.id}
                area={tomorrowDay.area}
                alt={tomorrowDay.title}
                fill
                className="object-cover"
                sizes="(max-width: 320px) 60vw, 320px"
              />
            </div>
            <div className="p-4">
              {tomorrowPreview?.time && (
                <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-terracotta">
                  Amanhã · {tomorrowPreview.time}
                </p>
              )}
              <p className="font-serif mt-1.5 text-lg leading-tight text-warm-black">
                {tomorrowPreview?.title ?? tomorrowDay.title}
              </p>
              <p className="mt-1 text-[11px] text-muted-foreground">
                {tomorrowPreview?.detail ?? tomorrowDay.theme}
              </p>
            </div>
          </div>
        )}

        <div
          className={`flex flex-col gap-3 ${tomorrowDay ? "col-span-2" : "col-span-5"}`}
        >
          {urgentCount > 0 && (
            <div className="flex-1 rounded-[20px] bg-warm-black p-4 text-sand-50">
              <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-terracotta">
                Pendências
              </p>
              <p className="font-serif mt-2 text-2xl leading-none">
                {String(urgentCount).padStart(2, "0")}
              </p>
              <ul className="mt-3 space-y-1.5 text-[11px] leading-snug text-sand-100/80">
                {urgentItems.slice(0, 4).map((item) => (
                  <li key={item}>· {item}</li>
                ))}
              </ul>
              {urgentCount > 4 && (
                <Link
                  href="/mais"
                  className="mt-2 inline-block text-[10px] uppercase tracking-wider text-terracotta"
                >
                  Ver todas →
                </Link>
              )}
            </div>
          )}
          {vibe && (
            <div className="rounded-[20px] bg-accent/60 p-4 ring-1 ring-border">
              <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-terracotta-deep">
                Vibe do dia
              </p>
              <p className="font-serif mt-1 text-base italic leading-tight text-warm-black">
                {vibe}
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
