/** GET /api/backup (admin) — unduh cadangan lengkap data website & CMS (JSON). */
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/site/admin-guard";
import { buildBackup } from "@/lib/site/backup";

export const maxDuration = 60;

export async function GET() {
  if (!(await requireAdmin()))
    return NextResponse.json(
      { error: "Anda tidak punya akses untuk tindakan ini." },
      { status: 403 },
    );
  const data = await buildBackup();
  return new NextResponse(JSON.stringify(data), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Content-Disposition": `attachment; filename="cadangan-eksyar-${data.dibuat.slice(0, 10)}.json"`,
    },
  });
}
