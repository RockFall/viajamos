import type { ComponentType } from "react";
import type { LucideProps } from "lucide-react";
import {
  Sun,
  CloudSun,
  Moon,
  Sparkles,
  UtensilsCrossed,
  Music,
  Landmark,
  ShoppingBag,
  Footprints,
  Plane,
  Coffee,
  Star,
  Ticket,
} from "lucide-react";
import type { EventCategory, EventPeriod } from "@/types";

type IconProps = LucideProps;

const PERIOD_ICON_MAP: Record<EventPeriod, ComponentType<IconProps>> = {
  morning: Sun,
  afternoon: CloudSun,
  night: Moon,
  late_night: Sparkles,
};

const CATEGORY_ICON_MAP: Record<EventCategory, ComponentType<IconProps>> = {
  food: UtensilsCrossed,
  music: Music,
  museum: Landmark,
  shopping: ShoppingBag,
  walk: Footprints,
  travel: Plane,
  rest: Coffee,
  experience: Star,
  event: Ticket,
};

export function PeriodIcon({
  period,
  ...props
}: IconProps & { period: EventPeriod }) {
  const Icon = PERIOD_ICON_MAP[period];
  return <Icon {...props} />;
}

export function CategoryIcon({
  category,
  ...props
}: IconProps & { category: EventCategory }) {
  const Icon = CATEGORY_ICON_MAP[category];
  return <Icon {...props} />;
}
