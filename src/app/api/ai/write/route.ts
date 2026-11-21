/** POST /api/ai/write — susun judul, isi, ringkasan, dan caption dari foto + konteks. */
import { NextRequest, NextResponse } from "next/server";
import { getBrandingConfig, listMedia } from "@/lib/data/provider";
import { AssistUnavailableError } from "@/lib/ai/assist";
import { writePost, type WriteKind } from "@/lib/ai/write";
import { requireEditor } from "@/lib/instagram/auth";

export const maxDuration = 60;

const KINDS = new Set<WriteKind>(["kegiatan", "buletin", "pengumuman"]);

export async function POST(req: NextRequest) {
  const me = await requireEditor();
  if (!me) return NextResponse.json({ error: "Silakan masuk terlebih dahulu." }, { status: 401 });
  const body = (await req.json().catch(() => ({}))) as { kind?: string; context?: string; title?: string; mediaIds?: string[] };
  const kind = (KINDS.has(body.kind as WriteKind) ? body.kind : "kegiatan") as WriteKind;
  // Penulis Buletin hanya menulis artikel buletin.
  if (me.role === "anggota" && kind !== "buletin")
    return NextResponse.json({ error: "Akun Penulis Buletin hanya bisa menulis Buletin Mahasiswa." }, { status: 403 });
  const context = String(body.context ?? "").trim();
  if (context.length < 20)
    return NextResponse.json({ error: "Tulis konteks minimal satu-dua kalimat dulu (apa, siapa, kapan, poin penting)." }, { status: 400 });
  const [media, branding] = await Promise.all([listMedia(), getBrandingConfig()]);
  const imageUrls = (body.mediaIds ?? [])
    .map((id) => media.find((m) => m.id === id)?.url)
    .filter((u): u is string => Boolean(u && u.startsWith("https://")));
  try {
    const result = await writePost({
      kind,
      context,
      title: body.title,
      imageUrls,
      signature: branding.signature,
      hashtags: branding.defaultHashtags,
    });
    return NextResponse.json(result);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "AI gagal menulis.";
    return NextResponse.json({ error: msg }, { status: err instanceof AssistUnavailableError ? 503 : 502 });
  }
}
