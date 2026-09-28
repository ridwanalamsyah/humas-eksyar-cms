import Link from "next/link";
import type { ContentItem, MediaAsset } from "@/lib/data/types";
import { formatLongDate } from "@/lib/format/dates";
import { contentExcerpt, rubricLabel } from "@/lib/site/content";
import { cn } from "@/lib/utils";

/** Kartu berita ala Apple Newsroom. `featured` = kartu lebar dengan gambar di kiri. */
export function NewsCard({
  item,
  cover,
  featured = false,
}: {
  item: ContentItem;
  cover?: MediaAsset | null;
  featured?: boolean;
}) {
  const date = item.publishedAt ?? item.updatedAt;
  return (
    <Link
      href={`/prodi/berita/${item.slug}`}
      className={cn(
        "group flex h-full overflow-hidden rounded-[20px] bg-canvas shadow-[0_2px_12px_rgba(0,0,0,0.06)] transition-shadow duration-300 hover:shadow-[0_6px_28px_rgba(0,0,0,0.12)]",
        featured ? "flex-col md:flex-row" : "flex-col",
      )}
    >
      <div className={cn("relative overflow-hidden bg-mist", featured ? "aspect-[16/9] md:aspect-auto md:w-[58%]" : "aspect-[16/9]")}>
        {cover ? (
          <>
            <span aria-hidden className="absolute inset-0" style={{ background: cover.averageColor }} />
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
      <div className={cn("flex flex-1 flex-col", featured ? "p-8 md:justify-center md:p-10" : "p-6")}>
        <p className="text-[12px] font-semibold uppercase tracking-[0.04em] text-label-2">{rubricLabel(item.rubric)}</p>
        <h3
          className={cn(
            "mt-2 font-semibold tracking-[-0.015em] text-label",
            featured ? "text-[clamp(1.5rem,1.2rem+1vw,2rem)] leading-[1.15]" : "text-[19px] leading-[1.25]",
          )}
        >
          {item.title}
        </h3>
        {featured && <p className="mt-3 line-clamp-3 text-[16px] leading-relaxed text-label-2">{contentExcerpt(item)}</p>}
        <time dateTime={date} className="mt-auto pt-4 text-[13px] text-label-3">
          {formatLongDate(date)}
        </time>
      </div>
    </Link>
  );
}

export function CoverFallback() {
  return (
    <div className="absolute inset-0 bg-gradient-to-br from-[#e6f4f2] via-[#f5f5f7] to-[#fdf1e1]">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/eksyar-logo.png" alt="" className="absolute left-1/2 top-1/2 w-16 -translate-x-1/2 -translate-y-1/2 opacity-80" />
    </div>
  );
}
