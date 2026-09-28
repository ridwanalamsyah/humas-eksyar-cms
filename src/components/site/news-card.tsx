import Link from "next/link";
import type { ContentItem, MediaAsset } from "@/lib/data/types";
import { formatLongDate } from "@/lib/format/dates";
import { contentExcerpt } from "@/lib/site/content";
import { cn } from "@/lib/utils";

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
    <Link href={`/prodi/berita/${item.slug}`} className="group flex h-full flex-col">
      <div className={cn("relative overflow-hidden bg-pine-800", featured ? "aspect-[16/9]" : "aspect-[3/2]")}>
        {cover ? (
          <>
            <span aria-hidden className="absolute inset-0" style={{ background: cover.averageColor }} />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={cover.url}
              alt={cover.alt}
              loading="lazy"
              className="absolute inset-0 size-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            />
          </>
        ) : (
          <div className="site-pattern absolute inset-0 grid place-items-center">
            <span className="font-serif text-2xl italic text-saffron-300">Eksyar</span>
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col pt-4">
        <time dateTime={date} className="text-[12px] font-semibold uppercase tracking-[0.14em] text-saffron-600">
          {formatLongDate(date)}
        </time>
        <h3
          className={cn(
            "mt-2 font-serif font-semibold leading-snug text-pine-800 group-hover:underline group-hover:decoration-saffron-500 group-hover:underline-offset-4",
            featured ? "text-2xl" : "text-lg",
          )}
        >
          {item.title}
        </h3>
        <p className="mt-2 line-clamp-3 text-[15px] leading-relaxed text-ink/65">{contentExcerpt(item)}</p>
      </div>
    </Link>
  );
}
