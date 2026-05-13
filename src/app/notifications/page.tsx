import type { Metadata } from "next";
import Link from "next/link";
import {
  getCurrentMember,
  listNotifications,
} from "@/lib/data/provider";
import { AppShell } from "@/components/layout/app-shell";
import { SectionHeader } from "@/components/common/section-header";
import { GlassCard } from "@/components/ui/glass-card";
import { Pill } from "@/components/common/pill";
import {
  ShieldCheck,
  Award,
  AtSign,
  CalendarDays,
  Sparkles,
  Bell,
} from "lucide-react";
import { relativeFromNow } from "@/lib/format/dates";
import type { NotificationItem } from "@/lib/data/types";

const ICON_BY_KIND: Record<NotificationItem["kind"], typeof ShieldCheck> = {
  approval: ShieldCheck,
  badge: Award,
  mention: AtSign,
  event: CalendarDays,
  ai: Sparkles,
  system: Bell,
};

export const metadata: Metadata = {
  title: "Notifikasi",
  description: "Update penting yang ditujukan untukmu.",
};

export default async function NotificationsPage() {
  const me = await getCurrentMember();
  const items = await listNotifications(me.id);
  const sorted = items.sort((a, b) => b.at.localeCompare(a.at));
  return (
    <AppShell>
      <SectionHeader
        eyebrow="Inbox"
        title="Notifikasi"
        description={`${items.filter((n) => !n.read).length} belum dibaca dari ${items.length} total.`}
      />
      <ul className="mt-2 space-y-2">
        {sorted.map((n) => {
          const Icon = ICON_BY_KIND[n.kind];
          return (
            <li key={n.id}>
              <Link href={n.href ?? "#"}>
                <GlassCard
                  hover
                  className={`p-4 ${
                    n.read ? "opacity-80" : ""
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span
                      className={`grid size-9 shrink-0 place-items-center rounded-xl ${
                        n.read
                          ? "bg-foreground/[0.06]"
                          : "bg-brand-500/15 text-brand-700 dark:text-brand-300"
                      }`}
                    >
                      <Icon className="size-4" strokeWidth={1.75} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-[14px] font-medium">{n.title}</p>
                        {!n.read && <Pill tone="brand">Baru</Pill>}
                      </div>
                      <p className="mt-0.5 text-[12px] text-foreground/65">
                        {n.body}
                      </p>
                      <p className="mt-1 text-[10px] uppercase tracking-[0.16em] text-foreground/45">
                        {relativeFromNow(n.at)}
                      </p>
                    </div>
                  </div>
                </GlassCard>
              </Link>
            </li>
          );
        })}
        {sorted.length === 0 && (
          <GlassCard variant="thin" className="p-6 text-center text-[13px] text-foreground/55">
            Tidak ada notifikasi.
          </GlassCard>
        )}
      </ul>
    </AppShell>
  );
}
