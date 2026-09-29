"use client";

import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react";
import { useRef } from "react";

/**
 * Hero dengan efek parallax: isi utama mengecil & memudar saat digulir,
 * sementara label bidang keilmuan di sekelilingnya bergerak dengan kecepatan
 * berbeda sehingga terasa berlapis. Tanpa gradasi — hanya pil warna solid.
 */
const SPOTS = [
  { top: "12%", side: "left", x: "3%", speed: -140, tone: "accent" },
  { top: "18%", side: "right", x: "4%", speed: -220, tone: "sand" },
  { top: "36%", side: "left", x: "1.5%", speed: -260, tone: "mist" },
  { top: "44%", side: "right", x: "2%", speed: -120, tone: "accent" },
  { top: "60%", side: "left", x: "4%", speed: -300, tone: "sand" },
  { top: "66%", side: "right", x: "5%", speed: -180, tone: "mist" },
  { top: "82%", side: "left", x: "2%", speed: -90, tone: "mist" },
  { top: "86%", side: "right", x: "3%", speed: -240, tone: "mist" },
] as const;

const TONES = {
  accent: "bg-accent text-white",
  sand: "bg-sand text-navy",
  mist: "bg-mist text-label-2 border border-hairline",
};

export function ParallaxHero({
  children,
  keywords,
}: {
  children: React.ReactNode;
  keywords: string[];
}) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [0, 160]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.9]);
  const opacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);

  return (
    <section
      ref={ref}
      className="relative overflow-hidden px-4 pb-20 pt-16 text-center sm:px-6 sm:pb-28 sm:pt-24"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 hidden xl:block"
      >
        {keywords.slice(0, SPOTS.length).map((k, i) => (
          <FloatingPill
            key={k}
            label={k}
            spot={SPOTS[i]}
            progress={scrollYProgress}
            index={i}
            still={!!reduce}
          />
        ))}
      </div>
      <motion.div
        style={reduce ? undefined : { y, scale, opacity }}
        className="relative"
      >
        {children}
      </motion.div>
    </section>
  );
}

function FloatingPill({
  label,
  spot,
  progress,
  index,
  still,
}: {
  label: string;
  spot: (typeof SPOTS)[number];
  progress: MotionValue<number>;
  index: number;
  still: boolean;
}) {
  const y = useTransform(progress, [0, 1], [0, spot.speed]);
  return (
    <motion.span
      style={{ top: spot.top, [spot.side]: spot.x, y: still ? 0 : y }}
      initial={still ? false : { opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        delay: 0.3 + index * 0.08,
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={`absolute whitespace-nowrap rounded-full px-4 py-2 text-[13px] font-semibold ${TONES[spot.tone]}`}
    >
      {label}
    </motion.span>
  );
}
