"use client";

import { useState, useMemo, useCallback } from "react";
import { useTrip } from "@/context/TripProvider";
import { AddToItineraryModal } from "@/components/forms/AddToItineraryModal";
import { PlanosHeader } from "@/components/planos/PlanosHeader";
import { PlanFilters } from "@/components/planos/PlanFilters";
import { PlanosGallery } from "@/components/planos/PlanosGallery";
import type { PossiblePlan, BestFor } from "@/types";

export default function PlanosPage() {
  const { possiblePlans, isHydrated } = useTrip();
  const [category, setCategory] = useState("");
  const [intensity, setIntensity] = useState("");
  const [bestFor, setBestFor] = useState("");
  const [nearbyOnly, setNearbyOnly] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<PossiblePlan | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const activePlans = useMemo(
    () => possiblePlans.filter((p) => p.status !== "discarded"),
    [possiblePlans]
  );

  const filtered = useMemo(() => {
    return activePlans.filter((p) => {
      if (category && p.category !== category) return false;
      if (intensity && p.intensity !== intensity) return false;
      if (bestFor && !p.bestFor.includes(bestFor as BestFor)) return false;
      if (nearbyOnly && !p.isNearby) return false;
      return true;
    });
  }, [activePlans, category, intensity, bestFor, nearbyOnly]);

  const featured = useMemo(
    () =>
      filtered.filter(
        (p) => p.status === "shortlisted" || p.isNearby
      ),
    [filtered]
  );

  const clearFilters = useCallback(() => {
    setCategory("");
    setIntensity("");
    setBestFor("");
    setNearbyOnly(false);
  }, []);

  const openModal = (plan: PossiblePlan) => {
    setSelectedPlan(plan);
    setModalOpen(true);
  };

  if (!isHydrated) {
    return (
      <div className="miami-gradient -mx-4 -mt-4 flex min-h-screen min-w-0 items-center justify-center pb-36 text-muted-foreground">
        <p className="text-sm">Carregando planos…</p>
      </div>
    );
  }

  return (
    <div className="miami-gradient -mx-4 -mt-4 min-h-screen min-w-0 pb-36 text-warm-black">
      <PlanosHeader ideaCount={activePlans.length} />

      <main className="mx-auto mt-6 w-full min-w-0 max-w-[48ch] space-y-8 px-6">
        <PlanFilters
          category={category}
          intensity={intensity}
          bestFor={bestFor}
          nearbyOnly={nearbyOnly}
          onCategoryChange={setCategory}
          onIntensityChange={setIntensity}
          onBestForChange={setBestFor}
          onNearbyOnlyChange={setNearbyOnly}
        />

        <PlanosGallery
          featured={featured}
          rest={filtered}
          onAddToItinerary={openModal}
          onClearFilters={clearFilters}
        />
      </main>

      <AddToItineraryModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        plan={selectedPlan ?? undefined}
      />
    </div>
  );
}
