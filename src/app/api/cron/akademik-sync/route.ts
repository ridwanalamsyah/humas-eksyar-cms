/** Cron mingguan: perbarui mata kuliah & dosen pengampu dari e-Knows. */
import { NextRequest, NextResponse } from "next/server";
import { syncAkademikFromEknows } from "@/lib/site/akademik-sync";

export const maxDuration = 60;

export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!secret || req.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Silakan masuk terlebih dahulu." }, { status: 401 });
  }
  try {
    const data = await syncAkademikFromEknows();
    return NextResponse.json({ mataKuliah: data.mataKuliah.length, dosen: data.dosen.length });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Sinkronisasi gagal" }, { status: 502 });
  }
}
