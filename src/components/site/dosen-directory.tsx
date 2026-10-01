"use client";

import { useMemo, useState } from "react";
import type { Person } from "@/lib/site/schema";
import {
  ALL,
  EmptyResult,
  FilterChips,
  SearchInput,
  matches,
} from "./filter-chips";
import { PersonCard } from "./person-card";
import { dosenSlug } from "@/lib/site/names";

/** Daftar dosen dengan pencarian nama dan filter bidang keahlian. */
export function DosenDirectory({ dosen }: { dosen: Person[] }) {
  const [q, setQ] = useState("");
  const [bidang, setBidang] = useState(ALL);

  const options = useMemo(() => {
    const set = new Set<string>();
    dosen.forEach((d) => d.expertise?.forEach((e) => e && set.add(e)));
    return [ALL, ...[...set].sort((a, b) => a.localeCompare(b, "id"))];
  }, [dosen]);

  const shown = dosen.filter(
    (d) =>
      (bidang === ALL || d.expertise?.includes(bidang)) &&
      matches(`${d.name} ${d.role} ${(d.expertise ?? []).join(" ")}`, q),
  );

  return (
    <div className="mx-auto max-w-[1024px]">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {options.length > 2 ? (
          <FilterChips options={options} value={bidang} onChange={setBidang} />
        ) : (
          <span />
        )}
        <SearchInput value={q} onChange={setQ} placeholder="Cari nama dosen" />
      </div>
      <p className="mt-6 text-[14px] text-label-3" aria-live="polite">
        {shown.length} dari {dosen.length} dosen
      </p>
      {shown.length ? (
        <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {shown.map((d, i) => (
            <PersonCard
              key={`${d.name}-${i}`}
              name={d.name}
              role={d.role}
              photo={d.photo}
              tags={d.expertise}
              href={`/prodi/dosen/${dosenSlug(d.name)}`}
            />
          ))}
        </div>
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
