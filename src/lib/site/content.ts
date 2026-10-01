import { listContents, listMedia } from "@/lib/data/provider";
import type { ContentItem, MediaAsset } from "@/lib/data/types";

/**
 * Konten CMS yang tampil di website publik: hanya yang berstatus `published`,
 * urut dari yang terbaru dipublikasikan.
 */
export async function listPublishedNews(): Promise<ContentItem[]> {
  const items = await listContents({ status: ["published"] });
  return items.sort((a, b) =>
    (b.publishedAt ?? b.updatedAt).localeCompare(a.publishedAt ?? a.updatedAt),
  );
}

/** Rubrik CMS yang ditampilkan sebagai "Pengumuman", bukan berita. */
export const ANNOUNCEMENT_RUBRIC = "pengumuman";

export function isAnnouncement(item: ContentItem) {
  return item.rubric === ANNOUNCEMENT_RUBRIC;
}

export async function findPublishedNews(
  slug: string,
): Promise<ContentItem | null> {
  const items = await listPublishedNews();
  return items.find((c) => c.slug === slug) ?? null;
}

/** Map id → media untuk menampilkan cover konten tanpa query per item. */
export async function getMediaMap(): Promise<Map<string, MediaAsset>> {
  const media = await listMedia();
  return new Map(media.map((m) => [m.id, m]));
}

export function coverFor(
  item: ContentItem,
  media: Map<string, MediaAsset>,
): MediaAsset | null {
  const id = item.mediaIds[0];
  return id ? (media.get(id) ?? null) : null;
}

/** Teks polos dari body markdown / caption, untuk ringkasan & meta description. */
export function contentExcerpt(item: ContentItem, max = 180): string {
  const source = item.body?.trim() || item.caption?.trim() || "";
  const plain = source
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/[#>*_`~-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  return plain.length > max ? `${plain.slice(0, max).trimEnd()}…` : plain;
}

const RUBRIC_LABELS: Record<string, string> = {
  pengumuman: "Pengumuman",
  dokumentasi: "Kegiatan",
  kajian: "Kajian",
  campaign: "Kampanye",
  selamat_sukses: "Prestasi",
  bisnis_halal: "Bisnis Halal",
  eksyar_talks: "Eksyar Talks",
  tausiyah_senin: "Tausiyah",
  eksphoria_update: "Eksphoria",
};

/** Label kategori berita untuk publik, dari slug rubrik CMS. */
export function rubricLabel(slug: string): string {
  if (RUBRIC_LABELS[slug]) return RUBRIC_LABELS[slug];
  const words = slug.split(/[_-]+/).filter(Boolean);
  return words.length
    ? words.map((w) => w[0].toUpperCase() + w.slice(1)).join(" ")
    : "Berita";
}

/** Kategori agenda CMS yang boleh tampil di website publik. */
export const PUBLIC_EVENT_CATEGORIES = [
  "kajian",
  "kegiatan_publik",
  "kompetisi",
  "pelatihan",
  "perayaan",
] as const;

/** Tautan "Tambahkan ke Google Calendar" untuk satu agenda. */
export function googleCalendarUrl(e: {
  title: string;
  startsAt: string;
  endsAt: string;
  isOnline: boolean;
  location: string;
  description: string;
}) {
  const fmt = (d: string) =>
    new Date(d)
      .toISOString()
      .replace(/[-:]/g, "")
      .replace(/\.\d{3}/, "");
  const sp = new URLSearchParams({
    action: "TEMPLATE",
    text: e.title,
    dates: `${fmt(e.startsAt)}/${fmt(e.endsAt || e.startsAt)}`,
    details: e.description.slice(0, 500),
    location: e.isOnline ? "Daring" : e.location,
  });
  return `https://calendar.google.com/calendar/render?${sp}`;
}

/** Pengumuman terbaru yang terbit dalam `days` hari terakhir (untuk pita pengumuman). */
export function recentAnnouncement(
  news: ContentItem[],
  days = 14,
): ContentItem | null {
  const since = Date.now() - days * 864e5;
  return (
    news.find(
      (n) =>
        isAnnouncement(n) &&
        new Date(n.publishedAt ?? n.updatedAt).getTime() >= since,
    ) ?? null
  );
}
