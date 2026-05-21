"use client";

import { useEffect, useMemo, useState } from "react";
import { useTrip } from "@/context/TripProvider";
import { IntegratedDateRail } from "@/components/agora/IntegratedDateRail";
import { PreTripView } from "@/components/agora/PreTripView";
import { TravelDayView } from "@/components/agora/TravelDayView";
import { TripDayContent } from "@/components/agora/TripDayContent";
import { PostTripView } from "@/components/agora/PostTripView";
import {
  addDays,
  getDateBounds,
  getTripPhase,
} from "@/lib/trip-phase";

export default function AgoraPage() {
  const { today, config } = useTrip();
  const [selectedDate, setSelectedDate] = useState(today);

  useEffect(() => {
    setSelectedDate(today);
  }, [today]);

  const { min, max } = useMemo(
    () => getDateBounds(config.startDate, config.endDate),
    [config.startDate, config.endDate]
  );

  const phase = getTripPhase(
    selectedDate,
    config.startDate,
    config.endDate
  );
  const canPrev = selectedDate > min;
  const canNext = selectedDate < max;

  const shift = (delta: number) => {
    const next = addDays(selectedDate, delta);
    if (next < min || next > max) return;
    setSelectedDate(next);
  };

  const dateRailProps = {
    selectedDate,
    today,
    onPrev: () => shift(-1),
    onNext: () => shift(1),
    onToday: () => setSelectedDate(today),
    canPrev,
    canNext,
  };

  const dateRail = (
    <IntegratedDateRail {...dateRailProps} variant="light" />
  );

  const shellClass =
    phase === "travel"
      ? "bg-warm-black text-sand-50"
      : "miami-gradient text-warm-black";

  return (
    <div
      className={`${shellClass} -mx-4 -mt-4 min-h-screen pb-36 animate-fade-in`}
    >
      {phase === "pre" && (
        <PreTripView selectedDate={selectedDate} dateRail={dateRail} />
      )}
      {phase === "travel" && (
        <TravelDayView
          selectedDate={selectedDate}
          today={today}
          dateRailProps={{
            onPrev: dateRailProps.onPrev,
            onNext: dateRailProps.onNext,
            onToday: dateRailProps.onToday,
            canPrev: dateRailProps.canPrev,
            canNext: dateRailProps.canNext,
          }}
        />
      )}
      {phase === "trip" && (
        <TripDayContent selectedDate={selectedDate} dateRail={dateRail} />
      )}
      {phase === "post" && <PostTripView dateRail={dateRail} />}
    </div>
  );
}
