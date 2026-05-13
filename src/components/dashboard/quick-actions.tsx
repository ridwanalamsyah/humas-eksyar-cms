"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { GlassCard } from "@/components/ui/glass-card";
import {
  Wand2,
  PenLine,
  CalendarPlus,
  Upload,
  ShieldCheck,
  Users,
} from "lucide-react";

const actions = [
  {
    href: "/captions/playground",
    icon: Wand2,
    title: "AI Caption",
    desc: "Generate caption per rubrik",
    accent: "from-gold-300/40 to-gold-500/20",
    iconColor: "text-gold-600 dark:text-gold-300",
  },
  {
    href: "/content/new",
    icon: PenLine,
    title: "Konten Baru",
    desc: "Tulis postingan IG / Twitter",
    accent: "from-brand-300/40 to-brand-500/20",
    iconColor: "text-brand-600 dark:text-brand-300",
  },
  {
    href: "/calendar?mode=new",
    icon: CalendarPlus,
    title: "Jadwalkan",
    desc: "Atur kalender editorial",
    accent: "from-sky-300/40 to-sky-500/20",
    iconColor: "text-sky-600 dark:text-sky-300",
  },
  {
    href: "/media",
    icon: Upload,
    title: "Upload Media",
    desc: "Tambah aset dokumentasi",
    accent: "from-violet-300/40 to-violet-500/20",
    iconColor: "text-violet-600 dark:text-violet-300",
  },
  {
    href: "/approval",
    icon: ShieldCheck,
    title: "Approval",
    desc: "Antrian review konten",
    accent: "from-amber-300/40 to-amber-500/20",
    iconColor: "text-amber-600 dark:text-amber-300",
  },
  {
    href: "/members",
    icon: Users,
    title: "Anggota",
    desc: "Direktori 6 divisi",
    accent: "from-emerald-300/40 to-emerald-500/20",
    iconColor: "text-emerald-600 dark:text-emerald-300",
  },
];

export function QuickActions() {
  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={{ hidden: {}, show: { transition: { staggerChildren: 0.05 } } }}
      className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6"
    >
      {actions.map((a) => (
        <motion.div
          key={a.href}
          variants={{
            hidden: { opacity: 0, y: 8 },
            show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 240, damping: 26 } },
          }}
        >
          <Link href={a.href} className="block">
            <GlassCard
              variant="regular"
              hover
              className="relative h-full overflow-hidden p-4"
            >
              <span
                aria-hidden
                className={`pointer-events-none absolute -right-6 -top-6 size-24 rounded-full bg-gradient-to-br ${a.accent} blur-2xl`}
              />
              <span className={`relative grid size-10 place-items-center rounded-xl bg-foreground/5 dark:bg-white/5 ${a.iconColor}`}>
                <a.icon className="size-4" strokeWidth={1.75} />
              </span>
              <p className="relative mt-3 font-display text-sm font-semibold tracking-tight">
                {a.title}
              </p>
              <p className="relative text-[11px] text-foreground/55">{a.desc}</p>
            </GlassCard>
          </Link>
        </motion.div>
      ))}
    </motion.div>
  );
}
