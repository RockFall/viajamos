"use client";

import Link from "next/link";
import { useTrip } from "@/context/TripProvider";
import { AlertTriangle, ChevronLeft } from "lucide-react";

export function SettingsShell({
  title,
  subtitle,
  backHref = "/mais/configuracoes",
  backLabel = "Configurações",
  children,
  flash,
}: {
  title: string;
  subtitle?: string;
  backHref?: string;
  backLabel?: string;
  children: React.ReactNode;
  flash?: string | null;
}) {
  const { dataSource } = useTrip();

  return (
    <div className="space-y-4 pb-8">
      <Link
        href={backHref}
        className="inline-flex items-center gap-1 text-sm text-terracotta"
      >
        <ChevronLeft size={16} />
        {backLabel}
      </Link>

      {dataSource === "fallback" && (
        <div className="flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
          <AlertTriangle size={18} className="mt-0.5 shrink-0" />
          <p>
            Dados em modo local (JSON). Conecte o Supabase para persistir
            alterações na nuvem.
          </p>
        </div>
      )}

      <header>
        <h1 className="text-2xl font-bold text-ocean">{title}</h1>
        {subtitle && (
          <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
        )}
      </header>

      {flash && (
        <p className="rounded-xl bg-teal/10 px-3 py-2 text-sm font-medium text-teal-dark">
          {flash}
        </p>
      )}

      {children}
    </div>
  );
}
