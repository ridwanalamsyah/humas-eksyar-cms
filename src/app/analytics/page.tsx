import type { Metadata } from "next";
import {
  listContents,
  listDivisions,
  getWeeklyDigest,
  listDivisionLeaderboard,
} from "@/lib/data/provider";
import { AppShell } from "@/components/layout/app-shell";
import { SectionHeader } from "@/components/common/section-header";
import { GlassCard } from "@/components/ui/glass-card";
import { AnalyticsCharts } from "@/components/charts/analytics-charts";
import { findMember } from "@/lib/fixtures/members";
import { humanNumber, percent } from "@/lib/format/dates";
import { Sparkles, TrendingUp, Heart, Eye } from "lucide-react";

export const metadata: Metadata = {
  title: "Analytics",
  description: "Performa konten Instagram, sentimen audiens, ringkasan mingguan AI.",
};

export default async function AnalyticsPage() {
  const [contents, divisions, digest, divBoard] = await Promise.all([
    listContents({ status: "published" }),
    listDivisions(),
    getWeeklyDigest(),
    listDivisionLeaderboard(),
  ]);

  const totals = contents.reduce(
    (acc, c) => {
      if (!c.metrics) return acc;
      acc.views += c.metrics.views;
      acc.likes += c.metrics.likes;
      acc.comments += c.metrics.comments;
      acc.shares += c.metrics.shares;
      acc.reach += c.metrics.reach;
      acc.engagementSum += c.metrics.engagementRate;
      acc.engCount += 1;
      acc.sentimentSum += c.metrics.sentiment;
      return acc;
    },
    {
      views: 0,
      likes: 0,
      comments: 0,
      shares: 0,
      reach: 0,
      engagementSum: 0,
      engCount: 0,
      sentimentSum: 0,
    },
  );
  const avgEng = totals.engCount ? totals.engagementSum / totals.engCount : 0;
  const avgSentiment = totals.engCount ? totals.sentimentSum / totals.engCount : 0;

  const top = contents
    .filter((c) => c.metrics)
    .sort((a, b) => (b.metrics?.views ?? 0) - (a.metrics?.views ?? 0))
    .slice(0, 5);

  const series = contents
    .filter((c) => c.metrics && c.publishedAt)
    .map((c) => ({
      name: c.title.split(" ").slice(0, 3).join(" "),
      views: c.metrics!.views,
      likes: c.metrics!.likes,
      engagement: Math.round(c.metrics!.engagementRate * 1000) / 10,
      sentiment: Math.round(c.metrics!.sentiment * 100),
    }));

  const byDivision = divisions.map((d) => {
    const ds = contents.filter((c) => c.divisionId === d.id);
    const reach = ds.reduce((sum, c) => sum + (c.metrics?.reach ?? 0), 0);
    return {
      name: d.shortName,
      value: reach,
      color: d.color,
    };
  });

  return (
    <AppShell width="wide">
      <SectionHeader
        eyebrow="Insight Organisasi"
        title="Analytics Dashboard"
        description={`${contents.length} konten publish · agregat dari semua channel.`}
      />

      <div className="mt-2 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <KPI
          icon={<Eye className="size-4" strokeWidth={1.75} />}
          label="Total views"
          value={humanNumber(totals.views)}
        />
        <KPI
          icon={<Heart className="size-4" strokeWidth={1.75} />}
          label="Likes"
          value={humanNumber(totals.likes)}
        />
        <KPI
          icon={<TrendingUp className="size-4" strokeWidth={1.75} />}
          label="Avg engagement"
          value={percent(avgEng, 2)}
          accent="brand"
        />
        <KPI
          icon={<Sparkles className="size-4" strokeWidth={1.75} />}
          label="Avg sentiment"
          value={(avgSentiment * 100).toFixed(0) + "%"}
          accent={avgSentiment > 0 ? "brand" : "danger"}
        />
      </div>

      <div className="mt-8">
        <AnalyticsCharts series={series} byDivision={byDivision} />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[2fr_1fr]">
        <GlassCard className="p-5">
          <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-foreground/55">
            Top 5 konten publish
          </p>
          <ul className="mt-3 divide-y divide-foreground/10 dark:divide-white/10">
            {top.map((c, i) => {
              const author = findMember(c.authorId);
              return (
                <li
                  key={c.id}
                  className="flex items-center justify-between gap-3 py-3"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="grid size-7 shrink-0 place-items-center rounded-full bg-foreground/[0.04] font-mono text-[12px] font-semibold text-foreground/65 dark:bg-white/5">
                      {i + 1}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-[13px] font-medium">{c.title}</p>
                      <p className="truncate text-[11px] text-foreground/55">
                        {author?.name ?? "—"}
                      </p>
                    </div>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="font-mono text-[12px] font-semibold">
                      {humanNumber(c.metrics!.views)}
                    </p>
                    <p className="text-[10px] text-foreground/55">
                      ER {percent(c.metrics!.engagementRate, 2)}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        </GlassCard>

        <aside className="space-y-4">
          <GlassCard variant="thick" className="p-5">
            <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-foreground/55">
              <Sparkles className="size-3.5 text-gold-500" strokeWidth={2} />
              Weekly Digest · {digest.isoWeek}
            </div>
            <p className="mt-2 text-[13px] font-semibold">
              Reach minggu ini: {humanNumber(digest.totalReach)}
            </p>
            <div className="mt-3">
              <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-foreground/55">
                Highlight
              </p>
              <ul className="mt-1 list-disc space-y-1 pl-4 text-[12px] text-foreground/75">
                {digest.highlights.map((h, i) => (
                  <li key={i}>{h}</li>
                ))}
              </ul>
            </div>
            <div className="mt-3">
              <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-foreground/55">
                Rekomendasi AI
              </p>
              <ul className="mt-1 list-disc space-y-1 pl-4 text-[12px] text-foreground/75">
                {digest.recommendations.map((h, i) => (
                  <li key={i}>{h}</li>
                ))}
              </ul>
            </div>
          </GlassCard>

          <GlassCard className="p-5">
            <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-foreground/55">
              Performa divisi
            </p>
            <ul className="mt-3 space-y-2 text-[12px]">
              {divBoard.map((d) => (
                <li key={d.division.id} className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5">
                    <span
                      className="size-2 rounded-full"
                      style={{ background: d.division.color }}
                    />
                    {d.division.shortName}
                  </span>
                  <span className="font-mono text-foreground/65">
                    {d.postCount} · {percent(d.engagementRate, 1)}
                  </span>
                </li>
              ))}
            </ul>
          </GlassCard>
        </aside>
      </div>
    </AppShell>
  );
}

function KPI({
  icon,
  label,
  value,
  accent = "neutral",
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  accent?: "neutral" | "brand" | "danger";
}) {
  return (
    <GlassCard className="p-4">
      <p
        className={`flex items-center gap-1 text-[10px] uppercase tracking-[0.16em] ${
          accent === "brand"
            ? "text-brand-700 dark:text-brand-300"
            : accent === "danger"
              ? "text-rose-700 dark:text-rose-300"
              : "text-foreground/55"
        }`}
      >
        {icon}
        {label}
      </p>
      <p className="mt-2 font-display text-2xl font-semibold tracking-tight">
        {value}
      </p>
    </GlassCard>
  );
}
