import { compareTimes } from "@/lib/dates";
import type { Intensity, NightEvent, NightEventType, TripDay } from "@/types";

export type NightMoodId = "jazz" | "dance" | "cocktail" | "view" | "quiet";

export interface NightMoodOption {
  id: NightMoodId;
  label: string;
  types?: NightEventType[];
  intensity?: Intensity;
}

export const NIGHT_MOODS: NightMoodOption[] = [
  { id: "jazz", label: "Jazz", types: ["jazz"] },
  { id: "dance", label: "Dançar", types: ["electronic"] },
  { id: "cocktail", label: "Coquetel", types: ["bar"] },
  { id: "view", label: "Vista", types: ["bar", "jazz"] },
  { id: "quiet", label: "Quieto", intensity: "light" },
];

export const NIGHT_EVENT_TYPES: NightEventType[] = [
  "jazz",
  "electronic",
  "bar",
  "late_food",
];

export function sortNightEventsByTime(events: NightEvent[]): NightEvent[] {
  return [...events].sort((a, b) =>
    compareTimes(a.startTime, b.startTime)
  );
}

/** Destaque: favorito → comprar antes → mais cedo */
export function pickTonightEvent(events: NightEvent[]): NightEvent | null {
  const pool = events.filter((e) => e.status !== "discarded");
  if (pool.length === 0) return null;

  const shortlisted = pool.find((e) => e.status === "shortlisted");
  if (shortlisted) return shortlisted;

  const buyAhead = pool.find((e) => e.buyAhead);
  if (buyAhead) return buyAhead;

  return sortNightEventsByTime(pool)[0] ?? null;
}

export function filterNightEventsByType(
  events: NightEvent[],
  type: string
): NightEvent[] {
  if (!type) return events;
  return events.filter((e) => e.type === type);
}

export function filterNightEventsByMood(
  events: NightEvent[],
  mood: string
): NightEvent[] {
  if (!mood) return events;
  const option = NIGHT_MOODS.find((m) => m.id === mood);
  if (!option) return events;

  return events.filter((e) => {
    if (option.types && !option.types.includes(e.type)) return false;
    if (option.intensity && e.intensity !== option.intensity) return false;
    return true;
  });
}

export function getTripNightDays(tripDays: TripDay[]): TripDay[] {
  return tripDays.filter((d) => !d.isTravelDay);
}

export function isHotNightEvent(event: NightEvent): boolean {
  return (
    event.status === "shortlisted" ||
    event.buyAhead === true ||
    event.status === "added_to_itinerary"
  );
}
