"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ALL, EmptyResult, FilterChips, SearchInput, matches } from "./filter-chips";

type MK = { nama: string; dosen: string[]; kelas: number; kategori: string[] };

/** Direktori mata kuliah dari e-Knows: cari nama MK / dosen, filter kelompok. */
export function MataKuliahDirectory({ items }: { items: MK[] }) {
  const [q, setQ] = useState("");
  const [grp, setGrp] = useState(ALL);
  const top = (k: string) => k.split(" › ")[0];
  const groups = useMemo(() => {
    const set = new Set(items.flatMap((m) => m.kategori.map(top)).filter(Boolean));
    return set.size > 1 && set.size <= 16 ? [ALL, ...[...set].sort((a, b) => a.localeCompare(b, "id", { numeric: true }))] : [];
  }, [items]);
  const shown = items.filter(
    (m) => (grp === ALL || m.kategori.some((k) => top(k) === grp)) && matches(`${m.nama} ${m.dosen.join(" ")}`, q),
  );
  const [limit, setLimit] = useState(24);

  return (
    <div>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        {groups.length ? <FilterChips options={groups} value={grp} onChange={setGrp} /> : <span />}
        <SearchInput value={q} onChange={setQ} placeholder="Cari mata kuliah atau dosen" />
      </div>
      <p className="mt-6 text-[14px] text-label-3" aria-live="polite">
        {shown.length} mata kuliah
      </p>
      {shown.length ? (
        <ul className="mt-3 grid gap-3 md:grid-cols-2">
          {shown.slice(0, limit).map((m) => (
            <li key={m.nama} className="rounded-[20px] border border-hairline bg-canvas p-5">
              <p className="text-[16px] font-semibold leading-snug text-label">{m.nama}</p>
              <p className="mt-1 text-[13px] text-label-3">
                {m.kelas} kelas{m.kategori[0] ? ` · ${m.kategori.slice(0, 2).join(", ")}` : ""}
              </p>
              {m.dosen.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {m.dosen.slice(0, 6).map((d) => (
                    <Link
                      key={d}
                      href={`/prodi/dosen?q=${encodeURIComponent(d)}`}
                      className="rounded-full bg-mist px-2.5 py-1 text-[12.5px] font-medium text-label-2 hover:text-accent"
                    >
                      {d}
                    </Link>
                  ))}
                  {m.dosen.length > 6 && <span className="px-1 py-1 text-[12.5px] text-label-3">+{m.dosen.length - 6}</span>}
                </div>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <div className="mt-3">
          <EmptyResult>Mata kuliah tidak ditemukan.</EmptyResult>
        </div>
      )}
      {shown.length > limit && (
        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => setLimit((l) => l + 48)}
            className="rounded-full bg-mist px-6 py-2.5 text-[15px] font-semibold text-label hover:bg-hairline"
          >
            Tampilkan lebih banyak ({shown.length - limit} lagi)
          </button>
        </div>
      )}
    </div>
  );
}
