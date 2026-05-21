"use client";

import type { FamilyMember, ItineraryEvent } from "@/types";
import { getFamilyInitial } from "@/lib/family-initials";
import { SectionLabel } from "./SectionLabel";

type RowTone = "default" | "accent" | "muted";

function rowTone(event: ItineraryEvent | null): RowTone {
  if (!event) return "muted";
  if (event.category === "rest" || event.status === "done") return "muted";
  if (
    event.status === "reserved" ||
    event.status === "booked" ||
    event.category === "food"
  ) {
    return "accent";
  }
  return "default";
}

function PersonRow({
  member,
  event,
  divider,
}: {
  member: FamilyMember;
  event: ItineraryEvent | null;
  divider: boolean;
}) {
  const tone = rowTone(event);
  const pill =
    tone === "accent"
      ? "bg-terracotta text-white"
      : tone === "muted"
        ? "bg-sand-200 text-warm-black/70"
        : "bg-card text-warm-black ring-1 ring-border";

  const location =
    event?.locationName ?? event?.neighborhood ?? "Livre por agora";
  const status = event?.title ?? "Sem plano fixo";

  return (
    <div
      className={`flex items-center justify-between gap-3 px-4 py-3.5 ${
        divider ? "border-b border-border/60" : ""
      }`}
    >
      <div className="flex min-w-0 items-center gap-3">
        <div className="grid size-10 shrink-0 place-items-center rounded-full bg-sand-200 font-serif text-base italic text-warm-black ring-2 ring-card">
          {getFamilyInitial(member)}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold tracking-tight">
            {member.shortName}
          </p>
          <p className="truncate text-[11px] text-muted-foreground">
            {location}
          </p>
        </div>
      </div>
      <span
        className={`shrink-0 max-w-[42%] truncate rounded-full px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider ${pill}`}
      >
        {status}
      </span>
    </div>
  );
}

interface PersonWhereListProps {
  family: FamilyMember[];
  getEvent: (memberId: FamilyMember["id"]) => ItineraryEvent | null;
}

export function PersonWhereList({ family, getEvent }: PersonWhereListProps) {
  return (
    <section>
      <SectionLabel left="Quem está onde" right="Ao vivo" />
      <div className="mt-5 overflow-hidden rounded-[24px] bg-card/70 ring-1 ring-border backdrop-blur-sm">
        {family.map((member, i) => (
          <PersonRow
            key={member.id}
            member={member}
            event={getEvent(member.id)}
            divider={i < family.length - 1}
          />
        ))}
      </div>
    </section>
  );
}
