export type FamilyMemberId = "caio" | "geovanin" | "adelaide" | "sofia";

export interface FamilyMember {
  id: FamilyMemberId;
  name: string;
  shortName: string;
  color: string;
}

export interface TripDay {
  id: string;
  date: string;
  title: string;
  theme: string;
  area?: "Miami" | "Islamorada" | "Travel";
  baseName?: string;
  baseAddress?: string;
  weather?: string;
  isTravelDay?: boolean;
  isReturnDay?: boolean;
}

export type EventPeriod = "morning" | "afternoon" | "night" | "late_night";

export type EventCategory =
  | "food"
  | "music"
  | "museum"
  | "shopping"
  | "walk"
  | "travel"
  | "rest"
  | "experience"
  | "event";

export type EventStatus =
  | "idea"
  | "planned"
  | "reserved"
  | "booked"
  | "done"
  | "cancelled";

export interface ItineraryEvent {
  id: string;
  title: string;
  description?: string;
  date: string;
  startTime?: string;
  endTime?: string;
  period: EventPeriod;
  locationName?: string;
  address?: string;
  neighborhood?: string;
  category: EventCategory;
  people: FamilyMemberId[];
  status: EventStatus;
  groupId?: string;
  groupLabel?: string;
  googleMapsUrl?: string;
  appleMapsUrl?: string;
  websiteUrl?: string;
  ticketUrl?: string;
  reservationUrl?: string;
  uberUrl?: string;
  notes?: string;
  leaveBy?: string;
}

export type PossiblePlanCategory =
  | "restaurant"
  | "cafe"
  | "jazz"
  | "electronic_music"
  | "museum"
  | "gallery"
  | "shopping"
  | "walk"
  | "bar"
  | "experience"
  | "rainy_day"
  | "nearby"
  | "late_night";

export type PossiblePlanStatus =
  | "candidate"
  | "shortlisted"
  | "added_to_itinerary"
  | "discarded";

export type Intensity = "light" | "moderate" | "intense";

export type BestFor =
  | "family"
  | "caio"
  | "geovanin"
  | "adelaide"
  | "sofia"
  | "caio_sofia"
  | "adults"
  | "everyone";

export interface PossiblePlan {
  id: string;
  title: string;
  subtitle?: string;
  description: string;
  whyGo?: string;
  category: PossiblePlanCategory;
  periods: EventPeriod[];
  neighborhood?: string;
  address?: string;
  estimatedDurationMinutes?: number;
  priceLevel?: 1 | 2 | 3 | 4;
  intensity: Intensity;
  bestFor: BestFor[];
  googleMapsUrl?: string;
  appleMapsUrl?: string;
  websiteUrl?: string;
  ticketUrl?: string;
  reservationUrl?: string;
  instagramUrl?: string;
  uberUrl?: string;
  tags: string[];
  status: PossiblePlanStatus;
  source?: "manual" | "ai_generated" | "user_added";
  notes?: string;
  isNearby?: boolean;
}

export type AlternativeTrigger =
  | "rain"
  | "tired"
  | "late_start"
  | "too_hot"
  | "reservation_failed"
  | "extra_energy";

export interface DayAlternativePlan {
  id: string;
  dayId: string;
  trigger: AlternativeTrigger;
  title: string;
  description: string;
  planItemIds: string[];
}

export type EssentialPlaceType =
  | "lodging"
  | "airport"
  | "pharmacy"
  | "market"
  | "hospital"
  | "shopping"
  | "consulate"
  | "meeting_point"
  | "parking";

export interface EssentialPlace {
  id: string;
  name: string;
  type: EssentialPlaceType;
  address: string;
  area?: "Miami" | "Islamorada" | "Travel";
  baseName?: string;
  notes?: string;
  googleMapsUrl?: string;
  appleMapsUrl?: string;
  uberUrl?: string;
}

export type DocumentType =
  | "flight"
  | "lodging"
  | "ticket"
  | "reservation"
  | "insurance"
  | "car_rental"
  | "other";

export interface TravelDocument {
  id: string;
  title: string;
  type: DocumentType;
  url?: string;
  notes?: string;
}

export type TaskPriority = "low" | "medium" | "high";
export type TaskStatus = "open" | "done";

export interface TripTask {
  id: string;
  title: string;
  dueDate?: string;
  relatedPlanId?: string;
  assignedTo?: FamilyMemberId;
  status: TaskStatus;
  priority: TaskPriority;
}

export type ChecklistType =
  | "before_trip"
  | "travel_day"
  | "daily"
  | "return";

export interface ChecklistItem {
  id: string;
  label: string;
}

export interface Checklist {
  id: string;
  title: string;
  type: ChecklistType;
  items: ChecklistItem[];
}

export type NightEventType = "jazz" | "electronic" | "bar" | "late_food";

export interface NightEvent {
  id: string;
  date: string;
  type: NightEventType;
  title: string;
  venue: string;
  neighborhood?: string;
  startTime: string;
  endTime?: string;
  priceInfo?: string;
  dressCode?: string;
  intensity: Intensity;
  buyAhead?: boolean;
  googleMapsUrl?: string;
  appleMapsUrl?: string;
  websiteUrl?: string;
  ticketUrl?: string;
  uberUrl?: string;
  status: PossiblePlanStatus;
  notes?: string;
}

export type FlightStatus = "confirmed" | "pending" | "delayed" | "boarding";

export interface Flight {
  id: string;
  passengerId: FamilyMemberId;
  passengerName: string;
  route: string;
  from: string;
  to: string;
  flightNumber: string;
  seat?: string;
  terminal?: string;
  gate?: string;
  boardingTime?: string;
  departureTime: string;
  arrivalTime?: string;
  date: string;
  status: FlightStatus;
  confirmationCode?: string;
}

export interface TravelTimelineItem {
  id: string;
  time: string;
  label: string;
  date: string;
  isDeparture?: boolean;
}

export interface Agreement {
  id: string;
  text: string;
  order: number;
}

export interface Memory {
  id: string;
  dayId: string;
  date: string;
  bestMoment?: string;
  bestFood?: string;
  favoritePlace?: string;
  rating?: number;
  notes?: string;
  photoUrl?: string;
}

export interface TripConfig {
  destination: string;
  baseAddress: string;
  startDate: string;
  endDate: string;
  mockToday: string;
}

export interface TripState {
  itineraryEvents: ItineraryEvent[];
  tasks: TripTask[];
  checklistStates: Record<string, boolean>;
  possiblePlanStatuses: Record<string, PossiblePlanStatus>;
  memories: Memory[];
  mockToday: string;
}
