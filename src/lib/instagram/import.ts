/**
 * Impor postingan Instagram menjadi artikel berita di CMS:
 *  - foto disalin ke Vercel Blob (URL Instagram kedaluwarsa dalam beberapa hari),
 *  - caption diubah jadi artikel oleh AI (atau dirapikan tanpa AI),
 *  - disimpan sebagai Konten berstatus draft agar direview Humas dulu.
 */
import { put } from "@vercel/blob";
import { revalidatePath } from "next/cache";
import { artikelFromCaption } from "@/lib/ai/assist";
import {
  createContent,
  createMedia,
  getSiteSetting,
  listMembers,
  setSiteSetting,
  updateContent,
} from "@/lib/data/provider";
import type { ContentItem, ID } from "@/lib/data/types";
import {
  articleFromCaptionPlain,
  hashtagsOf,
  rubricFromCaption,
} from "./caption";
import { listInstagramPosts, type IgPost } from "./graph";

const IMPORTED_KEY = "instagram_imported";
const SYNC_KEY = "instagram_sync";
const DIVISION_ID = "div-humas-eksyar";

export type ImportedMap = Record<
  string,
  { contentId: ID; at: string; title: string }
>;

export async function getImported(): Promise<ImportedMap> {
  const v = await getSiteSetting(IMPORTED_KEY).catch(() => null);
  return v && typeof v === "object" ? (v as ImportedMap) : {};
}

export async function getInstagramSync(): Promise<{
  at: string;
  imported: number;
  error?: string;
} | null> {
  return ((await getSiteSetting(SYNC_KEY).catch(() => null)) as never) ?? null;
}

async function copyImage(
  url: string,
  shortcode: string,
  i: number,
  authorId: ID,
  caption: string,
): Promise<{ id: ID; url: string } | null> {
  let finalUrl = url;
  const alreadyBlob = /\.public\.blob\.vercel-storage\.com\//.test(url);
  if (process.env.BLOB_READ_WRITE_TOKEN && !alreadyBlob) {
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(20_000) });
      if (res.ok) {
        const type = res.headers.get("content-type") ?? "image/jpeg";
        const blob = await put(
          `instagram/${shortcode}-${i}.${type.includes("png") ? "png" : "jpg"}`,
          await res.arrayBuffer(),
          {
            access: "public",
            contentType: type,
            addRandomSuffix: true,
          },
        );
        finalUrl = blob.url;
      }
    } catch {
      // Gagal menyalin: lewati foto ini.
      return null;
    }
  }
  const asset = await createMedia({
    url: finalUrl,
    width: 1080,
    height: 1350,
    type: "image",
    alt: caption.split("\n")[0].slice(0, 140),
    tags: ["instagram"],
    usedIn: [],
    uploaderId: authorId,
    aspect: "portrait",
    averageColor: "#e9f2f3",
  });
  return { id: asset.id, url: asset.url };
}

export type ImportInput = {
  shortcode: string;
  permalink: string;
  caption: string;
  timestamp: string;
  images: string[];
};

export async function importPost(
  post: ImportInput,
  opts: { authorId?: ID; publish?: boolean } = {},
): Promise<{ content: ContentItem; ai: boolean }> {
  const imported = await getImported();
  if (imported[post.shortcode])
    throw new Error("Postingan ini sudah pernah dijadikan artikel.");

  const authorId =
    opts.authorId ??
    (await listMembers()).find((m) => m.role === "admin")?.id ??
    "mbr-ridwan";
  const tanggal = new Date(post.timestamp).toLocaleDateString("id-ID", {
    dateStyle: "long",
    timeZone: "Asia/Jakarta",
  });

  let artikel: { judul: string; isi: string };
  let ai = true;
  try {
    artikel = await artikelFromCaption(post.caption, tanggal);
  } catch {
    // AI belum aktif (tanpa GEMINI_API_KEY) atau jawabannya tidak valid: rapikan caption saja.
    artikel = articleFromCaptionPlain(post.caption);
    ai = false;
  }

  const photos: { id: ID; url: string }[] = [];
  for (const [i, url] of post.images.slice(0, 10).entries()) {
    const photo = await copyImage(
      url,
      post.shortcode,
      i,
      authorId,
      post.caption,
    );
    if (photo) photos.push(photo);
  }
  // Foto pertama jadi sampul; foto lain (carousel) disisipkan di akhir artikel.
  const gallery = photos
    .slice(1)
    .map((p) => `![](${p.url})`)
    .join("\n\n");
  const body = [
    artikel.isi,
    gallery,
    `*Sumber: [unggahan Instagram](${post.permalink}), ${tanggal}.*`,
  ]
    .filter(Boolean)
    .join("\n\n");
  const mediaIds = photos.map((p) => p.id);

  let content = await createContent({
    title: artikel.judul,
    rubric: rubricFromCaption(post.caption),
    status: "draft",
    divisionId: DIVISION_ID,
    authorId,
    body,
    caption: post.caption,
    hashtags: hashtagsOf(post.caption),
    channels: ["instagram"],
    mediaIds,
  });
  if (opts.publish) {
    content =
      (await updateContent(content.id, {
        status: "published",
        publishedAt: post.timestamp,
      })) ?? content;
  }

  await setSiteSetting(IMPORTED_KEY, {
    ...(await getImported()),
    [post.shortcode]: {
      contentId: content.id,
      at: new Date().toISOString(),
      title: content.title,
    },
  });
  revalidatePath("/content");
  revalidatePath("/prodi", "layout");
  return { content, ai };
}

/** Jadikan draft artikel semua postingan baru (maks `limit` per jalan). */
export async function syncInstagram(
  limit = 6,
): Promise<{ imported: number; checked: number }> {
  try {
    const [posts, imported] = await Promise.all([
      listInstagramPosts(25),
      getImported(),
    ]);
    const fresh = posts
      .filter(
        (p: IgPost) => !imported[p.shortcode] && p.caption.trim().length > 30,
      )
      .slice(0, limit);
    let n = 0;
    for (const p of fresh) {
      await importPost(p);
      n++;
    }
    await setSiteSetting(SYNC_KEY, {
      at: new Date().toISOString(),
      imported: n,
    });
    return { imported: n, checked: posts.length };
  } catch (err) {
    await setSiteSetting(SYNC_KEY, {
      at: new Date().toISOString(),
      imported: 0,
      error: err instanceof Error ? err.message : String(err),
    });
    throw err;
  }
}
