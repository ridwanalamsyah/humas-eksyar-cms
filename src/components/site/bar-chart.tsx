"use client";

import { useState } from "react";

/**
 * Grafik kolom satu seri (warna aksen). Batang ≤24px, ujung membulat 4px,
 * nilai di ujung batang, tooltip saat disorot, dan tampilan tabel.
 */
export function BarChart({
  title,
  unit = "",
  data,
  height = 180,
}: {
  title: string;
  unit?: string;
  data: { label: string; nilai: number }[];
  height?: number;
}) {
  const [hover, setHover] = useState<number | null>(null);
  const max = Math.max(1, ...data.map((d) => d.nilai));
  const fmt = (n: number) => n.toLocaleString("id-ID");
  const isWide = data.length > 6;

  return (
    <figure className="w-full max-w-full overflow-hidden rounded-[24px] border border-hairline bg-canvas p-4 sm:p-5">
      <figcaption className="text-[15px] font-bold text-label">
        {title}
        {unit && (
          <span className="ml-1 text-[13px] font-normal text-label-3">
            ({unit})
          </span>
        )}
      </figcaption>

      {/* Pembungkus chart dengan perlindungan overflow responsif agar tidak zoom out di mobile */}
      <div className="w-full max-w-full overflow-x-auto overflow-y-hidden pb-1 scrollbar-thin">
        <div
          className="relative mt-6 min-w-0"
          style={{ height, minWidth: isWide ? `${Math.max(data.length * 38, 280)}px` : "100%" }}
          role="img"
          aria-label={`${title}: ${data.map((d) => `${d.label} ${fmt(d.nilai)}`).join(", ")}`}
        >
          <div className="absolute inset-x-0 bottom-0 h-px bg-hairline" />
          <div className="absolute inset-0 flex items-end justify-around gap-1.5 sm:gap-2">
            {data.map((d, i) => {
              const h = (d.nilai / max) * (height - 24);
              return (
                <div
                  key={d.label}
                  className="relative flex h-full flex-1 min-w-0 flex-col items-center justify-end"
                  onMouseEnter={() => setHover(i)}
                  onMouseLeave={() => setHover(null)}
                >
                  {hover === i && (
                    <div className="pointer-events-none absolute -top-2 z-10 -translate-y-full whitespace-nowrap rounded-lg bg-navy px-2.5 py-1.5 text-[12px] text-white shadow">
                      {d.label}: <b>{fmt(d.nilai)}</b> {unit}
                    </div>
                  )}
                  <span className="mb-1 text-[11px] sm:text-[12px] font-semibold tabular-nums text-label-2 truncate max-w-full text-center">
                    {fmt(d.nilai)}
                  </span>
                  <div
                    className="w-full max-w-[24px] rounded-t-[4px] bg-accent transition-opacity"
                    style={{
                      height: Math.max(2, h),
                      opacity: hover === null || hover === i ? 1 : 0.55,
                    }}
                  />
                </div>
              );
            })}
          </div>
        </div>

        <div
          className="mt-2 flex justify-around gap-1.5 sm:gap-2"
          style={{ minWidth: isWide ? `${Math.max(data.length * 38, 280)}px` : "100%" }}
        >
          {data.map((d) => (
            <span
              key={d.label}
              className="flex-1 min-w-0 truncate text-center text-[11px] sm:text-[12px] text-label-3"
            >
              {d.label}
            </span>
          ))}
        </div>
      </div>

      <details className="mt-3 text-[13px]">
        <summary className="cursor-pointer text-label-3 hover:text-accent">
          Lihat tabel
        </summary>
        <div className="w-full max-w-full overflow-x-auto">
          <table className="mt-2 w-full text-left">
            <tbody>
              {data.map((d) => (
                <tr key={d.label} className="border-t border-hairline">
                  <td className="py-1 text-label-2">{d.label}</td>
                  <td className="py-1 text-right tabular-nums text-label">
                    {fmt(d.nilai)} {unit}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </figure>
  );
}
