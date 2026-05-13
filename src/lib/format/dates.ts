import { differenceInDays, format, isToday, isTomorrow, parseISO } from "date-fns";
import { id as localeID } from "date-fns/locale/id";

const HIJRI_FORMATTER = (() => {
  try {
    return new Intl.DateTimeFormat("id-ID-u-ca-islamic-umalqura", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch {
    return null;
  }
})();

export function formatHijri(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  if (!HIJRI_FORMATTER) return "";
  try {
    return HIJRI_FORMATTER.format(d);
  } catch {
    return "";
  }
}

/** "Sen 12 Mei" */
export function formatShortDate(date: Date | string): string {
  const d = typeof date === "string" ? parseISO(date) : date;
  return format(d, "EEE d MMM", { locale: localeID });
}

/** "Senin, 12 Mei 2026" */
export function formatLongDate(date: Date | string): string {
  const d = typeof date === "string" ? parseISO(date) : date;
  return format(d, "EEEE, d MMMM yyyy", { locale: localeID });
}

/** "12 Mei · 19.00 WIB" */
export function formatDateTime(date: Date | string): string {
  const d = typeof date === "string" ? parseISO(date) : date;
  return `${format(d, "d MMM", { locale: localeID })} · ${format(d, "HH.mm", { locale: localeID })} WIB`;
}

export function formatTime(date: Date | string): string {
  const d = typeof date === "string" ? parseISO(date) : date;
  return format(d, "HH.mm", { locale: localeID });
}

export function relativeFromNow(date: Date | string, now = new Date()): string {
  const d = typeof date === "string" ? parseISO(date) : date;
  if (isToday(d)) return `Hari ini · ${formatTime(d)}`;
  if (isTomorrow(d)) return `Besok · ${formatTime(d)}`;
  const days = differenceInDays(d, now);
  if (days === -1) return `Kemarin · ${formatTime(d)}`;
  if (days < 0 && days > -7) return `${Math.abs(days)} hari lalu`;
  if (days > 0 && days < 7) return `${days} hari lagi · ${formatTime(d)}`;
  return formatShortDate(d);
}

export function durationLabel(start: Date | string, end: Date | string): string {
  const s = typeof start === "string" ? parseISO(start) : start;
  const e = typeof end === "string" ? parseISO(end) : end;
  if (s.toDateString() === e.toDateString()) {
    return `${formatTime(s)} – ${formatTime(e)}`;
  }
  return `${formatShortDate(s)} – ${formatShortDate(e)}`;
}

/** Human number: 1.2K, 3.4M */
export function humanNumber(n: number): string {
  if (n < 1000) return n.toString();
  if (n < 1_000_000) return `${(n / 1000).toFixed(1).replace(/\.0$/, "")}K`;
  return `${(n / 1_000_000).toFixed(1).replace(/\.0$/, "")}M`;
}

/** Returns 0..1 → "4.8%" */
export function percent(rate: number, fractionDigits = 1): string {
  return `${(rate * 100).toFixed(fractionDigits)}%`;
}
