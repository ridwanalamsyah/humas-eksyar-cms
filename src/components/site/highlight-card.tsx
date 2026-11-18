import {
  ArrowUpRight,
  BookOpen,
  Briefcase,
  GraduationCap,
  HandHeart,
  Newspaper,
  ShieldCheck,
  Users,
} from "lucide-react";
import { formatLongDate } from "@/lib/format/dates";
import type { Kegiatan } from "@/lib/site/schema";

const CATEGORY_ICONS: Record<string, typeof Newspaper> = {
  akademik: GraduationCap,
  pengabdian: HandHeart,
  karir: Briefcase,
  kemahasiswaan: Users,
  "penjaminan mutu": ShieldCheck,
  kajian: BookOpen,
};

/** Kartu kegiatan: foto (atau ikon kategori), kategori, tanggal, judul. Ringkasan ada di halaman beritanya. */
export function HighlightCard({ item }: { item: Kegiatan }) {
  const Icon = CATEGORY_ICONS[item.category.toLowerCase()] ?? Newspaper;
  const body = (
    <>
      <div className="relative isolate aspect-square w-28 shrink-0 overflow-hidden rounded-2xl bg-gradient-to-br from-[#0f3d33] via-[#165b4c] to-[#0c2340] sm:aspect-[16/9] sm:w-auto">
        {item.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={item.image}
            alt={item.title}
            loading="lazy"
            className="absolute inset-0 size-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
          />
        ) : (
          <Icon
            className="absolute left-1/2 top-1/2 size-12 -translate-x-1/2 -translate-y-1/2 text-white/40 transition-transform duration-500 group-hover:scale-110"
            strokeWidth={1.25}
          />
        )}
      </div>
      <div className="flex min-w-0 flex-1 flex-col justify-center sm:justify-start sm:pt-4">
        <time dateTime={item.date} className="text-[14px] text-label-3">
          {item.category} · {formatLongDate(item.date)}
        </time>
        <h3 className="mt-1 line-clamp-3 break-words text-[16px] font-bold leading-[1.3] tracking-[-0.015em] text-label group-hover:text-accent sm:mt-1.5 sm:text-[18px]">
          {item.title}
          {item.source && (
            <ArrowUpRight aria-label="(situs luar)" className="ml-1 inline size-4 align-[-2px] text-label-3" />
          )}
        </h3>
      </div>
    </>
  );

  const cls =
    "group relative flex h-full flex-row gap-4 transition active:scale-[0.99] sm:flex-col sm:gap-0";

  return item.source ? (
    <a
      href={item.source}
      target="_blank"
      rel="noopener noreferrer"
      className={cls}
    >
      {body}
    </a>
  ) : (
    <article className={cls}>{body}</article>
  );
}
