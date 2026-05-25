import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar as CalendarIcon, Sparkles, Eye, Heart, Share2, MessageSquare, Bookmark, ShieldCheck, ArrowUpRight } from "lucide-react";
import { getContent, getMember, listMedia } from "@/lib/data/provider";
import { AppShell } from "@/components/layout/app-shell";
import { GlassCard } from "@/components/ui/glass-card";
import { StatusPill, Pill } from "@/components/common/pill";
import { Avatar } from "@/components/common/avatar";
import { ApprovalChain } from "@/components/content/approval-chain";
import { CaptionHistory } from "@/components/content/caption-history";
import { ContentInlineEditor } from "@/components/content/content-inline-editor";
import { CommentThread } from "@/components/content/comment-thread";
import { SuggestMedia } from "@/components/media/suggest-media";
import { auth } from "@/auth";
import { findMemberByEmail } from "@/lib/data/provider";
import { findMedia } from "@/lib/fixtures/media";
import { humanNumber, percent, formatDateTime, formatLongDate } from "@/lib/format/dates";

interface Props { params: Promise<{ id: string }> }

export default async function ContentDetail({ params }: Props) {
  const { id } = await params;
  const content = await getContent(id);
  if (!content) notFound();

  const session = await auth();
  const me = session?.user?.email
    ? await findMemberByEmail(session.user.email)
    : null;
  const canEdit = !!me;
  const canDelete = me?.role === "admin" || me?.role === "ketua_divisi";

  const author = await getMember(content.authorId);
  const media = content.mediaIds.map((m) => findMedia(m)).filter(Boolean);
  const allMedia = await listMedia();
  const relatedMedia = allMedia
    .filter((m) => !content.mediaIds.includes(m.id) && m.tags.some((t) => content.title.toLowerCase().includes(t.toLowerCase())))
    .slice(0, 3);

  return (
    <AppShell width="wide">
      <Link href="/content" className="inline-flex items-center gap-1 text-sm text-foreground/55 hover:text-foreground">
        <ArrowLeft className="size-4" strokeWidth={1.75} /> Kembali ke Konten
      </Link>

      <div className="mt-4 grid gap-6 lg:grid-cols-[2fr_1fr]">
        <article>
          <div className="flex flex-wrap items-center gap-2">
            <StatusPill status={content.status} />
            {content.captionStyle && (
              <Pill tone="gold">
                <Sparkles className="size-3" strokeWidth={2} /> AI · {content.captionStyle}
              </Pill>
            )}
            <Pill tone="brand">{content.rubric.replace(/_/g, " ")}</Pill>
          </div>

          <h1 className="mt-3 font-display text-[clamp(1.8rem,1.4rem+1.5vw,2.4rem)] font-semibold leading-[1.05] tracking-tight">
            {content.title}
          </h1>

          {author && (
            <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-foreground/65">
              <span className="flex items-center gap-2">
                <Avatar member={author} size={28} ring={false} />
                <span>{author.name}</span>
              </span>
              <span aria-hidden className="text-foreground/30">·</span>
              <span>{formatLongDate(content.publishedAt ?? content.scheduledFor ?? content.createdAt)}</span>
              {content.scheduledFor && (
                <>
                  <span aria-hidden className="text-foreground/30">·</span>
                  <span className="inline-flex items-center gap-1 text-sky-600 dark:text-sky-300">
                    <CalendarIcon className="size-3.5" strokeWidth={1.75} />
                    Terjadwal {formatDateTime(content.scheduledFor)}
                  </span>
                </>
              )}
            </div>
          )}

          {media.length > 0 && (
            <div className="mt-6 grid gap-3 sm:grid-cols-[2fr_1fr]">
              {media.map((m, i) => (
                <div
                  key={m!.id}
                  className={`relative aspect-[4/3] overflow-hidden rounded-3xl ${i === 0 ? "sm:col-span-1 sm:row-span-2" : ""}`}
                >
                  <span aria-hidden className="absolute inset-0" style={{ background: m!.averageColor }} />
                  <img src={m!.url} alt={m!.alt} className="absolute inset-0 size-full object-cover" />
                </div>
              ))}
            </div>
          )}

          <GlassCard variant="regular" className="mt-6 p-6">
            <h3 className="font-display text-sm font-semibold uppercase tracking-[0.16em] text-foreground/55">
              Caption
            </h3>
            <pre className="mt-3 whitespace-pre-wrap font-sans text-[14.5px] leading-[1.75] text-foreground/85">
              {content.caption || "(Belum ada caption — masih draft.)"}
            </pre>
            {content.hashtags && (
              <div className="mt-4 flex flex-wrap gap-1.5">
                {content.hashtags.split(" ").map((h) => (
                  <span key={h} className="rounded-full bg-brand-500/10 px-2 py-0.5 font-mono text-[11px] text-brand-700 dark:text-brand-300">
                    {h}
                  </span>
                ))}
              </div>
            )}
          </GlassCard>

          {content.body && content.body !== content.caption && (
            <GlassCard variant="thin" className="mt-4 p-6">
              <h3 className="font-display text-sm font-semibold uppercase tracking-[0.16em] text-foreground/55">
                Catatan internal
              </h3>
              <p className="mt-3 whitespace-pre-wrap text-[14px] text-foreground/75">{content.body}</p>
            </GlassCard>
          )}

          {canEdit && (
            <ContentInlineEditor
              contentId={content.id}
              initialTitle={content.title}
              initialCaption={content.caption}
              initialHashtags={content.hashtags}
              initialBody={content.body}
              initialStatus={content.status}
              canDelete={canDelete}
            />
          )}
        </article>

        <aside className="flex flex-col gap-4">
          <GlassCard variant="thick" className="p-5">
            <h3 className="text-[11px] font-medium uppercase tracking-[0.18em] text-foreground/55">Approval</h3>
            <ApprovalChain content={content} />
          </GlassCard>

          {content.metrics && (
            <GlassCard variant="regular" className="p-5">
              <h3 className="text-[11px] font-medium uppercase tracking-[0.18em] text-foreground/55">
                Performa
              </h3>
              <div className="mt-3 grid grid-cols-3 gap-3">
                <Metric icon={<Eye className="size-3" strokeWidth={1.75} />} label="Views" value={humanNumber(content.metrics.views)} />
                <Metric icon={<Heart className="size-3" strokeWidth={1.75} />} label="Likes" value={humanNumber(content.metrics.likes)} />
                <Metric icon={<MessageSquare className="size-3" strokeWidth={1.75} />} label="Komentar" value={`${content.metrics.comments}`} />
                <Metric icon={<Share2 className="size-3" strokeWidth={1.75} />} label="Shares" value={`${content.metrics.shares}`} />
                <Metric icon={<Bookmark className="size-3" strokeWidth={1.75} />} label="Saves" value={`${content.metrics.saves}`} />
                <Metric icon={<Eye className="size-3" strokeWidth={1.75} />} label="Reach" value={humanNumber(content.metrics.reach)} />
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3 border-t border-foreground/8 pt-3 dark:border-white/8">
                <div>
                  <p className="text-[11px] uppercase tracking-wider text-foreground/55">Engagement</p>
                  <p className="font-display text-xl font-semibold text-brand-600 dark:text-brand-300">
                    {percent(content.metrics.engagementRate)}
                  </p>
                </div>
                <div>
                  <p className="text-[11px] uppercase tracking-wider text-foreground/55">Sentimen</p>
                  <p className="font-display text-xl font-semibold text-gold-500">
                    {Math.round(content.metrics.sentiment * 100)}
                  </p>
                </div>
              </div>
            </GlassCard>
          )}

          <GlassCard variant="regular" className="p-5">
            <h3 className="text-[11px] font-medium uppercase tracking-[0.18em] text-foreground/55">Channel</h3>
            <ul className="mt-3 flex flex-wrap gap-1.5">
              {content.channels.map((ch) => (
                <li key={ch}>
                  <Pill tone="info">{ch}</Pill>
                </li>
              ))}
            </ul>
          </GlassCard>

          <CaptionHistory
            contentId={content.id}
            currentCaption={content.caption}
            currentHashtags={content.hashtags}
            currentStyle={content.captionStyle}
          />

          {me && (
            <CommentThread
              contentId={content.id}
              currentMemberId={me.id}
              canModerate={me.role === "admin" || me.role === "ketua_divisi"}
            />
          )}

          {canEdit && <SuggestMedia contentId={content.id} />}

          {relatedMedia.length > 0 && (
            <GlassCard variant="thin" className="p-5">
              <h3 className="text-[11px] font-medium uppercase tracking-[0.18em] text-foreground/55">
                Media terkait
              </h3>
              <ul className="mt-3 grid grid-cols-3 gap-2">
                {relatedMedia.map((m) => (
                  <li key={m.id} className="overflow-hidden rounded-xl">
                    <img src={m.url} alt={m.alt} className="aspect-square w-full object-cover" />
                  </li>
                ))}
              </ul>
              <Link href="/media" className="mt-3 inline-flex items-center gap-1 text-[12px] font-medium text-brand-600 hover:text-brand-700 dark:text-brand-300 dark:hover:text-brand-200">
                Lihat library
                <ArrowUpRight className="size-3" strokeWidth={1.75} />
              </Link>
            </GlassCard>
          )}

          <GlassCard variant="thin" className="p-5">
            <h3 className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-[0.18em] text-foreground/55">
              <ShieldCheck className="size-3" strokeWidth={1.75} />
              Compliance
            </h3>
            <p className="mt-2 text-[12px] text-foreground/65">
              Konten ini sudah lewat etika syar&apos;i AI filter. Sumber kutipan
              tercantum dan tidak ada potensi misinformasi.
            </p>
          </GlassCard>
        </aside>
      </div>
    </AppShell>
  );
}

function Metric({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex flex-col items-start gap-1 rounded-xl bg-foreground/5 p-2 dark:bg-white/5">
      <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wider text-foreground/55">
        {icon}
        {label}
      </span>
      <span className="font-display text-base font-semibold tabular-nums">{value}</span>
    </div>
  );
}
