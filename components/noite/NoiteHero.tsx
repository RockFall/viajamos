import Image from "next/image";
import { resolveHeroImage } from "@/lib/images/resolve";

interface NoiteHeroProps {
  venueCount: number;
}

export function NoiteHero({ venueCount }: NoiteHeroProps) {
  const label = venueCount === 1 ? "lugar" : "lugares";

  return (
    <div className="relative overflow-hidden">
      <div className="relative h-[280px] w-full">
        <Image
          src={resolveHeroImage("night")}
          alt="Bar de jazz em Miami à noite"
          fill
          priority
          className="object-cover opacity-70"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-warm-black/40 via-warm-black/60 to-warm-black" />
      </div>
      <div className="absolute inset-x-0 top-0 px-6 pt-14">
        <div className="flex items-center gap-2">
          <span className="size-1.5 animate-pulse rounded-full bg-terracotta" />
          <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-terracotta">
            After dark
          </span>
        </div>
      </div>
      <header className="absolute inset-x-0 bottom-0 px-6 pb-8">
        <p className="text-[10px] uppercase tracking-[0.2em] text-sand-200/50">
          {venueCount} {label} no radar
        </p>
        <h1 className="font-serif text-[44px] leading-[0.9] tracking-tight text-sand-50">
          Noite em
          <br />
          <em className="italic text-terracotta">Miami</em>
        </h1>
        <p className="mt-4 max-w-[34ch] text-sm leading-relaxed text-sand-200/65">
          Jazz, eletrônica e bares escondidos — curadoria para decidir depois do
          pôr do sol.
        </p>
      </header>
    </div>
  );
}
