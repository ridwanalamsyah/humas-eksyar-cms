"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Batang yang tumbuh dari 0 ke lebarnya saat terlihat di layar.
 * Tanpa JavaScript, atau bila pengguna mematikan animasi, langsung tampil penuh.
 */
export function GrowBar({ pct, delay = 0 }: { pct: number; delay?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [shown, setShown] = useState(true);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setShown(false);
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <span
      ref={ref}
      className="block h-full rounded-full bg-accent transition-[width] duration-1000 ease-out"
      style={{ width: shown ? `${pct}%` : "0%", transitionDelay: `${delay}ms` }}
    />
  );
}
