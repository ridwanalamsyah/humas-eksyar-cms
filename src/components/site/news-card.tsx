import Link from "next/link";
import type { ContentItem, MediaAsset, Member } from "@/lib/data/types";
import { formatLongDate } from "@/lib/format/dates";
import { contentExcerpt, estimateReadingTime, rubricLabel } from "@/lib/site/content";
import { cn } from "@/lib/utils";
import { ProdiLogo } from "./prodi-logo";

/** Kartu berita & artikel editorial ala Apple Newsroom dengan info penulis & waktu baca */
export function NewsCard({
  item,
  cover,
  author,
  featured = false,
}: {
  item: ContentItem;
  cover?: MediaAsset | null;
  author?: Member | null;
  featured?: boolean;
}) {
  const date = item.publishedAt ?? item.updatedAt;
  const cleanTitle = item.title.replace(/^\[(?:Buletin\s+Artikel\s+HMJ|Buletin\s+HMJ)\]\s*/i, "");
  const readTime = estimateReadingTime(item.body || item.caption);
  const authorName = author?.name || "Redaksi Eksyar";
  const authorRole = author?.position || (item.rubric === "buletin_hmj" ? "Penulis Mahasiswa" : "Humas Prodi");

  return (
    <Link
      href={`/prodi/berita/${item.slug}`}
      className={cn(
        "group relative flex h-full",
        featured ? "flex-col md:flex-row" : "flex-col",
      )}
    >
      <div
        className={cn(
          "relative isolate overflow-hidden rounded-[20px] bg-mist",
          featured
            ? "aspect-[16/9] md:aspect-auto md:w-[54%]"
            : "aspect-[16/9]",
        )}
      >
        {cover ? (
          <>
            <span
              aria-hidden
              className="absolute inset-0"
              style={{ background: cover.averageColor }}
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={cover.url}
              alt={cover.alt}
              loading="lazy"
              className="absolute inset-0 size-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
            />
          </>
        ) : (
          <CoverFallback />
        )}
      </div>
      <div
        className={cn(
          "flex min-w-0 flex-1 flex-col",
          featured ? "pt-5 md:justify-center md:pl-9 md:pt-0" : "pt-4",
        )}
      >
        <div className="flex items-center gap-2">
          <span className="text-[14px] font-semibold text-accent">
            {rubricLabel(item.rubric)}
          </span>
          <span className="text-[14px] text-label-3">·</span>
          <span className="text-[14px] text-label-3">{readTime}</span>
        </div>

        <h3
          className={cn(
            "mt-2.5 break-words font-semibold tracking-[-0.015em] text-label group-hover:text-accent transition-colors",
            featured
              ? "text-[clamp(1.4rem,1.15rem+1vw,1.95rem)] font-bold leading-[1.2]"
              : "text-[18px] font-bold leading-[1.3]",
          )}
        >
          {cleanTitle}
        </h3>

        {featured && (
          <p className="mt-3 line-clamp-3 break-words text-[16px] leading-relaxed text-label-2">
            {contentExcerpt(item)}
          </p>
        )}

        {/* Info Penulis & Tanggal Terbit */}
        <div className="flex items-center justify-between gap-3 pt-4">
          <div className="flex items-center gap-2.5 min-w-0">
            {author?.avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={author.avatarUrl}
                alt={authorName}
                loading="lazy"
                className="size-7 shrink-0 rounded-lg object-cover ring-1 ring-hairline"
              />
            ) : (
              <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-accent/12 text-[14px] font-bold text-accent ring-1 ring-accent/20">
                {author?.initials || "ES"}
              </span>
            )}
            <div className="min-w-0">
              <p className="truncate text-[14px] font-semibold text-label">
                {authorName}
              </p>
              <p className="truncate text-[14px] text-label-3">
                {authorRole}
              </p>
            </div>
          </div>

          <time dateTime={date} className="shrink-0 text-right text-[14px] text-label-3">
            {formatLongDate(date)}
          </time>
        </div>
      </div>
    </Link>
  );
}

export function CoverFallback() {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-[#0f3d33] via-[#165b4c] to-[#0c2340] p-6 text-white">
      <ProdiLogo size={52} />
      <span className="mt-2.5 text-[14px] font-semibold uppercase tracking-[0.1em] text-white/75">
        Ekonomi Syariah · UIN SGD
      </span>
    </div>
  );
}
