"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { Person } from "@/lib/site/schema";
import {
  ALL,
  EmptyResult,
  FilterChips,
  SearchInput,
  matches,
} from "./filter-chips";
import { dosenSlug, initials } from "@/lib/site/names";

/** Daftar dosen dengan kartu horizontal ringkas, pencarian nama, dan filter bidang keahlian. */
export function DosenDirectory({ dosen }: { dosen: Person[] }) {
  const [q, setQ] = useState("");
  const [bidang, setBidang] = useState(ALL);
  const [showAll, setShowAll] = useState(false);

  const options = useMemo(() => {
    const counts = new Map<string, number>();
    dosen.forEach((d) =>
      d.expertise?.forEach((e) => {
        if (e) counts.set(e, (counts.get(e) ?? 0) + 1);
      }),
    );
    const topExpertise = [...counts.entries()]
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], "id"))
      .slice(0, 8)
      .map(([k]) => k);
    return [ALL, ...topExpertise];
  }, [dosen]);

  const shown = dosen.filter(
    (d) =>
      (bidang === ALL || d.expertise?.includes(bidang)) &&
      matches(`${d.name} ${d.role} ${(d.expertise ?? []).join(" ")}`, q),
  );

  const isFiltered = Boolean(q.trim()) || bidang !== ALL;
  const visible = isFiltered || showAll ? shown : shown.slice(0, 12);

  return (
    <div className="mx-auto max-w-[1060px]">
      <div className="flex flex-col gap-3.5 sm:flex-row sm:items-center sm:justify-between">
        {options.length > 2 ? (
          <FilterChips options={options} value={bidang} onChange={setBidang} />
        ) : (
          <span />
        )}
        <SearchInput
          value={q}
          onChange={setQ}
          placeholder="Cari nama dosen atau keahlian..."
        />
      </div>
      <p className="mt-4 text-[13.5px] text-label-3" aria-live="polite">
        Menampilkan {visible.length} dari {shown.length} dosen
      </p>
      {visible.length ? (
        <>
          <div className="mt-3.5 grid gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
            {visible.map((d, i) => (
              <Link
                key={`${d.name}-${i}`}
                href={`/prodi/dosen/${dosenSlug(d.name)}`}
                className="group flex items-start gap-3.5 rounded-[18px] border border-hairline bg-canvas p-4 transition-colors hover:border-accent/40 hover:bg-mist/30"
              >
                {d.photo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={d.photo}
                    alt={d.name}
                    loading="lazy"
                    className="size-13 shrink-0 rounded-full object-cover"
                  />
                ) : (
                  <span className="grid size-13 shrink-0 place-items-center rounded-full bg-accent-soft text-[15px] font-bold text-accent transition-colors group-hover:bg-accent group-hover:text-white">
                    {initials(d.name)}
                  </span>
                )}
                <div className="min-w-0 flex-1">
                  <h3 className="text-[15px] font-bold leading-snug text-label group-hover:text-accent">
                    {d.name}
                  </h3>
                  <p className="mt-0.5 text-[12.5px] font-medium text-label-2">
                    {d.role}
                  </p>
                  {d.expertise && d.expertise.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {d.expertise.slice(0, 3).map((t) => (
                        <span
                          key={t}
                          className="rounded-md bg-mist px-2 py-0.5 text-[11px] font-medium text-label-2"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>

          {!isFiltered && shown.length > 12 && (
            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={() => setShowAll((v) => !v)}
                className="rounded-full border border-hairline bg-canvas px-6 py-2.5 text-[14px] font-semibold text-label transition-colors hover:border-accent hover:text-accent"
              >
                {showAll
                  ? "Ringkas tampilan dosen"
                  : `Tampilkan seluruh ${shown.length} dosen`}
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="mt-4">
          <EmptyResult>
            Tidak ada dosen yang cocok dengan pencarian.
          </EmptyResult>
        </div>
      )}
    </div>
  );
}
