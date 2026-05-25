/**
 * GET /api/media/suggest?contentId=...
 *
 * Returns top-N media assets relevant to a content's title + rubric + caption.
 * Uses simple keyword/tag overlap scoring (no AI burn) — fast & deterministic.
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { listMedia, getContent } from "@/lib/data/provider";
import type { MediaAsset } from "@/lib/data/types";

// Indonesian + English stopwords kept short — these never carry meaning.
const STOPWORDS = new Set([
  "yang", "untuk", "dengan", "atau", "akan", "dari", "pada", "dan", "ini",
  "itu", "kita", "kami", "tidak", "bisa", "juga", "lebih", "agar", "supaya",
  "di", "ke", "the", "and", "for", "you", "with", "this", "that", "from",
]);

function extractTokens(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/#\w+/g, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((t) => t.length >= 3 && !STOPWORDS.has(t));
}

function scoreAsset(asset: MediaAsset, tokens: Set<string>): number {
  let score = 0;
  // Tag match weighs heavily.
  for (const tag of asset.tags) {
    if (tokens.has(tag.toLowerCase())) score += 5;
  }
  // Alt text match — lighter.
  const altTokens = extractTokens(asset.alt);
  for (const t of altTokens) {
    if (tokens.has(t)) score += 2;
  }
  // Recency bonus — fresher media slightly preferred for ties.
  const ageDays = Math.max(
    1,
    (Date.now() - new Date(asset.uploadedAt).getTime()) / (24 * 60 * 60 * 1000),
  );
  score += 1 / ageDays;
  return score;
}

export async function GET(req: NextRequest): Promise<NextResponse> {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const contentId = req.nextUrl.searchParams.get("contentId");
  const rawText = req.nextUrl.searchParams.get("text");
  if (!contentId && !rawText) {
    return NextResponse.json(
      { error: "contentId atau text wajib diisi" },
      { status: 400 },
    );
  }

  let queryText = rawText ?? "";
  if (contentId) {
    const content = await getContent(contentId);
    if (!content) {
      return NextResponse.json({ error: "Content not found" }, { status: 404 });
    }
    queryText = [content.title, content.rubric, content.caption, content.hashtags]
      .filter(Boolean)
      .join(" ");
  }

  const tokens = new Set(extractTokens(queryText));
  const allMedia = await listMedia();
  const ranked = allMedia
    .filter((m) => m.type === "image")
    .map((m) => ({ media: m, score: scoreAsset(m, tokens) }))
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 12);

  return NextResponse.json({
    suggestions: ranked.map((x) => x.media),
    matchedTokens: Array.from(tokens).slice(0, 12),
  });
}
