/** POST /api/ai/repurpose { contentId } — versi Instagram, WhatsApp, dan ringkasan dari satu konten. */
import { NextRequest, NextResponse } from "next/server";
import { repurpose } from "@/lib/ai/assist";
import { getContent } from "@/lib/data/provider";
import { requireEditor } from "@/lib/instagram/auth";
import { contentExcerpt } from "@/lib/site/content";

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  if (!(await requireEditor()))
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const { contentId } = ((await req.json().catch(() => ({}))) ?? {}) as {
    contentId?: string;
  };
  const item = contentId ? await getContent(contentId) : null;
  if (!item)
    return NextResponse.json(
      { error: "Konten tidak ditemukan" },
      { status: 404 },
    );
  const url = `${req.nextUrl.origin}/prodi/berita/${item.slug}`;
  const body = item.body || item.caption || "";
  try {
    return NextResponse.json({
      ...(await repurpose(item.title, body, url)),
      ai: true,
    });
  } catch {
    // Tanpa AI: susun versi sederhana dari judul dan ringkasan.
    const excerpt = contentExcerpt(item, 400);
    return NextResponse.json({
      ai: false,
      instagram: `${item.title}\n\n${excerpt}\n\nBaca selengkapnya di website prodi (link di bio).\n\n${item.hashtags || "#EkonomiSyariah #UINSGD"}`,
      whatsapp: `*${item.title}*\n\n${contentExcerpt(item, 280)}\n\nSelengkapnya: ${url}`,
      ringkas: contentExcerpt(item, 150) || item.title,
    });
  }
}
