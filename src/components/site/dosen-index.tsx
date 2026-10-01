"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { DosenEntry } from "@/lib/site/dosen-index";
import { EmptyResult, SearchInput, matches } from "./filter-chips";

/** Direktori seluruh dosen pengampu & pembimbing, dengan pencarian. */
export function DosenIndex({
  items,
  initialQuery = "",
}: {
  items: DosenEntry[];
  initialQuery?: string;
}) {
  const [q, setQ] = useState(initialQuery);
  const [limit, setLimit] = useState(30);
  const shown = useMemo(
    () =>
      items.filter((d) =>
        matches(
          `${d.nama} ${d.jabatan ?? ""} ${d.keahlian.join(" ")} ${d.mataKuliah.join(" ")}`,
          q,
        ),
      ),
    [items, q],
  );

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-[14px] text-label-3" aria-live="polite">
          {shown.length} dosen
        </p>
        <SearchInput
          value={q}
          onChange={setQ}
          placeholder="Cari nama, mata kuliah, keahlian"
        />
      </div>
      {shown.length ? (
        <ul className="mt-4 grid gap-3 md:grid-cols-2">
          {shown.slice(0, limit).map((d) => (
            <li
              key={d.nama}
              className="flex h-full flex-col rounded-[20px] border border-hairline bg-canvas p-5"
            >
              <p className="text-[16.5px] font-bold leading-snug text-label">
                {d.nama}
              </p>
              {d.jabatan && (
                <p className="mt-0.5 text-[13.5px] text-label-2">{d.jabatan}</p>
              )}
              {d.mataKuliah.length > 0 && (
                <p className="mt-3 text-[13.5px] leading-relaxed text-label-2">
                  <span className="font-semibold text-label">Mengampu: </span>
                  {d.mataKuliah.slice(0, 5).join(", ")}
                  {d.mataKuliah.length > 5 &&
                    ` +${d.mataKuliah.length - 5} lainnya`}
                </p>
              )}
              {d.keahlian.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {d.keahlian.map((k) => (
                    <span
                      key={k}
                      className="rounded-full bg-accent-soft px-2.5 py-1 text-[12px] font-semibold text-accent"
                    >
                      {k}
                    </span>
                  ))}
                </div>
              )}
              {d.bimbingan > 0 && d.namaPembimbing && (
                <Link
                  href={`/prodi/skripsi?pembimbing=${encodeURIComponent(d.namaPembimbing)}`}
                  className="mt-auto pt-4 text-[14px] font-semibold text-accent hover:underline"
                >
                  {d.bimbingan} skripsi bimbingan ›
                </Link>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <div className="mt-4">
          <EmptyResult>Dosen tidak ditemukan.</EmptyResult>
        </div>
      )}
      {shown.length > limit && (
        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => setLimit((l) => l + 60)}
            className="rounded-full bg-mist px-6 py-2.5 text-[15px] font-semibold text-label hover:bg-hairline"
          >
            Tampilkan lebih banyak ({shown.length - limit} lagi)
          </button>
        </div>
      )}
    </div>
  );
}
