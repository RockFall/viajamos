"use client";

import type { PossiblePlan } from "@/types";
import { SectionLabel } from "@/components/agora/SectionLabel";
import { PlanIdeaCard } from "./PlanIdeaCard";

interface PlanosGalleryProps {
  featured: PossiblePlan[];
  rest: PossiblePlan[];
  onAddToItinerary: (plan: PossiblePlan) => void;
  onClearFilters: () => void;
}

export function PlanosGallery({
  featured,
  rest,
  onAddToItinerary,
  onClearFilters,
}: PlanosGalleryProps) {
  const featuredIds = new Set(featured.map((p) => p.id));
  const gridPlans = rest.filter((p) => !featuredIds.has(p.id));

  if (featured.length === 0 && gridPlans.length === 0) {
    return (
      <section className="rounded-[24px] bg-card/80 p-8 text-center ring-1 ring-border">
        <p className="font-serif text-xl italic text-warm-black">
          Nenhuma ideia com esses filtros
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          Tente outra categoria ou intensidade.
        </p>
        <button
          type="button"
          onClick={onClearFilters}
          className="mt-4 rounded-full bg-terracotta px-5 py-2 text-[11px] font-bold uppercase tracking-[0.15em] text-sand-50"
        >
          Limpar filtros
        </button>
      </section>
    );
  }

  return (
    <div className="min-w-0 space-y-8">
      {featured.length > 0 && (
        <section className="min-w-0">
          <SectionLabel
            left="Destaques"
            right={`${featured.length} ideias`}
          />
          <div className="mt-4 min-w-0 max-w-full overflow-x-auto overscroll-x-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <div className="flex snap-x snap-mandatory gap-3 px-1 pb-1">
              {featured.map((plan) => (
                <div
                  key={plan.id}
                  className="w-[17.5rem] max-w-[calc(100%-0.5rem)] shrink-0 snap-start"
                >
                  <PlanIdeaCard
                    plan={plan}
                    variant="featured"
                    onAddToItinerary={() => onAddToItinerary(plan)}
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {gridPlans.length > 0 && (
        <section className="min-w-0">
          <SectionLabel
            left={featured.length > 0 ? "Mais ideias" : "Todas as ideias"}
            right={`${gridPlans.length}`}
          />
          <div className="mt-4 grid min-w-0 grid-cols-2 gap-3">
            {gridPlans.map((plan) => (
              <PlanIdeaCard
                key={plan.id}
                plan={plan}
                variant="compact"
                onAddToItinerary={() => onAddToItinerary(plan)}
              />
            ))}
          </div>
        </section>
      )}

      <section className="rounded-[28px] bg-accent/60 p-6 ring-1 ring-border">
        <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-terracotta-deep">
          Como funciona
        </p>
        <h3 className="mt-2 font-serif text-2xl leading-tight text-warm-black">
          Vire uma ideia em evento confirmado
        </h3>
        <p className="mt-2 text-[13px] leading-relaxed text-warm-black/70">
          Toque em &quot;Virar evento&quot;, escolha o dia e quem vai. A ideia
          aparece no roteiro — ainda dá para editar horário e detalhes lá.
        </p>
      </section>
    </div>
  );
}
