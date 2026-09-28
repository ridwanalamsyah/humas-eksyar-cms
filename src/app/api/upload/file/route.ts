/**
 * POST /api/upload/file   (pengurus/admin)
 *
 * Upload dokumen (PDF, Word, Excel, gambar) ke Vercel Blob — untuk surat
 * hasil layanan dan halaman Unduhan website prodi. Maks 10MB.
 */
import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { auth } from "@/auth";
import { findMemberByEmail } from "@/lib/data/provider";
import { PROCESSOR_ROLES } from "@/lib/site/layanan";

const MAX_BYTES = 10 * 1024 * 1024;
const ALLOWED: Record<string, string> = {
  "application/pdf": "pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "docx",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "xlsx",
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const me = await findMemberByEmail(session.user.email);
  if (!me || !PROCESSOR_ROLES.includes(me.role)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json(
      { error: "Vercel Blob belum di-setup (BLOB_READ_WRITE_TOKEN). Tempel tautan dokumen secara manual." },
      { status: 503 },
    );
  }

  const form = await req.formData();
  const file = form.get("file");
  if (!(file instanceof Blob)) return NextResponse.json({ error: "Tidak ada file" }, { status: 400 });
  if (file.size > MAX_BYTES) return NextResponse.json({ error: "Ukuran maksimal 10MB." }, { status: 413 });
  const ext = ALLOWED[file.type];
  if (!ext) return NextResponse.json({ error: "Format harus PDF, DOCX, XLSX, JPG, PNG, atau WEBP." }, { status: 400 });

  const blob = await put(`dokumen/${Date.now().toString(36)}.${ext}`, file, {
    access: "public",
    addRandomSuffix: true,
    contentType: file.type,
  });
  return NextResponse.json({ url: blob.url });
}
