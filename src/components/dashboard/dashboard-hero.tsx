"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Sparkles, PenLine, Wand2, Flame, CheckCircle2, ArrowUpRight } from "lucide-react";
import type { Member, WeeklyDigest } from "@/lib/data/types";

interface Props {
  member: Member;
  digest: WeeklyDigest;
  unreadCount: number;
}

const greetings = [
  { until: 11, salam: "Selamat pagi" },
  { until: 15, salam: "Selamat siang" },
  { until: 18, salam: "Selamat sore" },
  { until: 24, salam: "Selamat malam" },
];

function useGreeting() {
  const [hour, setHour] = useState<number | null>(null);
  useEffect(() => {
    // Hydration-safe: time differs between server and client.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHour(new Date().getHours());
  }, []);
  if (hour === null) return "Assalamualaikum";
  return greetings.find((g) => hour < g.until)?.salam ?? "Assalamualaikum";
}

function useDualDate() {
  const [s, setS] = useState<{ greg: string; hijri: string }>({ greg: "", hijri: "" });
  useEffect(() => {
    try {
      const greg = new Intl.DateTimeFormat("id-ID", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      }).format(new Date());
      const hijri = new Intl.DateTimeFormat("id-ID-u-ca-islamic-umalqura", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }).format(new Date());
      // Hydration-safe: client-only Intl resolution.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setS({ greg, hijri });
    } catch {
      // ignore
    }
  }, []);
  return s;
}

const fadeUp = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { type: "spring" as const, stiffness: 220, damping: 28 },
};

export function DashboardHero({ member, digest, unreadCount }: Props) {
  const salam = useGreeting();
  const { greg, hijri } = useDualDate();

  return (
    <motion.div {...fadeUp}>
      <GlassCard variant="thick" className="overflow-hidden p-6 sm:p-10">
        <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-foreground/55">
              <span className="size-2 rounded-full bg-brand-500 animate-glow" />
              <span>Live · Eksyar Satu, Victory in Harmony</span>
            </div>
            <h1 className="mt-4 font-display text-[clamp(2rem,1.4rem+2.8vw,3.5rem)] font-semibold leading-[1.05] tracking-tight text-balance">
              {salam},{" "}
              <span className="text-brand-600 dark:text-brand-300">
                {member.name.split(" ")[0]}
              </span>
              .
            </h1>
            <p className="mt-3 max-w-[44ch] text-pretty text-foreground/70">
              Hari ini kamu punya {unreadCount > 0 ? `${unreadCount} notifikasi baru` : "feed bersih"}, streak{" "}
              <span className="inline-flex items-center gap-1 font-semibold text-foreground/85">
                <Flame className="size-4 text-gold-500" strokeWidth={2} />
                {member.streak} hari
              </span>
              , dan AI siap bantu rancang caption.
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-foreground/60">
              <span>{greg || "—"}</span>
              {hijri && (
                <>
                  <span aria-hidden className="text-foreground/30">·</span>
                  <span className="font-mono text-[12px] tracking-tight">{hijri}</span>
                </>
              )}
            </div>
            <div className="mt-7 flex flex-wrap gap-3">
              <Button asChild>
                <Link href="/captions/playground">
                  <Wand2 className="size-4" strokeWidth={1.75} />
                  AI Caption Generator
                </Link>
              </Button>
              <Button asChild variant="secondary">
                <Link href="/content/new">
                  <PenLine className="size-4" strokeWidth={1.75} />
                  Konten Baru
                </Link>
              </Button>
            </div>
          </div>

          <GlassCard variant="regular" className="self-stretch p-6">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-2 rounded-full border border-gold-400/40 bg-[color-mix(in_oklab,var(--gold-400)_18%,transparent)] px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-gold-700 dark:text-gold-300">
                <Sparkles className="size-3.5" strokeWidth={1.75} />
                AI Digest
              </span>
              <span className="text-[11px] text-foreground/55">{digest.isoWeek}</span>
            </div>
            <p className="mt-3 font-display text-lg font-semibold leading-snug text-balance">
              {digest.highlights[0]}
            </p>
            <ul className="mt-3 space-y-2 text-sm text-foreground/75">
              {digest.recommendations.slice(0, 3).map((r, i) => (
                <li key={i} className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-brand-500" strokeWidth={1.75} />
                  <span>{r}</span>
                </li>
              ))}
            </ul>
            <Link
              href="/analytics"
              className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-brand-600 hover:text-brand-700 dark:text-brand-300 dark:hover:text-brand-200"
            >
              Lihat insight lengkap
              <ArrowUpRight className="size-4" strokeWidth={1.75} />
            </Link>
          </GlassCard>
        </div>
      </GlassCard>
    </motion.div>
  );
}
