import type {
  FamilyMemberId,
  ItineraryEvent,
  Memory,
  PossiblePlanStatus,
  TripTask,
} from "@/types";

export interface ItineraryEventRow {
  id: string;
  title: string;
  description: string | null;
  date: string;
  start_time: string | null;
  end_time: string | null;
  period: ItineraryEvent["period"];
  location_name: string | null;
  address: string | null;
  neighborhood: string | null;
  category: ItineraryEvent["category"];
  people: string[];
  status: ItineraryEvent["status"];
  group_id: string | null;
  group_label: string | null;
  google_maps_url: string | null;
  apple_maps_url: string | null;
  website_url: string | null;
  ticket_url: string | null;
  reservation_url: string | null;
  uber_url: string | null;
  notes: string | null;
  leave_by: string | null;
}

export interface TripTaskRow {
  id: string;
  title: string;
  due_date: string | null;
  related_plan_id: string | null;
  assigned_to: string | null;
  status: TripTask["status"];
  priority: TripTask["priority"];
}

export interface MemoryRow {
  id: string;
  day_id: string;
  date: string;
  best_moment: string | null;
  best_food: string | null;
  favorite_place: string | null;
  rating: number | null;
  notes: string | null;
  photo_url: string | null;
}

export interface ChecklistItemStateRow {
  item_id: string;
  checked: boolean;
}

export interface PossiblePlanStatusRow {
  id: string;
  status: PossiblePlanStatus;
}

export interface TripConfigRow {
  mock_today: string;
}

export function rowToItineraryEvent(row: ItineraryEventRow): ItineraryEvent {
  return {
    id: row.id,
    title: row.title,
    description: row.description ?? undefined,
    date: row.date,
    startTime: row.start_time ?? undefined,
    endTime: row.end_time ?? undefined,
    period: row.period,
    locationName: row.location_name ?? undefined,
    address: row.address ?? undefined,
    neighborhood: row.neighborhood ?? undefined,
    category: row.category,
    people: row.people as FamilyMemberId[],
    status: row.status,
    groupId: row.group_id ?? undefined,
    groupLabel: row.group_label ?? undefined,
    googleMapsUrl: row.google_maps_url ?? undefined,
    appleMapsUrl: row.apple_maps_url ?? undefined,
    websiteUrl: row.website_url ?? undefined,
    ticketUrl: row.ticket_url ?? undefined,
    reservationUrl: row.reservation_url ?? undefined,
    uberUrl: row.uber_url ?? undefined,
    notes: row.notes ?? undefined,
    leaveBy: row.leave_by ?? undefined,
  };
}

export function itineraryEventToRow(
  event: ItineraryEvent
): ItineraryEventRow {
  return {
    id: event.id,
    title: event.title,
    description: event.description ?? null,
    date: event.date,
    start_time: event.startTime ?? null,
    end_time: event.endTime ?? null,
    period: event.period,
    location_name: event.locationName ?? null,
    address: event.address ?? null,
    neighborhood: event.neighborhood ?? null,
    category: event.category,
    people: event.people,
    status: event.status,
    group_id: event.groupId ?? null,
    group_label: event.groupLabel ?? null,
    google_maps_url: event.googleMapsUrl ?? null,
    apple_maps_url: event.appleMapsUrl ?? null,
    website_url: event.websiteUrl ?? null,
    ticket_url: event.ticketUrl ?? null,
    reservation_url: event.reservationUrl ?? null,
    uber_url: event.uberUrl ?? null,
    notes: event.notes ?? null,
    leave_by: event.leaveBy ?? null,
  };
}

export function rowToTripTask(row: TripTaskRow): TripTask {
  return {
    id: row.id,
    title: row.title,
    dueDate: row.due_date ?? undefined,
    relatedPlanId: row.related_plan_id ?? undefined,
    assignedTo: (row.assigned_to as FamilyMemberId | null) ?? undefined,
    status: row.status,
    priority: row.priority,
  };
}

export function tripTaskToRow(task: TripTask): TripTaskRow {
  return {
    id: task.id,
    title: task.title,
    due_date: task.dueDate ?? null,
    related_plan_id: task.relatedPlanId ?? null,
    assigned_to: task.assignedTo ?? null,
    status: task.status,
    priority: task.priority,
  };
}

export function rowToMemory(row: MemoryRow): Memory {
  return {
    id: row.id,
    dayId: row.day_id,
    date: row.date,
    bestMoment: row.best_moment ?? undefined,
    bestFood: row.best_food ?? undefined,
    favoritePlace: row.favorite_place ?? undefined,
    rating: row.rating ?? undefined,
    notes: row.notes ?? undefined,
    photoUrl: row.photo_url ?? undefined,
  };
}

export function memoryToRow(memory: Memory): MemoryRow {
  return {
    id: memory.id,
    day_id: memory.dayId,
    date: memory.date,
    best_moment: memory.bestMoment ?? null,
    best_food: memory.bestFood ?? null,
    favorite_place: memory.favoritePlace ?? null,
    rating: memory.rating ?? null,
    notes: memory.notes ?? null,
    photo_url: memory.photoUrl ?? null,
  };
}
