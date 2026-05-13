"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import {
  addMonths,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  isToday,
  startOfMonth,
  startOfWeek,
} from "date-fns";
import { id as localeID } from "date-fns/locale/id";
import { ChevronLeft, ChevronRight, CalendarDays, MapPin, Users } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { formatHijri, formatTime } from "@/lib/format/dates";
import type { Event, Division } from "@/lib/data/types";
import { cn } from "@/lib/utils";

interface Props {
  events: Event[];
  divisions: Division[];
}

export function CalendarView({ events, divisions }: Props) {
  const [cursor, setCursor] = useState(new Date());
  const [selected, setSelected] = useState<Date>(new Date());

  const monthStart = startOfMonth(cursor);
  const monthEnd = endOfMonth(cursor);
  const gridStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const gridEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });

  const days = useMemo(() => {
    const list: Date[] = [];
    const d = new Date(gridStart);
    while (d <= gridEnd) {
      list.push(new Date(d));
      d.setDate(d.getDate() + 1);
    }
    return list;
  }, [gridStart, gridEnd]);

  const eventsByDay = useMemo(() => {
    const map = new Map<string, Event[]>();
    events.forEach((e) => {
      const key = e.startsAt.split("T")[0];
      const list = map.get(key) ?? [];
      list.push(e);
      map.set(key, list);
    });
    return map;
  }, [events]);

  const selectedKey = format(selected, "yyyy-MM-dd");
  const selectedEvents = eventsByDay.get(selectedKey) ?? [];

  const findDiv = (id: string) =>
    divisions.find((d) => d.id === id) ?? divisions[0];

  return (
    <div className="mt-4 grid gap-6 lg:grid-cols-[1fr_minmax(280px,360px)]">
      <GlassCard variant="thick" className="p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-display text-xl font-semibold tracking-tight">
              {format(cursor, "MMMM yyyy", { locale: localeID })}
            </p>
            <p className="text-[12px] text-foreground/55">
              {formatHijri(cursor)}
            </p>
          </div>
          <div className="flex items-center gap-1">
            <Button
              size="icon"
              variant="ghost"
              onClick={() => setCursor(addMonths(cursor, -1))}
              aria-label="Bulan sebelumnya"
            >
              <ChevronLeft className="size-4" strokeWidth={1.75} />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                setCursor(new Date());
                setSelected(new Date());
              }}
            >
              Hari ini
            </Button>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => setCursor(addMonths(cursor, 1))}
              aria-label="Bulan berikutnya"
            >
              <ChevronRight className="size-4" strokeWidth={1.75} />
            </Button>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-7 gap-1 text-center text-[10px] font-medium uppercase tracking-[0.16em] text-foreground/55">
          {"Sen,Sel,Rab,Kam,Jum,Sab,Min".split(",").map((d) => (
            <span key={d}>{d}</span>
          ))}
        </div>
        <div className="mt-1 grid grid-cols-7 gap-1">
          {days.map((d) => {
            const key = format(d, "yyyy-MM-dd");
            const dayEvents = eventsByDay.get(key) ?? [];
            const isCurMonth = isSameMonth(d, cursor);
            const isSel = isSameDay(d, selected);
            const today = isToday(d);
            return (
              <button
                key={key}
                type="button"
                onClick={() => setSelected(d)}
                className={cn(
                  "relative flex h-16 flex-col items-start gap-1 rounded-xl border px-1.5 pt-1.5 text-left text-[11px] transition-colors sm:h-20",
                  isCurMonth
                    ? "border-foreground/10 bg-foreground/[0.04] dark:border-white/10 dark:bg-white/5"
                    : "border-transparent text-foreground/40",
                  isSel && "border-brand-500/60 bg-brand-500/15",
                  today && !isSel && "ring-1 ring-inset ring-gold-500/50",
                )}
              >
                <span className="font-mono text-[12px] font-medium">
                  {format(d, "d")}
                </span>
                <div className="flex flex-wrap items-end gap-0.5">
                  {dayEvents.slice(0, 3).map((e) => {
                    const div = findDiv(e.divisionId);
                    return (
                      <span
                        key={e.id}
                        className="size-1.5 rounded-full"
                        style={{ background: div.color }}
                        title={e.title}
                      />
                    );
                  })}
                  {dayEvents.length > 3 && (
                    <span className="text-[9px] text-foreground/55">
                      +{dayEvents.length - 3}
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-foreground/10 pt-3 text-[11px] text-foreground/55 dark:border-white/10">
          <span>Legenda:</span>
          {divisions.map((d) => (
            <span key={d.id} className="inline-flex items-center gap-1">
              <span
                className="size-1.5 rounded-full"
                style={{ background: d.color }}
              />
              {d.shortName}
            </span>
          ))}
        </div>
      </GlassCard>

      <aside className="space-y-4">
        <GlassCard className="p-5">
          <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-foreground/55">
            {format(selected, "EEEE", { locale: localeID })}
          </p>
          <h3 className="mt-1 font-display text-xl font-semibold tracking-tight">
            {format(selected, "d MMMM yyyy", { locale: localeID })}
          </h3>
          <p className="text-[12px] text-foreground/60">
            {formatHijri(selected)}
          </p>
        </GlassCard>

        <AnimatePresence mode="popLayout">
          {selectedEvents.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <GlassCard variant="thin" className="p-5 text-center">
                <CalendarDays
                  className="mx-auto size-6 text-foreground/45"
                  strokeWidth={1.75}
                />
                <p className="mt-2 text-[13px] text-foreground/65">
                  Tidak ada agenda hari ini.
                </p>
              </GlassCard>
            </motion.div>
          ) : (
            <motion.div
              key="events"
              layout
              className="space-y-3"
            >
              {selectedEvents.map((e) => {
                const div = findDiv(e.divisionId);
                return (
                  <motion.div
                    key={e.id}
                    layout
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 26 }}
                  >
                    <Link href={`/events/${e.id}`}>
                      <GlassCard hover className="p-4">
                        <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.16em] text-foreground/55">
                          <span
                            className="inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-medium"
                            style={{
                              background: `color-mix(in oklab, ${div.color} 18%, transparent)`,
                              borderColor: `color-mix(in oklab, ${div.color} 45%, transparent)`,
                              color: div.color,
                            }}
                          >
                            {div.shortName}
                          </span>
                          <span>{formatTime(e.startsAt)}</span>
                        </div>
                        <h4 className="mt-2 font-display text-[15px] font-semibold leading-tight tracking-tight">
                          {e.title}
                        </h4>
                        <div className="mt-2 flex flex-wrap items-center gap-3 text-[11px] text-foreground/60">
                          <span className="inline-flex items-center gap-1">
                            <MapPin className="size-3" strokeWidth={1.75} />
                            {e.location}
                          </span>
                          <span className="inline-flex items-center gap-1">
                            <Users className="size-3" strokeWidth={1.75} />
                            {e.rsvpIds.length} RSVP
                          </span>
                        </div>
                      </GlassCard>
                    </Link>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </aside>
    </div>
  );
}
