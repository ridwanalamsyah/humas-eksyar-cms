/**
 *   PATCH  /api/media/:id     — update alt / tags
 *   DELETE /api/media/:id     — delete (uploader or moderator only)
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import {
  findMemberByEmail,
  getMedia,
  updateMedia,
  deleteMedia,
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
  if (!me) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await params;
  const media = await getMedia(id);
  if (!media) return NextResponse.json({ error: "Not found" }, { status: 404 });

  // Anyone can update tags + alt for now; restrict more later if needed.
  const body = await req.json().catch(() => ({}));
  const patch: { alt?: string; tags?: string[] } = {};
  if (typeof body.alt === "string") patch.alt = body.alt;
  if (Array.isArray(body.tags)) {
    const raw: unknown[] = body.tags;
    patch.tags = raw
      .filter((t): t is string => typeof t === "string")
      .map((t) => t.trim().toLowerCase())
      .filter((t) => t.length > 0);
  }
  const updated = await updateMedia(id, patch);
  return NextResponse.json({ media: updated });
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const me = await findMemberByEmail(session.user.email);
  if (!me) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await params;
  const media = await getMedia(id);
  if (!media) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const canDelete =
    me.id === media.uploaderId ||
    me.role === "admin" ||
    me.role === "ketua_divisi";
  if (!canDelete) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  await deleteMedia(id);
  return NextResponse.json({ ok: true });
}
