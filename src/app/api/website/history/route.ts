/**
 * GET  /api/website/history        (admin) — daftar versi tersimpan
 * POST /api/website/history {at}   (admin) — pulihkan versi tersebut
 */
import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { setWebsiteContent } from "@/lib/data/provider";
import { requireAdmin } from "@/lib/site/admin-guard";
import { mergeWebsiteConfig } from "@/lib/site/get-site";
import { getHistory, snapshotBeforeSave } from "@/lib/site/history";

export async function GET() {
  if (!(await requireAdmin()))
    return NextResponse.json(
      { error: "Anda tidak punya akses untuk tindakan ini." },
      { status: 403 },
    );
  return NextResponse.json(
    (await getHistory()).map(({ at, by }) => ({ at, by })),
  );
}

export async function POST(req: NextRequest) {
  if (!(await requireAdmin()))
    return NextResponse.json(
      { error: "Anda tidak punya akses untuk tindakan ini." },
      { status: 403 },
    );
  const { at } = ((await req.json().catch(() => ({}))) ?? {}) as {
    at?: string;
  };
  const entry = (await getHistory()).find((h) => h.at === at);
  if (!entry)
    return NextResponse.json(
      { error: "Versi tidak ditemukan" },
      { status: 404 },
    );
  const session = await auth();
  await snapshotBeforeSave(
    `${session?.user?.name ?? "admin"} (sebelum pemulihan)`,
  );
  await setWebsiteContent(mergeWebsiteConfig(entry.data));
  revalidatePath("/prodi", "layout");
  revalidatePath("/settings/website");
  return NextResponse.json({ ok: true });
}
