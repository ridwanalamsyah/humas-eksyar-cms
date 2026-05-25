/**
 * Print-friendly annual / monthly report.
 *
 * Visit `/report?year=2026` or `/report?month=2026-09` then "Save as PDF"
 * from the browser. Includes aggregate stats per rubric, channel, status,
 * top authors, plus the full content list.
 */

import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { auth } from "@/auth";
import {
  findMemberByEmail,
  listContents,
  listMembers,
  listEvents,
  getBrandingConfig,
} from "@/lib/data/provider";
import type { ContentItem, Member } from "@/lib/data/types";
import { ReportPrintActions } from "@/components/report/report-print-actions";

export const metadata: Metadata = {
  title: "Laporan",
  description: "Rangkuman aktivitas humas yang siap di-save sebagai PDF.",
};

interface Props {
  searchParams: Promise<{ year?: string; month?: string }>;
}

function within(c: ContentItem, start: Date, end: Date): boolean {
  const refRaw = c.publishedAt ?? c.scheduledFor ?? c.createdAt;
  const ref = new Date(refRaw);
  return ref >= start && ref <= end;
}

function countBy<T extends string>(
  arr: ContentItem[],
  key: (c: ContentItem) => T,
): Record<T, number> {
  const m = {} as Record<T, number>;
  for (const c of arr) {
    const k = key(c);
    m[k] = (m[k] ?? 0) + 1;
  }
  return m;
}

