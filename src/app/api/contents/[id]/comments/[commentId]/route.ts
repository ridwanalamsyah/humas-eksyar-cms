import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import {
  findMemberByEmail,
  updateContentComment,
  deleteContentComment,
} from "@/lib/data/provider";

interface Params {
  params: Promise<{ id: string; commentId: string }>;
}

export async function PATCH(req: NextRequest, { params }: Params) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Silakan masuk terlebih dahulu." }, { status: 401 });
  }
  const me = await findMemberByEmail(session.user.email);
  if (!me) return NextResponse.json({ error: "Anda tidak punya akses untuk tindakan ini." }, { status: 403 });
  const { commentId } = await params;
  const body = await req.json().catch(() => ({}));
  const patch: { body?: string; resolvedAt?: string | null } = {};
  if (typeof body.body === "string") patch.body = body.body.trim();
  if (body.resolved === true || body.resolve === true)
    patch.resolvedAt = new Date().toISOString();
  if (body.resolved === false || body.resolve === false) patch.resolvedAt = null;
  const comment = await updateContentComment(commentId, patch);
  if (!comment) {
    return NextResponse.json({ error: "Data tidak ditemukan." }, { status: 404 });
  }
  return NextResponse.json({ comment });
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Silakan masuk terlebih dahulu." }, { status: 401 });
  }
  const me = await findMemberByEmail(session.user.email);
  if (!me) return NextResponse.json({ error: "Anda tidak punya akses untuk tindakan ini." }, { status: 403 });
  const { commentId } = await params;
  const ok = await deleteContentComment(commentId);
  if (!ok) return NextResponse.json({ error: "Data tidak ditemukan." }, { status: 404 });
  return NextResponse.json({ ok: true });
}
