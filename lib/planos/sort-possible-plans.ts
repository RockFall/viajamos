import type { Intensity, PossiblePlan, PossiblePlanCategory } from "@/types";

const INTENSITY_RANK: Record<Intensity, number> = {
  light: 0,
  moderate: 1,
  intense: 2,
};

const CATEGORY_RANK: Partial<Record<PossiblePlanCategory, number>> = {
  cafe: 0,
  restaurant: 1,
  museum: 2,
  gallery: 3,
  walk: 4,
  experience: 5,
  shopping: 6,
  bar: 7,
  jazz: 8,
  nearby: 9,
  rainy_day: 10,
  electronic_music: 20,
  late_night: 21,
};

/** Lower score = shown earlier. Family-friendly and light plans first. */
function planSortScore(plan: PossiblePlan): number {
  let score = CATEGORY_RANK[plan.category] ?? 12;
  score += INTENSITY_RANK[plan.intensity] * 2;

  if (plan.bestFor.includes("family")) score -= 50;
  if (plan.bestFor.includes("everyone")) score -= 40;
  if (plan.bestFor.includes("geovanin") || plan.bestFor.includes("adelaide")) {
    score -= 10;
  }

  const adultsOnly =
    plan.bestFor.includes("adults") &&
    !plan.bestFor.includes("family") &&
    !plan.bestFor.includes("everyone");
  if (adultsOnly) score += 8;

  const coupleOnly =
    plan.bestFor.length <= 2 &&
    plan.bestFor.every((b) => b === "caio" || b === "sofia" || b === "caio_sofia");
  if (coupleOnly && !plan.bestFor.includes("family")) score += 12;

  if (plan.category === "electronic_music") score += 30;

  if (plan.isNearby) score -= 3;
  if (plan.status === "shortlisted") score -= 2;

  return score;
}

export function sortPossiblePlans(plans: PossiblePlan[]): PossiblePlan[] {
  return [...plans].sort((a, b) => {
    const diff = planSortScore(a) - planSortScore(b);
    if (diff !== 0) return diff;
    return a.title.localeCompare(b.title, "pt-BR");
  });
}
