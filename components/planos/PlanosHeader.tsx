import Image from "next/image";

interface PlanosHeaderProps {
  ideaCount: number;
}

export function PlanosHeader({ ideaCount }: PlanosHeaderProps) {
  const label = ideaCount === 1 ? "sugestão" : "sugestões";

  return (
    <div className="relative overflow-hidden">
      <div className="relative h-[200px] w-full">
        <Image
          src="/images/hero-botanical.jpg"
          alt="Folhagem tropical em Miami"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/15 to-background" />
      </div>
      <header className="relative -mt-16 px-6 pb-6">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-terracotta">
            Banco de ideias
          </span>
          <span className="h-px flex-1 bg-warm-black/15" />
          <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            {ideaCount} {label}
          </span>
        </div>
        <h1 className="mt-4 font-serif text-[40px] leading-[0.9] tracking-tight text-warm-black">
          Possíveis
          <br />
          <em className="italic text-terracotta">planos</em>
        </h1>
        <p className="mt-4 max-w-[36ch] text-sm leading-relaxed text-muted-foreground">
          Ideias para inspirar o roteiro — nada confirmado até você adicionar
          um evento.
        </p>
      </header>
    </div>
  );
}
