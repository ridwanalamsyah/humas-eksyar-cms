"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  ALL,
  EmptyResult,
  FilterChips,
  SearchInput,
  matches,
} from "./filter-chips";

type MK = { nama: string; dosen: string[]; kelas: number; kategori: string[] };

/** Direktori mata kuliah dari e-Knows: cari nama MK / dosen, filter kelompok. */
export function MataKuliahDirectory({ items }: { items: MK[] }) {
  const [q, setQ] = useState("");
  const [grp, setGrp] = useState(ALL);
  const top = (k: string) => k.split(" · ")[0].split(" › ")[0].trim();
  const groups = useMemo(() => {
    const set = new Set(
      items
        .flatMap((m) => m.kategori.map(top))
        .filter((g) => g.startsWith("Semester ")),
    );
    return set.size > 1
      ? [
          ALL,
          ...[...set].sort((a, b) =>
            a.localeCompare(b, "id", { numeric: true }),
          ),
        ]
      : [];
  }, [items]);
  const shown = items.filter(
    (m) =>
      (grp === ALL || m.kategori.some((k) => top(k) === grp)) &&
      matches(`${m.nama} ${m.dosen.join(" ")}`, q),
  );
  const [limit, setLimit] = useState(8);

  return (
    <div>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        {groups.length ? (
          <FilterChips options={groups} value={grp} onChange={setGrp} />
        ) : (
          <span />
        )}
        <SearchInput
          value={q}
          onChange={setQ}
          placeholder="Cari mata kuliah atau dosen"
        />
      </div>
      <p className="mt-6 text-[14px] text-label-3" aria-live="polite">
        {shown.length} mata kuliah
      </p>
      {shown.length ? (
        <ul className="mt-3 grid grid-cols-1 gap-x-8 gap-y-4 md:grid-cols-2">
          {shown.slice(0, limit).map((m) => (
            <li
              key={m.nama}
              className="border-t border-hairline pt-5"
            >
              <p className="text-[16px] font-semibold leading-snug text-label">
                {m.nama}
              </p>
              <p className="mt-1 text-[14px] text-label-3">
                {m.kelas} kelas
                {m.kategori[0] ? ` · ${m.kategori.slice(0, 2).join(", ")}` : ""}
              </p>
              {m.dosen.length > 0 && (
                <p className="mt-1.5 line-clamp-2 text-[14px] text-label-2">
                  {m.dosen.slice(0, 3).map((d, i) => (
                    <span key={d}>
                      {i > 0 && ", "}
                      <Link href={`/prodi/dosen?q=${encodeURIComponent(d)}`} className="hover:text-accent">
                        {d}
                      </Link>
                    </span>
                  ))}
                  {m.dosen.length > 3 && <span className="text-label-3"> +{m.dosen.length - 3}</span>}
                </p>
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
            onClick={() => setLimit((l) => l + 24)}
            className="min-h-11 text-[16px] font-semibold text-accent hover:underline"
          >
            Tampilkan {Math.min(24, shown.length - limit)} lagi
          </button>
        </div>
      )}
    </div>
  );
}
