"use client";

import { AnimatePresence, motion } from "motion/react";
import { ArrowUpRight, ChevronDown } from "lucide-react";
import { useState } from "react";
import type { Prosedur } from "@/lib/site/schema";
import { cn } from "@/lib/utils";

/** Alur layanan akademik: akordeon berisi langkah bernomor. */
export function ProsedurList({ items }: { items: Prosedur[] }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <ul className="grid gap-3">
      {items.map((p, i) => (
        <li
          key={p.title}
          className="overflow-hidden rounded-[24px] border border-hairline bg-canvas"
        >
          <button
            type="button"
            aria-expanded={open === i}
            onClick={() => setOpen(open === i ? null : i)}
            className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
          >
            <span>
              <span className="block text-[18px] font-bold tracking-[-0.01em] text-label">
                {p.title}
              </span>
              {p.description && (
                <span className="mt-0.5 block text-[14.5px] text-label-2">
                  {p.description}
                </span>
              )}
            </span>
            <ChevronDown
              className={cn(
                "size-5 shrink-0 text-label-3 transition-transform",
                open === i && "rotate-180",
              )}
            />
          </button>
          <AnimatePresence initial={false}>
            {open === i && (
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: "auto" }}
                exit={{ height: 0 }}
                className="overflow-hidden"
              >
                <ol className="space-y-3 px-6 pb-6">
                  {p.steps.map((s, k) => (
                    <li key={k} className="flex gap-4">
                      <span className="grid size-7 shrink-0 place-items-center rounded-full bg-accent text-[13px] font-bold text-white">
                        {k + 1}
                      </span>
                      <span className="pt-0.5 text-[15.5px] leading-relaxed text-label">
                        {s}
                      </span>
                    </li>
                  ))}
                </ol>
                {p.url && (
                  <a
                    href={p.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mx-6 mb-6 inline-flex items-center gap-1.5 rounded-full bg-mist px-4 py-2 text-[14px] font-semibold text-accent hover:bg-accent hover:text-white"
                  >
                    Formulir / dokumen <ArrowUpRight className="size-4" />
                  </a>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </li>
      ))}
    </ul>
  );
}
