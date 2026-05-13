/**
 * GET  /api/captions/versions?contentId=cnt-xxx
 *   → list version snapshots for a content (newest first)
 *
 * POST /api/captions/versions
 *   body: { contentId, caption, hashtags?, captionStyle?, source?, note?, authorId? }
 *   → snapshot the current caption as a new version
 */

import { NextResponse } from "next/server";
import {
  createCaptionVersion,
  listCaptionVersions,
} from "@/lib/data/provider";
import type { CaptionVersionSource } from "@/lib/data/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const contentId = url.searchParams.get("contentId");
  if (!contentId) {
    return NextResponse.json(
      { error: "contentId is required" },
      { status: 400 },
    );
  }
  try {
    const versions = await listCaptionVersions(contentId);
    return NextResponse.json({ versions });
  } catch (err) {
    console.error("listCaptionVersions error", err);
    return NextResponse.json(
      { error: "Failed to list versions" },
      { status: 500 },
    );
  }
}

interface CreateBody {
  contentId?: string;
  caption?: string;
  hashtags?: string;
  captionStyle?: string | null;
  source?: CaptionVersionSource;
  note?: string;
  authorId?: string | null;
}

export async function POST(req: Request) {
  let body: CreateBody;
  try {
    body = (await req.json()) as CreateBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  if (!body.contentId || typeof body.caption !== "string") {
    return NextResponse.json(
      { error: "contentId and caption are required" },
      { status: 400 },
    );
  }
  try {
    const version = await createCaptionVersion({
      contentId: body.contentId,
      caption: body.caption,
      hashtags: body.hashtags,
      captionStyle: body.captionStyle ?? null,
      source: body.source,
      note: body.note,
      authorId: body.authorId ?? null,
    });
    return NextResponse.json({ version }, { status: 201 });
  } catch (err) {
    console.error("createCaptionVersion error", err);
    return NextResponse.json(
      { error: "Failed to create version" },
      { status: 500 },
    );
  }
}
