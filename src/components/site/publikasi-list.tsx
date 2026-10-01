"use client";

import { ArrowUpRight } from "lucide-react";
import { useMemo, useState } from "react";
import type { Publikasi } from "@/lib/site/schema";
import {
  ALL,
  EmptyResult,
  FilterChips,
  SearchInput,
  matches,
} from "./filter-chips";

/** Daftar publikasi dosen dengan filter jenis dan pencarian. */
export function PublikasiList({ items }: { items: Publikasi[] }) {
  const [q, setQ] = useState("");
  const [type, setType] = useState(ALL);
  const types = useMemo(
    () => [ALL, ...new Set(items.map((p) => p.type).filter(Boolean))],
    [items],
  );
  const shown = items
    .filter(
      (p) =>
        (type === ALL || p.type === type) &&
        matches(`${p.title} ${p.authors} ${p.venue} ${p.year}`, q),
    )
    .sort((a, b) => (b.year || "0").localeCompare(a.year || "0"));

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {types.length > 2 ? (
          <FilterChips options={types} value={type} onChange={setType} />
        ) : (
          <span />
        )}
        <SearchInput
          value={q}
          onChange={setQ}
          placeholder="Cari judul atau penulis"
        />
      </div>
      {shown.length ? (
        <ul className="mt-6 divide-y divide-hairline overflow-hidden rounded-[24px] border border-hairline bg-canvas">
          {shown.map((p, i) => {
            const body = (
              <>
                <span className="min-w-0 flex-1">
                  <span className="text-[12.5px] font-semibold uppercase tracking-[0.06em] text-accent">
                    {[p.type, p.year].filter(Boolean).join(" · ")}
                  </span>
                  <span className="mt-1 block text-[16px] font-semibold leading-snug text-label group-hover:text-accent">
                    {p.title}
                  </span>
                  <span className="mt-1 block text-[14px] text-label-2">
                    {[p.authors, p.venue].filter(Boolean).join(" · ")}
                  </span>
                </span>
                {p.url && (
                  <ArrowUpRight className="mt-1 size-4 shrink-0 text-label-3 group-hover:text-accent" />
                )}
              </>
            );
            return (
              <li key={`${p.title}-${i}`}>
                {p.url ? (
                  <a
                    href={p.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex gap-4 p-5 hover:bg-mist/60"
                  >
                    {body}
                  </a>
                ) : (
                  <div className="flex gap-4 p-5">{body}</div>
                )}
              </li>
            );
          })}
        </ul>
      ) : (
        <div className="mt-6">
          <EmptyResult>Belum ada publikasi yang cocok.</EmptyResult>
        </div>
      )}
    </div>
  );
}
