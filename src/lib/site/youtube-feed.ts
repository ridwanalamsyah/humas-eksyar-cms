import { decodeHtml } from "./digilib";

/** Video terbaru dari RSS kanal YouTube (tanpa API key). */
export async function latestYoutube(
  channelId: string,
  n = 4,
): Promise<{ title: string; url: string }[]> {
  if (!/^UC[\w-]{20,}$/.test(channelId)) return [];
  try {
    const res = await fetch(
      `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`,
      {
        next: { revalidate: 3600 },
        signal: AbortSignal.timeout(8000),
      },
    );
    if (!res.ok) return [];
    const xml = await res.text();
    return [
      ...xml.matchAll(
        /<entry>[\s\S]*?<yt:videoId>([\w-]{11})<\/yt:videoId>[\s\S]*?<title>([\s\S]*?)<\/title>/g,
      ),
    ]
      .slice(0, n)
      .map((m) => ({
        title: decodeHtml(m[2]),
        url: `https://www.youtube.com/watch?v=${m[1]}`,
      }));
  } catch {
    return [];
  }
}
