/**
 * Content collection endpoints.
 *
 *   GET  /api/contents         → list contents (optional filters)
 *   POST /api/contents         → create a content draft (auth required)
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import {
  listContents,
  createContent,
  findMemberByEmail,
} from "@/lib/data/provider";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const status = url.searchParams.get("status") ?? undefined;
  const divisionId = url.searchParams.get("divisionId") ?? undefined;
  const search = url.searchParams.get("q") ?? undefined;
  const contents = await listContents({
    status: status ? [status as never] : undefined,
    divisionId,
    search,
  });
  return NextResponse.json({ contents });
}

export async function POST(req: NextRequest) {
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
  const body = await req.json().catch(() => ({}));
  if (!body.title || !body.rubric) {
    return NextResponse.json(
      { error: "title and rubric are required" },
      { status: 400 },
    );
  }
  const content = await createContent({
    title: String(body.title),
    rubric: body.rubric,
    status: body.status ?? "draft",
    divisionId: body.divisionId ?? member.divisionId,
    authorId: member.id,
    body: body.body,
    caption: body.caption,
    hashtags: body.hashtags,
    channels: body.channels,
    mediaIds: body.mediaIds,
    scheduledFor: body.scheduledFor ?? null,
    captionStyle: body.captionStyle ?? null,
  });
  return NextResponse.json({ content }, { status: 201 });
}
