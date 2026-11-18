/** /api/instagram/pilihan (editor) — daftar unggahan Instagram pilihan untuk beranda. */
import { NextResponse } from "next/server";
import { requireEditor } from "@/lib/instagram/auth";
import { cleanPilihan, getInstagramPilihan, setInstagramPilihan } from "@/lib/instagram/pilihan";

export async function GET() {
  if (!(await requireEditor())) return NextResponse.json({ error: "Silakan masuk." }, { status: 403 });
  return NextResponse.json({ items: await getInstagramPilihan() });
}

export async function PUT(req: Request) {
  if (!(await requireEditor())) return NextResponse.json({ error: "Silakan masuk." }, { status: 403 });
  const body = (await req.json().catch(() => ({}))) as { items?: unknown };
  const items = cleanPilihan(body.items);
  await setInstagramPilihan(items);
  return NextResponse.json({ items });
}
