import type { SupabaseClient } from "@supabase/supabase-js";
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
  PossiblePlanStatus,
  TravelDocument,
  TravelTimelineItem,
  TripConfig,
  TripDay,
  TripTask,
} from "@/types";
import {
  itineraryEventToRow,
  memoryToRow,
  rowToAgreement,
  rowToChecklist,
  rowToDayAlternative,
  rowToEssentialPlace,
  rowToFamilyMember,
  rowToFlight,
  rowToItineraryEvent,
  rowToMemory,
  rowToNightEvent,
  rowToPossiblePlan,
  rowToTravelDocument,
  rowToTravelTimeline,
  rowToTripConfig,
  rowToTripDay,
  rowToTripTask,
  tripTaskToRow,
  flightToRow,
  travelTimelineToRow,
  checklistToRow,
  tripDayToRow,
  type AgreementRow,
  type ChecklistItemStateRow,
  type ChecklistRow,
  type DayAlternativeRow,
  type EssentialPlaceRow,
  type FlightRow,
  type ItineraryEventRow,
  type MemoryRow,
  type NightEventRow,
  type PossiblePlanRow,
  type TravelDocumentRow,
  type TravelTimelineRow,
  type TripConfigRowFull,
  type TripDayRow,
  type TripTaskRow,
  type FamilyMemberRow,
} from "./mappers";

export interface FullTripData {
  family: FamilyMember[];
  config: TripConfig;
  tripDays: TripDay[];
  possiblePlans: PossiblePlan[];
  nightEvents: NightEvent[];
  flights: Flight[];
  travelTimeline: TravelTimelineItem[];
  dayAlternatives: DayAlternativePlan[];
  checklists: Checklist[];
  essentialPlaces: EssentialPlace[];
  travelDocuments: TravelDocument[];
  agreements: Agreement[];
  itineraryEvents: ItineraryEvent[];
  tasks: TripTask[];
  checklistStates: Record<string, boolean>;
  memories: Memory[];
}

function logErrors(label: string, errors: Record<string, unknown>) {
  const filtered = Object.fromEntries(
    Object.entries(errors).filter(([, v]) => v != null)
  );
  if (Object.keys(filtered).length > 0) {
    console.warn(`Supabase ${label}:`, filtered);
  }
}

export async function fetchFullTripData(
  client: SupabaseClient
): Promise<FullTripData | null> {
  const [
    familyResult,
    configResult,
    tripDaysResult,
    plansResult,
    nightResult,
    flightsResult,
    timelineResult,
    alternativesResult,
    checklistsResult,
    checklistStatesResult,
    placesResult,
    documentsResult,
    agreementsResult,
    eventsResult,
    tasksResult,
    memoriesResult,
  ] = await Promise.all([
    client.from("family_members").select("*").order("id"),
    client.from("trip_config").select("*").eq("id", "default").maybeSingle(),
    client.from("trip_days").select("*").order("date"),
    client.from("possible_plans").select("*").order("title"),
    client.from("night_events").select("*").order("date").order("start_time"),
    client.from("flights").select("*").order("date"),
    client.from("travel_timeline_items").select("*").order("date").order("time"),
    client.from("day_alternative_plans").select("*"),
    client.from("checklists").select("*").order("type"),
    client.from("checklist_item_states").select("*"),
    client.from("essential_places").select("*").order("name"),
    client.from("travel_documents").select("*").order("title"),
    client.from("agreements").select("*").order("order"),
    client.from("itinerary_events").select("*").order("date").order("start_time"),
    client.from("trip_tasks").select("*").order("due_date"),
    client.from("memories").select("*").order("date"),
  ]);

  logErrors("fetch", {
    family: familyResult.error,
    config: configResult.error,
    tripDays: tripDaysResult.error,
    plans: plansResult.error,
    night: nightResult.error,
    flights: flightsResult.error,
    timeline: timelineResult.error,
    alternatives: alternativesResult.error,
    checklists: checklistsResult.error,
    checklistStates: checklistStatesResult.error,
    places: placesResult.error,
    documents: documentsResult.error,
    agreements: agreementsResult.error,
    events: eventsResult.error,
    tasks: tasksResult.error,
    memories: memoriesResult.error,
  });

  const criticalError =
    familyResult.error ||
    configResult.error ||
    tripDaysResult.error ||
    eventsResult.error;

  if (criticalError) {
    return null;
  }

  const tripDays = ((tripDaysResult.data ?? []) as TripDayRow[]).map(
    rowToTripDay
  );
  const itineraryEvents = ((eventsResult.data ?? []) as ItineraryEventRow[]).map(
    rowToItineraryEvent
  );

  const hasData =
    tripDays.length > 0 ||
    itineraryEvents.length > 0 ||
    ((plansResult.data ?? []) as PossiblePlanRow[]).length > 0;

  if (!hasData) {
    return null;
  }

  const checklistStates: Record<string, boolean> = {};
  for (const row of (checklistStatesResult.data ?? []) as ChecklistItemStateRow[]) {
    checklistStates[row.item_id] = row.checked;
  }

  const configRow = configResult.data as TripConfigRowFull | null;
  const config: TripConfig = configRow
    ? rowToTripConfig(configRow)
    : {
        destination: "Miami + Islamorada",
        baseAddress: "",
        startDate: tripDays[0]?.date ?? "2026-05-22",
        endDate: tripDays[tripDays.length - 1]?.date ?? "2026-05-30",
        mockToday: "2026-05-20",
      };

  return {
    family: ((familyResult.data ?? []) as FamilyMemberRow[]).map(
      rowToFamilyMember
    ),
    config,
    tripDays,
    possiblePlans: ((plansResult.data ?? []) as PossiblePlanRow[]).map(
      rowToPossiblePlan
    ),
    nightEvents: ((nightResult.data ?? []) as NightEventRow[]).map(
      rowToNightEvent
    ),
    flights: ((flightsResult.data ?? []) as FlightRow[]).map(rowToFlight),
    travelTimeline: ((timelineResult.data ?? []) as TravelTimelineRow[]).map(
      rowToTravelTimeline
    ),
    dayAlternatives: ((alternativesResult.data ?? []) as DayAlternativeRow[]).map(
      rowToDayAlternative
    ),
    checklists: ((checklistsResult.data ?? []) as ChecklistRow[]).map(
      rowToChecklist
    ),
    essentialPlaces: ((placesResult.data ?? []) as EssentialPlaceRow[]).map(
      rowToEssentialPlace
    ),
    travelDocuments: ((documentsResult.data ?? []) as TravelDocumentRow[]).map(
      rowToTravelDocument
    ),
    agreements: ((agreementsResult.data ?? []) as AgreementRow[]).map(
      rowToAgreement
    ),
    itineraryEvents,
    tasks: ((tasksResult.data ?? []) as TripTaskRow[]).map(rowToTripTask),
    checklistStates,
    memories: ((memoriesResult.data ?? []) as MemoryRow[]).map(rowToMemory),
  };
}

