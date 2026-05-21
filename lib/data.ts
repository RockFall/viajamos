/**
 * Fallback estático quando o Supabase não responde.
 * Em produção os dados vêm de fetchFullTripData no TripProvider.
 */
import type {
  Agreement,
  Checklist,
  DayAlternativePlan,
  EssentialPlace,
  FamilyMember,
  Flight,
  ItineraryEvent,
  Memory,
  NightEvent,
  PossiblePlan,
  TravelDocument,
  TravelTimelineItem,
  TripConfig,
  TripDay,
  TripTask,
} from "@/types";

import familyData from "@/data/family.json";
import tripDaysData from "@/data/trip-days.json";
import itineraryEventsData from "@/data/itinerary-events.json";
import possiblePlansData from "@/data/possible-plans.json";
import essentialPlacesData from "@/data/essential-places.json";
import travelDocumentsData from "@/data/travel-documents.json";
import tripTasksData from "@/data/trip-tasks.json";
import checklistsData from "@/data/checklists.json";
import nightEventsData from "@/data/night-events.json";
import flightsData from "@/data/flights.json";
import memoriesData from "@/data/memories.json";
import agreementsData from "@/data/agreements.json";
import dayAlternativesData from "@/data/day-alternatives.json";
import travelTimelineData from "@/data/travel-timeline.json";
import type { FullTripData } from "@/lib/supabase/queries";

export const FALLBACK_TRIP_CONFIG: TripConfig = {
  destination: "Miami + Islamorada",
  baseAddress:
    "Miami: 3024 Aviation Avenue, Miami, FL 33133 · Islamorada: 82100 Overseas Highway, Islamorada, FL 33036",
  startDate: "2026-05-22",
  endDate: "2026-05-30",
  mockToday: "2026-05-20",
};

export const FALLBACK_TRIP_DATA: FullTripData = {
  family: familyData as FamilyMember[],
  config: FALLBACK_TRIP_CONFIG,
  tripDays: tripDaysData as TripDay[],
  itineraryEvents: itineraryEventsData as ItineraryEvent[],
  possiblePlans: possiblePlansData as PossiblePlan[],
  essentialPlaces: essentialPlacesData as EssentialPlace[],
  travelDocuments: travelDocumentsData as TravelDocument[],
  tasks: tripTasksData as TripTask[],
  checklists: checklistsData as Checklist[],
  nightEvents: nightEventsData as NightEvent[],
  flights: flightsData as Flight[],
  memories: memoriesData as Memory[],
  agreements: agreementsData as Agreement[],
  dayAlternatives: dayAlternativesData as DayAlternativePlan[],
  travelTimeline: travelTimelineData as TravelTimelineItem[],
  checklistStates: {},
};

export function getFamilyMember(
  family: FamilyMember[],
  id: string
): FamilyMember | undefined {
  return family.find((m) => m.id === id);
}
