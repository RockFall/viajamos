import type { FamilyMemberId, ItineraryEvent } from "@/types";
import { compareTimes } from "./dates";

export function getEventsForDate(
  events: ItineraryEvent[],
  date: string
): ItineraryEvent[] {
  return events
    .filter((e) => e.date === date && e.status !== "cancelled")
    .sort((a, b) => compareTimes(a.startTime, b.startTime));
}

export function getEventsForPeriod(
  events: ItineraryEvent[],
  date: string,
  period: ItineraryEvent["period"]
): ItineraryEvent[] {
  return getEventsForDate(events, date).filter((e) => e.period === period);
}

export function getNextEventForPerson(
  events: ItineraryEvent[],
  personId: FamilyMemberId,
  today: string,
  nowTime?: string
): ItineraryEvent | null {
  const currentTime = nowTime ?? "00:00";
  const upcoming = events
    .filter(
      (e) =>
        e.people.includes(personId) &&
        e.status !== "cancelled" &&
        e.status !== "done" &&
        (e.date > today || (e.date === today && (e.startTime ?? "23:59") >= currentTime))
    )
    .sort((a, b) => {
      const dateCmp = a.date.localeCompare(b.date);
      if (dateCmp !== 0) return dateCmp;
      return compareTimes(a.startTime, b.startTime);
    });

  return upcoming[0] ?? null;
}

export function getNextCollectiveEvent(
  events: ItineraryEvent[],
  familyIds: FamilyMemberId[],
  today: string,
  nowTime?: string
): ItineraryEvent | null {
  const currentTime = nowTime ?? "00:00";
  const upcoming = events
    .filter((e) => {
      if (e.status === "cancelled" || e.status === "done") return false;
      const isCollective = familyIds.every((id) => e.people.includes(id));
      if (!isCollective) return false;
      return (
        e.date > today ||
        (e.date === today && (e.startTime ?? "23:59") >= currentTime)
      );
    })
    .sort((a, b) => {
      const dateCmp = a.date.localeCompare(b.date);
      if (dateCmp !== 0) return dateCmp;
      return compareTimes(a.startTime, b.startTime);
    });

  return upcoming[0] ?? null;
}

export function isTravelDay(
  date: string,
  startDate: string,
  endDate: string
): boolean {
  return date === startDate || date === endDate;
}

export function getGroupedEvents(events: ItineraryEvent[]): Map<string, ItineraryEvent[]> {
  const groups = new Map<string, ItineraryEvent[]>();
  for (const event of events) {
    if (event.groupId) {
      const existing = groups.get(event.groupId) ?? [];
      existing.push(event);
      groups.set(event.groupId, existing);
    }
  }
  return groups;
}

export function generateId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}
