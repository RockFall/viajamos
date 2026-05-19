import { CATEGORY_COLORS, CATEGORY_LABELS } from "@/lib/labels";
import type { EventCategory } from "@/types";

export function CategoryChip({ category }: { category: EventCategory }) {
  return (
    <span className={`chip ${CATEGORY_COLORS[category]}`}>
      {CATEGORY_LABELS[category]}
    </span>
  );
}
