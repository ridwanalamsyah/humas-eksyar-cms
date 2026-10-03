import Link from "next/link";
import { ArrowRight, Camera, PenLine } from "lucide-react";
import { getCurrentMember, listContents, listEvents, listMembers } from "@/lib/data/provider";
import { AppShell } from "@/components/layout/app-shell";
import { OpsAlerts } from "@/components/dashboard/ops-alerts";
import { LaunchChecklist } from "@/components/dashboard/launch-checklist";
import { Button } from "@/components/ui/button";
import { StatusPill } from "@/components/common/pill";
import { formatHijri, formatLongDate, formatShortDate, formatTime, relativeFromNow } from "@/lib/format/dates";
import { findMember } from "@/lib/fixtures/members";
import type { ContentItem } from "@/lib/data/types";

// Selalu render ulang: peringatan sinkron & formulir harus terkini.
export const dynamic = "force-dynamic";

const REVIEW: ContentItem["status"][] = ["review_divisi", "review_sekjen"];

export default async function HomePage() {
  const now = new Date();
  const in30 = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
  const [member, contents, events, members] = await Promise.all([
    getCurrentMember(),
    listContents(),
    listEvents({ fromDate: now.toISOString() }),
    listMembers(),
  ]);

  const waiting = contents.filter((c) => REVIEW.includes(c.status));
  const stats = [
    { label: "Dipublikasikan", value: contents.filter((c) => c.status === "published").length, href: "/content" },
    { label: "Menunggu review", value: waiting.length, href: "/approval" },
    { label: "Draft & ide", value: contents.filter((c) => c.status === "draft" || c.status === "idea").length, href: "/content" },
    { label: "Agenda 30 hari", value: events.filter((e) => new Date(e.startsAt) <= in30).length, href: "/events" },
  ];
  const recent = contents.slice(0, 6);
  const authorName = (id: string) => members.find((m) => m.id === id)?.name ?? findMember(id)?.name ?? "—";

  return (
    <AppShell>
      {/* Sapaan */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[13px] text-foreground/50">
            {formatLongDate(now)}
            {formatHijri(now) && ` · ${formatHijri(now)}`}
          </p>
          <h1 className="mt-1 text-[26px] font-semibold tracking-tight sm:text-[30px]">
            Assalamualaikum, {member.name.split(" ")[0]}
          </h1>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" asChild>
            <Link href="/content/instagram">
              <Camera className="size-4" strokeWidth={1.75} /> Dari Instagram
            </Link>
          </Button>
          <Button asChild>
            <Link href="/content/new">
              <PenLine className="size-4" strokeWidth={1.75} /> Tulis berita
            </Link>
          </Button>
        </div>
      </div>

      {member.role === "admin" && (
        <>
          <OpsAlerts />
          <LaunchChecklist />
        </>
      )}

      {/* Angka ringkas */}
      <dl className="mt-8 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {stats.map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className="glass-regular rounded-xl px-4 py-3.5 transition-colors hover:border-foreground/20"
          >
            <dt className="text-[12.5px] text-foreground/55">{s.label}</dt>
            <dd className="mt-1 text-[26px] font-semibold tabular-nums tracking-tight">{s.value}</dd>
          </Link>
        ))}
      </dl>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.7fr_1fr]">
        {/* Konten terbaru */}
        <section className="glass-regular rounded-xl">
          <header className="flex items-center justify-between border-b border-foreground/[0.07] px-5 py-3.5 dark:border-white/[0.07]">
            <h2 className="text-[14px] font-semibold">Konten terbaru</h2>
            <Link href="/content" className="inline-flex items-center gap-1 text-[13px] text-foreground/55 hover:text-foreground">
              Semua <ArrowRight className="size-3.5" />
            </Link>
          </header>
          {recent.length === 0 ? (
            <div className="px-5 py-12 text-center">
              <p className="text-[14px] text-foreground/60">Belum ada konten.</p>
              <Button asChild size="sm" className="mt-3">
                <Link href="/content/new">Tulis konten pertama</Link>
              </Button>
            </div>
          ) : (
            <ul className="divide-y divide-foreground/[0.06] dark:divide-white/[0.06]">
              {recent.map((c) => (
                <li key={c.id}>
                  <Link href={`/content/${c.id}`} className="flex items-center gap-4 px-5 py-3 hover:bg-foreground/[0.025]">
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[14px] font-medium">{c.title}</p>
                      <p className="truncate text-[12px] text-foreground/50">
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

        <div className="flex flex-col gap-6">
          {/* Perlu review */}
          <section className="glass-regular rounded-xl">
            <header className="flex items-center justify-between border-b border-foreground/[0.07] px-5 py-3.5 dark:border-white/[0.07]">
              <h2 className="text-[14px] font-semibold">Perlu review</h2>
              <span className="rounded-full bg-foreground/[0.06] px-2 py-0.5 text-[12px] tabular-nums">{waiting.length}</span>
            </header>
            {waiting.length === 0 ? (
              <p className="px-5 py-6 text-[13px] text-foreground/55">Semua konten sudah direview.</p>
            ) : (
              <ul className="divide-y divide-foreground/[0.06] dark:divide-white/[0.06]">
                {waiting.slice(0, 4).map((c) => (
                  <li key={c.id}>
                    <Link href={`/content/${c.id}`} className="block px-5 py-3 hover:bg-foreground/[0.025]">
                      <p className="truncate text-[13.5px] font-medium">{c.title}</p>
                      <p className="text-[12px] text-foreground/50">{authorName(c.authorId)}</p>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </section>

          {/* Agenda */}
          <section className="glass-regular rounded-xl">
            <header className="flex items-center justify-between border-b border-foreground/[0.07] px-5 py-3.5 dark:border-white/[0.07]">
              <h2 className="text-[14px] font-semibold">Agenda</h2>
              <Link href="/calendar" className="inline-flex items-center gap-1 text-[13px] text-foreground/55 hover:text-foreground">
                Kalender <ArrowRight className="size-3.5" />
              </Link>
            </header>
            {events.length === 0 ? (
              <p className="px-5 py-6 text-[13px] text-foreground/55">Belum ada agenda.</p>
            ) : (
              <ul className="divide-y divide-foreground/[0.06] dark:divide-white/[0.06]">
                {events.slice(0, 4).map((e) => (
                  <li key={e.id}>
                    <Link href={`/events/${e.id}`} className="flex gap-3 px-5 py-3 hover:bg-foreground/[0.025]">
                      <span className="w-16 shrink-0 text-[12px] leading-tight text-foreground/55">
                        {formatShortDate(e.startsAt)}
                        <br />
                        {formatTime(e.startsAt)}
                      </span>
                      <span className="min-w-0">
                        <span className="block truncate text-[13.5px] font-medium">{e.title}</span>
                        <span className="block truncate text-[12px] text-foreground/50">{e.location}</span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </div>
    </AppShell>
  );
}
