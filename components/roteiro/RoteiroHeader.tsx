interface RoteiroHeaderProps {
  dayCount: number;
  eventCount: number;
}

export function RoteiroHeader({ dayCount, eventCount }: RoteiroHeaderProps) {
  const dayLabel = dayCount === 1 ? "dia" : "dias";
  const eventLabel = eventCount === 1 ? "evento" : "eventos";

  return (
    <header className="px-6 pt-14 pb-8">
      <div className="flex items-center gap-2">
        <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-terracotta">
          {dayCount} {dayLabel}
        </span>
        <span className="h-px flex-1 bg-warm-black/15" />
        <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
          {eventCount} {eventLabel}
        </span>
      </div>
      <h1 className="mt-4 font-serif text-[44px] leading-[0.9] tracking-tight text-warm-black">
        Roteiro
        <br />
        <em className="italic text-terracotta">completo</em>
      </h1>
      <p className="mt-4 max-w-[36ch] text-sm leading-relaxed text-muted-foreground">
        Dia a dia, com horários, endereços e quem está em cada plano. Toque no
        dia para expandir ou recolher.
      </p>
    </header>
  );
}
