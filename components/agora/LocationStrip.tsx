interface LocationStripProps {
  baseAddress: string;
  travelerCount: number;
}

export function LocationStrip({
  baseAddress,
  travelerCount,
}: LocationStripProps) {
  return (
    <div className="relative z-10 -mt-3 px-6">
      <div className="flex items-center justify-between rounded-2xl bg-card/90 px-4 py-3 shadow-[0_10px_30px_-15px_rgba(60,30,20,0.15)] ring-1 ring-border backdrop-blur-md">
        <div className="flex min-w-0 items-center gap-3">
          <span className="size-1.5 shrink-0 animate-pulse rounded-full bg-terracotta" />
          <div className="min-w-0">
            <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Base
            </p>
            <p className="truncate text-sm font-medium tracking-tight">
              {baseAddress}
            </p>
          </div>
        </div>
        <span className="shrink-0 text-[10px] text-muted-foreground">
          {String(travelerCount).padStart(2, "0")} viajantes
        </span>
      </div>
    </div>
  );
}
