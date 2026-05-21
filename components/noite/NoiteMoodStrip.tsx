"use client";

import { NIGHT_MOODS } from "@/lib/night-radar";

interface NoiteMoodStripProps {
  value: string;
  onChange: (value: string) => void;
}

export function NoiteMoodStrip({ value, onChange }: NoiteMoodStripProps) {
  return (
    <section className="rounded-[24px] bg-sand-50/[0.04] p-5 ring-1 ring-sand-50/10">
      <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-terracotta">
        Humor de hoje
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        {NIGHT_MOODS.map((mood) => (
          <button
            key={mood.id}
            type="button"
            onClick={() =>
              onChange(value === mood.id ? "" : mood.id)
            }
            className={`rounded-full px-3.5 py-1.5 text-[11px] font-medium transition ${
              value === mood.id
                ? "bg-terracotta text-sand-50"
                : "bg-sand-50/[0.06] text-sand-100 ring-1 ring-sand-50/10 hover:bg-sand-50/[0.1]"
            }`}
          >
            {mood.label}
          </button>
        ))}
      </div>
    </section>
  );
}
