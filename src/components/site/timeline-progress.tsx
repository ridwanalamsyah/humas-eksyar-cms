"use client";

import { motion, useReducedMotion, useScroll, useSpring } from "motion/react";
import { useRef } from "react";

/** Garis linimasa yang terisi mengikuti posisi gulir. */
export function TimelineProgress({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLOListElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.7", "end 0.6"],
  });
  const scaleY = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });
  return (
    <ol ref={ref} className="relative mx-auto mt-16 max-w-[820px] pl-8">
      <span
        aria-hidden
        className="absolute left-0 top-0 h-full w-0.5 bg-hairline"
      />
      <motion.span
        aria-hidden
        style={{ scaleY: reduce ? 1 : scaleY }}
        className="absolute left-0 top-0 h-full w-0.5 origin-top bg-accent"
      />
      {children}
    </ol>
  );
}