export async function upsertItineraryEvent(
  client: SupabaseClient,
  event: ItineraryEvent
): Promise<void> {
  const { error } = await client
    .from("itinerary_events")
    .upsert(itineraryEventToRow(event));
  if (error) console.warn("Failed to upsert itinerary event:", error.message);
}

export async function deleteItineraryEvent(
  client: SupabaseClient,
  id: string
): Promise<void> {
  const { error } = await client.from("itinerary_events").delete().eq("id", id);
  if (error) console.warn("Failed to delete itinerary event:", error.message);
}

export async function upsertTripTask(
  client: SupabaseClient,
  task: TripTask
): Promise<void> {
  const { error } = await client.from("trip_tasks").upsert(tripTaskToRow(task));
  if (error) console.warn("Failed to upsert trip task:", error.message);
}

export async function upsertChecklistItemState(
  client: SupabaseClient,
  itemId: string,
  checked: boolean
): Promise<void> {
  const { error } = await client
    .from("checklist_item_states")
    .upsert({ item_id: itemId, checked });
  if (error)
    console.warn("Failed to upsert checklist item state:", error.message);
}

export async function upsertPossiblePlanStatus(
  client: SupabaseClient,
  planId: string,
  status: PossiblePlanStatus
): Promise<void> {
  const { error } = await client
    .from("possible_plans")
    .update({ status })
    .eq("id", planId);
  if (error)
    console.warn("Failed to update possible plan status:", error.message);
}

export async function upsertMemory(
  client: SupabaseClient,
  memory: Memory
): Promise<void> {
  const { error } = await client.from("memories").upsert(memoryToRow(memory));
  if (error) console.warn("Failed to upsert memory:", error.message);
}

export async function upsertFlight(
  client: SupabaseClient,
  flight: Flight
): Promise<void> {
  const { error } = await client.from("flights").upsert(flightToRow(flight));
  if (error) console.warn("Failed to upsert flight:", error.message);
}

export async function deleteFlight(
  client: SupabaseClient,
  id: string
): Promise<void> {
  const { error } = await client.from("flights").delete().eq("id", id);
  if (error) console.warn("Failed to delete flight:", error.message);
}

export async function upsertTravelTimelineItem(
  client: SupabaseClient,
  item: TravelTimelineItem
): Promise<void> {
  const { error } = await client
    .from("travel_timeline_items")
    .upsert(travelTimelineToRow(item));
  if (error) console.warn("Failed to upsert travel timeline:", error.message);
}

export async function deleteTravelTimelineItem(
  client: SupabaseClient,
  id: string
): Promise<void> {
  const { error } = await client
    .from("travel_timeline_items")
    .delete()
    .eq("id", id);
  if (error)
    console.warn("Failed to delete travel timeline item:", error.message);
}

export async function upsertTripDay(
  client: SupabaseClient,
  day: TripDay
): Promise<void> {
  const { error } = await client.from("trip_days").upsert(tripDayToRow(day));
  if (error) console.warn("Failed to upsert trip day:", error.message);
}

export async function upsertChecklist(
  client: SupabaseClient,
  checklist: Checklist
): Promise<void> {
  const { error } = await client
    .from("checklists")
    .upsert(checklistToRow(checklist));
  if (error) console.warn("Failed to upsert checklist:", error.message);
}
