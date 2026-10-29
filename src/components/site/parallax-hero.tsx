"use client";

import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import { useRef } from "react";

/**
 * Hero beranda: latar atmosferik halus dengan kisi geometris yang terjaga
 * di dalam batas kontainer (overflow-hidden), serta efek paralaks lembut.
 */
export function ParallaxHero({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [0, 90]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.96]);
  const opacity = useTransform(scrollYProgress, [0, 0.85], [1, 0]);

  return (
    <section
      ref={ref}
      className="relative isolate overflow-hidden px-4 pb-16 pt-12 text-center sm:px-6 sm:pb-24 sm:pt-20"
    >
      {/*Pencahayaan lembut di latar hero (tidak pernah keluar batas)*/}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[520px] bg-[radial-gradient(ellipse_65%_55%_at_50%_0%,rgba(26,99,78,0.10),transparent_75%)]"
      />
      <motion.div
        style={reduce ? undefined : { y, scale, opacity }}
        className="relative mx-auto max-w-[1060px]"
      >
        {children}
      </motion.div>
    </section>
  );
}

/**
 * Judul hero yang muncul kata demi kata dari balik garis,
 * dengan ruang ekstra (padding-bottom) agar huruf berekor (y, g, p, j) tidak terpotong.
 */
export function HeroTitle({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const words = text.split(/\s+/).filter(Boolean);
  return (
    <h1 className={className} aria-label={text}>
      {words.map((w, i) => (
        <span
          key={`${w}-${i}`}
          aria-hidden
          className="inline-block overflow-hidden pb-[0.14em] pt-[0.04em] align-bottom"
        >
          <motion.span
            className="inline-block"
            initial={reduce ? false : { y: "105%" }}
            animate={{ y: 0 }}
            transition={{
              duration: 0.85,
              delay: 0.08 + i * 0.1,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            {w}
          </motion.span>
          {i < words.length - 1 && "\u00A0"}
        </span>
      ))}
    </h1>
  );
}
