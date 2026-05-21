"use client";

import type { BoardingPassDisplay } from "@/lib/boarding-pass";

function PlaneIcon() {
  return (
    <svg
      width="34"
      height="34"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-terracotta"
      aria-hidden
    >
      <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z" />
    </svg>
  );
}

function Stub({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
        {label}
      </p>
      <p className="font-serif mt-1 text-xl tracking-tight">{value}</p>
    </div>
  );
}

interface BoardingPassCardProps {
  pass: BoardingPassDisplay;
}

export function BoardingPassCard({ pass }: BoardingPassCardProps) {
  return (
    <section
      className="relative overflow-hidden rounded-[28px] bg-sand-50 text-warm-black shadow-[0_30px_60px_-25px_rgba(0,0,0,0.6)]"
      aria-label="Cartão de viagem"
    >
      {pass.isPending && (
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-terracotta/40 via-terracotta to-terracotta/40" />
      )}

      <div className="pointer-events-none absolute left-0 right-0 top-[62%] flex -translate-y-1/2 items-center justify-between px-2">
        <span className="-ml-3 size-6 rounded-full bg-warm-black" />
        <div className="mx-2 flex-1 border-t-2 border-dashed border-warm-black/15" />
        <span className="-mr-3 size-6 rounded-full bg-warm-black" />
      </div>

      <div className="p-6">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-terracotta">
              {pass.airline}
            </p>
            <p className="font-serif mt-0.5 text-sm italic text-muted-foreground">
              {pass.subtitle}
            </p>
          </div>
          <div className="shrink-0 rounded-lg bg-warm-black/5 px-2.5 py-1 text-[10px] font-bold tracking-[0.2em] text-warm-black">
            {pass.groupBadge}
          </div>
        </div>

        <div className="mt-6 grid grid-cols-[1fr_auto_1fr] items-end gap-3">
          <div>
            <p className="font-serif text-5xl leading-none tracking-tight">
              {pass.fromCode}
            </p>
            <p className="mt-2 text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
              {pass.fromCity}
            </p>
            <p className="font-serif mt-1 text-lg italic">
              {pass.departureTime}
            </p>
          </div>
          <div className="flex flex-col items-center pb-2">
            <PlaneIcon />
            {pass.duration && (
              <span className="mt-1 text-[10px] font-bold uppercase tracking-[0.2em] text-terracotta">
                {pass.duration}
              </span>
            )}
          </div>
          <div className="text-right">
            <p className="font-serif text-5xl leading-none tracking-tight">
              {pass.toCode}
            </p>
            <p className="mt-2 text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
              {pass.toCity}
            </p>
            <p className="font-serif mt-1 text-lg italic">
              {pass.arrivalTime}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-4 gap-2 border-t border-dashed border-warm-black/15 px-6 py-5 text-center">
        <Stub label="Portão" value={pass.gate} />
        <Stub label="Embarque" value={pass.boardingTime} />
        <Stub label="Assento" value={pass.seat} />
        <Stub label={pass.stubFourthLabel} value={pass.stubFourthValue} />
      </div>
    </section>
  );
}
