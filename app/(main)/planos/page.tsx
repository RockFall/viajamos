"use client";

import { useState, useMemo } from "react";
import { possiblePlans } from "@/lib/data";
import { useTrip } from "@/context/TripProvider";
import { PossiblePlanCard } from "@/components/cards/PossiblePlanCard";
import { FilterBar } from "@/components/forms/FilterBar";
import { AddToItineraryModal } from "@/components/forms/AddToItineraryModal";
import {
  POSSIBLE_CATEGORY_LABELS,
  INTENSITY_LABELS,
  BEST_FOR_LABELS,
} from "@/lib/labels";
import type { PossiblePlan, BestFor } from "@/types";

export default function PlanosPage() {
  const { possiblePlanStatuses } = useTrip();
  const [category, setCategory] = useState("");
  const [intensity, setIntensity] = useState("");
  const [bestFor, setBestFor] = useState("");
  const [nearbyOnly, setNearbyOnly] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<PossiblePlan | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const plansWithStatus = useMemo(
    () =>
      possiblePlans.map((p) => ({
        ...p,
        status: possiblePlanStatuses[p.id] ?? p.status,
      })),
    [possiblePlanStatuses]
  );

  const filtered = useMemo(() => {
    return plansWithStatus.filter((p) => {
      if (category && p.category !== category) return false;
      if (intensity && p.intensity !== intensity) return false;
      if (bestFor && !p.bestFor.includes(bestFor as BestFor)) return false;
      if (nearbyOnly && !p.isNearby) return false;
      return p.status !== "discarded";
    });
  }, [plansWithStatus, category, intensity, bestFor, nearbyOnly]);

  const nearbyPlans = plansWithStatus.filter((p) => p.isNearby);

  const categoryOptions = Object.entries(POSSIBLE_CATEGORY_LABELS).map(
    ([value, label]) => ({ value, label })
  );
  const intensityOptions = Object.entries(INTENSITY_LABELS).map(
    ([value, label]) => ({ value, label })
  );
  const bestForOptions = Object.entries(BEST_FOR_LABELS).map(
    ([value, label]) => ({ value, label })
  );

  return (
    <div className="space-y-6 pb-4">
      <header>
        <h1 className="text-2xl font-bold text-ocean">Possíveis Planos</h1>
        <p className="text-sm text-muted">
          Curadoria Miami — transforme ideias em roteiro
        </p>
      </header>

      <FilterBar
        label="Categoria"
        options={categoryOptions}
        value={category}
        onChange={setCategory}
      />
      <FilterBar
        label="Intensidade"
        options={intensityOptions}
        value={intensity}
        onChange={setIntensity}
      />
      <FilterBar
        label="Melhor para"
        options={bestForOptions}
        value={bestFor}
        onChange={setBestFor}
      />

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={nearbyOnly}
          onChange={(e) => setNearbyOnly(e.target.checked)}
          className="accent-teal"
        />
        Só perto de casa
      </label>

      {!nearbyOnly && nearbyPlans.length > 0 && (
        <section>
          <h2 className="mb-3 text-lg font-semibold text-teal-dark">
            🏠 Perto da nossa base
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {nearbyPlans.slice(0, 4).map((plan) => (
              <PossiblePlanCard
                key={plan.id}
                plan={plan}
                onAddToItinerary={() => {
                  setSelectedPlan(plan);
                  setModalOpen(true);
                }}
              />
            ))}
          </div>
        </section>
      )}

      <section>
        <h2 className="mb-3 text-lg font-semibold">
          Catálogo ({filtered.length})
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {filtered.map((plan) => (
            <PossiblePlanCard
              key={plan.id}
              plan={plan}
              onAddToItinerary={() => {
                setSelectedPlan(plan);
                setModalOpen(true);
              }}
            />
          ))}
        </div>
      </section>

      <AddToItineraryModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setSelectedPlan(null);
        }}
        plan={selectedPlan}
      />
    </div>
  );
}
