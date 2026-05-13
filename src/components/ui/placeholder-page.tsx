"use client";

import { motion } from "motion/react";
import { GlassCard } from "@/components/ui/glass-card";
import { BottomDock } from "@/components/navigation/bottom-dock";
import { Construction } from "lucide-react";
import Link from "next/link";

type PlaceholderPageProps = {
  title: string;
  subtitle: string;
  comingNext?: string[];
};

export function PlaceholderPage({ title, subtitle, comingNext = [] }: PlaceholderPageProps) {
  return (
    <main className="mx-auto w-full max-w-4xl px-4 pb-32 pt-8 sm:px-6 sm:pt-14">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 220, damping: 28 }}
      >
        <GlassCard variant="thick" className="p-8 sm:p-12">
          <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-foreground/55">
            <Construction className="size-4" strokeWidth={1.75} />
            Phase 0 placeholder
          </div>
          <h1 className="mt-3 font-display text-[clamp(2rem,1.5rem+1.6vw,3rem)] font-semibold leading-tight tracking-tight text-balance">
            {title}
          </h1>
          <p className="mt-3 max-w-[60ch] text-pretty text-foreground/70">{subtitle}</p>
          {comingNext.length > 0 && (
            <div className="mt-7">
              <p className="text-[11px] uppercase tracking-[0.18em] text-foreground/55">
                Coming next
              </p>
              <ul className="mt-3 space-y-2">
                {comingNext.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 rounded-2xl border border-[var(--border)] bg-[color-mix(in_oklab,var(--brand-500)_4%,transparent)] px-4 py-3 text-sm"
                  >
                    <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-brand-500" />
                    <span className="text-foreground/85">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <Link
            href="/"
            className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-brand-600 hover:text-brand-700 dark:text-brand-300"
          >
            ← Kembali ke dashboard
          </Link>
        </GlassCard>
      </motion.div>
      <BottomDock />
    </main>
  );
}
