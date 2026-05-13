import type { Metadata } from "next";
import Link from "next/link";
import {
  listLeaderboard,
  listDivisionLeaderboard,
} from "@/lib/data/provider";
import { AppShell } from "@/components/layout/app-shell";
import { SectionHeader } from "@/components/common/section-header";
import { GlassCard } from "@/components/ui/glass-card";
import { Avatar } from "@/components/common/avatar";
import { Trophy, Flame, Award } from "lucide-react";
import { findDivision } from "@/lib/fixtures/divisions";
import { percent } from "@/lib/format/dates";

export const metadata: Metadata = {
  title: "Leaderboard",
  description: "Peringkat anggota dan divisi berdasarkan kontribusi.",
};

export default async function LeaderboardPage() {
  const [members, divisions] = await Promise.all([
    listLeaderboard(),
    listDivisionLeaderboard(),
  ]);
  const top3 = members.slice(0, 3);
  const rest = members.slice(3, 20);

  return (
    <AppShell width="wide">
      <SectionHeader
        eyebrow="Hall of Recognition"
        title="Leaderboard"
        description="Yang aktif terlihat. Yang konsisten dapat reward."
      />

      <div className="mt-2 grid gap-4 sm:grid-cols-3">
        {top3.map((m, i) => {
          const division = findDivision(m.divisionId);
          const ranks: Array<{
            color: string;
            label: string;
            ring: string;
          }> = [
            {
              color: "from-gold-400 to-gold-500",
              label: "Juara 1",
              ring: "ring-gold-400/45",
            },
            {
              color: "from-slate-300 to-slate-500",
              label: "Juara 2",
              ring: "ring-slate-400/45",
            },
            {
              color: "from-amber-700/80 to-amber-900/80",
              label: "Juara 3",
              ring: "ring-amber-700/45",
            },
          ];
          const meta = ranks[i];
          return (
            <Link key={m.id} href={`/members/${m.id}`}>
              <GlassCard
                variant="thick"
                hover
                className={`p-5 ring-1 ring-inset ${meta.ring}`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`grid size-12 place-items-center rounded-2xl bg-gradient-to-br ${meta.color} text-white shadow`}
                  >
                    <Trophy className="size-6" strokeWidth={1.75} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-foreground/55">
                      {meta.label}
                    </p>
                    <p className="truncate font-display text-[15px] font-semibold tracking-tight">
                      {m.name}
                    </p>
                    <p className="text-[11px] text-foreground/55">
                      {division.shortName}
                    </p>
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between border-t border-foreground/10 pt-3 dark:border-white/10">
                  <Avatar member={m} size={42} />
                  <div className="text-right">
                    <p className="font-mono text-lg font-semibold">
                      {m.xp.toLocaleString()}
                    </p>
                    <p className="text-[10px] uppercase tracking-[0.16em] text-foreground/55">
                      XP
                    </p>
                  </div>
                </div>
              </GlassCard>
            </Link>
          );
        })}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[2fr_1fr]">
        <GlassCard className="overflow-hidden p-0">
          <div className="border-b border-foreground/10 px-5 py-3 dark:border-white/10">
            <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-foreground/55">
              Peringkat 4–20
            </p>
          </div>
          <ul className="divide-y divide-foreground/10 dark:divide-white/10">
            {rest.map((m, i) => {
              const division = findDivision(m.divisionId);
              return (
                <li key={m.id}>
                  <Link
                    href={`/members/${m.id}`}
                    className="flex items-center gap-3 px-5 py-3 transition-colors hover:bg-foreground/[0.04] dark:hover:bg-white/5"
                  >
                    <span className="grid size-7 shrink-0 place-items-center rounded-full bg-foreground/[0.04] font-mono text-[12px] font-semibold text-foreground/70 dark:bg-white/5">
                      {i + 4}
                    </span>
                    <Avatar member={m} size={32} ring={false} />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[14px] font-medium">{m.name}</p>
                      <p className="truncate text-[11px] text-foreground/55">
                        {division.shortName} · {m.position}
                      </p>
                    </div>
                    <span className="hidden items-center gap-1 text-[11px] text-foreground/60 sm:inline-flex">
                      <Flame className="size-3 text-gold-500" strokeWidth={2} />
                      {m.streak}h
                    </span>
                    <span className="hidden items-center gap-1 text-[11px] text-foreground/60 sm:inline-flex">
                      <Award className="size-3" strokeWidth={2} />
                      {m.badges.length}
                    </span>
                    <span className="font-mono text-[13px] font-semibold">
                      {m.xp.toLocaleString()}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </GlassCard>

        <aside className="space-y-4">
          <GlassCard className="p-5">
            <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-foreground/55">
              Leaderboard divisi
            </p>
            <ul className="mt-3 space-y-2">
              {divisions.map((d, i) => (
                <li
                  key={d.division.id}
                  className="flex items-center justify-between gap-2 rounded-xl border border-foreground/10 bg-foreground/[0.03] px-3 py-2 text-[12px] dark:border-white/10 dark:bg-white/[0.03]"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] text-foreground/55">
                      #{i + 1}
                    </span>
                    <span
                      className="size-2 rounded-full"
                      style={{ background: d.division.color }}
                    />
                    <span className="font-medium">{d.division.shortName}</span>
                  </div>
                  <div className="text-right">
                    <p className="font-mono text-[12px] font-semibold">
                      {d.totalXP.toLocaleString()} XP
                    </p>
                    <p className="text-[10px] text-foreground/55">
                      {d.postCount} post · ER {percent(d.engagementRate, 1)}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </GlassCard>

          <GlassCard variant="thin" className="p-5">
            <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-foreground/55">
              Aturan ringkas
            </p>
            <ul className="mt-2 space-y-1.5 text-[12px] text-foreground/70">
              <li>+50 XP setiap konten dipublish.</li>
              <li>+15 XP saat menyelesaikan tugas review.</li>
              <li>+5 XP per hari streak bertahan.</li>
              <li>+250 XP saat menyelesaikan quest weekly.</li>
              <li>+500 XP saat unlock badge gold ke atas.</li>
            </ul>
          </GlassCard>
        </aside>
      </div>
    </AppShell>
  );
}
