/**
 *   PATCH  /api/rubrics/:id   (admin only)
 *   DELETE /api/rubrics/:id   (admin only)
 */
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import {
  findMemberByEmail,
  updateRubric,
  deleteRubric,
} from "@/lib/data/provider";

interface Params {
  params: Promise<{ id: string }>;
}

export async function PATCH(req: NextRequest, { params }: Params) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const me = await findMemberByEmail(session.user.email);
  if (!me || me.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const { id } = await params;
  const body = await req.json().catch(() => ({}));
  const patch = {
    label: typeof body.label === "string" ? body.label : undefined,
    description: typeof body.description === "string" ? body.description : undefined,
    emoji: body.emoji === null || typeof body.emoji === "string" ? body.emoji : undefined,
    sortOrder: Number.isFinite(body.sortOrder) ? Number(body.sortOrder) : undefined,
    isActive: typeof body.isActive === "boolean" ? body.isActive : undefined,
  };
  const rubric = await updateRubric(id, patch);
  if (!rubric) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ rubric });
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
  const ok = await deleteRubric(id);
  if (!ok) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}
