"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Calendar as CalendarIcon,
  Clock,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { Pill, StatusPill } from "@/components/common/pill";
import type {
  ContentChannel,
  ContentItem,
  Event,
} from "@/lib/data/types";
import type { Holiday } from "@/lib/fixtures/holidays";

interface Props {
  contents: ContentItem[];
  events: Event[];
  holidays: Holiday[];
}

type ViewMode = "timeline" | "week";

const STATUS_FILTERS = [
  { value: "all", label: "Semua" },
  { value: "draft", label: "Draft" },
  { value: "review", label: "Review" },
  { value: "scheduled", label: "Terjadwal" },
  { value: "published", label: "Published" },
] as const;

type StatusFilter = (typeof STATUS_FILTERS)[number]["value"];

function dateKey(iso: string): string {
  return iso.slice(0, 10);
}

function isInReview(s: string): boolean {
  return s === "review_divisi" || s === "review_sekjen";
}

function matchesStatus(c: ContentItem, f: StatusFilter): boolean {
  if (f === "all") return true;
  if (f === "draft") return c.status === "draft" || c.status === "idea";
  if (f === "review") return isInReview(c.status);
  if (f === "scheduled") return c.status === "scheduled";
  if (f === "published") return c.status === "published";
  return true;
}

function fmtDate(iso: string): string {
  return new Date(iso).toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}

