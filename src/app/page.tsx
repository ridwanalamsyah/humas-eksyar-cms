import {
  getCurrentMember,
  listContents,
  listEvents,
  getWeeklyDigest,
  listDivisions,
  listLeaderboard,
  listQuests,
  listNotifications,
  listMedia,
} from "@/lib/data/provider";
import { AppShell } from "@/components/layout/app-shell";
import { DashboardHero } from "@/components/dashboard/dashboard-hero";
import { ContentCard } from "@/components/content/content-card";
import { SectionHeader } from "@/components/common/section-header";
import { GlassCard } from "@/components/ui/glass-card";
import { StatRow } from "@/components/dashboard/stat-row";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { UpcomingEvents } from "@/components/dashboard/upcoming-events";
import { LeaderboardSnippet } from "@/components/dashboard/leaderboard-snippet";
import { QuestProgress } from "@/components/dashboard/quest-progress";
import { findDivision } from "@/lib/fixtures/divisions";
import { findMember } from "@/lib/fixtures/members";
import { findMedia } from "@/lib/fixtures/media";
import { Sparkles } from "lucide-react";

export default async function HomePage() {
  const [member, contents, events, digest, divisions, leaderboard, quests, notifs, media] =
    await Promise.all([
      getCurrentMember(),
      listContents(),
      listEvents({ fromDate: new Date().toISOString() }),
      getWeeklyDigest(),
      listDivisions(),
      listLeaderboard(),
      listQuests(),
      listNotifications("mbr-aulia"),
      listMedia(),
    ]);

  const recent = contents.slice(0, 6);
  const featured = contents.find((c) => c.id === digest.topContentId) ?? contents[0];
  const featuredAuthor = findMember(featured.authorId)!;
  const featuredDivision = findDivision(featured.divisionId);
  const featuredCover = featured.mediaIds[0] ? findMedia(featured.mediaIds[0]) : null;

  return (
    <AppShell>
      <DashboardHero
        member={member}
        digest={digest}
        unreadCount={notifs.filter((n) => !n.read).length}
      />

      <div className="mt-6">
        <StatRow
          totalPublished={contents.filter((c) => c.status === "published").length}
          weeklyContent={contents.filter((c) => {
            const w = new Date();
            w.setDate(w.getDate() - 7);
            return c.updatedAt >= w.toISOString();
          }).length}
          mediaCount={media.length}
          divisionsActive={divisions.length}
        />
      </div>

      <div className="mt-8">
        <SectionHeader
          eyebrow="Aksi cepat"
          title="Mulai dari mana?"
          description="Tools yang paling sering kamu pakai — supaya momentum tidak hilang."
        />
        <QuickActions />
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-[2fr_1fr]">
        <section>
          <SectionHeader
            eyebrow="Editorial"
            title="Konten terbaru tim"
            description="Real-time feed dari semua divisi. Klik untuk buka detail + AI sidebar."
            cta={{ label: "Lihat semua", href: "/content" }}
          />
          <div className="grid gap-4 sm:grid-cols-2">
            {recent.map((c) => {
              const author = findMember(c.authorId);
              const division = findDivision(c.divisionId);
              const cover = c.mediaIds[0] ? findMedia(c.mediaIds[0]) : null;
              if (!author) return null;
              return (
                <ContentCard
                  key={c.id}
                  content={c}
                  division={division}
                  author={author}
                  cover={cover}
                />
              );
            })}
          </div>
        </section>

        <aside className="flex flex-col gap-6">
          <UpcomingEvents events={events.slice(0, 4)} />
          <LeaderboardSnippet members={leaderboard.slice(0, 5)} />
          <QuestProgress quests={quests.filter((q) => !q.completed).slice(0, 3)} />
        </aside>
      </div>

      <div className="mt-10">
        <SectionHeader
          eyebrow="AI Highlight"
          title="Konten paling resonan minggu ini"
          description="Berdasarkan reach × engagement × sentiment."
          cta={{ label: "Detail analytics", href: "/analytics" }}
        />
        <GlassCard variant="thick" className="grid gap-6 overflow-hidden p-6 sm:grid-cols-[1.1fr_1fr] sm:p-8">
          <div>
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-foreground/55">
              <Sparkles className="size-3.5 text-gold-500" strokeWidth={2} />
              <span>Top performer · {digest.isoWeek}</span>
            </div>
            <h3 className="mt-3 font-display text-2xl font-semibold leading-tight tracking-tight">
              {featured.title}
            </h3>
            {featured.caption && (
              <p className="mt-3 line-clamp-4 text-[14px] leading-relaxed text-foreground/75">
                {featured.caption.split("\n\n")[0]}
              </p>
            )}
            {featured.metrics && (
              <div className="mt-5 grid grid-cols-3 gap-3 text-center">
                <div>
                  <p className="font-display text-xl font-semibold">{featured.metrics.views.toLocaleString("id-ID")}</p>
                  <p className="text-[11px] uppercase tracking-wider text-foreground/55">Views</p>
                </div>
                <div>
                  <p className="font-display text-xl font-semibold text-brand-600 dark:text-brand-300">{(featured.metrics.engagementRate * 100).toFixed(1)}%</p>
                  <p className="text-[11px] uppercase tracking-wider text-foreground/55">Engagement</p>
                </div>
                <div>
                  <p className="font-display text-xl font-semibold text-gold-500">{Math.round(featured.metrics.sentiment * 100)}</p>
                  <p className="text-[11px] uppercase tracking-wider text-foreground/55">Sentiment</p>
                </div>
              </div>
            )}
          </div>
          {featuredCover && (
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
              <span aria-hidden className="absolute inset-0" style={{ background: featuredCover.averageColor }} />
              <img
                src={featuredCover.url}
                alt={featuredCover.alt}
                className="absolute inset-0 size-full object-cover"
              />
              <span aria-hidden className="absolute inset-0 bg-gradient-to-tr from-black/40 via-transparent to-brand-500/15" />
              <span
                className="absolute bottom-3 left-3 rounded-full px-2 py-0.5 text-[11px] font-semibold backdrop-blur"
                style={{ background: `${featuredDivision.color}33`, color: featuredDivision.color, border: `1px solid ${featuredDivision.color}66` }}
              >
                {featuredDivision.shortName} · {featuredAuthor.name.split(" ")[0]}
              </span>
            </div>
          )}
        </GlassCard>
      </div>

      <footer className="mt-16 text-center">
        <p className="font-serif text-2xl italic tracking-tight text-foreground/65">
          Eksyar Satu, Victory in Harmony.
        </p>
        <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.2em] text-foreground/45">
          Humas Eksyar UIN SGD · Phase 0–6 · 2026
        </p>
      </footer>
    </AppShell>
  );
}
