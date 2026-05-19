import type { SupabaseClient } from "@supabase/supabase-js";
import type {
  ItineraryEvent,
  Memory,
  PossiblePlanStatus,
  TripTask,
} from "@/types";
import {
  itineraryEventToRow,
  memoryToRow,
  rowToItineraryEvent,
  rowToMemory,
  rowToTripTask,
  tripTaskToRow,
  type ChecklistItemStateRow,
  type ItineraryEventRow,
  type MemoryRow,
  type PossiblePlanStatusRow,
  type TripConfigRow,
  type TripTaskRow,
} from "./mappers";

export interface MutableTripState {
  itineraryEvents: ItineraryEvent[];
  tasks: TripTask[];
  checklistStates: Record<string, boolean>;
  possiblePlanStatuses: Record<string, PossiblePlanStatus>;
  memories: Memory[];
  mockToday: string;
}

export async function fetchMutableTripState(
  client: SupabaseClient
): Promise<MutableTripState | null> {
  const [
    eventsResult,
    tasksResult,
    checklistResult,
    plansResult,
    memoriesResult,
    configResult,
  ] = await Promise.all([
    client.from("itinerary_events").select("*").order("date").order("start_time"),
    client.from("trip_tasks").select("*").order("due_date"),
    client.from("checklist_item_states").select("*"),
    client.from("possible_plans").select("id, status"),
    client.from("memories").select("*").order("date"),
    client.from("trip_config").select("mock_today").eq("id", "default").maybeSingle(),
  ]);

  if (
    eventsResult.error ||
    tasksResult.error ||
    checklistResult.error ||
    plansResult.error ||
    memoriesResult.error ||
    configResult.error
  ) {
    console.warn("Supabase fetch errors:", {
      events: eventsResult.error,
      tasks: tasksResult.error,
      checklist: checklistResult.error,
      plans: plansResult.error,
      memories: memoriesResult.error,
      config: configResult.error,
    });
    return null;
  }

  const hasAnyData =
    (eventsResult.data?.length ?? 0) > 0 ||
    (tasksResult.data?.length ?? 0) > 0 ||
    (memoriesResult.data?.length ?? 0) > 0 ||
    configResult.data !== null;

  if (!hasAnyData) {
    return null;
  }

  const checklistStates: Record<string, boolean> = {};
  for (const row of (checklistResult.data ?? []) as ChecklistItemStateRow[]) {
    checklistStates[row.item_id] = row.checked;
  }

  const possiblePlanStatuses: Record<string, PossiblePlanStatus> = {};
  for (const row of (plansResult.data ?? []) as PossiblePlanStatusRow[]) {
    possiblePlanStatuses[row.id] = row.status;
  }

  return {
    itineraryEvents: ((eventsResult.data ?? []) as ItineraryEventRow[]).map(
      rowToItineraryEvent
    ),
    tasks: ((tasksResult.data ?? []) as TripTaskRow[]).map(rowToTripTask),
    checklistStates,
    possiblePlanStatuses,
    memories: ((memoriesResult.data ?? []) as MemoryRow[]).map(rowToMemory),
    mockToday:
      (configResult.data as TripConfigRow | null)?.mock_today ?? "2026-05-24",
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

export async function updateMockToday(
  client: SupabaseClient,
  mockToday: string
): Promise<void> {
  const { error } = await client
    .from("trip_config")
    .upsert({
      id: "default",
      destination: "Miami",
      base_address: "3024 Aviation Avenue, Miami, FL 33133",
      start_date: "2026-05-23",
      end_date: "2026-05-27",
      mock_today: mockToday,
    });
  if (error) console.warn("Failed to update mock today:", error.message);
}

export async function syncAllMutableState(
  client: SupabaseClient,
  state: MutableTripState
): Promise<void> {
  await Promise.all([
    client
      .from("itinerary_events")
      .upsert(state.itineraryEvents.map(itineraryEventToRow)),
    client.from("trip_tasks").upsert(state.tasks.map(tripTaskToRow)),
    client.from("memories").upsert(state.memories.map(memoryToRow)),
    updateMockToday(client, state.mockToday),
    ...Object.entries(state.checklistStates).map(([itemId, checked]) =>
      upsertChecklistItemState(client, itemId, checked)
    ),
    ...Object.entries(state.possiblePlanStatuses).map(([planId, status]) =>
      upsertPossiblePlanStatus(client, planId, status)
    ),
  ]);
}
