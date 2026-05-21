"use client";

import type { ReactNode } from "react";
import { useTrip } from "@/context/TripProvider";
interface PostTripViewProps {
  dateRail: ReactNode;
}

export function PostTripView({ dateRail }: PostTripViewProps) {
  const { itineraryEvents, memories } = useTrip();
  const eventCount = itineraryEvents.filter((e) => e.status !== "cancelled")
    .length;
  const memoryCount = memories.length;

  return (
    <main className="mx-auto max-w-[48ch] space-y-8 px-6 pb-8 pt-10">
      <header>
        <div className="mb-6">{dateRail}</div>
        <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-terracotta">
          Depois da viagem
        </p>
        <h1 className="font-serif mt-2 text-[44px] leading-[0.95] tracking-tight text-warm-black">
          Saudade
          <br />
          <em className="italic">de Miami</em>
        </h1>
        <p className="mt-4 max-w-[36ch] text-sm leading-relaxed text-muted-foreground">
          A viagem acabou. Reviva momentos em memórias e organize despesas em
          Mais.
        </p>
      </header>

      <section className="rounded-[28px] bg-card p-6 ring-1 ring-border">
        <p className="font-serif text-2xl leading-tight text-warm-black">
          {eventCount} eventos no roteiro
          {memoryCount > 0
            ? ` · ${memoryCount} memórias registradas`
            : " · memórias em breve"}
          .
        </p>
      </section>
    </main>
  );
}
