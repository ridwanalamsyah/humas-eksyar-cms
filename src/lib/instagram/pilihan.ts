/**
 * Unggahan Instagram pilihan, dikelola tim dari CMS tanpa Instagram API:
 * tautan unggahan asli + fotonya (diunggah ke Pustaka Media). Beranda memakai
 * daftar ini bila Instagram API belum tersambung.
 */
import { getSiteSetting, setSiteSetting } from "@/lib/data/provider";

export type IgPilihan = { permalink: string; image: string; caption: string };

const KEY = "instagram_pilihan";
export const MAX_PILIHAN = 6;

const IG_POST = /^https:\/\/(www\.)?instagram\.com\/(p|reel|tv)\/[\w-]+\/?(\?.*)?$/i;

/** Hanya tautan unggahan Instagram asli dan foto https yang diterima. */
export function cleanPilihan(input: unknown): IgPilihan[] {
  if (!Array.isArray(input)) return [];
  const out: IgPilihan[] = [];
  for (const raw of input) {
    if (!raw || typeof raw !== "object") continue;
    const r = raw as Record<string, unknown>;
    const permalink = typeof r.permalink === "string" ? r.permalink.trim() : "";
    const image = typeof r.image === "string" ? r.image.trim() : "";
    const caption = typeof r.caption === "string" ? r.caption.trim().slice(0, 150) : "";
    if (!IG_POST.test(permalink) || !/^https:\/\//.test(image)) continue;
    out.push({ permalink: permalink.split("?")[0], image, caption });
    if (out.length >= MAX_PILIHAN) break;
  }
  return out;
}

export async function getInstagramPilihan(): Promise<IgPilihan[]> {
  return cleanPilihan(await getSiteSetting(KEY).catch(() => null));
}

export async function setInstagramPilihan(items: IgPilihan[]) {
  await setSiteSetting(KEY, cleanPilihan(items));
}
