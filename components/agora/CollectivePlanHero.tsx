"use client";

import Image from "next/image";
import type { ItineraryEvent } from "@/types";
import { QuickActions } from "@/components/ui/QuickActions";

function planImageSrc(title: string): string {
  if (/mandolin/i.test(title)) return "/images/dinner-mandolin.jpg";
  return "/images/hero-botanical.jpg";
}

function ChipAction({ label, href }: { label: string; href?: string }) {
  const className =
    "rounded-full bg-secondary px-3 py-2 text-[11px] font-semibold tracking-tight text-warm-black ring-1 ring-border transition-colors hover:bg-accent";
  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
      >
        {label}
      </a>
    );
  }
  return (
    <span className={`${className} cursor-default opacity-70`}>{label}</span>
  );
}

export function CollectivePlanHero({ event }: { event: ItineraryEvent }) {
  const chips = [
    { label: "Maps", href: event.googleMapsUrl ?? event.appleMapsUrl },
    { label: "Uber", href: event.uberUrl },
    {
      label: event.reservationUrl ? "Reserva" : event.ticketUrl ? "Ingresso" : "Site",
      href: event.reservationUrl ?? event.ticketUrl ?? event.websiteUrl,
    },
  ].filter((c) => c.href);

  return (
    <div className="overflow-hidden rounded-[28px] bg-card shadow-[0_25px_50px_-25px_rgba(60,30,20,0.25)] ring-1 ring-border">
      <div className="relative">
        <div className="relative aspect-[4/3] w-full">
          <Image
            src={planImageSrc(event.title)}
            alt={event.title}
            fill
            className="object-cover"
            sizes="(max-width: 512px) 100vw, 512px"
          />
        </div>
        <div className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-background/85 px-2.5 py-1 backdrop-blur-md">
          <span className="size-1.5 rounded-full bg-terracotta" />
          <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-warm-black">
            Plano coletivo
          </span>
        </div>
      </div>
      <div className="p-6">
        <div className="flex items-baseline justify-between gap-4">
          <h2 className="font-serif text-3xl leading-[1.05] tracking-tight text-balance text-warm-black">
            {event.title}
          </h2>
          {event.startTime && (
            <span className="shrink-0 font-serif text-xl italic text-terracotta">
              {event.startTime}
            </span>
          )}
        </div>
        {event.description && (
          <p className="mt-3 text-[15px] leading-relaxed text-pretty text-muted-foreground">
            {event.description}
          </p>
        )}
        {chips.length > 0 ? (
          <div className="mt-5 grid grid-cols-3 gap-2">
            {chips.map((c) => (
              <ChipAction key={c.label} label={c.label} href={c.href} />
            ))}
          </div>
        ) : (
          <QuickActions
            googleMapsUrl={event.googleMapsUrl}
            appleMapsUrl={event.appleMapsUrl}
            uberUrl={event.uberUrl}
            websiteUrl={event.websiteUrl}
            ticketUrl={event.ticketUrl}
            reservationUrl={event.reservationUrl}
          />
        )}
      </div>
    </div>
  );
}
