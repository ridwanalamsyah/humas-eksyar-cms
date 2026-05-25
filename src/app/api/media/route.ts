/**
 * Media library endpoints.
 *
 *   GET    /api/media         — list (optional ?tag, ?aspect, ?search)
 *   PATCH  /api/media/:id     — update alt / tags
 *   DELETE /api/media/:id     — delete (uploader or moderator only)
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { findMemberByEmail, listMedia } from "@/lib/data/provider";
import type { MediaAsset } from "@/lib/data/types";

export async function GET(req: NextRequest): Promise<NextResponse> {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const me = await findMemberByEmail(session.user.email);
  if (!me) return NextResponse.json({ media: [] });

  const sp = req.nextUrl.searchParams;
  const opts: {
    tag?: string;
    aspect?: MediaAsset["aspect"];
    search?: string;
  } = {};
  if (sp.has("tag")) opts.tag = sp.get("tag") as string;
  if (sp.has("aspect")) opts.aspect = sp.get("aspect") as MediaAsset["aspect"];
  if (sp.has("search")) opts.search = sp.get("search") as string;

  const media = await listMedia(opts);
  return NextResponse.json({ media });
}
