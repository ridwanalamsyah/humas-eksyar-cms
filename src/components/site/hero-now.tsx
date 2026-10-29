import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export type HeroNowItem = {
  label: string;
  title: string;
  meta?: string;
  href: string;
};

/**
 * Strip "Sekarang di Eksyar" di bawah hero: informasi nyata yang sedang
 * berlaku (kalender akademik, pengumuman, direktori skripsi), dibingkai rapi.
 */
export function HeroNow({ items }: { items: HeroNowItem[] }) {
  if (!items.length) return null;
  const cols = ["md:grid-cols-1", "md:grid-cols-2", "md:grid-cols-3"][
    Math.min(items.length, 3) - 1
  ];
  return (
    <div
      className={`mx-auto mt-12 text-left ${items.length === 1 ? "max-w-md" : "max-w-[1024px]"}`}
    >
      <div className="mb-3 flex items-center justify-between px-1">
        <p className="inline-flex items-center gap-2 text-[12px] font-bold uppercase tracking-[0.08em] text-label-2">
          <span className="size-2 rounded-full bg-accent" aria-hidden />
          Sekarang di Eksyar
        </p>
        <Link
          href="/prodi/kalender"
          className="text-[12.5px] font-semibold text-accent hover:underline"
        >
          Agenda lengkap ›
        </Link>
      </div>
      <ul
        className={`grid overflow-hidden rounded-[24px] border border-hairline bg-canvas/95 divide-y divide-hairline shadow-[0_2px_12px_rgba(12,35,64,0.04)] md:divide-x md:divide-y-0 ${cols}`}
      >
        {items.map((it) => (
          <li key={it.label} className="min-w-0">
            <Link
              href={it.href}
              className="group flex h-full items-start justify-between gap-3 p-5 transition-colors hover:bg-mist/60"
            >
              <span className="min-w-0 flex-1">
                <span className="inline-block rounded-md bg-accent-soft px-2 py-0.5 text-[11.5px] font-semibold text-accent">
                  {it.label}
                </span>
                <span className="mt-2 line-clamp-2 block break-words text-[15.5px] font-semibold leading-snug text-label group-hover:text-accent">
                  {it.title}
                </span>
                {it.meta && (
                  <span className="mt-1 line-clamp-1 block text-[12.5px] text-label-2">
                    {it.meta}
                  </span>
                )}
              </span>
              <span className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-full bg-mist text-label-2 transition-colors group-hover:bg-accent group-hover:text-white">
                <ArrowUpRight className="size-3.5" />
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
