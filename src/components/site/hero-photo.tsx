"use client";

import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import { useEffect, useRef } from "react";

/**
 * Foto kegiatan utama di bawah hero: tampil sebagai kartu bersudut bulat
 * yang rapi di dalam batas layar, lalu melebar perlahan saat digulir.
 */
export function HeroPhoto({ src, caption }: { src: string; caption: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const range = useRef({ start: 0, length: 1 });

  useEffect(() => {
    const measure = () => {
      const el = ref.current;
      if (!el) return;
      const top = el.getBoundingClientRect().top + window.scrollY;
      range.current = {
        start: top,
        length: Math.max(1, el.offsetHeight - window.innerHeight),
      };
    };
    measure();
    window.addEventListener("resize", measure);
    const ro = new ResizeObserver(measure);
    ro.observe(document.body);
    return () => {
      window.removeEventListener("resize", measure);
      ro.disconnect();
    };
  }, []);

  const { scrollY } = useScroll();
  const scrollYProgress = useTransform(scrollY, (y) =>
    Math.min(1, Math.max(0, (y - range.current.start) / range.current.length)),
  );
  const clipPath = useTransform(
    scrollYProgress,
    [0, 0.65],
    ["inset(4% 5% 4% 5% round 28px)", "inset(0% 0% 0% 0% round 0px)"],
  );
  const scale = useTransform(scrollYProgress, [0, 0.65], [1.08, 1]);
  const captionOpacity = useTransform(scrollYProgress, [0.35, 0.65], [0, 1]);

  if (reduce) {
    return (
      <div className="px-4 pb-16 sm:px-6">
        <figure className="mx-auto max-w-[1024px]">
          <div className="relative aspect-[16/9] isolate overflow-hidden rounded-[28px] border border-hairline bg-mist">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={src}
              alt={caption}
              className="absolute inset-0 size-full object-cover"
            />
          </div>
          {caption && (
            <figcaption className="mt-3 text-[13px] text-label-2">
              {caption}
            </figcaption>
          )}
        </figure>
      </div>
    );
  }

  return (
    <div ref={ref} className="relative h-[160svh]">
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        <motion.figure
          style={{ clipPath }}
          className="absolute inset-0 isolate overflow-hidden bg-mist will-change-[clip-path]"
        >
          <motion.img
            src={src}
            alt={caption}
            style={{ scale }}
            className="absolute inset-0 size-full object-cover"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/65 via-black/25 to-transparent"
          />
          {caption && (
            <motion.figcaption
              style={{ opacity: captionOpacity }}
              className="absolute bottom-8 left-6 right-6 max-w-xl rounded-2xl border border-white/15 bg-navy/75 px-4 py-2.5 text-[13px] font-medium leading-snug text-white backdrop-blur-md sm:bottom-12 sm:left-12 sm:right-auto"
            >
              {caption}
            </motion.figcaption>
          )}
        </motion.figure>
      </div>
    </div>
  );
}
