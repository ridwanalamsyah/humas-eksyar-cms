/**
 * Cron mingguan: perbarui direktori skripsi dari Digilib UIN SGD.
 * Dipanggil Vercel cron dengan `Authorization: Bearer <CRON_SECRET>`.
 */
import { NextRequest, NextResponse } from "next/server";
import { syncSkripsiFromDigilib } from "@/lib/site/skripsi-sync";

export const maxDuration = 60;

export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!secret || req.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    return NextResponse.json(await syncSkripsiFromDigilib());
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Sinkronisasi gagal" },
      { status: 502 },
    );
  }
}
