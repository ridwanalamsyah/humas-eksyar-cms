"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { GlassCard } from "@/components/ui/glass-card";
import { ProgressBar } from "@/components/common/progress-bar";
import { ChevronRight, Target } from "lucide-react";
import type { Quest } from "@/lib/data/types";

export function QuestProgress({ quests }: { quests: Quest[] }) {
  return (
    <GlassCard variant="regular" className="p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-foreground/55">Quests</p>
          <h3 className="font-display text-base font-semibold tracking-tight">Misi minggu ini</h3>
        </div>
        <Link
          href="/badges"
          className="inline-flex size-8 items-center justify-center rounded-full text-foreground/55 hover:bg-foreground/5 dark:hover:bg-white/5"
          aria-label="Semua quest"
        >
          <ChevronRight className="size-4" strokeWidth={1.75} />
        </Link>
      </div>
      <ul className="mt-3 flex flex-col gap-3">
        {quests.map((q, i) => (
          <motion.li
            key={q.id}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05, type: "spring", stiffness: 240, damping: 26 }}
            className="rounded-xl p-2"
          >
            <div className="flex items-center justify-between">
              <p className="flex items-center gap-1.5 text-[13px] font-medium">
                <Target className="size-3.5 text-brand-500" strokeWidth={1.75} />
                {q.title}
              </p>
              <span className="font-mono text-[10px] text-foreground/55">+{q.xpReward} XP</span>
            </div>
            <p className="mt-0.5 text-[11px] text-foreground/55">{q.description}</p>
            <div className="mt-2 flex items-center gap-2">
              <ProgressBar value={q.progress} className="flex-1" />
              <span className="font-mono text-[11px] tabular-nums text-foreground/65">
                {q.current}/{q.target}
              </span>
            </div>
          </motion.li>
        ))}
      </ul>
    </GlassCard>
  );
}
