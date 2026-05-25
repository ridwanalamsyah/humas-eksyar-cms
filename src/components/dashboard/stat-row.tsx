"use client";

import { motion } from "motion/react";
import { GlassCard } from "@/components/ui/glass-card";
import {
  CheckCircle2,
  Calendar as CalendarIcon,
  Image as ImageIcon,
  Users2,
} from "lucide-react";

interface Props {
  totalPublished: number;
  weeklyContent: number;
  mediaCount: number;
  membersActive: number;
}

export function StatRow({
  totalPublished,
  weeklyContent,
  mediaCount,
  membersActive,
}: Props) {
  const items = [
    {
      label: "Konten dipublikasikan",
      value: totalPublished,
      icon: CheckCircle2,
      hint: `+${weeklyContent} aktivitas minggu ini`,
      color: "text-brand-600 dark:text-brand-300",
    },
    {
      label: "Aset media",
      value: mediaCount,
      icon: ImageIcon,
      hint: "Library siap pakai",
      color: "text-violet-500",
    },
    {
      label: "Anggota aktif",
      value: membersActive,
      icon: Users2,
      hint: "Pengurus terdaftar",
      color: "text-gold-500",
    },
    {
      label: "Pekan ini",
      value: weeklyContent,
      icon: CalendarIcon,
      hint: "Update / draft / publish",
      color: "text-sky-500",
    },
  ];
  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: 0.04 } },
      }}
      className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4"
    >
      {items.map((it) => (
        <motion.div
          key={it.label}
          variants={{
            hidden: { opacity: 0, y: 8 },
            show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 220, damping: 28 } },
          }}
        >
          <GlassCard
            variant="regular"
            hover
            className="flex h-full flex-col justify-between gap-3 p-4"
          >
            <div className="flex items-center justify-between">
              <span className={`grid size-9 place-items-center rounded-xl bg-foreground/5 ${it.color} dark:bg-white/5`}>
                <it.icon className="size-4" strokeWidth={1.75} />
              </span>
              <span className="font-display text-2xl font-semibold tracking-tight tabular-nums">
                {it.value}
              </span>
            </div>
            <div>
              <p className="text-[13px] font-medium text-foreground/85">{it.label}</p>
              <p className="text-[11px] text-foreground/55">{it.hint}</p>
            </div>
          </GlassCard>
        </motion.div>
      ))}
    </motion.div>
  );
}
