/**
 * POST /api/public/layanan/status — cek status pengajuan.
 *
 * Butuh kode tiket + NIM yang cocok. Hanya mengembalikan informasi status,
 * tanpa data pribadi pemohon.
 */
import { NextRequest, NextResponse } from "next/server";
import { getServiceRequestByCode } from "@/lib/data/provider";
import { clientIp, rateLimit, statusQuerySchema } from "@/lib/site/layanan";

export async function POST(req: NextRequest) {
  if (!rateLimit(`status:${clientIp(req.headers)}`, 20, 10 * 60 * 1000)) {
    return NextResponse.json({ error: "Terlalu banyak percobaan. Coba lagi nanti." }, { status: 429 });
  }
  const parsed = statusQuerySchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    const message = issue?.code === "invalid_type" ? "Lengkapi semua kolom yang wajib diisi." : (issue?.message ?? "Data tidak valid");
    return NextResponse.json({ error: message }, { status: 400 });
  }
  const { code, nim } = parsed.data;
  const found = await getServiceRequestByCode(code);
  // Pesan sama untuk kode salah & NIM salah agar tidak bisa ditebak.
  if (!found || found.nim.toUpperCase() !== nim.toUpperCase()) {
    return NextResponse.json({ error: "Pengajuan tidak ditemukan. Periksa kode tiket dan NIM." }, { status: 404 });
  }
  return NextResponse.json({
    request: {
      code: found.code,
      type: found.type,
      status: found.status,
      adminNote: found.adminNote,
      resultUrl: found.resultUrl,
      history: found.history,
      createdAt: found.createdAt,
      updatedAt: found.updatedAt,
    },
  });
}
