"use client";

import { MotionConfig } from "motion/react";

/**
 * Pembungkus website: mengikuti pengaturan sistem (otomatis terang/gelap)
 * dan preferensi gerak pengguna (prefers-reduced-motion).
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
        data-site-theme="system"
        style={{ colorScheme: "light dark" }}
      >
        {children}
      </div>
    </MotionConfig>
  );
}
