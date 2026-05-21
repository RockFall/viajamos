import type {
  Agreement,
  Checklist,
  ChecklistItem,
  DayAlternativePlan,
  EssentialPlace,
  FamilyMember,
  FamilyMemberId,
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

function dateOnly(value: string): string {
  return value.slice(0, 10);
}

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

// --- Static / reference tables ---

export interface FamilyMemberRow {
  id: string;
  name: string;
  short_name: string;
  color: string;
}

export interface TripConfigRowFull {
  id: string;
  destination: string;
  base_address: string;
  start_date: string;
  end_date: string;
  mock_today: string;
}

export interface TripDayRow {
  id: string;
  date: string;
  title: string;
  theme: string;
  area: string | null;
  base_name: string | null;
  base_address: string | null;
  weather: string | null;
  is_travel_day: boolean;
  is_return_day: boolean;
}

export interface PossiblePlanRow {
  id: string;
  title: string;
  subtitle: string | null;
  description: string;
  why_go: string | null;
  category: PossiblePlan["category"];
  periods: PossiblePlan["periods"];
  neighborhood: string | null;
  address: string | null;
  estimated_duration_minutes: number | null;
  price_level: number | null;
  intensity: PossiblePlan["intensity"];
  best_for: PossiblePlan["bestFor"];
  google_maps_url: string | null;
  apple_maps_url: string | null;
  website_url: string | null;
  ticket_url: string | null;
  reservation_url: string | null;
  instagram_url: string | null;
  uber_url: string | null;
  tags: string[];
  status: PossiblePlanStatus;
  source: PossiblePlan["source"] | null;
  notes: string | null;
  is_nearby: boolean;
  cuisine: string | null;
}

export interface NightEventRow {
  id: string;
  date: string;
  type: NightEvent["type"];
  title: string;
  venue: string;
  neighborhood: string | null;
  start_time: string;
  end_time: string | null;
  price_info: string | null;
  dress_code: string | null;
  intensity: NightEvent["intensity"];
  buy_ahead: boolean;
  google_maps_url: string | null;
  apple_maps_url: string | null;
  website_url: string | null;
  ticket_url: string | null;
  uber_url: string | null;
  status: PossiblePlanStatus;
  notes: string | null;
}

export interface FlightRow {
  id: string;
  passenger_id: string;
  passenger_name: string;
  route: string;
  from: string;
  to: string;
  flight_number: string;
  seat: string | null;
  terminal: string | null;
  gate: string | null;
  boarding_time: string | null;
  departure_time: string;
  arrival_time: string | null;
  date: string;
  status: Flight["status"];
  confirmation_code: string | null;
}

export interface TravelTimelineRow {
  id: string;
  time: string;
  label: string;
  subtitle?: string | null;
  date: string;
  is_departure: boolean;
}

export interface DayAlternativeRow {
  id: string;
  day_id: string;
  trigger: DayAlternativePlan["trigger"];
  title: string;
  description: string;
  plan_item_ids: string[];
}

export interface ChecklistRow {
  id: string;
  title: string;
  type: Checklist["type"];
  items: ChecklistItem[];
}

export interface EssentialPlaceRow {
  id: string;
  name: string;
  type: EssentialPlace["type"];
  address: string;
  area: string | null;
  base_name: string | null;
  notes: string | null;
  google_maps_url: string | null;
  apple_maps_url: string | null;
  uber_url: string | null;
}

export interface TravelDocumentRow {
  id: string;
  title: string;
  type: TravelDocument["type"];
  url: string | null;
  notes: string | null;
}

export interface AgreementRow {
  id: string;
  text: string;
  order: number;
}

export function rowToFamilyMember(row: FamilyMemberRow): FamilyMember {
  return {
    id: row.id as FamilyMemberId,
    name: row.name,
    shortName: row.short_name,
    color: row.color,
  };
}

export function rowToTripConfig(row: TripConfigRowFull): TripConfig {
  return {
    destination: row.destination,
    baseAddress: row.base_address,
    startDate: dateOnly(row.start_date),
    endDate: dateOnly(row.end_date),
    mockToday: dateOnly(row.mock_today),
  };
}

export function rowToTripDay(row: TripDayRow): TripDay {
  return {
    id: row.id,
    date: dateOnly(row.date),
    title: row.title,
    theme: row.theme,
    area: (row.area as TripDay["area"]) ?? undefined,
    baseName: row.base_name ?? undefined,
    baseAddress: row.base_address ?? undefined,
    weather: row.weather ?? undefined,
    isTravelDay: row.is_travel_day,
    isReturnDay: row.is_return_day,
  };
}

export function rowToPossiblePlan(row: PossiblePlanRow): PossiblePlan {
  return {
    id: row.id,
    title: row.title,
    subtitle: row.subtitle ?? undefined,
    description: row.description,
    whyGo: row.why_go ?? undefined,
    category: row.category,
    periods: row.periods,
    neighborhood: row.neighborhood ?? undefined,
    address: row.address ?? undefined,
    estimatedDurationMinutes: row.estimated_duration_minutes ?? undefined,
    priceLevel: (row.price_level as PossiblePlan["priceLevel"]) ?? undefined,
    intensity: row.intensity,
    bestFor: row.best_for,
    googleMapsUrl: row.google_maps_url ?? undefined,
    appleMapsUrl: row.apple_maps_url ?? undefined,
    websiteUrl: row.website_url ?? undefined,
    ticketUrl: row.ticket_url ?? undefined,
    reservationUrl: row.reservation_url ?? undefined,
    instagramUrl: row.instagram_url ?? undefined,
    uberUrl: row.uber_url ?? undefined,
    tags: row.tags ?? [],
    status: row.status,
    source: row.source ?? undefined,
    notes: row.notes ?? undefined,
    isNearby: row.is_nearby,
    cuisine: (row.cuisine as PossiblePlan["cuisine"]) ?? undefined,
  };
}

export function rowToNightEvent(row: NightEventRow): NightEvent {
  return {
    id: row.id,
    date: dateOnly(row.date),
    type: row.type,
    title: row.title,
    venue: row.venue,
    neighborhood: row.neighborhood ?? undefined,
    startTime: row.start_time,
    endTime: row.end_time ?? undefined,
    priceInfo: row.price_info ?? undefined,
    dressCode: row.dress_code ?? undefined,
    intensity: row.intensity,
    buyAhead: row.buy_ahead,
    googleMapsUrl: row.google_maps_url ?? undefined,
    appleMapsUrl: row.apple_maps_url ?? undefined,
    websiteUrl: row.website_url ?? undefined,
    ticketUrl: row.ticket_url ?? undefined,
    uberUrl: row.uber_url ?? undefined,
    status: row.status,
    notes: row.notes ?? undefined,
  };
}

export function rowToFlight(row: FlightRow): Flight {
  return {
    id: row.id,
    passengerId: row.passenger_id as FamilyMemberId,
    passengerName: row.passenger_name,
    route: row.route,
    from: row.from,
    to: row.to,
    flightNumber: row.flight_number,
    seat: row.seat ?? undefined,
    terminal: row.terminal ?? undefined,
    gate: row.gate ?? undefined,
    boardingTime: row.boarding_time ?? undefined,
    departureTime: row.departure_time,
    arrivalTime: row.arrival_time ?? undefined,
    date: dateOnly(row.date),
    status: row.status,
    confirmationCode: row.confirmation_code ?? undefined,
  };
}

export function rowToTravelTimeline(row: TravelTimelineRow): TravelTimelineItem {
  return {
    id: row.id,
    time: row.time,
    label: row.label,
    subtitle: row.subtitle ?? undefined,
    date: dateOnly(row.date),
    isDeparture: row.is_departure,
  };
}

export function flightToRow(flight: Flight): FlightRow {
  return {
    id: flight.id,
    passenger_id: flight.passengerId,
    passenger_name: flight.passengerName,
    route: flight.route,
    from: flight.from,
    to: flight.to,
    flight_number: flight.flightNumber,
    seat: flight.seat ?? null,
    terminal: flight.terminal ?? null,
    gate: flight.gate ?? null,
    boarding_time: flight.boardingTime ?? null,
    departure_time: flight.departureTime,
    arrival_time: flight.arrivalTime ?? null,
    date: flight.date,
    status: flight.status,
    confirmation_code: flight.confirmationCode ?? null,
  };
}

export function travelTimelineToRow(
  item: TravelTimelineItem
): TravelTimelineRow {
  return {
    id: item.id,
    time: item.time,
    label: item.label,
    subtitle: item.subtitle ?? null,
    date: item.date,
    is_departure: item.isDeparture ?? false,
  };
}

export function checklistToRow(checklist: Checklist): ChecklistRow {
  return {
    id: checklist.id,
    title: checklist.title,
    type: checklist.type,
    items: checklist.items,
  };
}

export function tripDayToRow(day: TripDay): TripDayRow {
  return {
    id: day.id,
    date: day.date,
    title: day.title,
    theme: day.theme,
    area: day.area ?? null,
    base_name: day.baseName ?? null,
    base_address: day.baseAddress ?? null,
    weather: day.weather ?? null,
    is_travel_day: day.isTravelDay ?? false,
    is_return_day: day.isReturnDay ?? false,
  };
}

export function rowToDayAlternative(row: DayAlternativeRow): DayAlternativePlan {
  return {
    id: row.id,
    dayId: row.day_id,
    trigger: row.trigger,
    title: row.title,
    description: row.description,
    planItemIds: row.plan_item_ids ?? [],
  };
}

export function rowToChecklist(row: ChecklistRow): Checklist {
  return {
    id: row.id,
    title: row.title,
    type: row.type,
    items: Array.isArray(row.items) ? row.items : [],
  };
}

export function rowToEssentialPlace(row: EssentialPlaceRow): EssentialPlace {
  return {
    id: row.id,
    name: row.name,
    type: row.type,
    address: row.address,
    area: (row.area as EssentialPlace["area"]) ?? undefined,
    baseName: row.base_name ?? undefined,
    notes: row.notes ?? undefined,
    googleMapsUrl: row.google_maps_url ?? undefined,
    appleMapsUrl: row.apple_maps_url ?? undefined,
    uberUrl: row.uber_url ?? undefined,
  };
}

export function rowToTravelDocument(row: TravelDocumentRow): TravelDocument {
  return {
    id: row.id,
    title: row.title,
    type: row.type,
    url: row.url ?? undefined,
    notes: row.notes ?? undefined,
  };
}

export function rowToAgreement(row: AgreementRow): Agreement {
  return {
    id: row.id,
    text: row.text,
    order: row.order,
  };
}

export function familyMemberToRow(member: FamilyMember): FamilyMemberRow {
  return {
    id: member.id,
    name: member.name,
    short_name: member.shortName,
    color: member.color,
  };
}

export function tripConfigToRow(config: TripConfig): TripConfigRowFull {
  return {
    id: "default",
    destination: config.destination,
    base_address: config.baseAddress,
    start_date: config.startDate,
    end_date: config.endDate,
    mock_today: config.mockToday,
  };
}

export function possiblePlanToRow(plan: PossiblePlan): PossiblePlanRow {
  return {
    id: plan.id,
    title: plan.title,
    subtitle: plan.subtitle ?? null,
    description: plan.description,
    why_go: plan.whyGo ?? null,
    category: plan.category,
    periods: plan.periods,
    neighborhood: plan.neighborhood ?? null,
    address: plan.address ?? null,
    estimated_duration_minutes: plan.estimatedDurationMinutes ?? null,
    price_level: plan.priceLevel ?? null,
    intensity: plan.intensity,
    best_for: plan.bestFor,
    google_maps_url: plan.googleMapsUrl ?? null,
    apple_maps_url: plan.appleMapsUrl ?? null,
    website_url: plan.websiteUrl ?? null,
    ticket_url: plan.ticketUrl ?? null,
    reservation_url: plan.reservationUrl ?? null,
    instagram_url: plan.instagramUrl ?? null,
    uber_url: plan.uberUrl ?? null,
    tags: plan.tags ?? [],
    status: plan.status,
    source: plan.source ?? null,
    notes: plan.notes ?? null,
    is_nearby: plan.isNearby ?? false,
    cuisine: plan.cuisine ?? null,
  };
}

export function nightEventToRow(event: NightEvent): NightEventRow {
  return {
    id: event.id,
    date: event.date,
    type: event.type,
    title: event.title,
    venue: event.venue,
    neighborhood: event.neighborhood ?? null,
    start_time: event.startTime,
    end_time: event.endTime ?? null,
    price_info: event.priceInfo ?? null,
    dress_code: event.dressCode ?? null,
    intensity: event.intensity,
    buy_ahead: event.buyAhead ?? false,
    google_maps_url: event.googleMapsUrl ?? null,
    apple_maps_url: event.appleMapsUrl ?? null,
    website_url: event.websiteUrl ?? null,
    ticket_url: event.ticketUrl ?? null,
    uber_url: event.uberUrl ?? null,
    status: event.status,
    notes: event.notes ?? null,
  };
}

export function dayAlternativeToRow(
  alt: DayAlternativePlan
): DayAlternativeRow {
  return {
    id: alt.id,
    day_id: alt.dayId,
    trigger: alt.trigger,
    title: alt.title,
    description: alt.description,
    plan_item_ids: alt.planItemIds ?? [],
  };
}

export function essentialPlaceToRow(
  place: EssentialPlace
): EssentialPlaceRow {
  return {
    id: place.id,
    name: place.name,
    type: place.type,
    address: place.address,
    area: place.area ?? null,
    base_name: place.baseName ?? null,
    notes: place.notes ?? null,
    google_maps_url: place.googleMapsUrl ?? null,
    apple_maps_url: place.appleMapsUrl ?? null,
    uber_url: place.uberUrl ?? null,
  };
}

export function travelDocumentToRow(
  doc: TravelDocument
): TravelDocumentRow {
  return {
    id: doc.id,
    title: doc.title,
    type: doc.type,
    url: doc.url ?? null,
    notes: doc.notes ?? null,
  };
}

export function agreementToRow(agreement: Agreement): AgreementRow {
  return {
    id: agreement.id,
    text: agreement.text,
    order: agreement.order,
  };
}
