"use client";

import { LayoutGrid } from "lucide-react";
import {
  NIGHT_TYPES,
  NightTypeIcon,
} from "@/components/ui/NightIcons";
import { NIGHT_TYPE_LABELS } from "@/lib/labels";
import type { NightEventType } from "@/types";

function iconBtn(active: boolean) {
  return `flex size-11 shrink-0 items-center justify-center rounded-2xl transition active:scale-[0.97] ${
    active
      ? "bg-terracotta text-sand-50 ring-1 ring-terracotta"
      : "bg-sand-50/[0.06] text-sand-100 ring-1 ring-sand-50/10 hover:bg-sand-50/[0.1]"
  }`;
}

interface NightTypeFiltersProps {
  value: string;
  onChange: (value: string) => void;
}

export function NightTypeFilters({ value, onChange }: NightTypeFiltersProps) {
  return (
    <div className="min-w-0">
      <p className="mb-2 px-1 text-[10px] font-bold uppercase tracking-[0.2em] text-sand-200/50">
        Tipo de noite
      </p>
      <div className="-mx-6 min-w-0 overflow-x-auto overscroll-x-contain px-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="flex w-max gap-2 pr-1">
          <button
            type="button"
            title="Todos os tipos"
            aria-label="Todos os tipos"
            onClick={() => onChange("")}
            className={iconBtn(value === "")}
          >
            <LayoutGrid size={18} strokeWidth={2} />
          </button>
          {NIGHT_TYPES.map((type) => (
            <button
              key={type}
              type="button"
              title={NIGHT_TYPE_LABELS[type]}
              aria-label={NIGHT_TYPE_LABELS[type]}
              aria-pressed={value === type}
              onClick={() => onChange(value === type ? "" : type)}
              className={iconBtn(value === type)}
            >
              <NightTypeIcon
                type={type as NightEventType}
                size={18}
                strokeWidth={2}
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
