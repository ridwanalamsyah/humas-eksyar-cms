/**
 * POST /api/public/layanan — pengajuan layanan mahasiswa dari website prodi.
 *
 * Publik (tanpa login). Dilindungi validasi ketat, honeypot, dan pembatas
 * per IP. Mengembalikan kode tiket untuk cek status.
 */
import { NextRequest, NextResponse } from "next/server";
import { createServiceRequest, getServiceRequestByCode } from "@/lib/data/provider";
import type { ServiceRequest } from "@/lib/data/types";
import { htmlEmail, sendEmail } from "@/lib/email/send";
import { getSite } from "@/lib/site/get-site";
import { clientIp, escapeHtml, generateCode, newId, rateLimit, siteOrigin, submissionSchema } from "@/lib/site/layanan";

export async function POST(req: NextRequest) {
  if (!rateLimit(`submit:${clientIp(req.headers)}`, 5, 10 * 60 * 1000)) {
    return NextResponse.json({ error: "Terlalu banyak pengajuan. Coba lagi dalam 10 menit." }, { status: 429 });
  }

  const site = await getSite();
  const jenis = site.layananAdministrasi.map((l) => l.title);
  const parsed = submissionSchema(jenis).safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    const message = issue?.code === "invalid_type" ? "Lengkapi semua kolom yang wajib diisi." : (issue?.message ?? "Data tidak valid");
    return NextResponse.json({ error: message }, { status: 400 });
  }
  const input = parsed.data;

  let code = generateCode();
  for (let i = 0; i < 5 && (await getServiceRequestByCode(code)); i++) code = generateCode();

  const now = new Date().toISOString();
  const request: ServiceRequest = {
    id: newId(),
    code,
    type: input.type,
    name: input.name,
    nim: input.nim.toUpperCase(),
    email: input.email,
    phone: input.phone,
    purpose: input.purpose,
    details: input.details,
    attachmentUrl: input.attachmentUrl || null,
    status: "diajukan",
    adminNote: "",
    resultUrl: null,
    handledBy: null,
    history: [{ status: "diajukan", at: now }],
    createdAt: now,
    updatedAt: now,
  };
  await createServiceRequest(request);

  const origin = siteOrigin(req.nextUrl.origin);
  const statusUrl = `${origin}/prodi/layanan/status?kode=${code}`;
  // Email bersifat best-effort — kegagalan tidak membatalkan pengajuan.
  await Promise.all([
    sendEmail({
      to: request.email,
      subject: `Pengajuan ${request.type} diterima — ${code}`,
      text: `Halo ${request.name},\n\nPengajuan "${request.type}" sudah kami terima dengan kode ${code}.\nCek status: ${statusUrl}\n\nProgram Studi Ekonomi Syariah`,
      html: htmlEmail({
        heading: "Pengajuan diterima",
        body: `Halo ${escapeHtml(request.name)},<br/><br/>Pengajuan <b>${escapeHtml(request.type)}</b> sudah kami terima.<br/>Kode tiket: <b>${code}</b><br/><br/>Simpan kode ini untuk mengecek status menggunakan NIM kamu.`,
        ctaLabel: "Cek status",
        ctaHref: statusUrl,
        footer: "Program Studi Ekonomi Syariah · UIN Sunan Gunung Djati Bandung",
      }),
    }),
    sendEmail({
      to: site.kontak.email,
      subject: `[Layanan] ${request.type} — ${request.name} (${request.nim})`,
      text: `Pengajuan baru ${code}\nJenis: ${request.type}\nNama: ${request.name}\nNIM: ${request.nim}\nKeperluan: ${request.purpose}\n\nProses di CMS: ${origin}/layanan`,
    }),
  ]);

  return NextResponse.json({ code }, { status: 201 });
}
