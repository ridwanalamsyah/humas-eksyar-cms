/**
 * Instagram API (Instagram Login) — cara resmi membaca postingan akun
 * profesional milik sendiri. Butuh token akses jangka panjang di
 * `INSTAGRAM_ACCESS_TOKEN` (berlaku 60 hari); token diperpanjang otomatis
 * dan disimpan di siteSettings agar tidak kedaluwarsa.
 */
import { getSiteSetting, setSiteSetting } from "@/lib/data/provider";

const API = "https://graph.instagram.com";
const TOKEN_KEY = "instagram_token";

export type IgPost = {
  id: string;
  shortcode: string;
  permalink: string;
  caption: string;
  timestamp: string;
  mediaType: string;
  images: string[];
};

type StoredToken = { token: string; refreshedAt: string };

export class InstagramNotConfiguredError extends Error {}

async function getToken(): Promise<string> {
  const stored = (await getSiteSetting(TOKEN_KEY).catch(
    () => null,
  )) as StoredToken | null;
  const token = stored?.token || process.env.INSTAGRAM_ACCESS_TOKEN;
  if (!token) {
    throw new InstagramNotConfiguredError(
      "Instagram belum terhubung: tambahkan INSTAGRAM_ACCESS_TOKEN di environment Vercel (lihat panduan di halaman ini).",
    );
  }
  // Perpanjang token bila sudah lebih dari 7 hari sejak terakhir diperbarui.
  const age = stored
    ? Date.now() - new Date(stored.refreshedAt).getTime()
    : Infinity;
  if (age > 7 * 864e5) {
    try {
      const res = await fetch(
        `${API}/refresh_access_token?grant_type=ig_refresh_token&access_token=${token}`,
        {
          cache: "no-store",
        },
      );
      const j = (await res.json()) as { access_token?: string };
      if (res.ok && j.access_token) {
        await setSiteSetting(TOKEN_KEY, {
          token: j.access_token,
          refreshedAt: new Date().toISOString(),
        });
        return j.access_token;
      }
    } catch {
      // Tetap pakai token lama; diperpanjang lagi di sinkron berikutnya.
    }
  }
  return token;
}

type ApiMedia = {
  id: string;
  caption?: string;
  media_type: string;
  media_url?: string;
  thumbnail_url?: string;
  permalink: string;
  timestamp: string;
  children?: {
    data: { media_type: string; media_url?: string; thumbnail_url?: string }[];
  };
};

export async function listInstagramPosts(limit = 25): Promise<IgPost[]> {
  const token = await getToken();
  const fields =
    "id,caption,media_type,media_url,thumbnail_url,permalink,timestamp,children{media_type,media_url,thumbnail_url}";
  const res = await fetch(
    `${API}/me/media?fields=${fields}&limit=${limit}&access_token=${token}`,
    { cache: "no-store" },
  );
  const j = (await res.json()) as {
    data?: ApiMedia[];
    error?: { message?: string };
  };
  if (!res.ok || !j.data)
    throw new Error(`Instagram API: ${j.error?.message ?? res.status}`);
  return j.data.map((m) => {
    const pick = (x: {
      media_type: string;
      media_url?: string;
      thumbnail_url?: string;
    }) => (x.media_type === "VIDEO" ? x.thumbnail_url : x.media_url);
    const images = (
      m.children?.data.length ? m.children.data.map(pick) : [pick(m)]
    ).filter((u): u is string => !!u);
    return {
      id: m.id,
      shortcode: m.permalink.match(/\/(?:p|reel|tv)\/([\w-]+)/)?.[1] ?? m.id,
      permalink: m.permalink,
      caption: m.caption ?? "",
      timestamp: m.timestamp,
      mediaType: m.media_type,
      images,
    };
  });
}
