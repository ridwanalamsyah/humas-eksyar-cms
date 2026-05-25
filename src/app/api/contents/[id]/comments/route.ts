import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import {
  listContentComments,
  createContentComment,
  findMemberByEmail,
  getMember,
} from "@/lib/data/provider";
import type { Member } from "@/lib/data/types";

interface Params {
  params: Promise<{ id: string }>;
}

export async function GET(_req: NextRequest, { params }: Params) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const comments = await listContentComments(id);
  // Inline author info so the client can render avatars without extra calls.
  const authorIds = Array.from(new Set(comments.map((c) => c.authorId)));
  const authors = await Promise.all(authorIds.map((aid) => getMember(aid)));
  const byId = new Map<string, Member>();
  for (const a of authors) if (a) byId.set(a.id, a);
  const enriched = comments.map((c) => {
    const a = byId.get(c.authorId);
    return {
      ...c,
      author: a
        ? {
            id: a.id,
            name: a.name,
            initials: a.initials,
            avatarEmoji: a.avatarEmoji,
            accentHue: a.accentHue,
            avatarUrl: a.avatarUrl ?? null,
          }
        : null,
    };
  });
  return NextResponse.json({ comments: enriched });
}

export async function POST(req: NextRequest, { params }: Params) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const me = await findMemberByEmail(session.user.email);
  if (!me) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  if (me.role === "monitoring") {
    return NextResponse.json(
      { error: "Role monitoring tidak boleh berkomentar." },
      { status: 403 },
    );
  }
  const { id } = await params;
  const body = await req.json().catch(() => ({}));
  if (!body.body || typeof body.body !== "string" || !body.body.trim()) {
    return NextResponse.json({ error: "Body wajib diisi" }, { status: 400 });
  }
  const comment = await createContentComment({
    contentId: id,
    authorId: me.id,
    body: body.body.trim(),
  });
  return NextResponse.json({ comment }, { status: 201 });
}
