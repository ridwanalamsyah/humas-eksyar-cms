/** POST /api/instagram/sync (admin) — jadikan draft semua postingan IG yang baru. */
import { NextResponse } from "next/server";
import { syncInstagram } from "@/lib/instagram/import";
import { requireEditor } from "@/lib/instagram/auth";

export const maxDuration = 60;

export async function POST() {
  const me = await requireEditor();
  if (!me || me.role !== "admin")
    return NextResponse.json(
      { error: "Anda tidak punya akses untuk tindakan ini." },
      { status: 403 },
    );
  try {
    return NextResponse.json(await syncInstagram());
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Sinkronisasi gagal" },
      { status: 502 },
    );
  }
}
