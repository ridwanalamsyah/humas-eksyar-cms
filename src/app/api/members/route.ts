/**
 *   GET  /api/members
 *   POST /api/members         (admin only)
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import {
  listMembers,
  createMember,
  findMemberByEmail,
  listDivisions,
} from "@/lib/data/provider";

const ALLOWED_ROLES = new Set([
  "monitoring",
  "anggota",
  "pengurus",
  "ketua_divisi",
  "sekjen",
  "admin",
]);

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const divisionId = url.searchParams.get("divisionId") ?? undefined;
  const search = url.searchParams.get("q") ?? undefined;
  const members = await listMembers({ divisionId, search });
  return NextResponse.json({ members });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Silakan masuk terlebih dahulu." }, { status: 401 });
  }
  const me = await findMemberByEmail(session.user.email);
  if (!me || me.role !== "admin") {
    return NextResponse.json({ error: "Anda tidak punya akses untuk tindakan ini." }, { status: 403 });
  }
  const body = await req.json().catch(() => ({}));
  const name = String(body.name ?? "").trim();
  const email = String(body.email ?? "").trim().toLowerCase();
  if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json(
      { error: "Nama dan email yang valid wajib diisi." },
      { status: 400 },
    );
  }
  if (await findMemberByEmail(email)) {
    return NextResponse.json(
      { error: "Email ini sudah terdaftar sebagai anggota." },
      { status: 409 },
    );
  }
  const role = ALLOWED_ROLES.has(body.role) ? body.role : "anggota";
  const divisionId =
    body.divisionId ? String(body.divisionId) : (await listDivisions())[0]?.id;
  if (!divisionId) {
    return NextResponse.json({ error: "Divisi belum ada." }, { status: 400 });
  }
  const angkatan = Number(body.angkatan) || new Date().getFullYear();
  const nim = String(body.nim ?? body.nimSuffix ?? "").replace(/\D/g, "");
  const member = await createMember({
    name,
    email,
    role,
    divisionId,
    position: String(body.position ?? "").trim() || "Anggota Humas",
    bio: body.bio,
    angkatan,
    nimSuffix: nim.slice(-4) || "0000",
    avatarEmoji: body.avatarEmoji,
    accentHue: body.accentHue,
  });
  return NextResponse.json({ member }, { status: 201 });
}
