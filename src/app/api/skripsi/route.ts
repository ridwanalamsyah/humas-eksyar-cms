/** PUT /api/skripsi (admin) — simpan direktori judul skripsi. */
import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { findMemberByEmail, setSiteSetting } from "@/lib/data/provider";
import { SKRIPSI_KEY, skripsiListSchema } from "@/lib/site/skripsi";

export async function PUT(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const me = await findMemberByEmail(session.user.email);
  if (!me || me.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await req.json().catch(() => null);
  const parsed = skripsiListSchema.safeParse(body?.items);
  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    return NextResponse.json({ error: `Baris ${Number(issue?.path[0] ?? 0) + 1}: ${issue?.message}` }, { status: 400 });
  }
  const items = parsed.data.sort((a, b) => b.tahun - a.tahun);
  await setSiteSetting(SKRIPSI_KEY, items);
  revalidatePath("/prodi/skripsi");
  revalidatePath("/settings/skripsi");
  return NextResponse.json({ count: items.length });
}
