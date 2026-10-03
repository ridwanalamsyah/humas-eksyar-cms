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
 * berlaku (kalender akademik, pengumuman, direktori skripsi), bukan hiasan.
 */
export function HeroNow({ items }: { items: HeroNowItem[] }) {
  if (!items.length) return null;
  const cols = ["md:grid-cols-1", "md:grid-cols-2", "md:grid-cols-3"][
    Math.min(items.length, 3) - 1
  ];
  return (
    <div
      className={`mx-auto mt-14 text-left ${items.length === 1 ? "max-w-md" : "max-w-[1024px]"}`}
    >
      <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-label-3">
        Sekarang di Eksyar
      </p>
      <ul
        className={`mt-3 grid divide-y divide-hairline border-y border-hairline md:divide-x md:divide-y-0 ${cols}`}
      >
        {items.map((it) => (
          <li key={it.label}>
            <Link
              href={it.href}
              className="group flex h-full items-start justify-between gap-4 py-5 transition-colors md:px-5 md:first:pl-0 md:last:pr-0"
            >
              <span className="min-w-0">
                <span className="block text-[12.5px] font-medium text-accent">
                  {it.label}
                </span>
                <span className="mt-1 line-clamp-2 block text-[16px] font-semibold leading-snug text-label group-hover:text-accent">
                  {it.title}
                </span>
                {it.meta && (
                  <span className="mt-1 block text-[13px] text-label-2">
                    {it.meta}
                  </span>
                )}
              </span>
              <ArrowUpRight className="mt-1 size-4 shrink-0 text-label-3 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent" />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
