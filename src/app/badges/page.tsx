import type { Metadata } from "next";
import { listBadges, getCurrentMember } from "@/lib/data/provider";
import { AppShell } from "@/components/layout/app-shell";
import { SectionHeader } from "@/components/common/section-header";
import { GlassCard } from "@/components/ui/glass-card";
import { Pill } from "@/components/common/pill";
import { ProgressBar } from "@/components/common/progress-bar";
import {
  Award,
  Trophy,
  Star,
  Flame,
  Sparkles,
  Crown,
  Medal,
  Gem,
} from "lucide-react";
import type { Badge as BadgeType } from "@/lib/data/types";

export const metadata: Metadata = {
  title: "Badge",
  description: "Semua badge yang bisa kamu unlock.",
};

const ICON_MAP: Record<string, typeof Award> = {
  Award,
  Trophy,
  Star,
  Flame,
  Sparkles,
  Crown,
  Medal,
  Gem,
};

const TIER_COLOR: Record<BadgeType["tier"], { ring: string; bg: string; text: string; label: string }> = {
  bronze: {
    ring: "ring-amber-700/40",
    bg: "from-amber-700/20 to-amber-900/10",
    text: "text-amber-700 dark:text-amber-300",
    label: "Bronze",
  },
  silver: {
    ring: "ring-slate-400/40",
    bg: "from-slate-300/30 to-slate-500/10",
    text: "text-slate-500 dark:text-slate-300",
    label: "Silver",
  },
  gold: {
    ring: "ring-gold-400/45",
    bg: "from-gold-400/25 to-gold-500/10",
    text: "text-gold-600 dark:text-gold-300",
    label: "Gold",
  },
  platinum: {
    ring: "ring-sky-400/40",
    bg: "from-sky-400/25 to-violet-400/10",
    text: "text-sky-700 dark:text-sky-300",
    label: "Platinum",
  },
  legendary: {
    ring: "ring-fuchsia-400/45",
    bg: "from-fuchsia-400/25 to-amber-300/15",
    text: "text-fuchsia-700 dark:text-fuchsia-300",
    label: "Legendary",
  },
};

export default async function BadgesPage() {
  const [badges, me] = await Promise.all([listBadges(), getCurrentMember()]);
  return (
    <AppShell width="wide">
      <SectionHeader
        eyebrow="Gamification"
        title="Badge Library"
        description={`${me.badges.length} dari ${badges.length} badge sudah kamu unlock.`}
      />
      <div className="mt-2 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {badges.map((b) => {
          const Icon = ICON_MAP[b.icon] ?? Award;
          const color = TIER_COLOR[b.tier];
          const unlocked = me.badges.includes(b.id);
          const rate = b.totalMembers ? b.unlockedCount / b.totalMembers : 0;
          return (
            <GlassCard
              key={b.id}
              id={b.slug}
              variant={unlocked ? "thick" : "regular"}
              className={`p-5 ${unlocked ? "" : "opacity-80"}`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`grid size-14 place-items-center rounded-2xl bg-gradient-to-br ${color.bg} ring-1 ring-inset ${color.ring}`}
                >
                  <Icon
                    className={`size-7 ${color.text}`}
                    strokeWidth={1.75}
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className={`text-[10px] font-medium uppercase tracking-[0.16em] ${color.text}`}>
                    {color.label} · +{b.xpReward} XP
                  </p>
                  <h3 className="mt-0.5 font-display text-[15px] font-semibold leading-tight tracking-tight">
                    {b.name}
                  </h3>
                  <p className="mt-1 text-[12px] text-foreground/65">
                    {b.description}
                  </p>
                </div>
              </div>
              <div className="mt-4 text-[11px] text-foreground/60">
                <div className="flex items-center justify-between">
                  <span>Tingkat unlock</span>
                  <span className="font-mono">
                    {b.unlockedCount}/{b.totalMembers}
                  </span>
                </div>
                <ProgressBar value={rate} className="mt-1" />
              </div>
              {unlocked && (
                <div className="mt-3 inline-flex items-center gap-1 text-[11px] font-medium text-brand-700 dark:text-brand-300">
                  <Sparkles className="size-3" strokeWidth={2} /> Sudah dimiliki
                </div>
              )}
              {!unlocked && (
                <Pill className="mt-3">Belum unlock</Pill>
              )}
            </GlassCard>
          );
        })}
      </div>
    </AppShell>
  );
}
