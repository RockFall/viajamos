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
}

export function QuickActions({
  googleMapsUrl,
  appleMapsUrl,
  uberUrl,
  websiteUrl,
  ticketUrl,
  reservationUrl,
  compact = false,
}: QuickActionsProps) {
  const links = [
    { url: googleMapsUrl, label: "Maps", icon: MapPin, color: "bg-blue-50 text-blue-700" },
    { url: appleMapsUrl, label: "Apple", icon: Map, color: "bg-sky-50 text-sky-700" },
    { url: uberUrl, label: "Uber", icon: Car, color: "bg-zinc-900 text-white" },
    { url: websiteUrl, label: "Site", icon: ExternalLink, color: "bg-teal-50 text-teal-700" },
    { url: ticketUrl, label: "Ingresso", icon: Ticket, color: "bg-purple-50 text-purple-700" },
    { url: reservationUrl, label: "Reserva", icon: ExternalLink, color: "bg-orange-50 text-orange-700" },
  ].filter((l) => l.url);

  if (links.length === 0) return null;

  return (
    <div className={`flex flex-wrap gap-1.5 ${compact ? "" : "mt-3"}`}>
      {links.map(({ url, label, icon: Icon, color }) => (
        <a
          key={label}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-medium transition active:scale-95 ${color}`}
        >
          <Icon size={12} />
          {label}
        </a>
      ))}
    </div>
  );
}
