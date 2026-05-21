export type EntityImageKind =
  | "itinerary-events"
  | "night-events"
  | "possible-plans"
  | "trip-days"
  | "essential-places"
  | "alternatives";

export type ImageCategory =
  | "food"
  | "music"
  | "museum"
  | "shopping"
  | "walk"
  | "travel"
  | "rest"
  | "experience"
  | "event"
  | "restaurant"
  | "cafe"
  | "jazz"
  | "electronic_music"
  | "gallery"
  | "bar"
  | "rainy_day"
  | "nearby"
  | "late_night"
  | "electronic"
  | "lodging"
  | "airport"
  | "pharmacy"
  | "market"
  | "hospital"
  | "consulate"
  | "meeting_point"
  | "parking"
  | "area-miami"
  | "area-islamorada"
  | "area-travel"
  | "hero-plans"
  | "hero-night"
  | "default";

export interface ImageManifest {
  version: number;
  generatedAt: string;
  source: string;
  entities: Partial<Record<EntityImageKind, Record<string, string>>>;
  stats: {
    total: number;
    downloaded: number;
    copied: number;
    fallback: number;
  };
}
