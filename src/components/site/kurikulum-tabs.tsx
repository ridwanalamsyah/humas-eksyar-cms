"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import type { KurikulumYear } from "@/lib/site/schema";

/** Segmented control ala iOS + daftar mata kuliah per semester. */
export function KurikulumTabs({ years }: { years: KurikulumYear[] }) {
  const [active, setActive] = useState(0);
  const year = years[active];

  return (
    <div>
      <div className="flex justify-center">
        <div
          role="tablist"
          aria-label="Tahun kurikulum"
          className="inline-flex rounded-full bg-[#e8e8ed] p-1"
        >
          {years.map((y, i) => (
            <button
              key={y.label}
              role="tab"
              type="button"
              id={`kurikulum-tab-${i}`}
              aria-selected={i === active}
              aria-controls="kurikulum-panel"
              onClick={() => setActive(i)}
              className="relative rounded-full px-4 py-1.5 text-[14px] font-medium text-label sm:px-5"
            >
              {i === active && (
                <motion.span
                  layoutId="kurikulum-seg"
                  className="absolute inset-0 rounded-full bg-canvas shadow-[0_1px_3px_rgba(0,0,0,0.12)]"
                  transition={{ type: "spring", stiffness: 500, damping: 38 }}
                />
              )}
              <span className={cn("relative", i !== active && "text-label-2")}>
                {y.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div
        id="kurikulum-panel"
        role="tabpanel"
        aria-labelledby={`kurikulum-tab-${active}`}
        className="mt-10 grid gap-5 md:grid-cols-2"
      >
        {year.semesters.map((s) => (
          <div key={s.name} className="rounded-[28px] bg-canvas p-8">
            <p className="text-[21px] font-semibold tracking-[-0.01em] text-label">
              {s.name}
            </p>
            <ul className="mt-4">
              {s.courses.map((c, i) => (
                <li
                  key={`${c}-${i}`}
                  className="border-t border-black/[0.06] py-3 text-[16px] text-label/85 first:border-0"
                >
                  {c}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
