import Link from "next/link";
import { GlassCard } from "@/components/ui/glass-card";
import { CalendarHeart, ChevronRight } from "lucide-react";
import type { Holiday } from "@/lib/fixtures/holidays";

const KIND_LABEL: Record<Holiday["kind"], string> = {
  nasional: "Libur Nasional",
  hijriah: "Hijriah",
  internasional: "Internasional",
  cuti_bersama: "Cuti Bersama",
};

const KIND_TONE: Record<Holiday["kind"], string> = {
  nasional: "text-rose-600 dark:text-rose-300 bg-rose-500/10",
  hijriah: "text-emerald-700 dark:text-emerald-300 bg-emerald-500/10",
  internasional: "text-sky-700 dark:text-sky-300 bg-sky-500/10",
  cuti_bersama: "text-amber-700 dark:text-amber-300 bg-amber-500/10",
};

function formatDateID(iso: string): string {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("id-ID", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

function daysUntil(iso: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(iso + "T00:00:00");
  return Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

function relativeLabel(iso: string): string {
  const d = daysUntil(iso);
  if (d === 0) return "Hari ini";
  if (d === 1) return "Besok";
  if (d < 7) return `${d} hari lagi`;
  if (d < 30) return `${Math.round(d / 7)} minggu lagi`;
  return `${Math.round(d / 30)} bulan lagi`;
}

export function UpcomingHolidays({ holidays }: { holidays: Holiday[] }) {
  return (
    <GlassCard variant="regular" className="p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-foreground/55">
            Pengingat ucapan
          </p>
          <h3 className="font-display text-base font-semibold tracking-tight">
            Hijriah &amp; Hari Besar
          </h3>
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
        {holidays.length === 0 && (
          <li className="rounded-xl bg-foreground/5 p-3 text-sm text-foreground/55 dark:bg-white/5">
            Tidak ada hari besar dalam waktu dekat.
          </li>
        )}
        {holidays.map((h) => (
          <li key={h.id}>
            <div className="flex items-center gap-3 rounded-xl p-2">
              <div className="grid size-12 shrink-0 place-items-center rounded-xl bg-brand-500/10 text-brand-600 dark:text-brand-300">
                <span className="text-[10px] uppercase tracking-wider">
                  {formatDateID(h.date).split(" ")[2] ?? ""}
                </span>
                <span className="font-display text-base font-semibold leading-none">
                  {new Date(h.date + "T00:00:00").getDate()}
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="flex items-center gap-1.5 truncate text-sm font-medium">
                  {h.emoji && <span aria-hidden>{h.emoji}</span>}
                  <span className="truncate">{h.name}</span>
                </p>
                <p className="flex flex-wrap items-center gap-1.5 text-[11px] text-foreground/55">
                  <CalendarHeart className="size-3" strokeWidth={1.75} />
                  <span>{formatDateID(h.date)}</span>
                  <span className="opacity-50">·</span>
                  <span>{relativeLabel(h.date)}</span>
                  <span
                    className={`ml-1 rounded-full px-1.5 py-0.5 text-[10px] font-medium ${KIND_TONE[h.kind]}`}
                  >
                    {KIND_LABEL[h.kind]}
                  </span>
                </p>
                {h.hijriahLabel && (
                  <p className="mt-0.5 text-[11px] text-foreground/55">
                    {h.hijriahLabel}
                  </p>
                )}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </GlassCard>
  );
}
