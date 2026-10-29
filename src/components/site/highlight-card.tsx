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

/** Kartu kegiatan: foto (atau ikon kategori), kategori, judul, ringkasan. */
export function HighlightCard({ item }: { item: Kegiatan }) {
  const Icon = CATEGORY_ICONS[item.category.toLowerCase()] ?? Newspaper;
  const body = (
    <>
      <div className="relative aspect-[16/9] isolate overflow-hidden bg-gradient-to-br from-[#0f3d33] via-[#165b4c] to-[#0c2340]">
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
        <span className="absolute left-4 top-4 z-10 max-w-[calc(100%-2rem)] truncate rounded-full border border-hairline bg-canvas/95 px-3 py-1 text-[12px] font-semibold text-label shadow-xs">
          {item.category}
        </span>
      </div>
      <div className="flex min-w-0 flex-1 flex-col p-6">
        <time dateTime={item.date} className="text-[13px] text-label-3">
          {formatLongDate(item.date)}
        </time>
        <h3 className="mt-1.5 break-words text-[18.5px] font-bold leading-[1.28] tracking-[-0.015em] text-label">
          {item.title}
        </h3>
        <p className="mt-2 line-clamp-3 break-words text-[14.5px] leading-relaxed text-label-2">
          {item.summary}
        </p>
        {item.source && (
          <span className="mt-auto flex items-center justify-between pt-5 text-[14px] font-semibold text-accent">
            Baca selengkapnya
            <span className="grid size-8 place-items-center rounded-full bg-mist transition-colors duration-300 group-hover:bg-accent group-hover:text-white">
              <ArrowUpRight className="size-4" />
            </span>
          </span>
        )}
      </div>
    </>
  );

  const cls =
    "group relative isolate flex h-full flex-col overflow-hidden rounded-[24px] border border-hairline bg-canvas transition duration-300 hover:-translate-y-1 hover:border-accent/35 hover:shadow-[0_20px_40px_-20px_rgba(22,58,69,0.28)]";

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
