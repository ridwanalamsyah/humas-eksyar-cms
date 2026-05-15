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
} from "@/lib/data/provider";

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
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const me = await findMemberByEmail(session.user.email);
  if (!me || me.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const body = await req.json().catch(() => ({}));
  if (!body.name || !body.email || !body.divisionId || !body.angkatan || !body.nimSuffix) {
    return NextResponse.json(
      { error: "name, email, divisionId, angkatan, nimSuffix are required" },
      { status: 400 },
    );
  }
  const member = await createMember({
    name: String(body.name),
    email: String(body.email),
    role: body.role,
    divisionId: String(body.divisionId),
    position: body.position,
    bio: body.bio,
    angkatan: Number(body.angkatan),
    nimSuffix: String(body.nimSuffix),
    avatarEmoji: body.avatarEmoji,
    accentHue: body.accentHue,
  });
  return NextResponse.json({ member }, { status: 201 });
}
