import type { Metadata } from "next";
import { listQuests } from "@/lib/data/provider";
import { AppShell } from "@/components/layout/app-shell";
import { SectionHeader } from "@/components/common/section-header";
import { GlassCard } from "@/components/ui/glass-card";
import { Pill } from "@/components/common/pill";
import { ProgressBar } from "@/components/common/progress-bar";
import { CheckCircle2, Target, Sparkles, Flame } from "lucide-react";
import type { Quest } from "@/lib/data/types";

export const metadata: Metadata = {
  title: "Quest",
  description: "Tantangan mingguan, event, dan musiman untuk dapat XP.",
};

const DIFFICULTY_TONE: Record<Quest["difficulty"], "neutral" | "brand" | "gold" | "danger"> = {
  easy: "neutral",
  medium: "brand",
  hard: "danger",
};

const DURATION_LABEL: Record<Quest["duration"], string> = {
  weekly: "Mingguan",
  event: "Event",
  seasonal: "Musiman",
};

export default async function QuestsPage() {
  const quests = await listQuests();
  const active = quests.filter((q) => !q.completed);
  const completed = quests.filter((q) => q.completed);
  return (
    <AppShell width="wide">
      <SectionHeader
        eyebrow="Gamification"
        title="Quest Aktif"
        description={`${active.length} quest aktif · ${completed.length} sudah kelar.`}
      />
      <div className="mt-2 space-y-6">
        {[...active, ...completed].map((q) => (
          <GlassCard key={q.id} className="p-5">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-1.5 text-[11px] uppercase tracking-[0.16em] text-foreground/55">
                  <Pill tone={DIFFICULTY_TONE[q.difficulty]}>{q.difficulty}</Pill>
                  <Pill>{DURATION_LABEL[q.duration]}</Pill>
                  <Pill tone="gold">+{q.xpReward} XP</Pill>
                  {q.deadline && <span>· deadline {q.deadline}</span>}
                </div>
                <h3 className="mt-2 font-display text-[15px] font-semibold leading-tight tracking-tight">
                  {q.title}
                </h3>
                <p className="mt-1 text-[13px] text-foreground/70">
                  {q.description}
                </p>
              </div>
              <div className="shrink-0">
                {q.completed ? (
                  <CheckCircle2
                    className="size-7 text-brand-600 dark:text-brand-300"
                    strokeWidth={1.75}
                  />
                ) : q.difficulty === "hard" ? (
                  <Flame className="size-7 text-rose-500" strokeWidth={1.75} />
                ) : (
                  <Target className="size-7 text-brand-500" strokeWidth={1.75} />
                )}
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between text-[11px] text-foreground/55">
              <span>Progress</span>
              <span className="font-mono">
                {q.current}/{q.target}
              </span>
            </div>
            <ProgressBar value={q.progress} className="mt-1" />
            {q.completed && (
              <div className="mt-3 inline-flex items-center gap-1 text-[11px] font-medium text-brand-700 dark:text-brand-300">
                <Sparkles className="size-3" strokeWidth={2} /> Selesai —
                kontribusi dibukukan
              </div>
            )}
          </GlassCard>
        ))}
      </div>
    </AppShell>
  );
}
