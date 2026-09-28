"use client";

import { useMemo, useState } from "react";
import type { Kegiatan } from "@/lib/site/schema";
import {
  ALL,
  EmptyResult,
  FilterChips,
  SearchInput,
  matches,
} from "./filter-chips";
import { HighlightCard } from "./highlight-card";

/** Arsip kegiatan dengan filter kategori, pencarian, dan filter tahun. */
export function KegiatanExplorer({ items }: { items: Kegiatan[] }) {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState(ALL);
  const [year, setYear] = useState(ALL);

  const sorted = useMemo(
    () => [...items].sort((a, b) => b.date.localeCompare(a.date)),
    [items],
  );
  const { categories, counts, years } = useMemo(() => {
    const counts: Record<string, number> = { [ALL]: items.length };
    items.forEach((k) => (counts[k.category] = (counts[k.category] ?? 0) + 1));
    const categories = [ALL, ...Object.keys(counts).filter((c) => c !== ALL)];
    const years = [ALL, ...new Set(sorted.map((k) => k.date.slice(0, 4)))];
    return { categories, counts, years };
  }, [items, sorted]);

  const shown = sorted.filter(
    (k) =>
      (cat === ALL || k.category === cat) &&
      (year === ALL || k.date.startsWith(year)) &&
      matches(`${k.title} ${k.summary} ${k.category}`, q),
  );

  return (
    <div>
      <div className="flex flex-col gap-4">
        <FilterChips
          options={categories}
          value={cat}
          onChange={setCat}
          counts={counts}
        />
        <div className="flex gap-2">
          {years.length > 2 && (
            <select
              aria-label="Tahun"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="rounded-full border border-hairline bg-canvas px-4 py-2.5 text-[15px] text-label outline-none focus:border-accent"
            >
              {years.map((y) => (
                <option key={y} value={y}>
                  {y === ALL ? "Semua tahun" : y}
                </option>
              ))}
            </select>
          )}
          <SearchInput value={q} onChange={setQ} placeholder="Cari kegiatan" />
        </div>
      </div>
      {shown.length ? (
        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          {shown.map((k, i) => (
            <HighlightCard key={`${k.title}-${i}`} item={k} />
          ))}
        </div>
      ) : (
        <div className="mt-6">
          <EmptyResult>Belum ada kegiatan untuk filter ini.</EmptyResult>
        </div>
      )}
    </div>
  );
}
