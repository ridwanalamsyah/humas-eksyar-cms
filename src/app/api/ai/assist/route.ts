/**
 * POST /api/ai/assist — AI Bantu untuk editor CMS.
 *   { action: "perbaiki"|"ringkas"|"formal"|"santai"|"perluas", text, field? } → { text }
 *   { action: "kegiatan", caption } → { kegiatan }
 * Hanya anggota CMS (bukan role monitoring). Dibatasi per pengguna.
 */
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { findMemberByEmail } from "@/lib/data/provider";
import { AssistUnavailableError, assistText, kegiatanFromCaption } from "@/lib/ai/assist";

export const runtime = "nodejs";

const bodySchema = z.discriminatedUnion("action", [
  z.object({
    action: z.enum(["perbaiki", "ringkas", "formal", "santai", "perluas"]),
    text: z.string().trim().min(3, "Teks terlalu pendek").max(4000),
    field: z.string().max(80).optional(),
  }),
  z.object({ action: z.literal("kegiatan"), caption: z.string().trim().min(10, "Caption terlalu pendek").max(5000) }),
]);

function allow(key: string) {
  const g = globalThis as { __aiHits?: Map<string, number[]> };
  const map = (g.__aiHits ??= new Map<string, number[]>());
  const now = Date.now();
  const hits = (map.get(key) ?? []).filter((t) => now - t < 60_000);
  if (hits.length >= 15) return false;
  map.set(key, [...hits, now]);
  return true;
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const me = await findMemberByEmail(session.user.email);
  if (!me || me.role === "monitoring") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  if (!allow(me.id)) return NextResponse.json({ error: "Terlalu banyak permintaan. Tunggu sebentar." }, { status: 429 });

  const parsed = bodySchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Data tidak valid" }, { status: 400 });
  }

  try {
    const body = parsed.data;
    if (body.action === "kegiatan") {
      const today = new Date().toISOString().slice(0, 10);
      return NextResponse.json({ kegiatan: await kegiatanFromCaption(body.caption, today) });
    }
    return NextResponse.json({ text: await assistText(body.action, body.text, body.field) });
  } catch (err) {
    if (err instanceof AssistUnavailableError) return NextResponse.json({ error: err.message }, { status: 503 });
    console.error("[ai/assist]", err);
    return NextResponse.json({ error: "AI tidak dapat memproses saat ini. Coba lagi." }, { status: 502 });
  }
}
