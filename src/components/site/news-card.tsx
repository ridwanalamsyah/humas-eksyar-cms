import Link from "next/link";
import { ArrowUpRight, Newspaper } from "lucide-react";
import type { ContentItem, MediaAsset } from "@/lib/data/types";
import { formatLongDate } from "@/lib/format/dates";
import { contentExcerpt } from "@/lib/site/content";

export function NewsCard({ item, cover }: { item: ContentItem; cover?: MediaAsset | null }) {
  const date = item.publishedAt ?? item.updatedAt;
  return (
    <Link
      href={`/prodi/berita/${item.slug}`}
      className="group glass-regular flex h-full flex-col overflow-hidden rounded-2xl transition-transform duration-300 hover:-translate-y-1"
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        {cover ? (
          <>
            <span aria-hidden className="absolute inset-0" style={{ background: cover.averageColor }} />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={cover.url}
              alt={cover.alt}
              loading="lazy"
              className="absolute inset-0 size-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </>
        ) : (
          <div className="absolute inset-0 grid place-items-center bg-gradient-to-br from-brand-500/80 via-brand-700/80 to-ink-soft">
            <Newspaper className="size-10 text-cream-100/70" strokeWidth={1.5} />
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <time dateTime={date} className="text-xs font-medium text-foreground/50">
          {formatLongDate(date)}
        </time>
        <h3 className="mt-2 font-display text-lg font-semibold leading-snug tracking-tight line-clamp-2">
          {item.title}
        </h3>
        <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-foreground/65">
          {contentExcerpt(item)}
        </p>
        <span className="mt-auto inline-flex items-center gap-1 pt-4 text-sm font-semibold text-brand-600 dark:text-brand-300">
          Baca selengkapnya
          <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </span>
      </div>
    </Link>
  );
}
