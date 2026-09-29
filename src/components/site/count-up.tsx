"use client";

import { animate, useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef } from "react";

/** Angka yang menghitung naik saat pertama kali terlihat. */
export function CountUp({
  value,
  className,
}: {
  value: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const reduce = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || !inView || reduce) return;
    const controls = animate(0, value, {
      duration: 1.2,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => (el.textContent = Math.round(v).toLocaleString("id-ID")),
    });
    return () => controls.stop();
  }, [inView, reduce, value]);

  // Nilai akhir dirender di server agar tetap benar tanpa JavaScript.
  return (
    <span ref={ref} className={className}>
      {value.toLocaleString("id-ID")}
    </span>
  );
}