export default async function ReportPage({ searchParams }: Props) {
  const session = await auth();
  if (!session?.user?.email) {
    return (
      <div className="p-10 text-center">
        <p className="text-sm text-foreground/65">
          Login dulu untuk membuka laporan.
        </p>
        <Link
          href="/login"
          className="mt-3 inline-block rounded-xl border border-foreground/20 px-3 py-1.5 text-sm"
        >
          Login
        </Link>
      </div>
    );
  }
  const me = await findMemberByEmail(session.user.email);
  if (!me) {
    return (
      <div className="p-10 text-center text-sm text-foreground/65">
        Akun Anda belum terkait dengan member roster.
      </div>
    );
  }

  const params = await searchParams;
  let start: Date;
  let end: Date;
  let title: string;
  let subtitle: string;
  if (params.month) {
    const [y, m] = params.month.split("-").map((s) => parseInt(s, 10));
    start = new Date(Date.UTC(y, m - 1, 1, 0, 0, 0));
    end = new Date(Date.UTC(y, m, 0, 23, 59, 59));
    title = `Laporan Bulanan ${start.toLocaleDateString("id-ID", { month: "long", year: "numeric" })}`;
    subtitle = `Periode 1 — ${end.getUTCDate()} ${start.toLocaleDateString("id-ID", { month: "long", year: "numeric" })}`;
  } else {
    const year = params.year ? parseInt(params.year, 10) : new Date().getUTCFullYear();
    start = new Date(Date.UTC(year, 0, 1, 0, 0, 0));
    end = new Date(Date.UTC(year, 11, 31, 23, 59, 59));
    title = `Laporan Tahunan ${year}`;
    subtitle = `Periode 1 Januari — 31 Desember ${year}`;
  }

  const [allContents, allMembers, allEvents, branding] = await Promise.all([
    listContents(),
    listMembers(),
    listEvents(),
    getBrandingConfig(),
  ]);
  const contents = allContents.filter((c) => within(c, start, end));
  const events = allEvents.filter((e) => {
    const t = new Date(e.startsAt);
    return t >= start && t <= end;
  });

  const byRubric = countBy(contents, (c) => c.rubric);
  const byStatus = countBy(contents, (c) => c.status);
  const byChannel: Record<string, number> = {};
  for (const c of contents) {
    for (const ch of c.channels) {
      byChannel[ch] = (byChannel[ch] ?? 0) + 1;
    }
  }

  const byAuthor: Record<string, number> = {};
  for (const c of contents) {
    byAuthor[c.authorId] = (byAuthor[c.authorId] ?? 0) + 1;
  }
  const memberById = new Map<string, Member>(allMembers.map((m) => [m.id, m]));
  const topAuthors = Object.entries(byAuthor)
    .map(([id, count]) => ({ member: memberById.get(id), count }))
    .filter((x): x is { member: Member; count: number } => !!x.member)
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  const published = contents.filter((c) => c.status === "published");
  const totalReach = published.reduce(
    (acc, c) => acc + (c.metrics?.reach ?? 0),
    0,
  );
  const totalEngagement = published.reduce(
    (acc, c) => acc + (c.metrics?.likes ?? 0) + (c.metrics?.comments ?? 0),
    0,
  );

  return (
    <div className="report-root mx-auto max-w-3xl px-6 py-10 font-sans text-[14px] leading-relaxed text-foreground print:max-w-none print:px-10 print:py-6">
      <div className="mb-6 flex items-center justify-between print:hidden">
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-sm text-foreground/55 hover:text-foreground"
        >
          <ArrowLeft className="size-4" /> Dashboard
        </Link>
        <ReportPrintActions />
      </div>

      <header className="border-b border-foreground/15 pb-4">
        <p className="text-[11px] uppercase tracking-[0.25em] text-foreground/55">
          {branding.orgName}
        </p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight">{title}</h1>
        <p className="mt-1 text-[12px] text-foreground/65">{subtitle}</p>
      </header>

      <section className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label="Total konten" value={contents.length.toString()} />
        <Stat label="Dipublikasi" value={published.length.toString()} />
        <Stat label="Event" value={events.length.toString()} />
        <Stat
          label="Total reach"
          value={
            totalReach > 0 ? Intl.NumberFormat("id-ID").format(totalReach) : "—"
          }
        />
      </section>

      <Section title="Sebaran rubrik">
        <Bars items={byRubric} />
      </Section>

      <Section title="Status terakhir">
        <Bars items={byStatus} />
      </Section>

      {Object.keys(byChannel).length > 0 && (
        <Section title="Distribusi channel">
          <Bars items={byChannel} />
        </Section>
      )}

      <Section title="Top kontributor">
        {topAuthors.length === 0 ? (
          <p className="text-[12px] text-foreground/55">
            Belum ada konten untuk periode ini.
          </p>
        ) : (
          <ol className="space-y-1.5 text-[13px]">
            {topAuthors.map(({ member, count }, idx) => (
              <li key={member.id} className="flex justify-between">
                <span>
                  <b className="text-foreground/55">{idx + 1}.</b> {member.name}{" "}
                  <span className="text-foreground/55">· {member.role}</span>
                </span>
                <span className="font-medium tabular-nums">{count}</span>
              </li>
            ))}
          </ol>
        )}
      </Section>

      <Section title="Engagement">
        <ul className="space-y-1.5 text-[13px]">
          <li className="flex justify-between">
            <span>Total likes + komentar</span>
            <b className="tabular-nums">
              {Intl.NumberFormat("id-ID").format(totalEngagement)}
            </b>
          </li>
          <li className="flex justify-between">
            <span>Rata-rata engagement rate</span>
            <b className="tabular-nums">
              {published.length > 0
                ? (
                    (published.reduce(
                      (s, c) => s + (c.metrics?.engagementRate ?? 0),
                      0,
                    ) /
                      published.length) *
                    100
                  ).toFixed(2) + "%"
                : "—"}
            </b>
          </li>
        </ul>
      </Section>

      <Section title="Daftar konten">
        {contents.length === 0 ? (
          <p className="text-[12px] text-foreground/55">
            Tidak ada konten untuk periode ini.
          </p>
        ) : (
          <ol className="space-y-2 text-[12.5px]">
            {contents
              .slice()
              .sort((a, b) => {
                const da = new Date(a.publishedAt ?? a.scheduledFor ?? a.createdAt).getTime();
                const db = new Date(b.publishedAt ?? b.scheduledFor ?? b.createdAt).getTime();
                return da - db;
              })
              .map((c) => {
                const author = memberById.get(c.authorId);
                return (
                  <li
                    key={c.id}
                    className="border-b border-foreground/10 pb-1.5 last:border-none"
                  >
                    <div className="flex flex-wrap items-baseline justify-between gap-1">
                      <span className="font-medium">{c.title}</span>
                      <span className="text-[11px] text-foreground/55">
                        {new Date(
                          c.publishedAt ?? c.scheduledFor ?? c.createdAt,
                        ).toLocaleDateString("id-ID", {
                          day: "2-digit",
                          month: "short",
                          year: "2-digit",
                        })}
                      </span>
                    </div>
                    <div className="mt-0.5 text-[11px] text-foreground/65">
                      {c.rubric.replace(/_/g, " ")} · {c.status}
                      {author && ` · ${author.name}`}
                      {c.channels.length > 0 && ` · ${c.channels.join(", ")}`}
                    </div>
                  </li>
                );
              })}
          </ol>
        )}
      </Section>

      <footer className="mt-10 border-t border-foreground/15 pt-3 text-[11px] text-foreground/55">
        Dihasilkan oleh {branding.orgName} CMS · {new Date().toLocaleString("id-ID")}
        {` · oleh ${me.name}`}
      </footer>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-foreground/15 bg-foreground/[0.03] p-3">
      <p className="text-[10px] uppercase tracking-[0.16em] text-foreground/55">
        {label}
      </p>
      <p className="mt-1 text-lg font-semibold tabular-nums">{value}</p>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-6">
      <h2 className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-foreground/55">
        {title}
      </h2>
      {children}
    </section>
  );
}

function Bars({ items }: { items: Record<string, number> }) {
  const entries = Object.entries(items).sort((a, b) => b[1] - a[1]);
  const max = Math.max(1, ...entries.map(([, n]) => n));
  return (
    <ul className="space-y-1.5">
      {entries.map(([k, v]) => (
        <li key={k} className="text-[12.5px]">
          <div className="mb-0.5 flex justify-between">
            <span>{k.replace(/_/g, " ")}</span>
            <b className="tabular-nums">{v}</b>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-foreground/10">
            <div
              className="h-full bg-foreground/60"
              style={{ width: `${(v / max) * 100}%` }}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}
