import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import {
  findMemberByEmail,
  getContentDraft,
  saveContentDraft,
  clearContentDraft,
} from "@/lib/data/provider";

interface Params {
  params: Promise<{ id: string }>;
}

export async function GET(_req: NextRequest, { params }: Params) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const draft = await getContentDraft(id);
  return NextResponse.json({ draft });
}

export async function PUT(req: NextRequest, { params }: Params) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const me = await findMemberByEmail(session.user.email);
  if (!me) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  if (me.role === "monitoring") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const { id } = await params;
  const body = await req.json().catch(() => ({}));
  const draft = await saveContentDraft({
    contentId: id,
    body: String(body.body ?? ""),
    caption: String(body.caption ?? ""),
    hashtags: String(body.hashtags ?? ""),
    authorId: me.id,
  });
  return NextResponse.json({ draft });
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  await clearContentDraft(id);
  return NextResponse.json({ ok: true });
}
