/**
 *   GET  /api/rubrics
 *   POST /api/rubrics    (admin only)
 */
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import {
  findMemberByEmail,
  listRubrics,
  createRubric,
} from "@/lib/data/provider";

export async function GET(req: NextRequest) {
  const includeInactive =
    new URL(req.url).searchParams.get("includeInactive") === "1";
  const rubrics = await listRubrics({ includeInactive });
  return NextResponse.json({ rubrics });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const me = await findMemberByEmail(session.user.email);
  if (!me || me.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const body = await req.json().catch(() => ({}));
  if (!body.slug || !body.label) {
    return NextResponse.json(
      { error: "slug & label wajib diisi" },
      { status: 400 },
    );
  }
  const slug = String(body.slug)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
  if (!slug) {
    return NextResponse.json(
      { error: "slug tidak valid" },
      { status: 400 },
    );
  }
  const rubric = await createRubric({
    slug,
    label: String(body.label),
    description: body.description ? String(body.description) : "",
    emoji: body.emoji ? String(body.emoji) : null,
    sortOrder: Number.isFinite(body.sortOrder) ? Number(body.sortOrder) : undefined,
    isActive: body.isActive === false ? false : true,
  });
  return NextResponse.json({ rubric }, { status: 201 });
}
