import type { KalenderItem } from "./schema";

export type KalenderStatus = "berlangsung" | "akan-datang" | "selesai";

/** Tanggal hari ini (WIB) dalam format YYYY-MM-DD. */
export function todayJakarta(): string {
  return new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Jakarta" });
}

export function kalenderStatus(
  k: KalenderItem,
  today = todayJakarta(),
): KalenderStatus {
  const end = k.selesai || k.mulai;
  if (end < today) return "selesai";
  if (k.mulai > today) return "akan-datang";
  return "berlangsung";
}

const fmt = (d: string, opts: Intl.DateTimeFormatOptions) =>
  new Date(`${d}T00:00:00+07:00`).toLocaleDateString("id-ID", {
    timeZone: "Asia/Jakarta",
    ...opts,
  });

/** "6 Juli – 14 Agustus 2026" */
export function rentang(k: KalenderItem): string {
  if (!k.selesai || k.selesai === k.mulai)
    return fmt(k.mulai, { day: "numeric", month: "long", year: "numeric" });
  const sameYear = k.mulai.slice(0, 4) === k.selesai.slice(0, 4);
  return `${fmt(k.mulai, { day: "numeric", month: "long", ...(sameYear ? {} : { year: "numeric" }) })} – ${fmt(
    k.selesai,
    {
      day: "numeric",
      month: "long",
      year: "numeric",
    },
  )}`;
}

export function bulanLabel(d: string): string {
  return fmt(d, { month: "long", year: "numeric" });
}

/** Kegiatan yang sedang berlangsung atau terdekat. */
export function kalenderMendatang(
  items: KalenderItem[],
  n = 3,
): KalenderItem[] {
  const today = todayJakarta();
  return [...items]
    .filter((k) => kalenderStatus(k, today) !== "selesai")
    .sort((a, b) => a.mulai.localeCompare(b.mulai))
    .slice(0, n);
}

/** Sisa hari menuju tenggat (negatif bila sudah lewat; null bila tanpa tenggat). */
export function sisaHari(deadline?: string): number | null {
  if (!deadline) return null;
  const today = todayJakarta();
  return Math.round(
    (new Date(`${deadline}T00:00:00Z`).getTime() -
      new Date(`${today}T00:00:00Z`).getTime()) /
      864e5,
  );
}

export function labelTenggat(deadline?: string): {
  text: string;
  open: boolean;
} {
  const d = sisaHari(deadline);
  if (d === null) return { text: "Tanpa tenggat", open: true };
  if (d < 0) return { text: "Ditutup", open: false };
  if (d === 0) return { text: "Hari terakhir", open: true };
  return { text: `${d} hari lagi`, open: true };
}
