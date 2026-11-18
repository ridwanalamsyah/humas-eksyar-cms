"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  CalendarDays,
  ExternalLink,
  FileText,
  Globe,
  Home,
  Image as ImageIcon,
  Settings,
  type LucideIcon,
  UserCog,
  PenLine,
} from "lucide-react";
import { motion } from "motion/react";
import { EksyarLogo } from "@/components/brand/eksyar-logo";
import { Avatar } from "@/components/common/avatar";
import { ROLE_LABEL, type Member } from "@/lib/data/types";
import { cn } from "@/lib/utils";

type Item = { href: string; label: string; icon: LucideIcon; external?: boolean };

function groupsFor(role: Member["role"]): { title: string; items: Item[] }[] {
  // Akses khusus penulis mahasiswa (HMJ & kontributor artikel)
  if (role === "anggota") {
    return [
      {
        title: "Penulis",
        items: [
          { href: "/content", label: "Artikel & Berita", icon: FileText },
          { href: "/content/new", label: "Tulis Artikel Baru", icon: PenLine },
          { href: "/media", label: "Pustaka Media", icon: ImageIcon },
          { href: "/", label: "Lihat Website", icon: ExternalLink, external: true },
        ],
      },
    ];
  }

  const groups: { title: string; items: Item[] }[] = [
    {
      title: "Menu Utama",
      items: [
        { href: "/dashboard", label: "Dashboard", icon: Home },
        { href: "/content", label: "Artikel & Berita", icon: FileText },
        { href: "/content/new", label: "Tulis Artikel Baru", icon: PenLine },
        { href: "/events", label: "Agenda Kegiatan", icon: CalendarDays },
        { href: "/media", label: "Pustaka Media", icon: ImageIcon },
      ],
    },
  ];
  groups.push({
    title: "Kelola Website & Tim",
    items: [
      { href: "/settings/website", label: "Konten Website", icon: Globe },
      { href: "/settings/members", label: "Anggota & Peran", icon: UserCog },
      { href: "/settings/kinerja", label: "Laporan Kinerja", icon: BarChart3 },
      { href: "/", label: "Lihat Website", icon: ExternalLink, external: true },
    ],
  });
  return groups;
}

export function isActivePath(pathname: string, href: string) {
  if (href === "/dashboard") return pathname === "/dashboard";
  if (href === "/settings") return pathname === "/settings";
  if (href === "/content") return pathname === "/content";
  // Tautan pintasan ke bagian editor (?bagian=…) tidak ditandai aktif.
  if (href.includes("?")) return false;
  return pathname === href || pathname.startsWith(href + "/");
}

/** Sidebar navigasi CMS (desktop). */
export function Sidebar({ member }: { member: Member }) {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-60 flex-col border-r border-foreground/[0.07] bg-background lg:flex dark:border-white/[0.07]">
      <Link href="/dashboard" className="group flex items-center gap-2.5 px-5 pt-5 pb-4" aria-label="Dashboard">
        <motion.div
          whileHover={{ scale: 1.06, rotate: -3 }}
          transition={{ type: "spring", stiffness: 400, damping: 22 }}
        >
          <EksyarLogo size={32} />
        </motion.div>
        <span className="leading-tight">
          <span className="block text-[14px] font-semibold tracking-tight transition-colors group-hover:text-brand-600 dark:group-hover:text-brand-300">
            CMS Humas Eksyar
          </span>
          <span className="block text-[11px] text-foreground/50">Humas Jurusan Ekonomi Syariah</span>
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
                        "group relative flex items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-[13.5px] transition-colors",
                        active
                          ? "font-medium text-foreground"
                          : "text-foreground/65 hover:bg-foreground/[0.04] hover:text-foreground",
                      )}
                    >
                      {active && (
                        <motion.span
                          layoutId="cms-sidebar-active-pill"
                          transition={{ type: "spring", stiffness: 380, damping: 32 }}
                          className="absolute inset-0 rounded-lg bg-foreground/[0.06] dark:bg-white/[0.08]"
                        />
                      )}
                      <Icon
                        className={cn(
                          "relative z-10 size-4 shrink-0 transition-transform duration-200 group-hover:scale-105",
                          active ? "text-brand-600 dark:text-brand-300" : "",
                        )}
                        strokeWidth={1.75}
                      />
                      <span className="relative z-10">{label}</span>
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
            "group relative flex items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-[13.5px] text-foreground/65 transition-colors hover:bg-foreground/[0.04] hover:text-foreground",
            isActivePath(pathname, "/settings") && "font-medium text-foreground",
          )}
        >
          {isActivePath(pathname, "/settings") && (
            <motion.span
              layoutId="cms-sidebar-active-pill"
              transition={{ type: "spring", stiffness: 380, damping: 32 }}
              className="absolute inset-0 rounded-lg bg-foreground/[0.06] dark:bg-white/[0.08]"
            />
          )}
          <Settings className="relative z-10 size-4 transition-transform duration-300 group-hover:rotate-45" strokeWidth={1.75} />
          <span className="relative z-10">Pengaturan</span>
        </Link>
        <Link href="/profile" className="mt-1 flex items-center gap-2.5 rounded-lg px-2 py-1.5 transition-colors hover:bg-foreground/[0.04]">
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
