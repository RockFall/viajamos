import type { EventPeriod, ItineraryEvent } from "@/types";
import { PERIOD_LABELS } from "@/lib/labels";
import { PeriodIcon } from "@/components/ui/EventIcons";
import { EventCard } from "./EventCard";

const PERIOD_ACCENT: Record<EventPeriod, string> = {
  morning: "border-terracotta",
  afternoon: "border-sunset",
  night: "border-terracotta-deep",
  late_night: "border-warm-black/40",
};

interface PeriodSectionProps {
  period: EventPeriod;
  events: ItineraryEvent[];
  groupedIds?: Set<string>;
  onEdit?: (event: ItineraryEvent) => void;
  onDelete?: (id: string) => void;
}

export function PeriodSection({
  period,
  events,
  groupedIds,
  onEdit,
  onDelete,
}: PeriodSectionProps) {
  if (events.length === 0) return null;

  return (
    <section className={`border-l-2 pl-4 ${PERIOD_ACCENT[period]}`}>
      <h3 className="mb-3 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.25em] text-muted-foreground">
        <PeriodIcon
          period={period}
          size={14}
          strokeWidth={2.25}
          className="shrink-0 text-terracotta"
        />
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
            />
          );
        })}
      </div>
    </section>
  );
}
