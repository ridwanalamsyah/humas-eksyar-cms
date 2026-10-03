"use client";

import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import { useEffect, useRef } from "react";

/**
 * Foto kegiatan di bawah hero: tampil sebagai kartu bersudut bulat, lalu
 * melebar perlahan hingga penuh selebar layar saat digulir.
 */
export function HeroPhoto({ src, caption }: { src: string; caption: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  // Posisi bagian ini di halaman, diukur ulang saat ukuran layar berubah.
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
    ["inset(12% 14% 12% 14% round 32px)", "inset(0% 0% 0% 0% round 0px)"],
  );
  const scale = useTransform(scrollYProgress, [0, 0.65], [1.15, 1]);
  const captionOpacity = useTransform(scrollYProgress, [0.5, 0.7], [0, 1]);

  if (reduce) {
    return (
      <div className="px-4 pb-16 sm:px-6">
        <figure className="mx-auto max-w-[1024px]">
          <div className="relative aspect-[16/9] overflow-hidden rounded-[28px] bg-mist">
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
    <div ref={ref} className="relative h-[180svh]">
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        <motion.figure
          style={{ clipPath }}
          className="absolute inset-0 bg-mist will-change-[clip-path]"
        >
          <motion.img
            src={src}
            alt={caption}
            style={{ scale }}
            className="absolute inset-0 size-full object-cover"
          />
          {caption && (
            <motion.figcaption
              style={{ opacity: captionOpacity }}
              className="absolute bottom-6 left-6 max-w-[80%] rounded-full bg-black/55 px-4 py-2 text-[13px] font-medium text-white backdrop-blur-sm sm:bottom-10 sm:left-10"
            >
              {caption}
            </motion.figcaption>
          )}
        </motion.figure>
      </div>
    </div>
  );
}
