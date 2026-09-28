"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@/lib/utils";
import type { KurikulumYear } from "@/lib/site/prodi";

export function KurikulumTabs({ years }: { years: KurikulumYear[] }) {
  const [active, setActive] = useState(0);
  const year = years[active];

  return (
    <div>
      <div role="tablist" aria-label="Tahun kurikulum" className="glass-thin inline-flex flex-wrap gap-1 rounded-2xl p-1">
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
              "relative rounded-xl px-4 py-2 text-sm font-semibold transition-colors",
              i === active ? "text-white" : "text-foreground/65 hover:text-foreground",
            )}
          >
            {i === active && (
              <motion.span
                layoutId="kurikulum-pill"
                className="absolute inset-0 rounded-xl bg-brand-500"
                transition={{ type: "spring", stiffness: 400, damping: 32 }}
              />
            )}
            <span className="relative">{y.label}</span>
          </button>
        ))}
      </div>

      <div id="kurikulum-panel" role="tabpanel" aria-labelledby={`kurikulum-tab-${active}`} className="mt-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={year.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="grid gap-4 md:grid-cols-2"
          >
            {year.semesters.map((s) => (
              <div key={s.name} className="glass-regular rounded-2xl p-6">
                <p className="font-display text-lg font-semibold">{s.name}</p>
                <ul className="mt-4 grid gap-2.5">
                  {s.courses.map((c) => (
                    <li key={c} className="flex items-start gap-2.5 text-[14px] text-foreground/75">
                      <span className="mt-2 size-1.5 shrink-0 rounded-full bg-gold-500" aria-hidden />
                      {c}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
