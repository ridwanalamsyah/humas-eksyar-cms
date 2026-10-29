/**
 * POST /api/upload/image   (admin only)
 *
 * Upload gambar untuk website prodi (foto dosen, prestasi, kegiatan, hero)
 * ke Vercel Blob dan mengembalikan URL publik. Memverifikasi magic bytes
 * (header biner JPG/PNG/WEBP) demi keamanan konten.
 */
import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { auth } from "@/auth";
import { findMemberByEmail } from "@/lib/data/provider";

const MAX_BYTES = 5 * 1024 * 1024; // 5MB
const ALLOWED = new Set(["image/jpeg", "image/png", "image/webp"]);

function hasValidImageMagicBytes(buf: Uint8Array): boolean {
  if (buf.length < 12) return false;
  // JPEG: FF D8 FF
  if (buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return true;
  // PNG: 89 50 4E 47 0D 0A 1A 0A
  if (
    buf[0] === 0x89 &&
    buf[1] === 0x50 &&
    buf[2] === 0x4e &&
    buf[3] === 0x47
  )
    return true;
  // WEBP: "RIFF" .... "WEBP"
  if (
    buf[0] === 0x52 &&
    buf[1] === 0x49 &&
    buf[2] === 0x46 &&
    buf[3] === 0x46 &&
    buf[8] === 0x57 &&
    buf[9] === 0x45 &&
    buf[10] === 0x42 &&
    buf[11] === 0x50
  )
    return true;
  return false;
}

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json(
      { error: "Silakan masuk terlebih dahulu." },
      { status: 401 },
    );
  }
  const me = await findMemberByEmail(session.user.email);
  if (!me || me.role !== "admin") {
    return NextResponse.json(
      { error: "Anda tidak punya akses untuk tindakan ini." },
      { status: 403 },
    );
  }
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json(
      {
        error:
          "Vercel Blob belum di-setup. Tambahkan BLOB_READ_WRITE_TOKEN di env (Vercel project → Storage → Connect Blob), atau tempel URL gambar secara manual.",
      },
      { status: 503 },
    );
  }

  const form = await req.formData();
  const file = form.get("file");
  if (!(file instanceof Blob)) {
    return NextResponse.json({ error: "Tidak ada file" }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json(
      { error: "Ukuran maksimal 5MB." },
      { status: 413 },
    );
  }
  const type = file.type || "image/jpeg";
  if (!ALLOWED.has(type)) {
    return NextResponse.json(
      { error: "Format harus JPG, PNG, atau WEBP." },
      { status: 400 },
    );
  }
  const headerBytes = new Uint8Array(await file.slice(0, 16).arrayBuffer());
  if (!hasValidImageMagicBytes(headerBytes)) {
    return NextResponse.json(
      { error: "Isi file bukan gambar JPG, PNG, atau WEBP yang valid." },
      { status: 400 },
    );
  }
  const ext = type.split("/")[1] ?? "jpg";
  const blob = await put(`website/${Date.now().toString(36)}.${ext}`, file, {
    access: "public",
    addRandomSuffix: true,
    contentType: type,
  });
  return NextResponse.json({ url: blob.url });
}
