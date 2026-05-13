"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { GlassCard } from "@/components/ui/glass-card";
import { CalendarDays, MapPin, ChevronRight } from "lucide-react";
import { formatShortDate, formatTime } from "@/lib/format/dates";
import type { Event } from "@/lib/data/types";

interface Props { events: Event[] }

export function UpcomingEvents({ events }: Props) {
  return (
    <GlassCard variant="regular" className="p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-foreground/55">Agenda</p>
          <h3 className="font-display text-base font-semibold tracking-tight">Mendatang</h3>
        </div>
        <Link
          href="/calendar"
          className="inline-flex size-8 items-center justify-center rounded-full text-foreground/55 hover:bg-foreground/5 dark:hover:bg-white/5"
          aria-label="Lihat kalender"
        >
          <ChevronRight className="size-4" strokeWidth={1.75} />
        </Link>
      </div>
      <ul className="mt-3 flex flex-col gap-2.5">
        {events.length === 0 && (
          <li className="rounded-xl bg-foreground/5 p-3 text-sm text-foreground/55 dark:bg-white/5">
            Belum ada agenda.
          </li>
        )}
        {events.map((e, i) => (
          <motion.li
            key={e.id}
            initial={{ opacity: 0, x: -4 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.04, type: "spring", stiffness: 240, damping: 26 }}
          >
            <Link
              href={`/events/${e.id}`}
              className="flex items-center gap-3 rounded-xl p-2 transition-colors hover:bg-foreground/5 dark:hover:bg-white/5"
            >
              <div className="grid size-12 shrink-0 place-items-center rounded-xl bg-brand-500/10 text-brand-600 dark:text-brand-300">
                <span className="text-[10px] uppercase tracking-wider">{formatShortDate(e.startsAt).split(" ")[2] ?? ""}</span>
                <span className="font-display text-base font-semibold leading-none">
                  {new Date(e.startsAt).getDate()}
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{e.title}</p>
                <p className="flex items-center gap-1 text-[11px] text-foreground/55">
                  <CalendarDays className="size-3" strokeWidth={1.75} />
                  {formatTime(e.startsAt)}
                  <span className="opacity-50">·</span>
                  <MapPin className="size-3" strokeWidth={1.75} />
                  <span className="truncate">{e.location}</span>
                </p>
              </div>
            </Link>
          </motion.li>
        ))}
      </ul>
    </GlassCard>
  );
}
