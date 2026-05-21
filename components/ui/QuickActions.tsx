"use client";

import {
  ExternalLink,
  Map,
  MapPin,
  Ticket,
  Car,
} from "lucide-react";

interface QuickActionsProps {
  googleMapsUrl?: string;
  appleMapsUrl?: string;
  uberUrl?: string;
  websiteUrl?: string;
  ticketUrl?: string;
  reservationUrl?: string;
  compact?: boolean;
  className?: string;
}

const chipBase =
  "inline-flex items-center justify-center gap-1.5 rounded-full px-3 py-2 text-[11px] font-semibold tracking-tight transition active:scale-[0.98]";

const chipLight = `${chipBase} bg-secondary text-warm-black ring-1 ring-border hover:bg-accent`;
const chipDark = `${chipBase} bg-warm-black text-sand-50 ring-1 ring-warm-black/10 hover:bg-warm-black/90`;

export function QuickActions({
  googleMapsUrl,
  appleMapsUrl,
  uberUrl,
  websiteUrl,
  ticketUrl,
  reservationUrl,
  compact = false,
  className = "",
}: QuickActionsProps) {
  const links = [
    { url: googleMapsUrl, label: "Maps", icon: MapPin, style: chipLight },
    { url: appleMapsUrl, label: "Apple", icon: Map, style: chipLight },
    { url: uberUrl, label: "Uber", icon: Car, style: chipDark },
    { url: websiteUrl, label: "Site", icon: ExternalLink, style: chipLight },
    { url: ticketUrl, label: "Ingresso", icon: Ticket, style: chipLight },
    {
      url: reservationUrl,
      label: "Reserva",
      icon: ExternalLink,
      style: chipLight,
    },
  ].filter((l) => l.url);

  if (links.length === 0) return null;

  return (
    <div
      className={`flex flex-wrap gap-2 ${compact ? "" : "mt-3"} ${className}`.trim()}
    >
      {links.map(({ url, label, icon: Icon, style }) => (
        <a
          key={`${label}-${url}`}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className={style}
        >
          <Icon size={12} strokeWidth={2.25} />
          {label}
        </a>
      ))}
    </div>
  );
}
