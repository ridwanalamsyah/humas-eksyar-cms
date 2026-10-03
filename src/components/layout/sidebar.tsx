"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  CalendarDays,
  CheckSquare,
  ExternalLink,
  FileText,
  Globe,
  Home,
  Image as ImageIcon,
  Settings,
  Users,
  type LucideIcon,
  Inbox,
  UserCog,
} from "lucide-react";
import { EksyarLogo } from "@/components/brand/eksyar-logo";
import { Avatar } from "@/components/common/avatar";
import { ROLE_LABEL, type Member } from "@/lib/data/types";
import { cn } from "@/lib/utils";

type Item = { href: string; label: string; icon: LucideIcon; external?: boolean };

function groupsFor(role: Member["role"]): { title: string; items: Item[] }[] {
  const canReview = ["admin", "sekjen", "ketua_divisi"].includes(role);
  const groups: { title: string; items: Item[] }[] = [
    {
      title: "Kerja",
      items: [
        { href: "/dashboard", label: "Beranda", icon: Home },
        { href: "/content", label: "Berita & konten", icon: FileText },
        ...(canReview ? [{ href: "/approval", label: "Perlu disetujui", icon: CheckSquare }] : []),
        { href: "/events", label: "Agenda", icon: CalendarDays },
        { href: "/media", label: "Media", icon: ImageIcon },
      ],
    },
  ];
  if (role === "admin") {
    groups.push({
      title: "Website",
      items: [
        { href: "/settings/website", label: "Isi website", icon: Globe },
        { href: "/settings/formulir", label: "Kotak masuk", icon: Inbox },
        { href: "/settings/kinerja", label: "Laporan", icon: BarChart3 },
        { href: "/settings/members", label: "Anggota", icon: UserCog },
        { href: "/", label: "Lihat website", icon: ExternalLink, external: true },
      ],
    });
  } else {
    groups.push({
      title: "Website",
      items: [
        { href: "/members", label: "Anggota", icon: Users },
        { href: "/", label: "Lihat website", icon: ExternalLink, external: true },
      ],
    });
  }
  return groups;
}

export function isActivePath(pathname: string, href: string) {
  if (href === "/dashboard") return pathname === "/dashboard";
  if (href === "/settings") return pathname === "/settings";
  // Tautan pintasan ke bagian editor (?bagian=…) tidak ditandai aktif.
  if (href.includes("?")) return false;
  return pathname === href || pathname.startsWith(href + "/");
}

/** Sidebar navigasi CMS (desktop). */
export function Sidebar({ member }: { member: Member }) {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-60 flex-col border-r border-foreground/[0.07] bg-background lg:flex dark:border-white/[0.07]">
      <Link href="/dashboard" className="flex items-center gap-2.5 px-5 pt-5 pb-4" aria-label="Beranda">
        <EksyarLogo size={32} />
        <span className="leading-tight">
          <span className="block text-[14px] font-semibold tracking-tight">Humas Eksyar</span>
          <span className="block text-[11px] text-foreground/50">Ruang kerja humas</span>
        </span>
      </Link>

      <nav aria-label="Navigasi CMS" className="flex-1 overflow-y-auto px-3 pb-4">
        {groupsFor(member.role).map((g) => (
          <div key={g.title} className="mt-4 first:mt-1">
            <p className="px-2 pb-1 text-[11px] font-medium text-foreground/45">{g.title}</p>
            <ul className="grid gap-0.5">
              {g.items.map(({ href, label, icon: Icon, external }) => {
                const active = !external && isActivePath(pathname, href);
                return (
                  <li key={href}>
                    <Link
                      href={href}
                      target={external ? "_blank" : undefined}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "flex items-center gap-2.5 rounded-lg px-2 py-1.5 text-[13.5px] transition-colors",
                        active
                          ? "bg-foreground/[0.06] font-medium text-foreground dark:bg-white/[0.07]"
                          : "text-foreground/65 hover:bg-foreground/[0.04] hover:text-foreground",
                      )}
                    >
                      <Icon className={cn("size-4 shrink-0", active ? "text-brand-600 dark:text-brand-300" : "")} strokeWidth={1.75} />
                      {label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="border-t border-foreground/[0.07] p-3 dark:border-white/[0.07]">
        <Link
          href="/settings"
          aria-current={isActivePath(pathname, "/settings") ? "page" : undefined}
          className={cn(
            "flex items-center gap-2.5 rounded-lg px-2 py-1.5 text-[13.5px] text-foreground/65 hover:bg-foreground/[0.04] hover:text-foreground",
            isActivePath(pathname, "/settings") && "bg-foreground/[0.06] font-medium text-foreground",
          )}
        >
          <Settings className="size-4" strokeWidth={1.75} /> Pengaturan
        </Link>
        <Link href="/profile" className="mt-1 flex items-center gap-2.5 rounded-lg px-2 py-1.5 hover:bg-foreground/[0.04]">
          <Avatar member={member} size={26} ring={false} />
          <span className="min-w-0 leading-tight">
            <span className="block truncate text-[13px] font-medium">{member.name}</span>
            <span className="block truncate text-[11px] text-foreground/50">{ROLE_LABEL[member.role]}</span>
          </span>
        </Link>
      </div>
    </aside>
  );
}
