"use client";

import { useTrip } from "@/context/TripProvider";
import { getFamilyInitial } from "@/lib/family-initials";
import type { FamilyMemberId } from "@/types";

interface FamilyAvatarsProps {
  people: FamilyMemberId[];
  size?: "sm" | "md";
  ringClass?: string;
  className?: string;
}

const SIZES = {
  sm: "size-7 text-[11px] ring-2",
  md: "size-10 text-base ring-2",
};

export function FamilyAvatars({
  people,
  size = "sm",
  ringClass = "ring-card",
  className = "",
}: FamilyAvatarsProps) {
  const { getFamilyMember } = useTrip();

  if (people.length === 0) return null;

  return (
    <div className={`flex shrink-0 -space-x-2 ${className}`}>
      {people.map((id) => {
        const member = getFamilyMember(id);
        if (!member) return null;
        return (
          <span
            key={id}
            title={member.name}
            className={`grid place-items-center rounded-full bg-sand-200 font-serif italic text-warm-black ${SIZES[size]} ${ringClass}`}
          >
            {getFamilyInitial(member)}
          </span>
        );
      })}
    </div>
  );
}
