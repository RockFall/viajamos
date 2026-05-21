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
} from "@/lib/labels";
import type { BestFor } from "@/types";

const BEST_FOR_OPTIONS: { value: BestFor; label: string }[] = [
  { value: "everyone", label: "Todos" },
  { value: "family", label: "Família" },
  { value: "caio", label: "C" },
  { value: "geovanin", label: "G" },
  { value: "adelaide", label: "A" },
  { value: "sofia", label: "S" },
  { value: "adults", label: "GP" },
  { value: "caio_sofia", label: "C+S" },
];

interface PlanFiltersProps {
  category: string;
  intensity: string;
  bestFor: string;
  nearbyOnly: boolean;
  onCategoryChange: (value: string) => void;
  onIntensityChange: (value: string) => void;
  onBestForChange: (value: string) => void;
  onNearbyOnlyChange: (value: boolean) => void;
}

function iconBtn(active: boolean) {
  return `flex size-11 shrink-0 items-center justify-center rounded-2xl transition active:scale-[0.97] ${
    active
      ? "bg-warm-black text-sand-50 ring-1 ring-warm-black"
      : "bg-card text-warm-black ring-1 ring-border hover:bg-accent"
  }`;
}

export function PlanFilters({
  category,
  intensity,
  bestFor,
  nearbyOnly,
  onCategoryChange,
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
        <div className="-mx-6 min-w-0 overflow-x-auto overscroll-x-contain px-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="flex w-max gap-2 pr-1">
            <button
              type="button"
              title="Todas as categorias"
              aria-label="Todas as categorias"
              onClick={() => onCategoryChange("")}
              className={iconBtn(category === "")}
            >
              <LayoutGrid size={18} strokeWidth={2} />
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
                className={iconBtn(category === cat)}
              >
                <PlanCategoryIcon category={cat} size={18} strokeWidth={2} />
              </button>
            ))}
          </div>
        </div>
      </div>

      <div>
        <p className="mb-2 px-1 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
          Intensidade
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            title="Qualquer intensidade"
            aria-label="Qualquer intensidade"
            onClick={() => onIntensityChange("")}
            className={iconBtn(intensity === "")}
          >
            <SlidersHorizontal size={18} strokeWidth={2} />
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
              className={iconBtn(intensity === level)}
            >
              <IntensityIcon intensity={level} size={18} strokeWidth={2} />
            </button>
          ))}
        </div>
      </div>

      <div className="min-w-0">
        <p className="mb-2 px-1 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
          Melhor para
        </p>
        <div className="-mx-6 min-w-0 overflow-x-auto overscroll-x-contain px-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
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
