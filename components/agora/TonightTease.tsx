"use client";

import Link from "next/link";
import type { NightEvent } from "@/types";

export function TonightTease({ event }: { event: NightEvent }) {
  const subtitle =
    event.notes ??
    [event.venue, event.neighborhood, event.priceInfo]
      .filter(Boolean)
      .join(" · ");

  return (
    <section className="relative overflow-hidden rounded-[28px] bg-warm-black p-7 text-sand-50">
      <div className="absolute -bottom-12 -right-12 size-56 rounded-full bg-terracotta/25 blur-3xl" />
      <div className="relative">
        <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-terracotta">
          Tonight
        </p>
        <h3 className="font-serif mt-3 text-4xl leading-[0.95] tracking-tight">
          {event.title}
        </h3>
        {subtitle && (
          <p className="mt-3 max-w-[32ch] text-sm leading-relaxed text-sand-100/65">
            {subtitle}
          </p>
        )}
        <Link
          href="/noite"
          className="mt-6 inline-flex items-center gap-2 border-b border-terracotta pb-1 text-[11px] font-bold uppercase tracking-[0.2em] text-terracotta"
        >
          Ver radar da noite <span>→</span>
        </Link>
      </div>
    </section>
  );
}
