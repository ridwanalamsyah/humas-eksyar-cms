/**
 * Pendaftar baru yang menunggu persetujuan admin.
 *   GET    /api/members/pending                 daftar pendaftar (admin)
 *   POST   /api/members/pending  {email, role, position?}   konfirmasi jadi anggota (admin)
 *   DELETE /api/members/pending?email=…         tolak pendaftar (admin)
 */
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import {
  confirmPendingMember,
  findMemberByEmail,
  listPendingMembers,
  removePendingMember,
} from "@/lib/data/provider";

const ROLES = new Set(["monitoring", "anggota", "pengurus", "ketua_divisi", "sekjen", "admin"]);

async function requireAdmin() {
  const session = await auth();
  if (!session?.user?.email) {
    return { error: NextResponse.json({ error: "Silakan masuk terlebih dahulu." }, { status: 401 }) };
  }
  const me = await findMemberByEmail(session.user.email);
  if (!me || me.role !== "admin") {
    return { error: NextResponse.json({ error: "Hanya admin yang bisa mengatur pendaftar." }, { status: 403 }) };
  }
  return { me };
}

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;
  return NextResponse.json({ pending: await listPendingMembers() });
}

export async function POST(req: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;
  const body = await req.json().catch(() => ({}));
  const email = String(body.email ?? "").trim().toLowerCase();
  if (!email) return NextResponse.json({ error: "Email pendaftar wajib diisi." }, { status: 400 });
  if (await findMemberByEmail(email)) {
    // Sudah jadi anggota (mis. dikonfirmasi dari tab lain): cukup hapus dari antrean.
    await removePendingMember(email);
    return NextResponse.json({ error: "Email ini sudah terdaftar sebagai anggota." }, { status: 409 });
  }
  const role = ROLES.has(body.role) ? body.role : "anggota";
  const position = String(body.position ?? "").trim() || undefined;
  try {
    const member = await confirmPendingMember(email, role, position);
    if (!member) return NextResponse.json({ error: "Pendaftar tidak ditemukan. Muat ulang halaman." }, { status: 404 });
    return NextResponse.json({ member }, { status: 201 });
  } catch (err) {
    console.error("[members/pending] konfirmasi gagal", err);
    return NextResponse.json({ error: "Gagal menyimpan anggota baru. Coba lagi." }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;
  const email = new URL(req.url).searchParams.get("email")?.trim();
  if (!email) return NextResponse.json({ error: "Email pendaftar wajib diisi." }, { status: 400 });
  await removePendingMember(email);
  return NextResponse.json({ ok: true });
}
