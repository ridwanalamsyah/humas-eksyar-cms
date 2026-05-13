"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { GlassCard } from "@/components/ui/glass-card";
import { Avatar } from "@/components/common/avatar";
import { Trophy, Flame, ChevronRight } from "lucide-react";
import type { Member } from "@/lib/data/types";

const tierColor = ["text-gold-500", "text-foreground/65", "text-amber-700 dark:text-amber-400"];

export function LeaderboardSnippet({ members }: { members: Member[] }) {
  return (
    <GlassCard variant="regular" className="p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-foreground/55">Peringkat</p>
          <h3 className="font-display text-base font-semibold tracking-tight">Top kontributor</h3>
        </div>
        <Link
          href="/leaderboard"
          className="inline-flex size-8 items-center justify-center rounded-full text-foreground/55 hover:bg-foreground/5 dark:hover:bg-white/5"
          aria-label="Lihat leaderboard"
        >
          <ChevronRight className="size-4" strokeWidth={1.75} />
        </Link>
      </div>
      <ol className="mt-3 flex flex-col gap-2">
        {members.map((m, i) => (
          <motion.li
            key={m.id}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04, type: "spring", stiffness: 240, damping: 26 }}
          >
            <Link
              href={`/members/${m.id}`}
              className="flex items-center gap-3 rounded-xl p-2 transition-colors hover:bg-foreground/5 dark:hover:bg-white/5"
            >
              <span
                className={`grid size-7 place-items-center rounded-full bg-foreground/5 font-mono text-[11px] font-semibold dark:bg-white/5 ${
                  tierColor[i] ?? "text-foreground/55"
                }`}
              >
                {i + 1}
              </span>
              <Avatar member={m} size={28} ring={false} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{m.name}</p>
                <p className="text-[10px] text-foreground/55">
                  XP {m.xp.toLocaleString("id-ID")}
                </p>
              </div>
              <span className="inline-flex items-center gap-0.5 text-[11px] text-gold-500">
                <Flame className="size-3" strokeWidth={2} />
                {m.streak}
              </span>
              {i === 0 && <Trophy className="size-4 text-gold-500" strokeWidth={1.75} />}
            </Link>
          </motion.li>
        ))}
      </ol>
    </GlassCard>
  );
}
