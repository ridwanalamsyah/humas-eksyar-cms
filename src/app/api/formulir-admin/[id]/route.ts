/**
 * PATCH  /api/formulir-admin/[id]  (admin) — ubah status, catatan/jawaban, publikasi
 * DELETE /api/formulir-admin/[id]  (admin) — hapus isian
 * POST   /api/formulir-admin/[id]  (admin) — terapkan ke website (prestasi, profil dosen)
 */
import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { z } from "@/lib/zod";
import {
  deleteSubmission,
  getEvent,
  listSubmissions,
  setWebsiteContent,
  updateSubmission,
} from "@/lib/data/provider";
import { requireAdmin } from "@/lib/site/admin-guard";
import { getSite } from "@/lib/site/get-site";
import { normName } from "@/lib/site/names";
import { websiteConfigSchema } from "@/lib/site/schema";

type Ctx = { params: Promise<{ id: string }> };

const patchSchema = z.object({
  status: z.enum(["baru", "diproses", "selesai", "ditolak"]).optional(),
  note: z.string().max(5000).optional(),
  published: z.boolean().optional(),
});

function refresh() {
  revalidatePath("/prodi", "layout");
  revalidatePath("/settings/formulir");
}

export async function PATCH(req: NextRequest, { params }: Ctx) {
  if (!(await requireAdmin()))
    return NextResponse.json(
      { error: "Anda tidak punya akses untuk tindakan ini." },
      { status: 403 },
    );
  const parsed = patchSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success)
    return NextResponse.json({ error: "Data tidak valid" }, { status: 400 });
  const row = await updateSubmission((await params).id, parsed.data);
  if (!row)
    return NextResponse.json({ error: "Tidak ditemukan" }, { status: 404 });
  refresh();
  return NextResponse.json(row);
}

export async function DELETE(_req: NextRequest, { params }: Ctx) {
  if (!(await requireAdmin()))
    return NextResponse.json(
      { error: "Anda tidak punya akses untuk tindakan ini." },
      { status: 403 },
    );
  await deleteSubmission((await params).id);
  refresh();
  return NextResponse.json({ ok: true });
}

export async function POST(_req: NextRequest, { params }: Ctx) {
  if (!(await requireAdmin()))
    return NextResponse.json(
      { error: "Anda tidak punya akses untuk tindakan ini." },
      { status: 403 },
    );
  const id = (await params).id;
  const sub = (await listSubmissions({ limit: 5000 })).find((s) => s.id === id);
  if (!sub)
    return NextResponse.json({ error: "Tidak ditemukan" }, { status: 404 });
  const site = structuredClone(await getSite());
  const d = sub.data as Record<string, string>;
  let message = "";

  if (sub.type === "prestasi") {
    site.prestasi.unshift({
      name: d.nama,
      achievement: `${d.prestasi} (${d.tingkat})`,
      group: d.kategori || "Mahasiswa",
      photo: null,
    });
    message = "Prestasi ditambahkan ke website.";
  } else if (sub.type === "profil-dosen") {
    const key = normName(d.nama);
    const keahlian = (d.keahlian ?? "")
      .split(",")
      .map((k) => k.trim())
      .filter(Boolean)
      .slice(0, 8);
    const list = site.pimpinan.some((p) => normName(p.name) === key)
      ? site.pimpinan
      : site.dosen;
    const existing = list.find((p) => normName(p.name) === key);
    const photo = /^https:\/\//.test(d.foto ?? "") ? d.foto : undefined;
    const extra = {
      ...(d.pendidikan ? { pendidikan: d.pendidikan } : {}),
      ...(d.sinta ? { sinta: d.sinta } : {}),
      ...(d.scholar ? { scholar: d.scholar } : {}),
      ...(d.konsultasi ? { konsultasi: d.konsultasi } : {}),
      ...(d.email ? { email: d.email } : {}),
    };
    if (existing) {
      existing.name = d.nama;
      if (d.jabatan) existing.role = d.jabatan;
      if (keahlian.length) existing.expertise = keahlian;
      if (photo) existing.photo = photo;
      Object.assign(existing, extra);
    } else {
      site.dosen.push({
        name: d.nama,
        role: d.jabatan || "Dosen",
        photo: photo ?? null,
        expertise: keahlian,
        ...extra,
      });
    }
    message = existing ? "Profil dosen diperbarui." : "Dosen baru ditambahkan.";
  } else if (sub.type === "acara") {
    const event = sub.refId ? await getEvent(sub.refId) : null;
    if (!event)
      return NextResponse.json(
        { error: "Acara tidak ditemukan" },
        { status: 404 },
      );
    const kode = `EKSYAR-${event.startsAt.slice(2, 4)}${event.startsAt.slice(5, 7)}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;
    site.sertifikat.unshift({
      kode,
      nama: d.nama,
      kegiatan: event.title,
      peran: "Peserta",
      tanggal: event.startsAt.slice(0, 10),
    });
    message = `Sertifikat dibuat: ${kode}. Cek di /prodi/verifikasi/${kode}`;
  } else {
    return NextResponse.json(
      { error: "Jenis isian ini tidak bisa diterapkan otomatis." },
      { status: 400 },
    );
  }

  const valid = websiteConfigSchema.safeParse(site);
  if (!valid.success)
    return NextResponse.json(
      { error: valid.error.issues[0]?.message ?? "Data tidak valid" },
      { status: 400 },
    );
  await setWebsiteContent(valid.data);
  await updateSubmission(id, { status: "selesai" });
  refresh();
  revalidatePath("/settings/website");
  return NextResponse.json({ ok: true, message });
}
