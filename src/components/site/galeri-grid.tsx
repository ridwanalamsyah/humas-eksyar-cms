"use client";

import { AnimatePresence, motion } from "motion/react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { formatLongDate } from "@/lib/format/dates";
import type { Galeri } from "@/lib/site/schema";
import { ALL, FilterChips } from "./filter-chips";

/** Grid foto dengan filter album dan lightbox (panah kiri/kanan, Esc). */
export function GaleriGrid({ items }: { items: Galeri[] }) {
  const [album, setAlbum] = useState(ALL);
  const [open, setOpen] = useState<number | null>(null);
  const albums = useMemo(
    () => [ALL, ...new Set(items.map((g) => g.album).filter(Boolean))],
    [items],
  );
  const shown = items.filter((g) => album === ALL || g.album === album);

  const step = useCallback(
    (d: number) =>
      setOpen((i) =>
        i === null ? null : (i + d + shown.length) % shown.length,
      ),
    [shown.length],
  );

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    document.documentElement.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = "";
    };
  }, [open, step]);

  const current = open !== null ? shown[open] : null;

  return (
    <div>
      {albums.length > 2 && (
        <FilterChips options={albums} value={album} onChange={setAlbum} />
      )}
      <div className="mt-6 columns-2 gap-4 sm:columns-3 [&>*]:mb-4">
        {shown.map((g, i) => (
          <button
            key={`${g.image}-${i}`}
            type="button"
            onClick={() => setOpen(i)}
            className="group relative block w-full overflow-hidden rounded-[20px] bg-mist"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={g.image}
              alt={g.caption}
              loading="lazy"
              className="w-full transition duration-700 group-hover:scale-[1.04]"
            />
            {g.caption && (
              <span className="absolute inset-x-0 bottom-0 translate-y-full bg-navy/75 px-4 py-2.5 text-left text-[13px] font-medium text-white transition-transform duration-300 group-hover:translate-y-0">
                {g.caption}
              </span>
            )}
          </button>
        ))}
      </div>

      <AnimatePresence>
        {current && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={current.caption || "Foto"}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] flex flex-col bg-navy/95 p-4 sm:p-8"
            onClick={() => setOpen(null)}
          >
            <div className="flex justify-end">
              <button
                type="button"
                aria-label="Tutup"
                className="grid size-11 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20"
              >
                <X className="size-5" />
              </button>
            </div>
            <div
              className="relative flex min-h-0 flex-1 items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <motion.img
                key={current.image}
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                src={current.image}
                alt={current.caption}
                className="max-h-full max-w-full rounded-2xl object-contain"
              />
              {shown.length > 1 && (
                <>
                  <button
                    type="button"
                    aria-label="Sebelumnya"
                    onClick={() => step(-1)}
                    className="absolute left-0 grid size-11 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20"
                  >
                    <ChevronLeft className="size-6" />
                  </button>
                  <button
                    type="button"
                    aria-label="Berikutnya"
                    onClick={() => step(1)}
                    className="absolute right-0 grid size-11 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20"
                  >
                    <ChevronRight className="size-6" />
                  </button>
                </>
              )}
            </div>
            <p
              className="pt-4 text-center text-[15px] text-white/85"
              onClick={(e) => e.stopPropagation()}
            >
              {current.caption}
              {current.date && (
                <span className="text-white/55">
                  {" "}
                  · {formatLongDate(current.date)}
                </span>
              )}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
