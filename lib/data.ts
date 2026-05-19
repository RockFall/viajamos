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

export const TRIP_CONFIG = {
  destination: "Miami",
  baseAddress: "3024 Aviation Avenue, Miami, FL 33133",
  startDate: "2026-05-23",
  endDate: "2026-05-27",
  mockToday: "2026-05-24",
} as const;

export const family: FamilyMember[] = familyData as FamilyMember[];
export const tripDays: TripDay[] = tripDaysData as TripDay[];
export const initialItineraryEvents: ItineraryEvent[] =
  itineraryEventsData as ItineraryEvent[];
export const possiblePlans: PossiblePlan[] = possiblePlansData as PossiblePlan[];
export const essentialPlaces: EssentialPlace[] =
  essentialPlacesData as EssentialPlace[];
export const travelDocuments: TravelDocument[] =
  travelDocumentsData as TravelDocument[];
export const initialTasks: TripTask[] = tripTasksData as TripTask[];
export const checklists: Checklist[] = checklistsData as Checklist[];
export const nightEvents: NightEvent[] = nightEventsData as NightEvent[];
export const flights: Flight[] = flightsData as Flight[];
export const initialMemories: Memory[] = memoriesData as Memory[];
export const agreements: Agreement[] = agreementsData as Agreement[];
export const dayAlternatives: DayAlternativePlan[] =
  dayAlternativesData as DayAlternativePlan[];
export const travelTimeline: TravelTimelineItem[] =
  travelTimelineData as TravelTimelineItem[];

export function getFamilyMember(id: string): FamilyMember | undefined {
  return family.find((m) => m.id === id);
}
