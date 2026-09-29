"use client";

import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import { useRef } from "react";

/**
 * Kartu yang menumpuk saat digulir: tiap kartu menempel di atas lalu sedikit
 * mengecil ketika kartu berikutnya datang menutupinya.
 */
export function StickyStack({ children }: { children: React.ReactNode[] }) {
  return (
    <div className="flex flex-col gap-6">
      {children.map((child, i) => (
        <StackItem key={i} index={i} total={children.length}>
          {child}
        </StackItem>
      ))}
    </div>
  );
}

function StackItem({
  children,
  index,
  total,
}: {
  children: React.ReactNode;
  index: number;
  total: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 112px", "end start"],
  });
  const scale = useTransform(
    scrollYProgress,
    [0, 1],
    [1, 1 - (total - index) * 0.03],
  );
  return (
    <div
      ref={ref}
      className="md:sticky"
      style={{ top: `calc(7rem + ${index * 1.25}rem)` }}
    >
      <motion.div style={reduce ? undefined : { scale }} className="origin-top">
        {children}
      </motion.div>
    </div>
  );
}
