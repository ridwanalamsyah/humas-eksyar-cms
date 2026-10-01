import {
  getSiteSetting,
  getWebsiteContent,
  setSiteSetting,
} from "@/lib/data/provider";

const KEY = "website_history";
const MAX = 15;

export type HistoryEntry = { at: string; by: string; data: unknown };

export async function getHistory(): Promise<HistoryEntry[]> {
  const v = await getSiteSetting(KEY).catch(() => null);
  return Array.isArray(v) ? (v as HistoryEntry[]) : [];
}

/** Simpan isi website saat ini sebagai versi sebelum diubah. */
export async function snapshotBeforeSave(by: string): Promise<void> {
  const current = await getWebsiteContent().catch(() => null);
  if (!current) return;
  const list = await getHistory();
  await setSiteSetting(
    KEY,
    [{ at: new Date().toISOString(), by, data: current }, ...list].slice(
      0,
      MAX,
    ),
  );
}
