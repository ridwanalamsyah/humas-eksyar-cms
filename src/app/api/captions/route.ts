/**
 * POST /api/captions
 *
 * Generate AI caption (or fallback to mock if no Gemini key).
 * Next.js 16 Route Handler convention: export named HTTP method handlers
 * that accept a Request and return a Response.
 */

import { NextResponse } from "next/server";
import { generateCaption, type CaptionRequest } from "@/lib/ai/captions";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  let body: Partial<CaptionRequest>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!body.title || !body.style || !body.rubric) {
    return NextResponse.json(
      { error: "Missing required fields: title, style, rubric" },
      { status: 400 },
    );
  }

  try {
    const result = await generateCaption({
      title: body.title,
      details: body.details ?? "",
      divisionName: body.divisionName ?? "Humas Eksyar",
      rubric: body.rubric,
      style: body.style,
      variants: body.variants ?? 2,
      includeHook: body.includeHook ?? false,
      extraHashtags: body.extraHashtags,
    });
    return NextResponse.json(result);
  } catch (err) {
    console.error("AI caption error", err);
    return NextResponse.json(
      { error: "AI tidak dapat memproses saat ini." },
      { status: 500 },
    );
  }
}
