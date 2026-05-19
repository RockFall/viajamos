"use client";

import type { PossiblePlan } from "@/types";
import {
  POSSIBLE_CATEGORY_LABELS,
  INTENSITY_LABELS,
  BEST_FOR_LABELS,
  PRICE_LABELS,
  PLAN_STATUS_LABELS,
} from "@/lib/labels";
import { QuickActions } from "@/components/ui/QuickActions";
import { MapPin, Clock, Plus } from "lucide-react";

interface PossiblePlanCardProps {
  plan: PossiblePlan;
  onAddToItinerary: () => void;
}

export function PossiblePlanCard({ plan, onAddToItinerary }: PossiblePlanCardProps) {
  return (
    <article className="card flex flex-col overflow-hidden transition hover:shadow-md">
      <div className="gradient-miami h-2" />
      <div className="flex flex-1 flex-col p-4">
        <div className="flex flex-wrap gap-1">
          <span className="chip bg-coral/10 text-coral text-xs">
            {POSSIBLE_CATEGORY_LABELS[plan.category]}
          </span>
          {plan.isNearby && (
            <span className="chip bg-teal/10 text-teal-dark text-xs">
              Perto de casa
            </span>
          )}
          <span className="chip bg-zinc-100 text-zinc-600 text-xs">
            {PLAN_STATUS_LABELS[plan.status]}
          </span>
        </div>
        <h3 className="mt-2 text-lg font-bold">{plan.title}</h3>
        {plan.subtitle && (
          <p className="text-sm text-coral">{plan.subtitle}</p>
        )}
        <p className="mt-2 flex-1 text-sm text-muted">{plan.description}</p>
        {plan.whyGo && (
          <p className="mt-2 text-sm italic text-teal-dark">
            ✦ {plan.whyGo}
          </p>
        )}
        <div className="mt-3 flex flex-wrap gap-2 text-xs text-muted">
          {plan.neighborhood && (
            <span className="flex items-center gap-1">
              <MapPin size={12} />
              {plan.neighborhood}
            </span>
          )}
          {plan.estimatedDurationMinutes && (
            <span className="flex items-center gap-1">
              <Clock size={12} />
              {plan.estimatedDurationMinutes} min
            </span>
          )}
          {plan.priceLevel && (
            <span>{PRICE_LABELS[plan.priceLevel]}</span>
          )}
          <span>{INTENSITY_LABELS[plan.intensity]}</span>
        </div>
        <div className="mt-2 flex flex-wrap gap-1">
          {plan.bestFor.map((bf) => (
            <span
              key={bf}
              className="rounded-full bg-ocean/10 px-2 py-0.5 text-xs text-ocean"
            >
              {BEST_FOR_LABELS[bf]}
            </span>
          ))}
        </div>
        {plan.tags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {plan.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs text-zinc-500"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
        <QuickActions
          googleMapsUrl={plan.googleMapsUrl}
          appleMapsUrl={plan.appleMapsUrl}
          uberUrl={plan.uberUrl}
          websiteUrl={plan.websiteUrl}
          ticketUrl={plan.ticketUrl}
          reservationUrl={plan.reservationUrl}
          compact
        />
        <button
          type="button"
          onClick={onAddToItinerary}
          className="mt-3 flex w-full items-center justify-center gap-1 rounded-xl bg-coral py-2.5 text-sm font-semibold text-white transition active:scale-[0.98]"
        >
          <Plus size={16} />
          Adicionar ao roteiro
        </button>
      </div>
    </article>
  );
}
