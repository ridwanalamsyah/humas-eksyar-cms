/**
 * POST /api/instagram/import — jadikan satu postingan IG artikel berita (draft).
 *   { shortcode }                          → ambil dari akun IG yang terhubung
 *   { url, caption, imageUrls?, timestamp? } → impor manual (tanpa token)
 */
import { NextRequest, NextResponse } from "next/server";
import { z } from "@/lib/zod";
import { shortcodeFromUrl } from "@/lib/instagram/caption";
import { listInstagramPosts } from "@/lib/instagram/graph";
import { importPost } from "@/lib/instagram/import";
import { requireEditor } from "@/lib/instagram/auth";

export const maxDuration = 60;

// Foto manual hanya dari Vercel Blob (hasil unggah CMS) atau CDN Instagram.
const IMAGE_HOST =
  /^https:\/\/([\w-]+\.public\.blob\.vercel-storage\.com|[\w.-]+\.(cdninstagram|fbcdn)\.(com|net))\//i;

const schema = z.union([
  z.object({
    shortcode: z.string().regex(/^[\w-]{5,40}$/),
    publish: z.boolean().optional(),
  }),
  z.object({
    url: z.string().url().max(300),
    caption: z.string().trim().min(20, "Caption terlalu pendek").max(5000),
    imageUrls: z
      .array(z.string().regex(IMAGE_HOST, "Foto harus diunggah lewat CMS"))
      .max(10)
      .optional(),
    timestamp: z.string().datetime().optional(),
    publish: z.boolean().optional(),
  }),
]);

export async function POST(req: NextRequest) {
  const me = await requireEditor();
  if (!me)
    return NextResponse.json(
      { error: "Anda tidak punya akses untuk tindakan ini." },
      { status: 403 },
    );
  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success)
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Data tidak valid" },
      { status: 400 },
    );
  const input = parsed.data;
  // Hanya admin yang boleh langsung menerbitkan.
  const publish = !!input.publish && me.role === "admin";

  try {
    if ("shortcode" in input) {
      const post = (await listInstagramPosts(50)).find(
        (p) => p.shortcode === input.shortcode,
      );
      if (!post)
        return NextResponse.json(
          { error: "Postingan tidak ditemukan di akun Instagram." },
          { status: 404 },
        );
      const { content, ai } = await importPost(post, {
        authorId: me.id,
        publish,
      });
      return NextResponse.json({ id: content.id, title: content.title, ai });
    }
    const shortcode = shortcodeFromUrl(input.url);
    if (!shortcode)
      return NextResponse.json(
        {
          error: "Tautan harus tautan postingan Instagram (instagram.com/p/…).",
        },
        { status: 400 },
      );
    const { content, ai } = await importPost(
      {
        shortcode,
        permalink: `https://www.instagram.com/p/${shortcode}/`,
        caption: input.caption,
        timestamp: input.timestamp ?? new Date().toISOString(),
        images: input.imageUrls ?? [],
      },
      { authorId: me.id, publish },
    );
    return NextResponse.json({ id: content.id, title: content.title, ai });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Gagal mengimpor" },
      { status: 400 },
    );
  }
}
