"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import type { KurikulumYear } from "@/lib/site/prodi";

export function KurikulumTabs({ years }: { years: KurikulumYear[] }) {
  const [active, setActive] = useState(0);
  const year = years[active];

  return (
    <div>
      <div role="tablist" aria-label="Tahun kurikulum" className="flex flex-wrap border-b border-pine-800/15">
        {years.map((y, i) => (
          <button
            key={y.label}
            role="tab"
            type="button"
            id={`kurikulum-tab-${i}`}
            aria-selected={i === active}
            aria-controls="kurikulum-panel"
            onClick={() => setActive(i)}
            className={cn(
              "-mb-px border-b-[3px] px-5 py-3 font-serif text-[16px] font-semibold transition-colors",
              i === active ? "border-saffron-500 text-pine-800" : "border-transparent text-ink/50 hover:text-pine-700",
            )}
          >
            {y.label}
          </button>
        ))}
      </div>

      <div
        id="kurikulum-panel"
        role="tabpanel"
        aria-labelledby={`kurikulum-tab-${active}`}
        className="grid gap-px bg-pine-800/10 md:grid-cols-2"
      >
        {year.semesters.map((s) => (
          <div key={s.name} className="bg-paper p-7">
            <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-saffron-600">{s.name}</p>
            <ol className="mt-4 grid gap-0">
              {s.courses.map((c, i) => (
                <li key={`${c}-${i}`} className="flex gap-4 border-b border-dashed border-pine-800/10 py-2.5 text-[15px] text-ink/80 last:border-0">
                  <span className="w-5 font-mono text-[12px] leading-6 text-pine-500">{String(i + 1).padStart(2, "0")}</span>
                  {c}
                </li>
              ))}
            </ol>
          </div>
        ))}
      </div>
    </div>
  );
}
