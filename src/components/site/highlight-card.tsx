import { ArrowUpRight } from "lucide-react";
import { formatLongDate } from "@/lib/format/dates";
import type { sorotan } from "@/lib/site/prodi";

type Highlight = (typeof sorotan)[number];

/** Kartu sorotan kegiatan (sumber: berita resmi kampus). */
export function HighlightCard({ item }: { item: Highlight }) {
  return (
    <a
      href={item.source}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex h-full flex-col border-t-[3px] border-pine-700 bg-white/60 p-6 transition-colors hover:border-saffron-500 hover:bg-white"
    >
      <div className="flex items-center justify-between gap-3 text-[12px] font-semibold uppercase tracking-[0.14em]">
        <span className="text-saffron-600">{item.category}</span>
        <time dateTime={item.date} className="text-ink/45">
          {formatLongDate(item.date)}
        </time>
      </div>
      <h3 className="mt-3 font-serif text-lg font-semibold leading-snug text-pine-800">{item.title}</h3>
      <p className="mt-2 flex-1 text-[14.5px] leading-relaxed text-ink/65">{item.summary}</p>
      <span className="mt-4 inline-flex items-center gap-1 text-[13px] font-semibold text-pine-700 group-hover:text-saffron-600">
        Baca di uinsgd.ac.id <ArrowUpRight className="size-3.5" />
      </span>
    </a>
  );
}
