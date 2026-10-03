/**
 * POST /api/upload/image   (admin only)
 *
 * Upload gambar untuk website prodi (foto dosen, prestasi, kegiatan, hero)
 * ke Vercel Blob dan mengembalikan URL publik. Butuh `BLOB_READ_WRITE_TOKEN`.
 */
import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { auth } from "@/auth";
import { findMemberByEmail } from "@/lib/data/provider";

const MAX_BYTES = 5 * 1024 * 1024; // 5MB
const ALLOWED = new Set(["image/jpeg", "image/png", "image/webp"]);

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Silakan masuk terlebih dahulu." }, { status: 401 });
  }
  const me = await findMemberByEmail(session.user.email);
  if (!me || me.role !== "admin") {
    return NextResponse.json({ error: "Anda tidak punya akses untuk tindakan ini." }, { status: 403 });
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
    return NextResponse.json({ error: "Ukuran maksimal 5MB." }, { status: 413 });
  }
  const type = file.type || "image/jpeg";
  if (!ALLOWED.has(type)) {
    return NextResponse.json({ error: "Format harus JPG, PNG, atau WEBP." }, { status: 400 });
  }
  const ext = type.split("/")[1] ?? "jpg";
  const blob = await put(`website/${Date.now().toString(36)}.${ext}`, file, {
    access: "public",
    addRandomSuffix: true,
    contentType: type,
  });
  return NextResponse.json({ url: blob.url });
}
