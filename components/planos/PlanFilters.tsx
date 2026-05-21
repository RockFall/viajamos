"use client";

import { LayoutGrid, MapPin, SlidersHorizontal } from "lucide-react";
import {
  PLAN_CATEGORIES,
  PLAN_INTENSITIES,
  IntensityIcon,
  PlanCategoryIcon,
} from "@/components/ui/PlanIcons";
import { FAMILY_INITIALS } from "@/lib/family-initials";
import {
  INTENSITY_LABELS,
  POSSIBLE_CATEGORY_LABELS,
  RESTAURANT_CUISINE_LABELS,
} from "@/lib/labels";
import { RESTAURANT_CUISINES } from "@/lib/planos/restaurant-cuisines";
import type { BestFor } from "@/types";

const BEST_FOR_OPTIONS: { value: BestFor; label: string }[] = [
  { value: "everyone", label: "Todos" },
  { value: "family", label: "FF" },
  { value: "caio", label: "C" },
  { value: "geovanin", label: "G" },
  { value: "adelaide", label: "A" },
  { value: "sofia", label: "S" },
];

interface PlanFiltersProps {
  category: string;
  cuisine: string;
  intensity: string;
  bestFor: string;
  nearbyOnly: boolean;
  onCategoryChange: (value: string) => void;
  onCuisineChange: (value: string) => void;
  onIntensityChange: (value: string) => void;
  onBestForChange: (value: string) => void;
  onNearbyOnlyChange: (value: boolean) => void;
}

function labeledFilterBtn(active: boolean) {
  return `flex min-w-[3rem] shrink-0 flex-col items-center justify-center gap-0.5 rounded-2xl px-1 py-1.5 transition active:scale-[0.97] ${
    active
      ? "bg-warm-black text-sand-50 ring-1 ring-warm-black"
      : "bg-card text-warm-black ring-1 ring-border hover:bg-accent"
  }`;
}

