"use client";

import Link from "next/link";
import { motion } from "motion/react";
import {
  Heart,
  MessageSquare,
  Eye,
  Share2,
  ImageIcon,
  Calendar as CalendarIcon,
  Sparkles,
} from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { StatusPill } from "@/components/common/pill";
import { Avatar } from "@/components/common/avatar";
import { humanNumber, percent, relativeFromNow, formatDateTime } from "@/lib/format/dates";
import type { ContentItem, Division, Member, MediaAsset } from "@/lib/data/types";

interface ContentCardProps {
  content: ContentItem;
  division: Division;
  author: Member;
  cover?: MediaAsset | null;
}

export function ContentCard({ content, division, author, cover }: ContentCardProps) {
  const aiGenerated = !!content.captionStyle;
  const headline = content.title;

  return (
    <Link href={`/content/${content.id}`} className="group block">
      <GlassCard
        variant="regular"
        hover
        className="flex h-full flex-col gap-3 overflow-hidden p-4"
        whileHover={{ y: -4 }}
      >
        {cover && (
          <div className="relative aspect-[16/10] overflow-hidden rounded-2xl">
            <span
              aria-hidden
              className="absolute inset-0"
              style={{ background: cover.averageColor }}
            />
            <motion.img
              src={cover.url}
              alt={cover.alt}
              loading="lazy"
              className="absolute inset-0 size-full object-cover"
              initial={{ scale: 1.06 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 via-transparent" />
            <div className="absolute left-3 top-3 flex items-center gap-1.5">
              <StatusPill status={content.status} size="xs" />
              {aiGenerated && (
                <span className="inline-flex items-center gap-1 rounded-full border border-gold-400/40 bg-gold-400/15 px-1.5 py-0.5 text-[10px] font-semibold text-gold-700 backdrop-blur dark:text-gold-200">
                  <Sparkles className="size-2.5" strokeWidth={2} />
                  AI
                </span>
              )}
            </div>
            <div className="absolute right-3 top-3">
              <span
                className="inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[10px] font-semibold backdrop-blur"
                style={{
                  background: `${division.color}33`,
                  color: division.color,
                  borderColor: `${division.color}66`,
                  borderWidth: 1,
                  borderStyle: "solid",
                }}
              >
                {division.shortName}
              </span>
            </div>
          </div>
        )}

        {!cover && (
          <div className="flex items-center gap-1.5">
            <StatusPill status={content.status} size="xs" />
            {aiGenerated && (
              <span className="inline-flex items-center gap-1 rounded-full border border-gold-400/40 bg-gold-400/15 px-1.5 py-0.5 text-[10px] font-semibold text-gold-700 dark:text-gold-200">
                <Sparkles className="size-2.5" strokeWidth={2} />
                AI
              </span>
            )}
            <span
              className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold"
              style={{
                background: `${division.color}1f`,
                color: division.color,
              }}
            >
              {division.shortName}
            </span>
          </div>
        )}

        <div className="flex flex-1 flex-col gap-2">
          <h3 className="font-display text-base font-semibold leading-snug tracking-tight transition-colors group-hover:text-brand-700 dark:group-hover:text-brand-300">
            {headline}
          </h3>
          {content.caption && (
            <p className="line-clamp-2 text-[13px] text-foreground/70">
              {content.caption.replace(/\n/g, " ").slice(0, 160)}
            </p>
          )}
        </div>

        <div className="flex items-center justify-between gap-2 border-t border-foreground/8 pt-3 dark:border-white/8">
          <div className="flex items-center gap-2">
            <Avatar member={author} size={24} ring={false} />
            <div className="leading-tight">
              <p className="text-[12px] font-medium">{author.name.split(" ")[0]}</p>
              <p className="text-[10px] text-foreground/55">
                {content.publishedAt
                  ? `${relativeFromNow(content.publishedAt)} · published`
                  : content.scheduledFor
                    ? `${formatDateTime(content.scheduledFor)} · scheduled`
                    : `${relativeFromNow(content.updatedAt)} · update`}
              </p>
            </div>
          </div>
          {content.metrics ? (
            <div className="flex items-center gap-2 text-[11px] text-foreground/60">
              <span className="inline-flex items-center gap-0.5"><Eye className="size-3" strokeWidth={1.75} />{humanNumber(content.metrics.views)}</span>
              <span className="inline-flex items-center gap-0.5"><Heart className="size-3" strokeWidth={1.75} />{humanNumber(content.metrics.likes)}</span>
              <span className="inline-flex items-center gap-0.5"><MessageSquare className="size-3" strokeWidth={1.75} />{content.metrics.comments}</span>
              <span className="inline-flex items-center gap-0.5"><Share2 className="size-3" strokeWidth={1.75} />{percent(content.metrics.engagementRate, 1)}</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-[11px] text-foreground/55">
              <ImageIcon className="size-3" strokeWidth={1.75} />
              {content.mediaIds.length}
              <span className="opacity-50">·</span>
              <CalendarIcon className="size-3" strokeWidth={1.75} />
              {content.channels.length}
            </div>
          )}
        </div>
      </GlassCard>
    </Link>
  );
}
