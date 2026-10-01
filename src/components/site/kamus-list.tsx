"use client";

import { useMemo, useState } from "react";
import type { Kamus } from "@/lib/site/schema";
import {
  ALL,
  EmptyResult,
  FilterChips,
  SearchInput,
  matches,
} from "./filter-chips";

/** Kamus istilah: cari, filter kategori, indeks huruf. */
export function KamusList({ items }: { items: Kamus[] }) {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState(ALL);
  const cats = useMemo(
    () => [ALL, ...new Set(items.map((k) => k.kategori).filter(Boolean))],
    [items],
  );
  const shown = items
    .filter(
      (k) =>
        (cat === ALL || k.kategori === cat) &&
        matches(`${k.istilah} ${k.arti}`, q),
    )
    .sort((a, b) => a.istilah.localeCompare(b.istilah, "id"));
  const letters = [...new Set(shown.map((k) => k.istilah[0].toUpperCase()))];
  return (
    <div>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <FilterChips options={cats} value={cat} onChange={setCat} />
        <SearchInput value={q} onChange={setQ} placeholder="Cari istilah" />
      </div>
      {letters.length > 4 && (
        <nav aria-label="Indeks huruf" className="mt-6 flex flex-wrap gap-1">
          {letters.map((l) => (
            <a
              key={l}
              href={`#huruf-${l}`}
              className="grid size-8 place-items-center rounded-full bg-mist text-[13px] font-bold text-label hover:bg-accent hover:text-white"
            >
              {l}
            </a>
          ))}
        </nav>
      )}
      {shown.length ? (
        <dl className="mt-8 grid gap-3 md:grid-cols-2">
          {shown.map((k, i) => (
            <div
              key={k.istilah}
              id={
                i === 0 ||
                shown[i - 1].istilah[0].toUpperCase() !==
                  k.istilah[0].toUpperCase()
                  ? `huruf-${k.istilah[0].toUpperCase()}`
                  : undefined
              }
              className="scroll-mt-28 rounded-[20px] border border-hairline bg-canvas p-5"
            >
              <dt className="flex items-baseline justify-between gap-3">
                <span className="text-[17px] font-bold text-label">
                  {k.istilah}
                </span>
                <span className="shrink-0 text-[12px] font-semibold text-accent">
                  {k.kategori}
                </span>
              </dt>
              <dd className="mt-1.5 text-[15px] leading-[1.55] text-label-2">
                {k.arti}
              </dd>
            </div>
          ))}
        </dl>
      ) : (
        <div className="mt-8">
          <EmptyResult>Istilah tidak ditemukan.</EmptyResult>
        </div>
      )}
    </div>
  );
}
