import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowRight, PenLine, Globe } from "lucide-react";
import {
  getCurrentMember,
  listContents,
  listEvents,
  listMembers,
  listPageViews,
} from "@/lib/data/provider";
import { AppShell } from "@/components/layout/app-shell";
import { OpsAlerts } from "@/components/dashboard/ops-alerts";
import { Button } from "@/components/ui/button";
import { StatusPill } from "@/components/common/pill";
import {
  formatHijri,
  formatLongDate,
  formatShortDate,
  formatTime,
  relativeFromNow,
} from "@/lib/format/dates";
import { findMember } from "@/lib/fixtures/members";
import type { ContentItem } from "@/lib/data/types";
import {
  ContentDistributionCard,
  TopPagesList,
  ViewsAreaChart,
} from "@/components/dashboard/dashboard-charts";

// Selalu render ulang agar data statistik dan konten selalu mutakhir
export const dynamic = "force-dynamic";

const REVIEW: ContentItem["status"][] = ["review_divisi", "review_sekjen"];

export default async function DashboardPage() {
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const in30 = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

  const [member, contents, events, members, views] = await Promise.all([
    getCurrentMember(),
    listContents().catch(() => []),
    listEvents({ fromDate: now.toISOString() }).catch(() => []),
    listMembers().catch(() => []),
    listPageViews(thirtyDaysAgo.toISOString().slice(0, 10)).catch(() => []),
  ]);

  if (member.role === "anggota") {
    redirect("/content");
  }

  const waiting = contents.filter((c) => REVIEW.includes(c.status));
  const publishedCount = contents.filter((c) => c.status === "published").length;
  const draftCount = contents.filter(
    (c) => c.status === "draft" || c.status === "idea",
  ).length;
  const totalViews = views.reduce((sum, v) => sum + v.count, 0);

  const stats = [
    {
      label: "Kunjungan 30 hari",
      value: totalViews.toLocaleString("id-ID"),
      desc: "Total klik halaman publik",
      href: "/settings/kinerja",
    },
    {
      label: "Terbit",
      value: publishedCount.toLocaleString("id-ID"),
      desc: "Tayang di website prodi",
      href: "/content",
    },
    {
      label: "Menunggu persetujuan",
      value: waiting.length.toLocaleString("id-ID"),
      desc: "Perlu ditinjau pengurus",
      href: "/content",
      highlight: waiting.length > 0,
    },
    {
      label: "Agenda",
      value: events.length.toLocaleString("id-ID"),
      desc: "Jadwal kegiatan akademik",
      href: "/events",
    },
  ];

  const recent = contents.slice(0, 5);
  const authorName = (id: string) =>
    members.find((m) => m.id === id)?.name ?? findMember(id)?.name ?? "Pengurus";

  return (
    <AppShell>
      {/* Sapaan & Tombol Cepat */}
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-foreground/[0.07] pb-6 dark:border-white/[0.07]">
        <div>
          <p className="text-[13px] text-foreground/60">
            {formatLongDate(now)}
            {formatHijri(now) && ` · ${formatHijri(now)}`}
          </p>
          <h1 className="mt-1 text-[26px] font-semibold tracking-tight sm:text-[30px]">
            Assalamu&apos;alaikum, {member.name.split(" ")[0]}
          </h1>
        </div>

        <div className="flex flex-wrap gap-2.5">
          <Button variant="secondary" asChild>
            <Link href="/" target="_blank" className="gap-2">
              <Globe className="size-4" strokeWidth={1.75} /> Lihat website
            </Link>
          </Button>
          <Button asChild className="gap-2 shadow-xs bg-emerald-600 hover:bg-emerald-700 text-white dark:bg-emerald-500">
            <Link href="/content/new">
              <PenLine className="size-4" strokeWidth={1.75} /> Tulis konten
            </Link>
          </Button>
        </div>
      </div>

      {member.role === "admin" && <OpsAlerts />}

      {/* Hari ini: tugas saya dan jadwal minggu ini, paling atas */}
      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        {/* Perlu review */}
        <section className="min-w-0 rounded-2xl border border-foreground/[0.08] bg-canvas p-5 shadow-xs dark:border-white/[0.08]">
          <header className="flex items-center justify-between border-b border-foreground/[0.07] pb-3.5 dark:border-white/[0.07]">
            <h2 className="text-[16px] font-bold text-label">Tugas saya: perlu disetujui</h2>
            <span className="rounded-full bg-foreground/[0.06] px-2.5 py-0.5 text-[13px] font-semibold tabular-nums text-foreground/75 dark:bg-white/[0.08]">
              {waiting.length}
            </span>
          </header>
          {waiting.length === 0 ? (
            <p className="py-6 text-[13px] text-foreground/60">
              Tidak ada yang menunggu. Semua konten sudah diperiksa.
            </p>
          ) : (
            <ul className="mt-2 divide-y divide-foreground/[0.06] dark:divide-white/[0.06]">
              {waiting.slice(0, 4).map((c) => (
                <li key={c.id}>
                  <Link
                    href={`/content/${c.id}`}
                    className="block py-3 transition-colors hover:bg-foreground/[0.02] -mx-2 px-2 rounded-xl"
                  >
                    <p className="truncate text-[13.5px] font-medium text-foreground">
                      {c.title}
                    </p>
                    <p className="text-[13px] text-foreground/60">
                      Oleh {authorName(c.authorId)}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Agenda */}
        <section className="min-w-0 rounded-2xl border border-foreground/[0.08] bg-canvas p-5 shadow-xs dark:border-white/[0.08]">
          <header className="flex items-center justify-between border-b border-foreground/[0.07] pb-3.5 dark:border-white/[0.07]">
            <h2 className="text-[16px] font-bold text-label">Jadwal terdekat</h2>
            <Link
              href="/calendar"
              className="inline-flex items-center gap-1 text-[13px] font-semibold text-accent hover:underline"
            >
              Kalender <ArrowRight className="size-3.5" />
            </Link>
          </header>
          {events.length === 0 ? (
            <p className="py-6 text-[13px] text-foreground/60">
              Belum ada agenda kegiatan dalam 30 hari ke depan.
            </p>
          ) : (
            <ul className="mt-2 divide-y divide-foreground/[0.06] dark:divide-white/[0.06]">
              {events.slice(0, 4).map((e) => (
                <li key={e.id}>
                  <Link
                    href={`/events/${e.id}`}
                    className="flex gap-3.5 py-3 transition-colors hover:bg-foreground/[0.02] -mx-2 px-2 rounded-xl"
                  >
                    <span className="w-16 shrink-0 text-[13px] leading-tight text-foreground/60 font-medium">
                      {formatShortDate(e.startsAt)}
                      <br />
                      <span className="text-foreground/60">{formatTime(e.startsAt)}</span>
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[13.5px] font-medium text-foreground">
                        {e.title}
                      </span>
                      <span className="block truncate text-[13px] text-foreground/60">
                        {e.location || "Online"}
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      {/* 4 Kartu KPI Ringkas */}
      <dl className="mt-6 grid grid-cols-2 gap-3.5 lg:grid-cols-4">
        {stats.map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className={`rounded-2xl border p-4 transition-all hover:scale-[1.01] ${
              s.highlight
                ? "border-amber-500/40 bg-amber-500/[0.04] dark:border-amber-400/30 dark:bg-amber-400/[0.03]"
                : "border-foreground/[0.08] bg-canvas hover:border-foreground/20 dark:border-white/[0.08]"
            }`}
          >
            <dt className="text-[13px] font-medium text-foreground/60">{s.label}</dt>
            <dd className="mt-1.5 text-[28px] font-extrabold tabular-nums tracking-tight text-foreground">
              {s.value}
            </dd>
            <p className="mt-1 text-[13px] text-foreground/60">{s.desc}</p>
          </Link>
        ))}
      </dl>

      {/* Baris Grafik & Distribusi */}
      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
        <ViewsAreaChart data={views} />
        <ContentDistributionCard
          published={publishedCount}
          review={waiting.length}
          draft={draftCount}
        />
      </div>

      {/* Baris Halaman Populer & Konten Terbaru */}
      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]">
        <TopPagesList views={views} />

        {/* Konten terbaru */}
        <section className="min-w-0 rounded-2xl border border-foreground/[0.08] bg-canvas p-5 shadow-xs dark:border-white/[0.08]">
          <header className="flex items-center justify-between border-b border-foreground/[0.07] pb-3.5 dark:border-white/[0.07]">
            <h2 className="text-[16px] font-bold text-label">Konten terbaru</h2>
            <Link
              href="/content"
              className="inline-flex items-center gap-1 text-[13px] font-semibold text-accent hover:underline"
            >
              Lihat semua <ArrowRight className="size-3.5" />
            </Link>
          </header>

          {recent.length === 0 ? (
            <div className="py-10 text-center">
              <p className="text-[14px] text-foreground/60">Belum ada konten dibuat.</p>
              <Button asChild size="sm" className="mt-3">
                <Link href="/content/new">Tulis konten pertama</Link>
              </Button>
            </div>
          ) : (
            <ul className="mt-2 divide-y divide-foreground/[0.06] dark:divide-white/[0.06]">
              {recent.map((c) => (
                <li key={c.id}>
                  <Link
                    href={`/content/${c.id}`}
                    className="flex items-center gap-3.5 py-3 transition-colors hover:bg-foreground/[0.02] -mx-2 px-2 rounded-xl"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[14px] font-medium text-foreground">
                        {c.title}
                      </p>
                      <p className="truncate text-[13px] text-foreground/60">
                        {authorName(c.authorId)} · {relativeFromNow(c.updatedAt)}
                      </p>
                    </div>
                    <StatusPill status={c.status} />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

    </AppShell>
  );
}
