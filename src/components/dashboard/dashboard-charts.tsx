"use client";

import { useMemo, useState } from "react";
import type { PageViewRow } from "@/lib/data/types";

interface ViewsChartProps {
  data: PageViewRow[];
}

export function ViewsAreaChart({ data }: ViewsChartProps) {
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);

  // Group by day for the last 30 days
  const chartPoints = useMemo(() => {
    const days: { dateStr: string; label: string; count: number }[] = [];
    const now = new Date();
    const map = new Map<string, number>();

    data.forEach((d) => {
      map.set(d.day, (map.get(d.day) ?? 0) + d.count);
    });

    for (let i = 29; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const iso = d.toISOString().slice(0, 10);
      const label = d.toLocaleDateString("id-ID", { day: "numeric", month: "short" });
      days.push({
        dateStr: iso,
        label,
        count: map.get(iso) ?? 0,
      });
    }
    return days;
  }, [data]);

  const maxVal = Math.max(...chartPoints.map((p) => p.count), 10);
  const width = 640;
  const height = 180;
  const paddingX = 20;
  const paddingY = 24;

  const points = chartPoints.map((p, idx) => {
    const x = paddingX + (idx / (chartPoints.length - 1)) * (width - paddingX * 2);
    const y = height - paddingY - (p.count / maxVal) * (height - paddingY * 2);
    return { x, y, ...p };
  });

  const pathD = points.reduce((acc, pt, idx) => {
    if (idx === 0) return `M ${pt.x} ${pt.y}`;
    const prev = points[idx - 1];
    const cpx1 = prev.x + (pt.x - prev.x) / 2;
    const cpx2 = cpx1;
    return `${acc} C ${cpx1} ${prev.y}, ${cpx2} ${pt.y}, ${pt.x} ${pt.y}`;
  }, "");

  const areaD = `${pathD} L ${points[points.length - 1].x} ${height - paddingY} L ${points[0].x} ${height - paddingY} Z`;

  const totalViews = chartPoints.reduce((acc, p) => acc + p.count, 0);

  return (
    <div className="rounded-2xl border border-foreground/[0.08] bg-canvas p-5 shadow-xs dark:border-white/[0.08]">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-[13px] font-semibold uppercase tracking-wider text-accent">
            Aktivitas Pengunjung
          </p>
          <h3 className="mt-0.5 text-[17px] font-bold text-label">
            Tren Kunjungan 30 Hari Terakhir
          </h3>
        </div>
        <div className="text-right">
          <p className="text-[22px] font-extrabold tabular-nums text-label">
            {totalViews.toLocaleString("id-ID")}
          </p>
          <p className="text-[13px] text-label-2">Total kunjungan halaman</p>
        </div>
      </div>

      <div className="relative mt-4 w-full overflow-hidden">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full overflow-visible"
          aria-label="Grafik kunjungan 30 hari"
        >
          <defs>
            <linearGradient id="viewsGlow" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.28" />
              <stop offset="100%" stopColor="var(--accent)" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          <line
            x1={paddingX}
            y1={paddingY}
            x2={width - paddingX}
            y2={paddingY}
            stroke="currentColor"
            strokeOpacity="0.08"
            strokeDasharray="4 4"
          />
          <line
            x1={paddingX}
            y1={(height - paddingY + paddingY) / 2}
            x2={width - paddingX}
            y2={(height - paddingY + paddingY) / 2}
            stroke="currentColor"
            strokeOpacity="0.08"
            strokeDasharray="4 4"
          />
          <line
            x1={paddingX}
            y1={height - paddingY}
            x2={width - paddingX}
            y2={height - paddingY}
            stroke="currentColor"
            strokeOpacity="0.12"
          />

          {/* Area under curve */}
          <path d={areaD} fill="url(#viewsGlow)" />

          {/* Curve Line */}
          <path
            d={pathD}
            fill="none"
            stroke="var(--accent)"
            strokeWidth="2.5"
            strokeLinecap="round"
          />

          {/* Interactive hover points */}
          {points.map((pt, idx) => (
            <g
              key={pt.dateStr}
              onMouseEnter={() => setHoverIdx(idx)}
              onMouseLeave={() => setHoverIdx(null)}
              className="cursor-pointer"
            >
              <circle
                cx={pt.x}
                cy={pt.y}
                r={hoverIdx === idx ? 5 : 2.5}
                className={hoverIdx === idx ? "fill-accent stroke-canvas stroke-2" : "fill-accent/70"}
              />
              <rect
                x={pt.x - 10}
                y={0}
                width={20}
                height={height}
                fill="transparent"
              />
            </g>
          ))}
        </svg>

        {/* Hover Tooltip display */}
        {hoverIdx !== null && points[hoverIdx] && (
          <div
            className="pointer-events-none absolute -top-1 rounded-lg border border-hairline bg-canvas px-3 py-1.5 shadow-md text-center transition-all"
            style={{
              left: `${Math.min(Math.max((points[hoverIdx].x / width) * 100, 10), 90)}%`,
              transform: "translateX(-50%)",
            }}
          >
            <p className="text-[13px] font-medium text-label-3">
              {points[hoverIdx].label}
            </p>
            <p className="text-[13.5px] font-bold text-accent tabular-nums">
              {points[hoverIdx].count.toLocaleString("id-ID")} kunjungan
            </p>
          </div>
        )}
      </div>

      <div className="mt-2 flex items-center justify-between text-[13px] text-label-3">
        <span>{chartPoints[0]?.label}</span>
        <span>{chartPoints[14]?.label}</span>
        <span>{chartPoints[chartPoints.length - 1]?.label}</span>
      </div>
    </div>
  );
}

