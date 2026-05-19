import type { EventPeriod, ItineraryEvent } from "@/types";
import { PERIOD_ICONS, PERIOD_LABELS } from "@/lib/labels";
import { EventCard } from "./EventCard";

interface PeriodSectionProps {
  period: EventPeriod;
  events: ItineraryEvent[];
  groupedIds?: Set<string>;
  onEdit?: (event: ItineraryEvent) => void;
  onDelete?: (id: string) => void;
  onStatusChange?: (id: string, status: ItineraryEvent["status"]) => void;
}

export function PeriodSection({
  period,
  events,
  groupedIds,
  onEdit,
  onDelete,
  onStatusChange,
}: PeriodSectionProps) {
  if (events.length === 0) return null;

  const periodClass = `period-${period}`;

  return (
    <section className={`${periodClass} pl-4`}>
      <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-muted">
        <span>{PERIOD_ICONS[period]}</span>
        {PERIOD_LABELS[period]}
      </h3>
      <div className="space-y-3">
        {events.map((event) => {
          if (groupedIds?.has(event.id)) return null;
          return (
            <EventCard
              key={event.id}
              event={event}
              onEdit={onEdit ? () => onEdit(event) : undefined}
              onDelete={onDelete ? () => onDelete(event.id) : undefined}
              onStatusChange={
                onStatusChange
                  ? (s) => onStatusChange(event.id, s)
                  : undefined
              }
            />
          );
        })}
      </div>
    </section>
  );
}
