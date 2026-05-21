import type { FamilyMember, FamilyMemberId } from "@/types";

/** Primeira letra do nome curto (ex.: Caio → C, Sofia → S) */
export function getFamilyInitial(
  member: Pick<FamilyMember, "shortName" | "name">
): string {
  const label = (member.shortName || member.name).trim();
  return label.charAt(0).toUpperCase();
}

/** Fallback quando só há o id (ex.: filtros estáticos) */
export const FAMILY_INITIALS: Record<FamilyMemberId, string> = {
  caio: "C",
  geovanin: "G",
  adelaide: "A",
  sofia: "S",
};
