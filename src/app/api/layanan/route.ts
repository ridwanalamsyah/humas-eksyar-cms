/** GET /api/layanan — daftar pengajuan layanan (pengurus CMS). */
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { findMemberByEmail, listServiceRequests } from "@/lib/data/provider";
import { VIEWER_ROLES } from "@/lib/site/layanan";

export async function GET() {
  const session = await auth();
  if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const me = await findMemberByEmail(session.user.email);
  if (!me || !VIEWER_ROLES.includes(me.role)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  return NextResponse.json({ requests: await listServiceRequests() });
}
