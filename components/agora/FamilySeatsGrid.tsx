"use client";

import type { FamilyMember, Flight } from "@/types";

interface FamilySeatsGridProps {
  family: FamilyMember[];
  flights: Flight[];
}

export function FamilySeatsGrid({ family, flights }: FamilySeatsGridProps) {
  const seats = family.map((member) => {
    const flight = flights.find((f) => f.passengerId === member.id);
    const raw = flight?.seat;
    const seat =
      raw && !/^(a definir|—|-)$/i.test(raw.trim())
        ? raw.slice(0, 4)
        : "—";
    return { id: member.id, name: member.shortName, seat };
  });

  return (
    <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4">
      {seats.map((s) => (
        <div
          key={s.id}
          className="rounded-2xl bg-sand-50/[0.05] p-3 text-center ring-1 ring-sand-50/10"
        >
          <p className="font-serif text-2xl leading-none">{s.seat}</p>
          <p className="mt-1 text-[10px] uppercase tracking-[0.15em] text-sand-200/60">
            {s.name}
          </p>
        </div>
      ))}
    </div>
  );
}
