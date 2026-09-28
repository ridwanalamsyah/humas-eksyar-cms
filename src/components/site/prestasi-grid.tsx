"use client";

import { useMemo, useState } from "react";
import type { Prestasi } from "@/lib/site/schema";
import { ALL, FilterChips } from "./filter-chips";
import { PrestasiCard } from "./prestasi-card";

/** Grid prestasi dengan filter kelompok (Mahasiswa, Dosen, Alumni, ...). */
export function PrestasiGrid({ items }: { items: Prestasi[] }) {
  const [group, setGroup] = useState(ALL);
  const groups = useMemo(
    () => [ALL, ...new Set(items.map((p) => p.group).filter(Boolean))],
    [items],
  );
  const shown = items.filter((p) => group === ALL || p.group === group);

  return (
    <div>
      {groups.length > 2 && (
        <div className="flex justify-center">
          <FilterChips options={groups} value={group} onChange={setGroup} />
        </div>
      )}
      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {shown.map((p, i) => (
          <PrestasiCard key={`${p.name}-${i}`} item={p} />
        ))}
      </div>
    </div>
  );
}
