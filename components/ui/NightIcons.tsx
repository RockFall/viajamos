import type { ComponentType } from "react";
import type { LucideProps } from "lucide-react";
import {
  Music,
  Disc3,
  Wine,
  UtensilsCrossed,
  LayoutGrid,
} from "lucide-react";
import type { NightEventType } from "@/types";

type IconProps = LucideProps;

const NIGHT_TYPE_ICON_MAP: Record<
  NightEventType,
  ComponentType<IconProps>
> = {
  jazz: Music,
  electronic: Disc3,
  bar: Wine,
  late_food: UtensilsCrossed,
};

export function NightTypeIcon({
  type,
  ...props
}: IconProps & { type: NightEventType }) {
  const Icon = NIGHT_TYPE_ICON_MAP[type];
  return <Icon {...props} />;
}

export function NightTypeAllIcon(props: IconProps) {
  return <LayoutGrid {...props} />;
}

export const NIGHT_TYPES = Object.keys(
  NIGHT_TYPE_ICON_MAP
) as NightEventType[];
