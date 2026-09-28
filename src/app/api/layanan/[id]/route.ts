/**
 * PATCH /api/layanan/:id — ubah status/catatan/dokumen hasil pengajuan.
 * Pemohon dikabari lewat email saat status berubah.
 */
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { findMemberByEmail, getServiceRequest, updateServiceRequest } from "@/lib/data/provider";
import { htmlEmail, sendEmail } from "@/lib/email/send";
import { PROCESSOR_ROLES, STATUS_LABEL, escapeHtml, siteOrigin } from "@/lib/site/layanan";

const patchSchema = z.object({
  status: z.enum(["diajukan", "diproses", "selesai", "ditolak"]).optional(),
  adminNote: z.string().trim().max(2000).optional(),
  resultUrl: z
    .string()
    .trim()
    .max(2000)
    .refine((v) => v === "" || /^https:\/\/[^\s]+$/i.test(v), "Tautan dokumen harus https://")
    .optional(),
});

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const me = await findMemberByEmail(session.user.email);
  if (!me || !PROCESSOR_ROLES.includes(me.role)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await params;
  const current = await getServiceRequest(id);
  if (!current) return NextResponse.json({ error: "Tidak ditemukan" }, { status: 404 });

  const parsed = patchSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Data tidak valid" }, { status: 400 });
  const body = parsed.data;

  const now = new Date().toISOString();
  const statusChanged = body.status !== undefined && body.status !== current.status;
  const updated = await updateServiceRequest(id, {
    ...(body.status ? { status: body.status } : {}),
    ...(body.adminNote !== undefined ? { adminNote: body.adminNote } : {}),
    ...(body.resultUrl !== undefined ? { resultUrl: body.resultUrl || null } : {}),
    handledBy: me.id,
    history: statusChanged ? [...current.history, { status: body.status!, at: now, note: body.adminNote || undefined }] : current.history,
    updatedAt: now,
  });

  if (statusChanged && updated) {
    const statusUrl = `${siteOrigin(req.nextUrl.origin)}/prodi/layanan/status?kode=${updated.code}`;
    const label = STATUS_LABEL[updated.status];
    await sendEmail({
      to: updated.email,
      subject: `Status ${updated.code}: ${label}`,
      text: `Halo ${updated.name},\n\nStatus pengajuan "${updated.type}" (${updated.code}) kini: ${label}.${updated.adminNote ? `\nCatatan: ${updated.adminNote}` : ""}\nCek: ${statusUrl}`,
      html: htmlEmail({
        heading: `Status: ${label}`,
        body: `Halo ${escapeHtml(updated.name)},<br/><br/>Status pengajuan <b>${escapeHtml(updated.type)}</b> (${updated.code}) kini <b>${label}</b>.${
          updated.adminNote ? `<br/><br/>Catatan: ${escapeHtml(updated.adminNote)}` : ""
        }`,
        ctaLabel: "Lihat detail",
        ctaHref: statusUrl,
        footer: "Program Studi Ekonomi Syariah · UIN Sunan Gunung Djati Bandung",
      }),
    });
  }

  return NextResponse.json({ request: updated });
}
