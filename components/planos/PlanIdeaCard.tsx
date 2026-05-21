"use client";

import type { PossiblePlan } from "@/types";
import { PlanCategoryIcon } from "@/components/ui/PlanIcons";
import { QuickActions } from "@/components/ui/QuickActions";
import {
  PLAN_STATUS_LABELS,
  POSSIBLE_CATEGORY_LABELS,
  PRICE_LABELS,
} from "@/lib/labels";
import { Clock, MapPin } from "lucide-react";

interface PlanIdeaCardProps {
  plan: PossiblePlan;
  variant?: "compact" | "featured";
  onAddToItinerary: () => void;
}

function StatusPill({ plan }: { plan: PossiblePlan }) {
  if (plan.status === "candidate") return null;
  const tone =
    plan.status === "added_to_itinerary"
      ? "bg-terracotta/15 text-terracotta-deep"
      : plan.status === "shortlisted"
        ? "bg-warm-black/8 text-warm-black"
        : "bg-sand-200 text-muted-foreground";

  return (
    <span
      className={`inline-block rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.12em] ${tone}`}
    >
      {PLAN_STATUS_LABELS[plan.status]}
    </span>
  );
}

export function PlanIdeaCard({
  plan,
  variant = "compact",
  onAddToItinerary,
}: PlanIdeaCardProps) {
  const isFeatured = variant === "featured";

  return (
    <article
      className={`flex h-full min-w-0 flex-col overflow-hidden rounded-[20px] bg-card ring-1 ring-border shadow-[0_12px_28px_-18px_rgba(60,30,20,0.2)] ${
        isFeatured ? "w-full p-5" : "min-w-0 p-3.5"
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div
          className={`grid shrink-0 place-items-center rounded-xl bg-sand-100 text-terracotta ${
            isFeatured ? "size-11" : "size-9"
          }`}
        >
          <PlanCategoryIcon
            category={plan.category}
            size={isFeatured ? 20 : 16}
            strokeWidth={2}
          />
        </div>
        <div className="flex flex-wrap items-center justify-end gap-1">
          {plan.isNearby && (
            <span className="rounded-full bg-terracotta/10 px-2 py-0.5 text-[8px] font-bold uppercase tracking-[0.1em] text-terracotta">
              Perto
            </span>
          )}
          <StatusPill plan={plan} />
        </div>
      </div>

      <p className="mt-2 text-[9px] font-bold uppercase tracking-[0.15em] text-terracotta">
        {POSSIBLE_CATEGORY_LABELS[plan.category]}
      </p>

      <h3
        className={`font-serif leading-[1.1] tracking-tight text-warm-black ${
          isFeatured ? "mt-1 text-[22px]" : "mt-0.5 text-[17px] line-clamp-2"
        }`}
      >
        {plan.title}
      </h3>

      {plan.subtitle && isFeatured && (
        <p className="mt-1 text-sm italic text-muted-foreground">
          {plan.subtitle}
        </p>
      )}

      <p
        className={`text-muted-foreground ${
          isFeatured
            ? "mt-2 text-[13px] leading-relaxed line-clamp-3"
            : "mt-1.5 text-[11px] leading-snug line-clamp-2"
        }`}
      >
        {plan.description}
      </p>

      {plan.whyGo && (
        <p
          className={`italic text-terracotta-deep ${
            isFeatured ? "mt-2 text-xs line-clamp-2" : "mt-1 text-[10px] line-clamp-1"
          }`}
        >
          {plan.whyGo}
        </p>
      )}

      <div
        className={`mt-2 flex flex-wrap gap-x-2 gap-y-0.5 text-[10px] text-muted-foreground ${
          isFeatured ? "" : "min-h-[14px]"
        }`}
      >
        {plan.neighborhood && (
          <span className="flex items-center gap-0.5">
            <MapPin size={10} />
            {plan.neighborhood}
          </span>
        )}
        {plan.estimatedDurationMinutes && (
          <span className="flex items-center gap-0.5">
            <Clock size={10} />
            {plan.estimatedDurationMinutes} min
          </span>
        )}
        {plan.priceLevel && (
          <span>{PRICE_LABELS[plan.priceLevel]}</span>
        )}
      </div>

      {isFeatured && (
        <QuickActions
          googleMapsUrl={plan.googleMapsUrl}
          appleMapsUrl={plan.appleMapsUrl}
          uberUrl={plan.uberUrl}
          websiteUrl={plan.websiteUrl}
          ticketUrl={plan.ticketUrl}
          reservationUrl={plan.reservationUrl}
          className="mt-3 min-w-0"
        />
      )}

      <div className="mt-auto pt-3">
        <button
          type="button"
          onClick={onAddToItinerary}
          className="w-full rounded-full bg-warm-black py-2 text-[10px] font-bold uppercase tracking-[0.18em] text-sand-50 transition active:scale-[0.98]"
        >
          Virar evento
        </button>
      </div>
    </article>
  );
}
