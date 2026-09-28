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

export async function findPublishedNews(slug: string): Promise<ContentItem | null> {
  const items = await listPublishedNews();
  return items.find((c) => c.slug === slug) ?? null;
}

/** Map id → media untuk menampilkan cover konten tanpa query per item. */
export async function getMediaMap(): Promise<Map<string, MediaAsset>> {
  const media = await listMedia();
  return new Map(media.map((m) => [m.id, m]));
}

export function coverFor(item: ContentItem, media: Map<string, MediaAsset>): MediaAsset | null {
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