export function PlanFilters({
  category,
  cuisine,
  intensity,
  bestFor,
  nearbyOnly,
  onCategoryChange,
  onCuisineChange,
  onIntensityChange,
  onBestForChange,
  onNearbyOnlyChange,
}: PlanFiltersProps) {
  return (
    <div className="min-w-0 space-y-4">
      <div className="min-w-0">
        <p className="mb-2 px-1 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
          Categoria
        </p>
        <div className="min-w-0 max-w-full overflow-x-auto overscroll-x-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="flex w-max gap-2 pr-1">
            <button
              type="button"
              title="Todas as categorias"
              aria-label="Todas as categorias"
              onClick={() => onCategoryChange("")}
              className={labeledFilterBtn(category === "")}
            >
              <LayoutGrid size={18} strokeWidth={2} />
              <span className="max-w-[3.25rem] text-center text-[8px] font-medium leading-[1.15] tracking-tight">
                Todas
              </span>
            </button>
            {PLAN_CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                title={POSSIBLE_CATEGORY_LABELS[cat]}
                aria-label={POSSIBLE_CATEGORY_LABELS[cat]}
                aria-pressed={category === cat}
                onClick={() =>
                  onCategoryChange(category === cat ? "" : cat)
                }
                className={labeledFilterBtn(category === cat)}
              >
                <PlanCategoryIcon category={cat} size={18} strokeWidth={2} />
                <span className="max-w-[3.25rem] text-center text-[8px] font-medium leading-[1.15] tracking-tight">
                  {POSSIBLE_CATEGORY_LABELS[cat]}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {category === "restaurant" && (
        <div className="min-w-0">
          <p className="mb-2 px-1 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
            Cozinha
          </p>
          <div className="min-w-0 max-w-full overflow-x-auto overscroll-x-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <div className="flex w-max gap-2 pr-1">
              <button
                type="button"
                title="Todas as cozinhas"
                aria-label="Todas as cozinhas"
                onClick={() => onCuisineChange("")}
                className={`shrink-0 rounded-full px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.12em] transition ${
                  cuisine === ""
                    ? "bg-warm-black text-sand-50"
                    : "bg-card text-warm-black ring-1 ring-border"
                }`}
              >
                Todas
              </button>
              {RESTAURANT_CUISINES.map((c) => (
                <button
                  key={c}
                  type="button"
                  title={RESTAURANT_CUISINE_LABELS[c]}
                  aria-label={RESTAURANT_CUISINE_LABELS[c]}
                  aria-pressed={cuisine === c}
                  onClick={() => onCuisineChange(cuisine === c ? "" : c)}
                  className={`shrink-0 rounded-full px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.12em] transition ${
                    cuisine === c
                      ? "bg-terracotta text-sand-50"
                      : "bg-card text-warm-black ring-1 ring-border"
                  }`}
                >
                  {RESTAURANT_CUISINE_LABELS[c]}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <div>
        <p className="mb-2 px-1 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
          Intensidade
        </p>
        <div className="min-w-0 max-w-full overflow-x-auto overscroll-x-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="flex w-max gap-2 pr-1">
          <button
            type="button"
            title="Qualquer intensidade"
            aria-label="Qualquer intensidade"
            onClick={() => onIntensityChange("")}
            className={labeledFilterBtn(intensity === "")}
          >
            <SlidersHorizontal size={18} strokeWidth={2} />
            <span className="max-w-[3.25rem] text-center text-[8px] font-medium leading-[1.15] tracking-tight">
              Todas
            </span>
          </button>
          {PLAN_INTENSITIES.map((level) => (
            <button
              key={level}
              type="button"
              title={INTENSITY_LABELS[level]}
              aria-label={INTENSITY_LABELS[level]}
              aria-pressed={intensity === level}
              onClick={() =>
                onIntensityChange(intensity === level ? "" : level)
              }
              className={labeledFilterBtn(intensity === level)}
            >
              <IntensityIcon intensity={level} size={18} strokeWidth={2} />
              <span className="max-w-[3.25rem] text-center text-[8px] font-medium leading-[1.15] tracking-tight">
                {INTENSITY_LABELS[level]}
              </span>
            </button>
          ))}
          </div>
        </div>
      </div>

      <div className="min-w-0">
        <p className="mb-2 px-1 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
          Melhor para
        </p>
        <div className="min-w-0 max-w-full overflow-x-auto overscroll-x-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="flex w-max gap-2 pr-1">
            <button
              type="button"
              onClick={() => onBestForChange("")}
              className={`shrink-0 rounded-full px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.15em] transition ${
                bestFor === ""
                  ? "bg-warm-black text-sand-50"
                  : "bg-card text-warm-black ring-1 ring-border"
              }`}
            >
              Todos
            </button>
            {BEST_FOR_OPTIONS.filter((o) => o.value !== "everyone").map(
              (opt) => {
                const initial =
                  opt.value in FAMILY_INITIALS
                    ? FAMILY_INITIALS[opt.value as keyof typeof FAMILY_INITIALS]
                    : opt.label;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() =>
                      onBestForChange(bestFor === opt.value ? "" : opt.value)
                    }
                    className={`flex size-9 shrink-0 items-center justify-center rounded-full text-[11px] font-bold transition ${
                      bestFor === opt.value
                        ? "bg-terracotta text-sand-50"
                        : "bg-card text-warm-black ring-1 ring-border"
                    }`}
                    title={opt.label}
                    aria-label={opt.label}
                  >
                    {initial}
                  </button>
                );
              }
            )}
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={() => onNearbyOnlyChange(!nearbyOnly)}
        aria-pressed={nearbyOnly}
        className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.12em] transition ${
          nearbyOnly
            ? "bg-warm-black text-sand-50"
            : "bg-card text-warm-black ring-1 ring-border"
        }`}
      >
        <MapPin size={14} />
        Perto da base
      </button>
    </div>
  );
}
