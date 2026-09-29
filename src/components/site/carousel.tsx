"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Children, useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

/** Carousel geser horizontal ala Apple: snap, tombol panah, bisa di-swipe. */
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
      start: el.scrollLeft < 8,
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
    el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: "smooth" });
  };

  return (
    <div role="region" aria-roledescription="carousel" aria-label={label}>
      <div
        ref={ref}
        onScroll={update}
        className="flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        style={{
          paddingInline: "max(1rem, calc((100vw - 1024px) / 2))",
          scrollPaddingInline: "max(1rem, calc((100vw - 1024px) / 2))",
        }}
      >
        {Children.map(children, (child) => (
          <div
            className={cn(
              "w-[82vw] max-w-[380px] shrink-0 snap-start",
              itemClassName,
            )}
          >
            {child}
          </div>
        ))}
      </div>
      <div className="mx-auto mt-4 flex max-w-[1024px] justify-end gap-3 px-4 sm:px-0">
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
              className="grid size-11 place-items-center rounded-full bg-mist text-label transition-colors hover:bg-hairline disabled:opacity-35"
            >
              <Icon className="size-5" />
            </button>
          );
        })}
      </div>
    </div>
  );
}
