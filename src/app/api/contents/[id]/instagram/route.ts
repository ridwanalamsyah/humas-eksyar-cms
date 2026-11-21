/**
 * GET  /api/contents/:id/instagram → status posting Instagram konten ini
 * POST /api/contents/:id/instagram → posting (ulang) sekarang (pengurus ke atas)
 */
import { NextResponse } from "next/server";
import { getContent, listMedia } from "@/lib/data/provider";
import { requireEditor } from "@/lib/instagram/auth";
import { getIgPostStatuses, postContentToInstagram } from "@/lib/instagram/publish";

export const maxDuration = 60;

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: Request, { params }: Params) {
  if (!(await requireEditor())) return NextResponse.json({ error: "Silakan masuk terlebih dahulu." }, { status: 401 });
  const { id } = await params;
  return NextResponse.json({ status: (await getIgPostStatuses())[id] ?? null });
}

export async function POST(_req: Request, { params }: Params) {
  const me = await requireEditor();
  if (!me || me.role === "anggota") return NextResponse.json({ error: "Hanya tim Humas yang bisa memposting ke Instagram." }, { status: 403 });
  const { id } = await params;
  const content = await getContent(id);
  if (!content) return NextResponse.json({ error: "Konten tidak ditemukan." }, { status: 404 });
  if (content.status !== "published") return NextResponse.json({ error: "Terbitkan dulu kontennya, baru posting ke Instagram." }, { status: 400 });
  const status = await postContentToInstagram(content, await listMedia(), true);
  return NextResponse.json({ status }, { status: status.ok ? 200 : 502 });
}
