"use client";

import { TABLE_BY_ID, type TableId } from "@/lib/settings/table-registry";
import { GenericTableEditor } from "./GenericTableEditor";
import { ItineraryEventEditor } from "./ItineraryEventEditor";
import { NightEventEditor } from "./NightEventEditor";
import { PossiblePlanEditor } from "./PossiblePlanEditor";
import { TripContentEditor } from "./TripContentEditor";

export function TableEditorView({
  tableId,
  onFlash,
}: {
  tableId: TableId;
  onFlash: (msg: string) => void;
}) {
  const table = TABLE_BY_ID[tableId];
  if (!table) return null;

  if (table.dedicatedEditor === "trip_content") {
    return (
      <div className="card border-terracotta/20 p-4">
        <TripContentEditor />
      </div>
    );
  }
  if (table.dedicatedEditor === "itinerary") {
    return <ItineraryEventEditor onFlash={onFlash} />;
  }
  if (table.dedicatedEditor === "possible_plan") {
    return <PossiblePlanEditor onFlash={onFlash} />;
  }
  if (table.dedicatedEditor === "night_event") {
    return <NightEventEditor onFlash={onFlash} />;
  }

  return <GenericTableEditor tableId={tableId} onFlash={onFlash} />;
}
