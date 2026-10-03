/**
 *   GET  /api/website   (admin only) — konten website prodi + data awal
 *   PUT  /api/website   (admin only) — simpan konten website prodi
 *
 * Konten divalidasi penuh dengan `websiteConfigSchema` (termasuk URL yang
 * aman). Setelah tersimpan, seluruh halaman /prodi di-revalidate sehingga
 * perubahan langsung tampil tanpa deploy ulang.
 */
import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { findMemberByEmail, setWebsiteContent } from "@/lib/data/provider";
import { defaultWebsiteConfig } from "@/lib/site/defaults";
import { getSite } from "@/lib/site/get-site";
import { websiteConfigSchema } from "@/lib/site/schema";
import { snapshotBeforeSave } from "@/lib/site/history";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Silakan masuk terlebih dahulu." }, { status: 401 });
  }
  const me = await findMemberByEmail(session.user.email);
  if (!me || me.role !== "admin") {
    return NextResponse.json({ error: "Anda tidak punya akses untuk tindakan ini." }, { status: 403 });
  }
  return null;
}

export async function GET() {
  const denied = await requireAdmin();
  if (denied) return denied;
  return NextResponse.json({ website: await getSite(), defaults: defaultWebsiteConfig });
}

export async function PUT(req: NextRequest) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const body = await req.json().catch(() => null);
  const parsed = websiteConfigSchema.safeParse(body?.website ?? body);
  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    return NextResponse.json(
      {
        error: `${issue?.path.join(" › ") || "Konten"}: ${issue?.message ?? "tidak valid"}`,
        issues: parsed.error.issues.slice(0, 20),
      },
      { status: 400 },
    );
  }

  const session = await auth();
  await snapshotBeforeSave(session?.user?.name ?? session?.user?.email ?? "admin");
  const saved = await setWebsiteContent(parsed.data);
  revalidatePath("/prodi", "layout");
  revalidatePath("/settings/website");
  return NextResponse.json({ website: saved });
}
