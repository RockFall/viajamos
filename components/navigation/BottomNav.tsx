"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { href: "/", label: "Agora" },
  { href: "/roteiro", label: "Roteiro" },
  { href: "/planos", label: "Planos" },
  { href: "/noite", label: "Noite" },
  { href: "/mais", label: "Mais" },
] as const;

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-6 left-1/2 z-50 w-[92%] max-w-md -translate-x-1/2">
      <div className="flex items-center justify-between rounded-full bg-warm-black/95 px-3 py-2 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.35)] ring-1 ring-white/5 backdrop-blur-xl">
        {tabs.map(({ href, label }) => {
          const active =
            href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex-1 px-2 py-2 text-center text-[10px] font-semibold uppercase tracking-[0.15em] transition-colors ${
                active
                  ? "text-terracotta"
                  : "text-sand-100/50 hover:text-sand-100"
              }`}
            >
              {label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
