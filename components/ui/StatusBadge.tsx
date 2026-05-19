import { STATUS_COLORS, STATUS_LABELS } from "@/lib/labels";
import type { EventStatus } from "@/types";

export function StatusBadge({ status }: { status: EventStatus }) {
  return (
    <span className={`chip ${STATUS_COLORS[status]}`}>
      {STATUS_LABELS[status]}
    </span>
  );
}
