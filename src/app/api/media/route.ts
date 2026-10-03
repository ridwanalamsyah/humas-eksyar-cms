/**
 * POST /api/media  — unggah foto ke Pustaka media (anggota selain pembina).
 *
 * File disimpan di Vercel Blob lalu dicatat di tabel media. Ukuran gambar
 * dikirim dari browser (dibaca sebelum unggah) untuk menentukan bentuk grid.
 */
import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { createMedia } from "@/lib/data/provider";
import { requireEditor } from "@/lib/instagram/auth";

export const runtime = "nodejs";

const MAX_BYTES = 10 * 1024 * 1024;
const ALLOWED = new Set(["image/jpeg", "image/png", "image/webp"]);

function aspectOf(w: number, h: number) {
  const r = w / h;
  if (r >= 1.7) return "wide" as const;
  if (r >= 1.15) return "landscape" as const;
  if (r <= 0.85) return "portrait" as const;
  return "square" as const;
}

export async function POST(req: NextRequest) {
  const me = await requireEditor();
  if (!me)
    return NextResponse.json(
      { error: "Anda tidak punya akses untuk mengunggah." },
      { status: 403 },
    );
  if (!process.env.BLOB_READ_WRITE_TOKEN)
    return NextResponse.json(
      { error: "Penyimpanan file belum diaktifkan. Hubungi admin." },
      { status: 503 },
    );

  const form = await req.formData();
  const file = form.get("file");
  if (!(file instanceof File))
    return NextResponse.json(
      { error: "Belum ada file yang dipilih." },
      { status: 400 },
    );
  if (file.size > MAX_BYTES)
    return NextResponse.json(
      { error: "Ukuran maksimal 10 MB." },
      { status: 413 },
    );
  if (!ALLOWED.has(file.type))
    return NextResponse.json(
      { error: "Format harus JPG, PNG, atau WEBP." },
      { status: 400 },
    );

  const width = Math.max(1, Number(form.get("width")) || 1200);
  const height = Math.max(1, Number(form.get("height")) || 800);
  const alt =
    String(form.get("alt") ?? "")
      .trim()
      .slice(0, 200) || file.name.replace(/\.[a-z0-9]+$/i, "");
  const tags = String(form.get("tags") ?? "")
    .split(",")
    .map((t) => t.trim().toLowerCase())
    .filter(Boolean)
    .slice(0, 10);

  const ext = file.type.split("/")[1] ?? "jpg";
  const blob = await put(`media/${Date.now().toString(36)}.${ext}`, file, {
    access: "public",
    addRandomSuffix: true,
    contentType: file.type,
  });
  const asset = await createMedia({
    url: blob.url,
    width,
    height,
    type: "image",
    alt,
    tags,
    usedIn: [],
    uploaderId: me.id,
    aspect: aspectOf(width, height),
    averageColor: "#e5ecea",
  });
  return NextResponse.json({ media: asset }, { status: 201 });
}