interface ContentBreakdownProps {
  published: number;
  review: number;
  draft: number;
}

export function ContentDistributionCard({
  published,
  review,
  draft,
}: ContentBreakdownProps) {
  const total = Math.max(published + review + draft, 1);
  const pPub = Math.round((published / total) * 100);
  const pRev = Math.round((review / total) * 100);
  const pDrf = Math.max(0, 100 - pPub - pRev);

  return (
    <div className="rounded-2xl border border-foreground/[0.08] bg-canvas p-5 shadow-xs dark:border-white/[0.08]">
      <p className="text-[13px] font-semibold uppercase tracking-wider text-accent">
        Distribusi Konten
      </p>
      <h3 className="mt-0.5 text-[17px] font-bold text-label">
        Status Editorial Berita & Artikel
      </h3>

      <div className="mt-5 flex h-4 w-full overflow-hidden rounded-full bg-foreground/[0.06] p-0.5 dark:bg-white/[0.06]">
        {pPub > 0 && (
          <div
            style={{ width: `${pPub}%` }}
            className="rounded-full bg-emerald-600 transition-all dark:bg-emerald-500"
            title={`Terbit: ${published}`}
          />
        )}
        {pRev > 0 && (
          <div
            style={{ width: `${pRev}%` }}
            className="rounded-full bg-amber-500 transition-all"
            title={`Menunggu Persetujuan: ${review}`}
          />
        )}
        {pDrf > 0 && (
          <div
            style={{ width: `${pDrf}%` }}
            className="rounded-full bg-foreground/20 transition-all dark:bg-white/20"
            title={`Draf / Ide: ${draft}`}
          />
        )}
      </div>

      <ul className="mt-6 space-y-3">
        <li className="flex items-center justify-between text-[13.5px]">
          <span className="flex items-center gap-2">
            <span className="size-2.5 rounded-full bg-emerald-600 dark:bg-emerald-500" />
            <span className="font-medium text-label">Terpublikasi</span>
          </span>
          <span className="font-bold tabular-nums text-label">
            {published}{" "}
            <span className="text-[13px] font-normal text-label-3">
              ({pPub}%)
            </span>
          </span>
        </li>

        <li className="flex items-center justify-between text-[13.5px]">
          <span className="flex items-center gap-2">
            <span className="size-2.5 rounded-full bg-amber-500" />
            <span className="font-medium text-label">Menunggu Persetujuan</span>
          </span>
          <span className="font-bold tabular-nums text-label">
            {review}{" "}
            <span className="text-[13px] font-normal text-label-3">
              ({pRev}%)
            </span>
          </span>
        </li>

        <li className="flex items-center justify-between text-[13.5px]">
          <span className="flex items-center gap-2">
            <span className="size-2.5 rounded-full bg-foreground/30 dark:bg-white/30" />
            <span className="font-medium text-label">Draf & Ide</span>
          </span>
          <span className="font-bold tabular-nums text-label">
            {draft}{" "}
            <span className="text-[13px] font-normal text-label-3">
              ({pDrf}%)
            </span>
          </span>
        </li>
      </ul>
    </div>
  );
}

interface PopularPagesProps {
  views: PageViewRow[];
}

export function TopPagesList({ views }: PopularPagesProps) {
  const top = useMemo(() => {
    const map = new Map<string, number>();
    views.forEach((v) => map.set(v.path, (map.get(v.path) ?? 0) + v.count));
    const list = [...map.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([path, count]) => ({ path, count }));
    const max = list[0]?.count ?? 1;
    return { list, max };
  }, [views]);

  return (
    <div className="rounded-2xl border border-foreground/[0.08] bg-canvas p-5 shadow-xs dark:border-white/[0.08]">
      <p className="text-[13px] font-semibold uppercase tracking-wider text-accent">
        Halaman Populer
      </p>
      <h3 className="mt-0.5 text-[17px] font-bold text-label">
        Paling Sering Dibaca Pengunjung
      </h3>

      {top.list.length === 0 ? (
        <p className="mt-5 text-[13.5px] text-label-2">
          Belum ada data kunjungan terkumpul.
        </p>
      ) : (
        <ul className="mt-4 space-y-3">
          {top.list.map(({ path, count }) => {
            const pct = Math.max(6, Math.round((count / top.max) * 100));
            return (
              <li key={path} className="space-y-1">
                <div className="flex items-center justify-between text-[13px]">
                  <span className="truncate font-mono font-medium text-label">
                    {path}
                  </span>
                  <span className="tabular-nums font-semibold text-label-2">
                    {count.toLocaleString("id-ID")}
                  </span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-foreground/[0.05] dark:bg-white/[0.05]">
                  <div
                    style={{ width: `${pct}%` }}
                    className="h-full rounded-full bg-accent"
                  />
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
