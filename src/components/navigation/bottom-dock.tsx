"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CalendarDays, FileText, Home as HomeIcon, Image as ImageIcon, Menu } from "lucide-react";
import { cn } from "@/lib/utils";

const tabs = [
  { href: "/dashboard", label: "Beranda", icon: HomeIcon },
  { href: "/content", label: "Berita", icon: FileText },
  { href: "/events", label: "Agenda", icon: CalendarDays },
  { href: "/media", label: "Media", icon: ImageIcon },
  { href: "/settings", label: "Lainnya", icon: Menu },
] as const;

/** Tab bar bawah — hanya di layar kecil (desktop memakai sidebar). */
export function BottomDock() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Navigasi utama"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-foreground/[0.08] bg-background/95 pb-[env(safe-area-inset-bottom)] backdrop-blur lg:hidden dark:border-white/[0.08]"
    >
      <ul className="mx-auto grid max-w-md grid-cols-5">
        {tabs.map(({ href, label, icon: Icon }) => {
          const active = href === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(href);
          return (
            <li key={href}>
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex flex-col items-center gap-0.5 py-2 text-[11px] transition-colors",
                  active ? "font-medium text-brand-600 dark:text-brand-300" : "text-foreground/55",
                )}
              >
                <Icon className="size-5" strokeWidth={1.75} />
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
