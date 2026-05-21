import manifestData from "./manifest.json";
import {
  placeholderForCategory,
  placeholderForTripArea,
} from "./placeholders";
import type { EntityImageKind, ImageManifest } from "./types";

const manifest = manifestData as ImageManifest;

export function resolveEntityImage(
  kind: EntityImageKind,
  id: string,
  category?: string | null
): string {
  const entityPath = manifest.entities[kind]?.[id];
  if (entityPath) return entityPath;
  return placeholderForCategory(category);
}

export function resolveTripDayImage(
  dayId: string,
  area?: "Miami" | "Islamorada" | "Travel" | null
): string {
  const entityPath = manifest.entities["trip-days"]?.[dayId];
  if (entityPath) return entityPath;
  return placeholderForTripArea(area);
}

export function resolveHeroImage(
  variant: "plans" | "night" | "miami" | "islamorada" | "travel"
): string {
  switch (variant) {
    case "plans":
      return "/images/heroes/plans-hero.webp";
    case "night":
      return "/images/heroes/night.webp";
    case "islamorada":
      return "/images/heroes/islamorada.webp";
    case "travel":
      return "/images/heroes/travel.webp";
    default:
      return "/images/heroes/miami.webp";
  }
}

export function getImageManifestStats(): ImageManifest["stats"] {
  return manifest.stats;
}
