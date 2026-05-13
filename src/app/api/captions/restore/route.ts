/**
 * POST /api/captions/restore
 *   body: { versionId }
 *   → set the content's caption back to the snapshotted version and
 *     record a new "restore" version entry for auditability.
 */

import { NextResponse } from "next/server";
import { restoreCaptionVersion } from "@/lib/data/provider";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface RestoreBody {
  versionId?: string;
}

export async function POST(req: Request) {
  let body: RestoreBody;
  try {
    body = (await req.json()) as RestoreBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  if (!body.versionId) {
    return NextResponse.json(
      { error: "versionId is required" },
      { status: 400 },
    );
  }
  try {
    const result = await restoreCaptionVersion(body.versionId);
    if (!result) {
      return NextResponse.json({ error: "Version not found" }, { status: 404 });
    }
    return NextResponse.json(result);
  } catch (err) {
    console.error("restoreCaptionVersion error", err);
    return NextResponse.json(
      { error: "Failed to restore version" },
      { status: 500 },
    );
  }
}
