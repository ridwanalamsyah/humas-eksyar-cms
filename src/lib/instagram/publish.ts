/**
 * Posting ke Instagram (Instagram API dengan Instagram Login, content
 * publishing). Dipakai saat konten CMS diterbitkan dengan centang
 * "Kirim ke Instagram". Foto harus berupa URL publik (Vercel Blob) dan JPEG.
 *
 * Status per konten disimpan di siteSettings `instagram_posts` supaya satu
 * konten tidak terposting dua kali dan hasilnya terlihat di CMS.
 */
import { after } from "next/server";
import { getSiteSetting, listMedia, setSiteSetting } from "@/lib/data/provider";
import type { ContentItem, MediaAsset } from "@/lib/data/types";
import { getToken } from "./graph";

const API = "https://graph.instagram.com/v21.0";
const KEY = "instagram_posts";

export type IgPostStatus = {
  at: string;
  ok: boolean;
  permalink?: string;
  mediaId?: string;
  error?: string;
};

export async function getIgPostStatuses(): Promise<Record<string, IgPostStatus>> {
  const v = await getSiteSetting(KEY).catch(() => null);
  return v && typeof v === "object" ? (v as Record<string, IgPostStatus>) : {};
}

async function saveStatus(contentId: string, s: IgPostStatus) {
  const all = await getIgPostStatuses();
  all[contentId] = s;
  await setSiteSetting(KEY, all);
}

async function call(path: string, params: Record<string, string>, token: string, method: "GET" | "POST" = "POST") {
  const qs = new URLSearchParams({ ...params, access_token: token });
  const res = await fetch(`${API}/${path}${method === "GET" ? `?${qs}` : ""}`, {
    method,
    headers: method === "POST" ? { "Content-Type": "application/x-www-form-urlencoded" } : undefined,
    body: method === "POST" ? qs : undefined,
    cache: "no-store",
  });
  const j = (await res.json().catch(() => ({}))) as Record<string, unknown> & { error?: { message?: string } };
  if (!res.ok || j.error) throw new Error(j.error?.message || `Instagram menolak permintaan (${res.status}).`);
  return j;
}

/** Tunggu sampai Instagram selesai memproses foto (biasanya beberapa detik). */
async function waitReady(id: string, token: string) {
  for (let i = 0; i < 10; i++) {
    const j = await call(id, { fields: "status_code" }, token, "GET");
    if (j.status_code === "FINISHED") return;
    if (j.status_code === "ERROR" || j.status_code === "EXPIRED") throw new Error("Instagram gagal memproses foto.");
    await new Promise((r) => setTimeout(r, 1500));
  }
}

/** Caption + hashtag, dipotong ke batas Instagram (2.200 karakter). */
export function igCaption(c: Pick<ContentItem, "caption" | "hashtags" | "title">): string {
  const text = [c.caption?.trim() || c.title, c.hashtags?.trim()].filter(Boolean).join("\n\n");
  return text.slice(0, 2200);
}

/**
 * Posting satu konten. Satu foto = postingan biasa; 2–10 foto = carousel.
 * Melempar error dengan pesan yang bisa ditampilkan ke tim.
 */
export async function postContentToInstagram(content: ContentItem, media: MediaAsset[], force = false): Promise<IgPostStatus> {
  const prev = (await getIgPostStatuses())[content.id];
  if (prev?.ok && !force) return prev;
  const photos = content.mediaIds
    .map((id) => media.find((m) => m.id === id))
    .filter((m): m is MediaAsset => Boolean(m && /^https:\/\//.test(m.url)))
    .slice(0, 10);
  try {
    if (!photos.length) throw new Error("Pilih minimal satu foto supaya bisa diposting ke Instagram.");
    const notJpeg = photos.find((p) => !/\.jpe?g($|\?)/i.test(p.url));
    if (notJpeg) throw new Error("Instagram hanya menerima foto JPG. Ganti foto PNG/WebP dengan versi JPG.");
    const token = await getToken();
    const me = await call("me", { fields: "user_id,username" }, token, "GET");
    const igUser = String(me.user_id ?? me.id);
    const caption = igCaption(content);
    let creationId: string;
    if (photos.length === 1) {
      const c = await call(`${igUser}/media`, { image_url: photos[0].url, caption }, token);
      creationId = String(c.id);
    } else {
      const children: string[] = [];
      for (const p of photos) {
        const c = await call(`${igUser}/media`, { image_url: p.url, is_carousel_item: "true" }, token);
        children.push(String(c.id));
      }
      for (const id of children) await waitReady(id, token);
      const c = await call(`${igUser}/media`, { media_type: "CAROUSEL", children: children.join(","), caption }, token);
      creationId = String(c.id);
    }
    await waitReady(creationId, token);
    const pub = await call(`${igUser}/media_publish`, { creation_id: creationId }, token);
    const mediaId = String(pub.id);
    const info = await call(mediaId, { fields: "permalink" }, token, "GET").catch(() => ({}) as Record<string, unknown>);
    const status: IgPostStatus = { at: new Date().toISOString(), ok: true, mediaId, permalink: info.permalink as string | undefined };
    await saveStatus(content.id, status);
    return status;
  } catch (err) {
    const status: IgPostStatus = { at: new Date().toISOString(), ok: false, error: err instanceof Error ? err.message : "Gagal posting ke Instagram." };
    await saveStatus(content.id, status).catch(() => {});
    return status;
  }
}

/**
 * Dipanggil saat konten baru saja terbit: bila dicentang "Kirim ke Instagram",
 * posting berjalan setelah respons terkirim supaya tombol Terbitkan tidak menunggu.
 */
export function queueInstagramPost(content: ContentItem) {
  if (content.status !== "published" || !content.channels?.includes("instagram")) return;
  after(async () => {
    try {
      await postContentToInstagram(content, await listMedia());
    } catch (err) {
      console.error("[instagram] posting gagal", err);
    }
  });
}