function fmtTime(iso: string): string {
  return new Date(iso).toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function ScheduleClient({ contents, events, holidays }: Props) {
  const [view, setView] = useState<ViewMode>("timeline");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [channelFilter, setChannelFilter] = useState<ContentChannel | "all">(
    "all",
  );

  // Channels actually used.
  const channels = useMemo(() => {
    const set = new Set<ContentChannel>();
    contents.forEach((c) => c.channels.forEach((ch) => set.add(ch)));
    return Array.from(set);
  }, [contents]);

  const filtered = useMemo(() => {
    return contents.filter((c) => {
      if (!matchesStatus(c, statusFilter)) return false;
      if (channelFilter !== "all" && !c.channels.includes(channelFilter))
        return false;
      return true;
    });
  }, [contents, statusFilter, channelFilter]);

  // Group content by date for the timeline.
  const grouped = useMemo(() => {
    const map = new Map<string, ContentItem[]>();
    for (const c of filtered) {
      const when =
        c.scheduledFor ?? c.publishedAt ?? c.updatedAt ?? c.createdAt;
      const key = dateKey(when);
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(c);
    }
    return Array.from(map.entries()).sort(([a], [b]) => a.localeCompare(b));
  }, [filtered]);

  const eventsByDate = useMemo(() => {
    const m = new Map<string, Event[]>();
    for (const e of events) {
      const k = dateKey(e.startsAt);
      if (!m.has(k)) m.set(k, []);
      m.get(k)!.push(e);
    }
    return m;
  }, [events]);

  const holidaysByDate = useMemo(() => {
    const m = new Map<string, Holiday[]>();
    for (const h of holidays) {
      if (!m.has(h.date)) m.set(h.date, []);
      m.get(h.date)!.push(h);
    }
    return m;
  }, [holidays]);

  return (
    <div className="grid gap-4">
      <GlassCard variant="regular" className="p-4">
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex rounded-full bg-foreground/[0.05] p-1">
            <button
              type="button"
              onClick={() => setView("timeline")}
              className={`rounded-full px-3 py-1 text-[12px] ${
                view === "timeline"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-foreground/55"
              }`}
            >
              Timeline
            </button>
            <button
              type="button"
              onClick={() => setView("week")}
              className={`rounded-full px-3 py-1 text-[12px] ${
                view === "week"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-foreground/55"
              }`}
            >
              Minggu
            </button>
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
            className="ml-auto rounded-full border border-foreground/10 bg-background px-3 py-1 text-[12px] focus:border-brand-500 focus:outline-none"
          >
            {STATUS_FILTERS.map((f) => (
              <option key={f.value} value={f.value}>
                Status: {f.label}
              </option>
            ))}
          </select>

          <select
            value={channelFilter}
            onChange={(e) =>
              setChannelFilter(e.target.value as ContentChannel | "all")
            }
            className="rounded-full border border-foreground/10 bg-background px-3 py-1 text-[12px] focus:border-brand-500 focus:outline-none"
          >
            <option value="all">Channel: semua</option>
            {channels.map((ch) => (
              <option key={ch} value={ch}>
                Channel: {ch}
              </option>
            ))}
          </select>
        </div>
      </GlassCard>

      {view === "timeline" ? (
        <TimelineView
          grouped={grouped}
          eventsByDate={eventsByDate}
          holidaysByDate={holidaysByDate}
        />
      ) : (
        <WeekView
          contents={filtered}
          events={events}
          holidays={holidays}
        />
      )}
    </div>
  );
}

function TimelineView({
  grouped,
  eventsByDate,
  holidaysByDate,
}: {
  grouped: [string, ContentItem[]][];
  eventsByDate: Map<string, Event[]>;
  holidaysByDate: Map<string, Holiday[]>;
}) {
  if (grouped.length === 0) {
    return (
      <GlassCard variant="thin" className="p-8 text-center text-sm text-foreground/55">
        Tidak ada konten cocok dengan filter di atas.
      </GlassCard>
    );
  }
  return (
    <ol className="grid gap-3">
      {grouped.map(([date, items]) => {
        const todayKey = new Date().toISOString().slice(0, 10);
        const isToday = date === todayKey;
        const isPast = date < todayKey;
        const eventsOn = eventsByDate.get(date) ?? [];
        const holidaysOn = holidaysByDate.get(date) ?? [];
        return (
          <li key={date}>
            <GlassCard variant="regular" className="p-5">
              <header className="flex items-center justify-between gap-2">
                <h3 className="font-display text-sm font-semibold">
                  {fmtDate(date + "T00:00:00")}
                  {isToday && (
                    <span className="ml-2 rounded-full bg-brand-500 px-2 py-0.5 text-[10px] font-medium text-white">
                      Hari ini
                    </span>
                  )}
                  {isPast && !isToday && (
                    <span className="ml-2 text-[11px] text-foreground/45">
                      (lewat)
                    </span>
                  )}
                </h3>
                <span className="text-[11px] text-foreground/55">
                  {items.length} konten
                </span>
              </header>

              {(holidaysOn.length > 0 || eventsOn.length > 0) && (
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {holidaysOn.map((h) => (
                    <span
                      key={h.id}
                      className="rounded-full bg-amber-500/10 px-2 py-0.5 text-[11px] text-amber-700 dark:text-amber-300"
                    >
                      {h.emoji ?? "•"} {h.name}
                    </span>
                  ))}
                  {eventsOn.map((e) => (
                    <span
                      key={e.id}
                      className="rounded-full bg-sky-500/10 px-2 py-0.5 text-[11px] text-sky-700 dark:text-sky-300"
                    >
                      📅 {e.title}
                    </span>
                  ))}
                </div>
              )}

              <ul className="mt-3 grid gap-2">
                {items.map((c) => (
                  <li key={c.id}>
                    <Link
                      href={`/content/${c.id}`}
                      className="block rounded-xl border border-foreground/8 p-3 transition-colors hover:border-brand-500/40 dark:border-white/8"
                    >
                      <div className="flex flex-wrap items-center gap-2">
                        <StatusPill status={c.status} />
                        <Pill tone="brand">{c.rubric.replace(/_/g, " ")}</Pill>
                        {c.channels.map((ch) => (
                          <Pill key={ch} tone="info">
                            {ch}
                          </Pill>
                        ))}
                        {c.scheduledFor && (
                          <span className="ml-auto inline-flex items-center gap-1 text-[11px] text-foreground/55">
                            <Clock className="size-3" strokeWidth={1.75} />
                            {fmtTime(c.scheduledFor)}
                          </span>
                        )}
                      </div>
                      <p className="mt-1.5 text-[14px] font-medium">{c.title}</p>
                      {c.caption && (
                        <p className="mt-0.5 line-clamp-1 text-[12px] text-foreground/55">
                          {c.caption.split("\n")[0]}
                        </p>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </GlassCard>
          </li>
        );
      })}
    </ol>
  );
}

function WeekView({
  contents,
  events,
  holidays,
}: {
  contents: ContentItem[];
  events: Event[];
  holidays: Holiday[];
}) {
  const [weekStart, setWeekStart] = useState<Date>(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() - ((d.getDay() + 6) % 7)); // Monday-start
    return d;
  });

  const days = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(weekStart);
      d.setDate(weekStart.getDate() + i);
      return d;
    });
  }, [weekStart]);

  const dayKeys = days.map((d) => d.toISOString().slice(0, 10));

  const itemsByDay = useMemo(() => {
    const m = new Map<string, { contents: ContentItem[]; events: Event[]; holidays: Holiday[] }>();
    for (const k of dayKeys)
      m.set(k, { contents: [], events: [], holidays: [] });
    for (const c of contents) {
      const when = c.scheduledFor ?? c.publishedAt ?? c.createdAt;
      const k = when.slice(0, 10);
      if (m.has(k)) m.get(k)!.contents.push(c);
    }
    for (const e of events) {
      const k = e.startsAt.slice(0, 10);
      if (m.has(k)) m.get(k)!.events.push(e);
    }
    for (const h of holidays) {
      if (m.has(h.date)) m.get(h.date)!.holidays.push(h);
    }
    return m;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contents, events, holidays, weekStart]);

  const shift = (delta: number) => {
    const d = new Date(weekStart);
    d.setDate(weekStart.getDate() + delta);
    setWeekStart(d);
  };

  const todayKey = new Date().toISOString().slice(0, 10);

  return (
    <GlassCard variant="regular" className="p-4">
      <div className="mb-3 flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={() => shift(-7)}
          className="rounded-full p-1 hover:bg-foreground/[0.05]"
        >
          <ChevronLeft className="size-4" strokeWidth={1.75} />
        </button>
        <span className="font-display text-sm font-semibold">
          {weekStart.toLocaleDateString("id-ID", {
            day: "numeric",
            month: "long",
          })}{" "}
          –{" "}
          {days[6].toLocaleDateString("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </span>
        <button
          type="button"
          onClick={() => shift(7)}
          className="rounded-full p-1 hover:bg-foreground/[0.05]"
        >
          <ChevronRight className="size-4" strokeWidth={1.75} />
        </button>
      </div>

      <div className="grid grid-cols-1 gap-2 md:grid-cols-7">
        {days.map((d, i) => {
          const key = dayKeys[i];
          const bag = itemsByDay.get(key)!;
          const isToday = key === todayKey;
          return (
            <div
              key={key}
              className={`rounded-2xl border p-3 ${
                isToday
                  ? "border-brand-500/30 bg-brand-500/[0.04]"
                  : "border-foreground/8 dark:border-white/8"
              }`}
            >
              <div className="text-[10px] font-medium uppercase tracking-[0.16em] text-foreground/55">
                {d.toLocaleDateString("id-ID", { weekday: "short" })}
              </div>
              <div className="text-lg font-semibold">{d.getDate()}</div>

              <ul className="mt-2 space-y-1">
                {bag.holidays.map((h) => (
                  <li
                    key={h.id}
                    className="rounded-md bg-amber-500/10 px-1.5 py-0.5 text-[10px] text-amber-700 dark:text-amber-300"
                    title={h.description}
                  >
                    {h.emoji ?? "•"} {h.name}
                  </li>
                ))}
                {bag.events.map((e) => (
                  <li
                    key={e.id}
                    className="rounded-md bg-sky-500/10 px-1.5 py-0.5 text-[10px] text-sky-700 dark:text-sky-300"
                    title={e.location}
                  >
                    📅 {e.title}
                  </li>
                ))}
                {bag.contents.map((c) => (
                  <li key={c.id}>
                    <Link
                      href={`/content/${c.id}`}
                      className="block rounded-md bg-foreground/[0.04] px-1.5 py-1 text-[10.5px] hover:bg-foreground/[0.08]"
                    >
                      <span className="line-clamp-1 font-medium">{c.title}</span>
                      <span className="mt-0.5 inline-block text-[9px] uppercase tracking-wider text-foreground/55">
                        {c.status}
                      </span>
                    </Link>
                  </li>
                ))}
                {bag.contents.length === 0 &&
                  bag.events.length === 0 &&
                  bag.holidays.length === 0 && (
                    <li className="text-[10px] text-foreground/35">—</li>
                  )}
              </ul>
            </div>
          );
        })}
      </div>

      <p className="mt-3 inline-flex items-center gap-1 text-[11px] text-foreground/55">
        <AlertCircle className="size-3" strokeWidth={1.75} />
        Item ditempatkan berdasar tanggal scheduledFor / publishedAt.
        <CalendarIcon className="ml-2 size-3" strokeWidth={1.75} /> Hari besar
        + event berdampingan.
      </p>
    </GlassCard>
  );
}
