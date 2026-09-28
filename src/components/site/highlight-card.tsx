import { formatLongDate } from "@/lib/format/dates";
import type { sorotan } from "@/lib/site/prodi";

type Highlight = (typeof sorotan)[number];

/** Kartu sorotan kegiatan (tautan ke berita resmi kampus). */
export function HighlightCard({ item }: { item: Highlight }) {
  return (
    <a
      href={item.source}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex h-full flex-col rounded-[20px] bg-canvas p-7 shadow-[0_2px_12px_rgba(0,0,0,0.06)] transition-shadow duration-300 hover:shadow-[0_6px_28px_rgba(0,0,0,0.12)]"
    >
      <p className="text-[12px] font-semibold uppercase tracking-[0.04em] text-label-2">{item.category}</p>
      <h3 className="mt-2 text-[19px] font-semibold leading-[1.25] tracking-[-0.015em] text-label">{item.title}</h3>
      <p className="mt-2 line-clamp-3 text-[15px] leading-relaxed text-label-2">{item.summary}</p>
      <div className="mt-auto flex items-center justify-between pt-5 text-[13px]">
        <time dateTime={item.date} className="text-label-3">
          {formatLongDate(item.date)}
        </time>
        <span className="text-accent group-hover:underline">{sourceLabel(item.source)} ↗</span>
      </div>
    </a>
  );
}

function sourceLabel(url: string) {
  if (url.includes("instagram.com")) return "Instagram";
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "Sumber";
  }
}
