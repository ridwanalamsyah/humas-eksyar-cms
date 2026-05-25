/**
 * Editable `eksyar.bio` configuration.
 *
 * - GET: publicly readable so the `/bio` page (and external Linktree-style
 *   embeds) can hydrate without auth.
 * - PUT: admin-only. Replaces the whole config.
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import {
  getBioConfig,
  setBioConfig,
  findMemberByEmail,
} from "@/lib/data/provider";
import type { BioConfig } from "@/lib/fixtures/bio";

export async function GET() {
  const config = await getBioConfig();
  return NextResponse.json({ config });
}

export async function PUT(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const me = await findMemberByEmail(session.user.email);
  if (!me || me.role !== "admin") {
    return NextResponse.json({ error: "Admin only" }, { status: 403 });
  }

  const body = (await req.json().catch(() => null)) as Partial<BioConfig> | null;
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const current = await getBioConfig();
  const next: BioConfig = {
    ...current,
    ...body,
    links: Array.isArray(body.links) ? body.links : current.links,
    magazineIssues: Array.isArray(body.magazineIssues)
      ? body.magazineIssues
      : current.magazineIssues,
  };

  if (!next.name || !next.tagline) {
    return NextResponse.json(
      { error: "name and tagline are required" },
      { status: 400 },
    );
  }

  const saved = await setBioConfig(next);
  return NextResponse.json({ config: saved });
}
