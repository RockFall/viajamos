import type { ComponentType } from "react";
import type { LucideProps } from "lucide-react";
import {
  UtensilsCrossed,
  Coffee,
  Music,
  Disc3,
  Landmark,
  Palette,
  ShoppingBag,
  Footprints,
  Wine,
  Sparkles,
  CloudRain,
  MapPin,
  Moon,
  Feather,
  Gauge,
  Flame,
} from "lucide-react";
import type { Intensity, PossiblePlanCategory } from "@/types";

type IconProps = LucideProps;

const CATEGORY_ICON_MAP: Record<
  PossiblePlanCategory,
  ComponentType<IconProps>
> = {
  restaurant: UtensilsCrossed,
  cafe: Coffee,
  jazz: Music,
  electronic_music: Disc3,
  museum: Landmark,
  gallery: Palette,
  shopping: ShoppingBag,
  walk: Footprints,
  bar: Wine,
  experience: Sparkles,
  rainy_day: CloudRain,
  nearby: MapPin,
  late_night: Moon,
};

const INTENSITY_ICON_MAP: Record<Intensity, ComponentType<IconProps>> = {
  light: Feather,
  moderate: Gauge,
  intense: Flame,
};

export function PlanCategoryIcon({
  category,
  ...props
}: IconProps & { category: PossiblePlanCategory }) {
  const Icon = CATEGORY_ICON_MAP[category];
  return <Icon {...props} />;
}

export function IntensityIcon({
  intensity,
  ...props
}: IconProps & { intensity: Intensity }) {
  const Icon = INTENSITY_ICON_MAP[intensity];
  return <Icon {...props} />;
}

export const PLAN_CATEGORIES = Object.keys(
  CATEGORY_ICON_MAP
) as PossiblePlanCategory[];

export const PLAN_INTENSITIES: Intensity[] = ["light", "moderate", "intense"];
