import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { StickyStack } from "./sticky-stack";

/** Satu keluarga warna teal, makin terang ke bawah. Hex tetap supaya sama di mode gelap. */
const SHADES = ["#123f3a", "#14635a", "#197a6f", "#23897d"];

/**
 * Bidang kajian sebagai kartu yang menumpuk saat digulir: kartu menempel di
 * atas, lalu kartu berikutnya datang menutupinya. Tanpa perlu dipencet.
 */
export function BidangKajian({ items }: { items: { title: string; description: string }[] }) {
  const list = items.slice(0, 4);
  return (
    <StickyStack>
      {list.map((b, i) => (
        <article
          key={b.title}
          className="flex min-h-[260px] flex-col rounded-[28px] p-6 text-white sm:min-h-[300px] sm:p-10"
          style={{ background: SHADES[i % SHADES.length] }}
        >
          <span className="text-[14px] font-semibold tabular-nums text-white/60">
            0{i + 1} / 0{list.length}
          </span>
          <h3 className="mt-auto max-w-[18ch] text-balance text-[28px] font-bold leading-[1.1] tracking-[-0.025em] sm:text-[40px]">
            {b.title}
          </h3>
          <p className="mt-3 max-w-[52ch] text-[16px] leading-relaxed text-white/80 sm:text-[18px]">
            {b.description}
          </p>
          <Link
            href="/prodi/akademik"
            className="mt-5 inline-flex min-h-11 items-center gap-1.5 self-start text-[16px] font-semibold text-white underline-offset-4 hover:underline"
          >
            Lihat mata kuliahnya <ArrowRight className="size-4" />
          </Link>
        </article>
      ))}
    </StickyStack>
  );
}
