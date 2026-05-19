"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Clock, Map, Sparkles, Moon, MoreHorizontal } from "lucide-react";

const tabs = [
  { href: "/", label: "Agora", icon: Clock },
  { href: "/roteiro", label: "Roteiro", icon: Map },
  { href: "/planos", label: "Planos", icon: Sparkles },
  { href: "/noite", label: "Noite", icon: Moon },
  { href: "/mais", label: "Mais", icon: MoreHorizontal },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="bottom-nav fixed bottom-0 left-0 right-0 z-50 border-t border-black/5 bg-white/95 backdrop-blur-lg">
      <div className="mx-auto flex max-w-lg items-stretch justify-around px-2 pt-2">
        {tabs.map(({ href, label, icon: Icon }) => {
          const active =
            href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-1 flex-col items-center gap-0.5 rounded-xl py-1.5 text-xs font-medium transition ${
                active
                  ? "text-coral"
                  : "text-muted hover:text-foreground"
              }`}
            >
              <Icon
                size={22}
                className={active ? "text-coral" : ""}
                strokeWidth={active ? 2.5 : 2}
              />
              <span>{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
