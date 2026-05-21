"use client";

import { useMemo } from "react";
import type { ReactNode } from "react";
import { useTrip } from "@/context/TripProvider";
import { AgoraHero } from "./AgoraHero";
import { LocationStrip } from "./LocationStrip";
import { CollectivePlanHero } from "./CollectivePlanHero";
import { PersonWhereList } from "./PersonWhereList";
import { NextUpSection } from "./NextUpSection";
import { TonightTease } from "./TonightTease";
import {
  getNextCollectiveEvent,
  getNextEventForPerson,
} from "@/lib/itinerary";
import { getTomorrow } from "@/lib/dates";
import { weatherAreaFromTripDay } from "@/lib/weather";
import type { FamilyMemberId } from "@/types";

interface TripDayContentProps {
  selectedDate: string;
  dateRail: ReactNode;
}

export function TripDayContent({
  selectedDate,
  dateRail,
}: TripDayContentProps) {
  const { itineraryEvents, tasks, family, tripDays, config, nightEvents } =
    useTrip();

  const dayInfo = tripDays.find((d) => d.date === selectedDate);
  const familyIds = family.map((m) => m.id) as FamilyMemberId[];
  const collectiveEvent = getNextCollectiveEvent(
    itineraryEvents,
    familyIds,
    selectedDate
  );
  const tomorrow = getTomorrow(selectedDate);
  const tomorrowDay = tripDays.find((d) => d.date === tomorrow);
  const tomorrowEvents = itineraryEvents
    .filter((e) => e.date === tomorrow && e.status !== "cancelled")
    .sort((a, b) => (a.startTime ?? "").localeCompare(b.startTime ?? ""));
  const firstTomorrow = tomorrowEvents[0];
  const urgentTasks = tasks.filter(
    (t) => t.status === "open" && t.priority === "high"
  );
  const tonightEvent = useMemo(
    () =>
      nightEvents.find((e) => e.date === selectedDate) ??
      nightEvents.find(
        (e) =>
          e.date > selectedDate &&
          e.date <= config.endDate
      ),
    [selectedDate, config.endDate]
  );

  return (
    <>
      <AgoraHero
        theme={dayInfo?.theme ?? "Miami + Islamorada"}
        weatherDate={selectedDate}
        weatherArea={weatherAreaFromTripDay(dayInfo?.area)}
        dayId={dayInfo?.id}
        dayArea={dayInfo?.area}
        dateRail={dateRail}
      />
      <LocationStrip
        baseAddress={dayInfo?.baseAddress ?? config.baseAddress}
        travelerCount={family.length}
      />

      <main className="mx-auto mt-10 max-w-[48ch] space-y-12 px-6">
        {collectiveEvent && (
          <section>
            <CollectivePlanHero event={collectiveEvent} />
          </section>
        )}

        <PersonWhereList
          family={family}
          getEvent={(id) =>
            getNextEventForPerson(itineraryEvents, id, selectedDate)
          }
        />

        <NextUpSection
          tomorrowDay={tomorrowDay}
          tomorrowPreview={
            firstTomorrow
              ? {
                  time: firstTomorrow.startTime,
                  title: firstTomorrow.title,
                  detail:
                    firstTomorrow.locationName ??
                    firstTomorrow.neighborhood,
                }
              : tomorrowDay
                ? { title: tomorrowDay.title, detail: tomorrowDay.theme }
                : undefined
          }
          urgentCount={urgentTasks.length}
          urgentItems={urgentTasks.map((t) => t.title)}
          vibe={dayInfo?.theme}
        />

        {tonightEvent && <TonightTease event={tonightEvent} />}
      </main>
    </>
  );
}
