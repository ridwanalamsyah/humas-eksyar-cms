import Link from "next/link";
import type { ContentItem, MediaAsset } from "@/lib/data/types";
import { formatLongDate } from "@/lib/format/dates";
import { contentExcerpt, rubricLabel } from "@/lib/site/content";
import { cn } from "@/lib/utils";
import { ProdiLogo } from "./prodi-logo";

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
        "group relative isolate flex h-full overflow-hidden rounded-[22px] border border-hairline bg-canvas transition duration-300 hover:-translate-y-1 hover:border-accent/35 hover:shadow-[0_20px_40px_-20px_rgba(22,58,69,0.28)]",
        featured ? "flex-col md:flex-row" : "flex-col",
      )}
    >
      <div
        className={cn(
          "relative isolate overflow-hidden bg-mist",
          featured
            ? "aspect-[16/9] md:aspect-auto md:w-[58%]"
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
          featured ? "p-7 md:justify-center md:p-10" : "p-6",
        )}
      >
        <p className="text-[12px] font-semibold uppercase tracking-[0.04em] text-accent">
          {rubricLabel(item.rubric)}
        </p>
        <h3
          className={cn(
            "mt-2 break-words font-semibold tracking-[-0.015em] text-label group-hover:text-accent",
            featured
              ? "text-[clamp(1.4rem,1.15rem+1vw,1.95rem)] font-bold leading-[1.18]"
              : "text-[18.5px] font-bold leading-[1.28]",
          )}
        >
          {item.title}
        </h3>
        {featured && (
          <p className="mt-3 line-clamp-3 break-words text-[15.5px] leading-relaxed text-label-2">
            {contentExcerpt(item)}
          </p>
        )}
        <time dateTime={date} className="mt-auto pt-4 text-[13px] text-label-3">
          {formatLongDate(date)}
        </time>
      </div>
    </Link>
  );
}

export function CoverFallback() {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-[#0f3d33] via-[#165b4c] to-[#0c2340] p-6 text-white">
      <ProdiLogo size={52} />
      <span className="mt-2.5 text-[11px] font-semibold uppercase tracking-[0.1em] text-white/75">
        Kabar Ekonomi Syariah · UIN SGD
      </span>
    </div>
  );
}
