"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { formatHeroDate } from "@/lib/dates";
import { getRelativeDayTag } from "@/lib/trip-phase";

interface IntegratedDateRailProps {
  selectedDate: string;
  today: string;
  onPrev: () => void;
  onNext: () => void;
  onToday: () => void;
  canPrev: boolean;
  canNext: boolean;
  variant?: "light" | "dark";
}

export function IntegratedDateRail({
  selectedDate,
  today,
  onPrev,
  onNext,
  onToday,
  canPrev,
  canNext,
  variant = "light",
}: IntegratedDateRailProps) {
  const isToday = selectedDate === today;
  const tag = getRelativeDayTag(selectedDate, today);
  const dark = variant === "dark";

  return (
    <div
      className={`flex w-full items-center gap-1 ${
        dark ? "text-sand-50" : "text-warm-black"
      }`}
      role="group"
      aria-label="Navegar entre dias"
    >
      <button
        type="button"
        onClick={onPrev}
        disabled={!canPrev}
        aria-label="Dia anterior"
        className={`flex size-10 shrink-0 items-center justify-center transition-opacity ${
          canPrev
            ? dark
              ? "text-sand-100/80 hover:text-sand-50"
              : "text-warm-black/45 hover:text-warm-black"
            : "cursor-not-allowed opacity-25"
        }`}
      >
        <ChevronLeft size={20} strokeWidth={2} />
      </button>

      <button
        type="button"
        onClick={onToday}
        className="min-w-0 flex-1 px-1 text-center"
      >
        <p
          className={`text-[10px] font-bold uppercase tracking-[0.25em] ${
            dark ? "text-sand-100/70" : "text-warm-black/70"
          }`}
        >
          {formatHeroDate(selectedDate)}
        </p>
        <p
          className={`mt-0.5 text-[9px] font-bold uppercase tracking-[0.2em] ${
            isToday
              ? "text-terracotta"
              : dark
                ? "text-sand-200/50"
                : "text-muted-foreground"
          }`}
        >
          {tag}
        </p>
      </button>

      <button
        type="button"
        onClick={onNext}
        disabled={!canNext}
        aria-label="Próximo dia"
        className={`flex size-10 shrink-0 items-center justify-center transition-opacity ${
          canNext
            ? dark
              ? "text-sand-100/80 hover:text-sand-50"
              : "text-warm-black/45 hover:text-warm-black"
            : "cursor-not-allowed opacity-25"
        }`}
      >
        <ChevronRight size={20} strokeWidth={2} />
      </button>
    </div>
  );
}
