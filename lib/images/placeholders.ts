import type { ImageCategory } from "./types";

/** Local placeholder paths under public/images/placeholders/ */
export const PLACEHOLDER_PATHS: Record<ImageCategory, string> = {
  food: "/images/placeholders/food.webp",
  restaurant: "/images/placeholders/food.webp",
  cafe: "/images/placeholders/cafe.webp",
  music: "/images/placeholders/music.webp",
  jazz: "/images/placeholders/jazz.webp",
  electronic_music: "/images/placeholders/electronic.webp",
  electronic: "/images/placeholders/electronic.webp",
  museum: "/images/placeholders/museum.webp",
  gallery: "/images/placeholders/gallery.webp",
  shopping: "/images/placeholders/shopping.webp",
  walk: "/images/placeholders/walk.webp",
  bar: "/images/placeholders/bar.webp",
  experience: "/images/placeholders/experience.webp",
  event: "/images/placeholders/experience.webp",
  travel: "/images/placeholders/travel.webp",
  rest: "/images/placeholders/walk.webp",
  rainy_day: "/images/placeholders/museum.webp",
  nearby: "/images/placeholders/nearby.webp",
  late_night: "/images/placeholders/late-night.webp",
  lodging: "/images/placeholders/lodging.webp",
  airport: "/images/placeholders/airport.webp",
  pharmacy: "/images/placeholders/pharmacy.webp",
  market: "/images/placeholders/market.webp",
  hospital: "/images/placeholders/pharmacy.webp",
  consulate: "/images/placeholders/travel.webp",
  meeting_point: "/images/placeholders/nearby.webp",
  parking: "/images/placeholders/nearby.webp",
  "area-miami": "/images/heroes/miami.webp",
  "area-islamorada": "/images/heroes/islamorada.webp",
  "area-travel": "/images/heroes/travel.webp",
  "hero-plans": "/images/heroes/plans-hero.webp",
  "hero-night": "/images/heroes/night.webp",
  default: "/images/placeholders/default.webp",
};

export function placeholderForCategory(
  category?: string | null
): string {
  if (!category) return PLACEHOLDER_PATHS.default;

  const triggerMap: Record<string, ImageCategory> = {
    rain: "rainy_day",
    tired: "rest",
    late_start: "travel",
    too_hot: "walk",
    reservation_failed: "nearby",
    extra_energy: "electronic",
  };
  const mapped = triggerMap[category];
  if (mapped) return PLACEHOLDER_PATHS[mapped];

  const key = category as ImageCategory;
  return PLACEHOLDER_PATHS[key] ?? PLACEHOLDER_PATHS.default;
}

export function placeholderForTripArea(
  area?: "Miami" | "Islamorada" | "Travel" | null
): string {
  if (area === "Islamorada") return PLACEHOLDER_PATHS["area-islamorada"];
  if (area === "Travel") return PLACEHOLDER_PATHS["area-travel"];
  return PLACEHOLDER_PATHS["area-miami"];
}
