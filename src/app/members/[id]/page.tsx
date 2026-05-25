import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  getMember,
  listContents,
  listBadges,
  listXPLogs,
} from "@/lib/data/provider";
import { AppShell } from "@/components/layout/app-shell";
import { GlassCard } from "@/components/ui/glass-card";
import { Avatar } from "@/components/common/avatar";
import { Pill } from "@/components/common/pill";
import { ProgressBar } from "@/components/common/progress-bar";
import { ContentCard } from "@/components/content/content-card";
import { Flame, Award, Mail, Calendar as CalIcon } from "lucide-react";
import { findMember } from "@/lib/fixtures/members";
import { findMedia } from "@/lib/fixtures/media";
import { formatLongDate } from "@/lib/format/dates";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const member = await getMember(id);
  if (!member) return {};
  return {
    title: member.name,
    description: `${member.position} · ${member.bio ?? "Anggota Humas Eksyar."}`,
  };
}

export default async function MemberDetailPage({ params }: PageProps) {
  const { id } = await params;
  const member = await getMember(id);
  if (!member) notFound();

  const [allContents, allBadges, xpLogs] = await Promise.all([
    listContents({ authorId: id }),
    listBadges(),
    listXPLogs(id),
  ]);

  const memberBadges = allBadges.filter((b) => member.badges.includes(b.id));

  const nextTierThreshold = nextThreshold(member.xp);
  const prevTierThreshold = previousThreshold(member.xp);
  const progress =
    (member.xp - prevTierThreshold) / (nextTierThreshold - prevTierThreshold);

  return (
    <AppShell width="wide">
      <div className="grid gap-6 lg:grid-cols-[1fr_2fr]">
        <aside className="space-y-4">
          <GlassCard variant="thick" className="p-6 text-center">
            <div className="mx-auto inline-block">
              <Avatar member={member} size={96} />
            </div>
            <h1 className="mt-4 font-display text-2xl font-semibold tracking-tight">
              {member.name}
            </h1>
            <p className="mt-1 text-[13px] text-foreground/65">
              {member.position}
            </p>
            <div className="mt-3 flex flex-wrap items-center justify-center gap-1.5">
              <Pill>Angkatan {member.angkatan}</Pill>
            </div>
            {member.bio && (
              <p className="mt-4 text-[13px] leading-relaxed text-foreground/75">
                {member.bio}
              </p>
            )}
            <div className="mt-5 space-y-1.5 text-left text-[12px] text-foreground/65">
              <p className="flex items-center gap-2">
                <Mail className="size-3.5" strokeWidth={1.75} />
                {member.email}
              </p>
              <p className="flex items-center gap-2">
                <CalIcon className="size-3.5" strokeWidth={1.75} />
                Bergabung {formatLongDate(member.joinedAt)}
              </p>
            </div>
          </GlassCard>

          <GlassCard className="p-5">
            <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.16em] text-foreground/55">
              <span>Progression</span>
              <span>{member.xp.toLocaleString()} XP</span>
            </div>
            <ProgressBar value={progress} className="mt-3" />
            <p className="mt-2 text-[12px] text-foreground/60">
              {Math.round((nextTierThreshold - member.xp) / 100) * 100} XP lagi
              menuju tier berikutnya.
            </p>
            <div className="mt-4 grid grid-cols-2 gap-3 border-t border-foreground/10 pt-3 text-center text-[11px] dark:border-white/10">
              <div>
                <p className="text-foreground/55">Streak harian</p>
                <p className="mt-0.5 text-[14px] font-semibold inline-flex items-center gap-1">
                  <Flame className="size-3.5 text-gold-500" strokeWidth={2} />
                  {member.streak} hari
                </p>
              </div>
              <div>
                <p className="text-foreground/55">Posting publish</p>
                <p className="mt-0.5 text-[14px] font-semibold">
                  {allContents.filter((c) => c.status === "published").length}
                </p>
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-5">
            <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-foreground/55">
              Badge dimiliki ({memberBadges.length})
            </p>
            <div className="mt-3 grid grid-cols-3 gap-2">
              {memberBadges.map((b) => (
                <Link
                  key={b.id}
                  href={`/badges#${b.slug}`}
                  className="group relative grid place-items-center rounded-xl border border-foreground/10 bg-foreground/[0.04] py-3 transition-transform hover:-translate-y-0.5 dark:border-white/10 dark:bg-white/5"
                  title={`${b.name} — ${b.description}`}
                >
                  <Award
                    className="size-5 text-brand-500 group-hover:text-brand-600"
                    strokeWidth={1.75}
                  />
                  <span className="mt-1 max-w-full truncate px-1 text-[10px] text-foreground/70">
                    {b.name}
                  </span>
                </Link>
              ))}
              {memberBadges.length === 0 && (
                <p className="col-span-3 text-center text-[12px] text-foreground/55">
                  Belum ada badge — yuk mulai kontribusi.
                </p>
              )}
            </div>
          </GlassCard>
        </aside>

        <section className="space-y-6">
          <GlassCard className="p-5">
            <h2 className="font-display text-lg font-semibold tracking-tight">
              Aktivitas XP terakhir
            </h2>
            <p className="mt-1 text-[12px] text-foreground/65">
              Setiap kontribusi yang tercatat di sistem.
            </p>
            <div className="mt-4 space-y-2">
              {xpLogs.slice(0, 6).map((log) => (
                <div
                  key={log.id}
                  className="flex items-start justify-between gap-3 rounded-xl border border-foreground/10 bg-foreground/[0.03] px-3 py-2.5 text-[13px] dark:border-white/10 dark:bg-white/[0.03]"
                >
                  <div>
                    <p className="font-medium">{log.reason}</p>
                    <p className="text-[11px] text-foreground/55">
                      {formatLongDate(log.at)} · {log.source}
                    </p>
                  </div>
                  <span className="shrink-0 font-mono text-[12px] font-semibold text-brand-700 dark:text-brand-300">
                    +{log.amount}
                  </span>
                </div>
              ))}
              {xpLogs.length === 0 && (
                <p className="text-[12px] text-foreground/55">
                  Belum ada aktivitas tercatat.
                </p>
              )}
            </div>
          </GlassCard>

          <div>
            <h2 className="font-display text-lg font-semibold tracking-tight">
              Konten kontribusi
            </h2>
            <p className="mt-1 text-[12px] text-foreground/65">
              Semua post yang ditulis atau dijadwalkan oleh anggota ini.
            </p>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {allContents.slice(0, 6).map((c) => {
                const author = findMember(c.authorId);
                const cover = c.mediaIds[0] ? findMedia(c.mediaIds[0]) : null;
                if (!author) return null;
                return (
                  <ContentCard
                    key={c.id}
                    content={c}
                    author={author}
                    cover={cover}
                  />
                );
              })}
              {allContents.length === 0 && (
                <p className="col-span-2 rounded-xl border border-dashed border-foreground/15 p-6 text-center text-[12px] text-foreground/55">
                  Belum ada konten dari anggota ini.
                </p>
              )}
            </div>
          </div>
        </section>
      </div>
    </AppShell>
  );
}

const TIER_THRESHOLDS = [0, 500, 1500, 3000, 5000, 8000, 12000, 18000];
function nextThreshold(xp: number) {
  return TIER_THRESHOLDS.find((t) => t > xp) ?? xp + 1000;
}
function previousThreshold(xp: number) {
  return TIER_THRESHOLDS.filter((t) => t <= xp).slice(-1)[0] ?? 0;
}
