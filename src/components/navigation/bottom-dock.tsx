"use client";

import { motion } from "motion/react";
import {
  Home as HomeIcon,
  FileText,
  CalendarDays,
  BarChart3,
  User,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const tabs = [
  { href: "/", label: "Home", icon: HomeIcon },
  { href: "/content", label: "Konten", icon: FileText },
  { href: "/calendar", label: "Kalender", icon: CalendarDays },
  { href: "/analytics", label: "Insight", icon: BarChart3 },
  { href: "/profile", label: "Profil", icon: User },
] as const;

export function BottomDock() {
  const pathname = usePathname();

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 flex justify-center pb-[max(env(safe-area-inset-bottom),16px)] px-3 sm:pb-6">
      <nav
        className="pointer-events-auto glass-thick specular-edge flex items-center gap-1 rounded-full px-2 py-2"
        aria-label="Primary"
      >
        {tabs.map(({ href, label, icon: Icon }) => {
          const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              aria-label={label}
              aria-current={active ? "page" : undefined}
              className={cn(
                "relative flex h-12 min-w-12 items-center gap-2 rounded-full px-3 text-foreground/70 transition-colors",
                "hover:text-foreground",
                active && "text-foreground",
              )}
            >
              {active && (
                <motion.span
                  layoutId="dock-active"
                  className="absolute inset-0 rounded-full bg-[color-mix(in_oklab,var(--brand-500)_18%,transparent)]"
                  transition={{ type: "spring", stiffness: 360, damping: 30 }}
                />
              )}
              <Icon className="relative z-10 size-5 shrink-0" strokeWidth={1.75} />
              <span
                className={cn(
                  "relative z-10 hidden text-[13px] font-medium sm:inline",
                  active ? "inline" : "sm:inline",
                )}
              >
                {label}
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
