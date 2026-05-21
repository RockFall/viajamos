"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import Link from "next/link";
import { useTrip } from "@/context/TripProvider";
import { IntegratedDateRail } from "@/components/agora/IntegratedDateRail";
import { AddToItineraryModal } from "@/components/forms/AddToItineraryModal";
import { NoiteHero } from "@/components/noite/NoiteHero";
import { NightTypeFilters } from "@/components/noite/NightTypeFilters";
import { NoiteMoodStrip } from "@/components/noite/NoiteMoodStrip";
import { TonightSpotlight } from "@/components/noite/TonightSpotlight";
import { NightTimeline } from "@/components/noite/NightTimeline";
import { NightRadarList } from "@/components/noite/NightRadarList";
import {
  filterNightEventsByMood,
  filterNightEventsByType,
  getTripNightDays,
  pickTonightEvent,
  sortNightEventsByTime,
} from "@/lib/night-radar";
import { addDays } from "@/lib/trip-phase";
import type { NightEvent } from "@/types";

export default function NoitePage() {
  const { nightEvents, tripDays, today, isHydrated } = useTrip();
  const tripNights = useMemo(() => getTripNightDays(tripDays), [tripDays]);
  const nightDates = useMemo(
    () => tripNights.map((d) => d.date),
    [tripNights]
  );

  const [selectedDate, setSelectedDate] = useState(today);
  const [typeFilter, setTypeFilter] = useState("");
  const [moodFilter, setMoodFilter] = useState("");
  const [selectedEvent, setSelectedEvent] = useState<NightEvent | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const minDate = nightDates[0] ?? today;
  const maxDate = nightDates[nightDates.length - 1] ?? today;

  useEffect(() => {
    if (nightDates.includes(today)) {
      setSelectedDate(today);
    } else if (nightDates.length > 0) {
      setSelectedDate(nightDates[0]);
    }
  }, [today, nightDates.join(",")]);

  const canPrev = selectedDate > minDate;
  const canNext = selectedDate < maxDate;

  const shift = (delta: number) => {
    const next = addDays(selectedDate, delta);
    if (next < minDate || next > maxDate) return;
    setSelectedDate(next);
  };

  const dayEvents = useMemo(() => {
    let list = nightEvents.filter(
      (e) => e.date === selectedDate && e.status !== "discarded"
    );
    list = filterNightEventsByType(list, typeFilter);
    list = filterNightEventsByMood(list, moodFilter);
    return sortNightEventsByTime(list);
  }, [nightEvents, selectedDate, typeFilter, moodFilter]);

  const spotlight = useMemo(() => pickTonightEvent(dayEvents), [dayEvents]);

  const restEvents = useMemo(
    () =>
      spotlight
        ? dayEvents.filter((e) => e.id !== spotlight.id)
        : dayEvents,
    [dayEvents, spotlight]
  );

  const clearFilters = useCallback(() => {
    setTypeFilter("");
    setMoodFilter("");
  }, []);

  const openModal = (event: NightEvent) => {
    setSelectedEvent(event);
    setModalOpen(true);
  };

  if (!isHydrated) {
    return (
      <div className="page-full-bleed relative flex min-h-screen items-center justify-center overflow-x-hidden bg-warm-black pb-36 text-sand-200/60">
        <p className="text-sm">Carregando radar da noite…</p>
      </div>
    );
  }

  return (
    <div className="page-full-bleed relative min-h-screen overflow-x-hidden bg-warm-black pb-36 text-sand-50">
      <div className="pointer-events-none absolute -top-32 -right-24 size-96 rounded-full bg-terracotta/20 blur-[120px]" />
      <div className="pointer-events-none absolute top-1/3 -left-32 size-96 rounded-full bg-terracotta-deep/15 blur-[120px]" />

      <NoiteHero venueCount={dayEvents.length} />

      <main className="relative mx-auto mt-6 w-full min-w-0 max-w-[48ch] space-y-8 px-6">
        <IntegratedDateRail
          selectedDate={selectedDate}
          today={today}
          variant="dark"
          onPrev={() => shift(-1)}
          onNext={() => shift(1)}
          onToday={() => {
            if (nightDates.includes(today)) setSelectedDate(today);
          }}
          canPrev={canPrev}
          canNext={canNext}
        />

        {spotlight && (
          <TonightSpotlight
            event={spotlight}
            onAddToItinerary={() => openModal(spotlight)}
          />
        )}

        <NightTypeFilters value={typeFilter} onChange={setTypeFilter} />

        {dayEvents.length === 0 ? (
          <section className="rounded-[28px] bg-sand-50/[0.04] p-8 text-center ring-1 ring-sand-50/10">
            <p className="font-serif text-2xl italic text-sand-50">
              Noite tranquila neste dia
            </p>
            <p className="mt-3 text-sm leading-relaxed text-sand-200/60">
              Nenhum lugar no radar com esses filtros. Explore outro dia ou veja
              ideias em Planos.
            </p>
            <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
              <button
                type="button"
                onClick={clearFilters}
                className="rounded-full bg-sand-50/10 px-5 py-2 text-[11px] font-bold uppercase tracking-[0.15em] text-sand-100 ring-1 ring-sand-50/15"
              >
                Limpar filtros
              </button>
              <Link
                href="/planos"
                className="rounded-full bg-terracotta px-5 py-2 text-[11px] font-bold uppercase tracking-[0.15em] text-sand-50"
              >
                Ver planos
              </Link>
            </div>
          </section>
        ) : (
          <>
            <>
              <NightTimeline
                events={restEvents}
                onSelectEvent={openModal}
              />
              <NightRadarList
                events={restEvents}
                onSelectEvent={openModal}
              />
            </>
          </>
        )}

        <NoiteMoodStrip value={moodFilter} onChange={setMoodFilter} />
      </main>

      <AddToItineraryModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setSelectedEvent(null);
        }}
        nightEvent={selectedEvent}
      />
    </div>
  );
}
