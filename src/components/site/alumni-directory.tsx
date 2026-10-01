"use client";

import { useMemo, useState } from "react";
import {
  ALL,
  EmptyResult,
  FilterChips,
  SearchInput,
  matches,
} from "./filter-chips";

export type AlumniEntry = {
  nama: string;
  lulus: number;
  pekerjaan: string;
  instansi: string;
  bidang: string;
  kota?: string;
  linkedin?: string;
  mentor: boolean;
};

/** Direktori alumni (hanya yang mengizinkan), dengan filter bidang & pencarian. */
export function AlumniDirectory({ items }: { items: AlumniEntry[] }) {
  const [q, setQ] = useState("");
  const [bidang, setBidang] = useState(ALL);
  const [mentorOnly, setMentorOnly] = useState(false);
  const opts = useMemo(
    () => [ALL, ...new Set(items.map((a) => a.bidang).filter(Boolean))],
    [items],
  );
  const shown = items.filter(
    (a) =>
      (bidang === ALL || a.bidang === bidang) &&
      (!mentorOnly || a.mentor) &&
      matches(
        `${a.nama} ${a.pekerjaan} ${a.instansi} ${a.kota ?? ""} ${a.lulus}`,
        q,
      ),
  );
  return (
    <div>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        {opts.length > 2 ? (
          <FilterChips options={opts} value={bidang} onChange={setBidang} />
        ) : (
          <span />
        )}
        <div className="flex items-center gap-3">
          <label className="flex shrink-0 items-center gap-2 text-[14px] text-label-2">
            <input
              type="checkbox"
              checked={mentorOnly}
              onChange={(e) => setMentorOnly(e.target.checked)}
            />{" "}
            Bersedia jadi mentor
          </label>
          <SearchInput
            value={q}
            onChange={setQ}
            placeholder="Cari nama, instansi, kota"
          />
        </div>
      </div>
      {shown.length ? (
        <ul className="mt-6 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {shown.map((a, i) => (
            <li
              key={`${a.nama}-${i}`}
              className="rounded-[20px] border border-hairline bg-canvas p-5"
            >
              <p className="text-[16px] font-bold text-label">{a.nama}</p>
              <p className="mt-0.5 text-[13px] text-label-3">
                Lulus {a.lulus}
                {a.kota ? ` · ${a.kota}` : ""}
              </p>
              <p className="mt-2 text-[14.5px] text-label">
                {a.pekerjaan}
                <span className="text-label-2"> · {a.instansi}</span>
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                {a.mentor && (
                  <span className="rounded-full bg-accent-soft px-2.5 py-1 text-[12px] font-semibold text-accent">
                    Mentor
                  </span>
                )}
                {a.linkedin && (
                  <a
                    href={a.linkedin}
                    target="_blank"
                    rel="noopener noreferrer nofollow"
                    className="text-[13px] font-semibold text-accent hover:underline"
                  >
                    LinkedIn ↗
                  </a>
                )}
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="mt-6">
          <EmptyResult>Belum ada alumni yang cocok.</EmptyResult>
        </div>
      )}
    </div>
  );
}
