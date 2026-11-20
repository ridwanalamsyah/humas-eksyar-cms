import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { findMemberByEmail } from "@/lib/data/provider";
import type { Event, Member } from "@/lib/data/types";

const CATEGORIES = new Set<Event["category"]>([
  "kajian", "rapat", "kegiatan_publik", "kompetisi", "pelatihan", "agenda_internal", "perayaan",
]);

/** Pengurus ke atas boleh mengelola jadwal; penulis buletin dan pembina tidak. */
export async function requireScheduler(): Promise<{ me: Member } | { error: NextResponse }> {
  const session = await auth();
  if (!session?.user?.email) {
    return { error: NextResponse.json({ error: "Silakan masuk terlebih dahulu." }, { status: 401 }) };
  }
  const me = await findMemberByEmail(session.user.email);
  if (!me || me.role === "anggota" || me.role === "monitoring" || me.role === "pending") {
    return { error: NextResponse.json({ error: "Anda tidak punya akses untuk mengatur jadwal." }, { status: 403 }) };
  }
  return { me };
}

/** Bersihkan isian formulir jadwal. `partial` untuk ubah sebagian. */
export function parseEventBody(body: Record<string, unknown>, partial = false) {
  const out: Partial<Pick<Event, "title" | "description" | "location" | "isOnline" | "startsAt" | "endsAt" | "category">> = {};
  const str = (v: unknown, max: number) => String(v ?? "").trim().slice(0, max);
  if (!partial || body.title !== undefined) out.title = str(body.title, 160);
  if (!partial || body.description !== undefined) out.description = str(body.description, 2000);
  if (!partial || body.location !== undefined) out.location = str(body.location, 200);
  if (!partial || body.isOnline !== undefined) out.isOnline = Boolean(body.isOnline);
  if (!partial || body.category !== undefined) {
    const c = String(body.category ?? "kegiatan_publik") as Event["category"];
    out.category = CATEGORIES.has(c) ? c : "kegiatan_publik";
  }
  for (const k of ["startsAt", "endsAt"] as const) {
    if (!partial || body[k] !== undefined) {
      const d = new Date(String(body[k] ?? ""));
      if (Number.isNaN(d.getTime())) return { error: "Tanggal dan jam wajib diisi dengan benar." };
      out[k] = d.toISOString();
    }
  }
  if (!partial && !out.title) return { error: "Nama kegiatan wajib diisi." };
  if (!partial && !out.location) return { error: "Tempat atau tautan wajib diisi." };
  if (out.startsAt && out.endsAt && out.endsAt < out.startsAt) return { error: "Jam selesai tidak boleh sebelum jam mulai." };
  return { data: out };
}
