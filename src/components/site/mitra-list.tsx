import { ArrowUpRight } from "lucide-react";
import type { Mitra } from "@/lib/site/schema";

const FALLBACK_LOGOS: Record<string, string> = {
  "bursa efek indonesia": "/prodi/mitra/idx.png",
  "bank muamalat": "/prodi/mitra/muamalat.svg",
  "bank indonesia": "/prodi/mitra/bi.png",
  "bjb syariah": "/prodi/mitra/bjbsyariah.png",
  "otoritas jasa keuangan": "/prodi/mitra/ojk.png",
  "baznas": "/prodi/mitra/baznas.svg",
  "bank tabungan negara": "/prodi/mitra/btn.svg",
  "mnc sekuritas": "/prodi/mitra/mncsekuritas.png",
};

function resolveLogo(item: Mitra): string | null {
  if (item.logo && item.logo.trim()) return item.logo.trim();
  const lower = item.name.toLowerCase();
  for (const [key, path] of Object.entries(FALLBACK_LOGOS)) {
    if (lower.includes(key)) return path;
  }
  return null;
}

/** Kartu mitra kerja sama dengan logo resmi lembaga, bentuk kolaborasi, dan tautan. */
export function MitraList({ items }: { items: Mitra[] }) {
  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((m, idx) => {
        const logoSrc = resolveLogo(m);
        const body = (
          <div className="flex h-full flex-col justify-between">
            <div>
              <div className="flex items-center justify-between gap-3">
                <div className="flex h-14 w-28 items-center justify-center rounded-xl border border-hairline/80 bg-white px-3 py-2 shadow-[0_1px_2px_rgba(12,35,64,0.04)]">
                  {logoSrc ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={logoSrc}
                      alt={`Logo ${m.name}`}
                      loading="lazy"
                      className="max-h-9 w-auto max-w-full object-contain"
                    />
                  ) : (
                    <span className="text-[12px] font-bold text-accent">
                      {m.name.slice(0, 3).toUpperCase()}
                    </span>
                  )}
                </div>
                {m.url && (
                  <span className="grid size-8 shrink-0 place-items-center rounded-full bg-mist text-label-3 transition-colors group-hover:bg-accent group-hover:text-white">
                    <ArrowUpRight className="size-4" />
                  </span>
                )}
              </div>
              <p className="mt-4 break-words text-[16px] font-bold leading-snug tracking-[-0.01em] text-label group-hover:text-accent">
                {m.name}
              </p>
              <p className="mt-1.5 break-words text-[13.5px] leading-[1.5] text-label-2">
                {m.description}
              </p>
            </div>
          </div>
        );
        const cls =
          "group relative isolate block h-full overflow-hidden rounded-[22px] border border-hairline bg-canvas p-5 transition duration-300 hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-[0_16px_32px_-18px_rgba(22,58,69,0.22)]";
        return (
          <li key={`${m.name}-${idx}`}>
            {m.url ? (
              <a
                href={m.url}
                target="_blank"
                rel="noopener noreferrer"
                className={cls}
              >
                {body}
              </a>
            ) : (
              <div className={cls}>{body}</div>
            )}
          </li>
        );
      })}
    </ul>
  );
}
