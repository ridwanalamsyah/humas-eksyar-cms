"use client";

import { MotionConfig } from "motion/react";

/**
 * Pembungkus website: tema terang/gelap dan pengurangan animasi mengikuti
 * pengaturan sistem perangkat pengunjung.
 */
export function SiteShell({
  className,
  children,
}: {
  className: string;
  children: React.ReactNode;
}) {
  return (
    <MotionConfig reducedMotion="user">
      <div
        className={className}
        data-site-theme
        style={{ colorScheme: "light dark" }}
      >
        {children}
      </div>
    </MotionConfig>
  );
}
