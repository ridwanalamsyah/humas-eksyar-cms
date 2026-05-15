/**
 *   GET    /api/members/:id
 *   PATCH  /api/members/:id   (self-edit any field except role/divisionId; admin can edit all)
 *   DELETE /api/members/:id   (admin only)
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import {
  getMember,
  updateMember,
  deleteMember,
  findMemberByEmail,
} from "@/lib/data/provider";

interface Params {
  params: Promise<{ id: string }>;
}

export async function GET(_req: NextRequest, { params }: Params) {
  const { id } = await params;
  const member = await getMember(id);
  if (!member) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ member });
}

export async function PATCH(req: NextRequest, { params }: Params) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const me = await findMemberByEmail(session.user.email);
  if (!me) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const { id } = await params;
  const isAdmin = me.role === "admin";
  const isSelf = me.id === id;
  if (!isAdmin && !isSelf) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const patch = await req.json().catch(() => ({}));
  // Non-admins can't change their own role / divisionId / xp.
  if (!isAdmin) {
    delete patch.role;
    delete patch.divisionId;
    delete patch.xp;
    delete patch.streak;
    delete patch.userId;
  }
  const member = await updateMember(id, patch);
  if (!member) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ member });
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const me = await findMemberByEmail(session.user.email);
  if (!me || me.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const { id } = await params;
  if (id === me.id) {
    return NextResponse.json({ error: "Cannot delete yourself" }, { status: 400 });
  }
  const ok = await deleteMember(id);
  if (!ok) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}
