/**
 * Single content endpoints.
 *
 *   GET    /api/contents/:id
 *   PATCH  /api/contents/:id   (auth required)
 *   DELETE /api/contents/:id   (auth required)
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import {
  getContent,
  updateContent,
  deleteContent,
  findMemberByEmail,
  createCaptionVersion,
} from "@/lib/data/provider";

interface Params {
  params: Promise<{ id: string }>;
}

export async function GET(_req: NextRequest, { params }: Params) {
  const { id } = await params;
  const content = await getContent(id);
  if (!content) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ content });
}

export async function PATCH(req: NextRequest, { params }: Params) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const member = await findMemberByEmail(session.user.email);
  if (!member) {
    return NextResponse.json(
      { error: "No member record linked to this Google account" },
      { status: 403 },
    );
  }
  // Monitoring roles (pembina) are view-only — cannot edit content.
  if (member.role === "monitoring") {
    return NextResponse.json(
      { error: "Akun pembina hanya untuk monitoring, tidak bisa edit konten." },
      { status: 403 },
    );
  }
  const { id } = await params;
  const prev = await getContent(id);
  if (!prev) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  const patch = await req.json().catch(() => ({}));
  const content = await updateContent(id, patch);
  if (!content) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  // If caption changed, snapshot the previous one for rollback.
  if (
    patch.caption !== undefined &&
    prev.caption !== content.caption
  ) {
    await createCaptionVersion({
      contentId: id,
      caption: prev.caption,
      hashtags: prev.hashtags,
      captionStyle: prev.captionStyle ?? null,
      source: "manual",
      note: `Edit by ${member.name}`,
      authorId: member.id,
    });
  }
  return NextResponse.json({ content });
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const member = await findMemberByEmail(session.user.email);
  if (!member) {
    return NextResponse.json(
      { error: "No member record linked to this Google account" },
      { status: 403 },
    );
  }
  // Only admin or coordinator can delete.
  if (member.role !== "admin" && member.role !== "ketua_divisi") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const { id } = await params;
  const ok = await deleteContent(id);
  if (!ok) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}
