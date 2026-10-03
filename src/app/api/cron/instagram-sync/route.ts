/** Cron harian: postingan Instagram baru → draft artikel berita untuk direview Humas. */
import { NextRequest, NextResponse } from "next/server";
import { syncInstagram } from "@/lib/instagram/import";

export const maxDuration = 60;

export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!secret || req.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json(
      { error: "Silakan masuk terlebih dahulu." },
      { status: 401 },
    );
  }
  try {
    return NextResponse.json(await syncInstagram());
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Sinkronisasi gagal" },
      { status: 502 },
    );
  }
}
