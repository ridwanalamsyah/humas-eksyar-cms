"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Children, useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

/** Carousel geser horizontal presisi: kartu pertama sejajar lurus dengan judul tanpa offset miring. */
export function Carousel({
  children,
  label,
  itemClassName,
}: {
  children: React.ReactNode;
  label: string;
  itemClassName?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [edge, setEdge] = useState({ start: true, end: false });

  const update = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    setEdge({
      start: el.scrollLeft <= 4,
      end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 8,
    });
  }, []);

  useEffect(() => {
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [update]);

  const go = (dir: 1 | -1) => {
    const el = ref.current;
    if (!el) return;
    el.scrollBy({ left: dir * (el.clientWidth * 0.75), behavior: "smooth" });
  };

  return (
    <div role="region" aria-roledescription="carousel" aria-label={label} className="relative w-full">
      {/* Container scroll lurus sejajar kiri dengan padding 0 agar kartu pertama presisi di bawah judul */}
      <div
        ref={ref}
        onScroll={update}
        className="flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth pb-4 pt-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        style={{
          paddingInline: 0,
          scrollPaddingInline: 0,
        }}
      >
        {Children.map(children, (child) => (
          <div
            className={cn(
              "w-[85vw] max-w-[340px] sm:max-w-[360px] shrink-0 snap-start",
              itemClassName,
            )}
          >
            {child}
          </div>
        ))}
      </div>

      {/* Tombol navigasi panah kiri/kanan di kanan bawah */}
      <div className="mt-3 flex items-center justify-end gap-2">
        {([-1, 1] as const).map((dir) => {
          const disabled = dir === -1 ? edge.start : edge.end;
          const Icon = dir === -1 ? ChevronLeft : ChevronRight;
          return (
            <button
              key={dir}
              type="button"
              onClick={() => go(dir)}
              disabled={disabled}
              aria-label={dir === -1 ? "Sebelumnya" : "Berikutnya"}
              className="grid size-10 place-items-center rounded-xl border border-hairline bg-canvas text-label transition-colors hover:border-accent hover:text-accent disabled:opacity-25 disabled:pointer-events-none shadow-2xs"
            >
              <Icon className="size-4.5" />
            </button>
          );
        })}
      </div>
    </div>
  );
}
