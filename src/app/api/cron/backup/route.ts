/** Cron mingguan: simpan cadangan data ke Vercel Blob (butuh BLOB_READ_WRITE_TOKEN). */
import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { setSiteSetting } from "@/lib/data/provider";
import { buildBackup } from "@/lib/site/backup";

export const maxDuration = 60;

export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!secret || req.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!process.env.BLOB_READ_WRITE_TOKEN)
    return NextResponse.json(
      { error: "BLOB_READ_WRITE_TOKEN belum diatur" },
      { status: 503 },
    );
  // Data formulir (email/nomor HP pengirim) tidak ikut: berkas Blob dapat diakses lewat URL-nya.
  const { formulir: _omit, ...data } = await buildBackup();
  void _omit;
  const blob = await put(
    `backups/cadangan-${data.dibuat.slice(0, 10)}.json`,
    JSON.stringify(data),
    {
      access: "public",
      contentType: "application/json",
      addRandomSuffix: true,
    },
  );
  await setSiteSetting("backup_last", { at: data.dibuat, url: blob.url });
  return NextResponse.json({ ok: true, url: blob.url });
}
