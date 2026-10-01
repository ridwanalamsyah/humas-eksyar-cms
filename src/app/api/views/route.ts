/**
 * POST /api/views { path } — hitung kunjungan halaman website prodi.
 * Hanya jumlah per halaman per hari; tidak menyimpan IP atau identitas.
 */
import { NextRequest, NextResponse } from "next/server";
import { recordPageView } from "@/lib/data/provider";

const BOT =
  /bot|crawl|spider|slurp|preview|facebookexternalhit|whatsapp|telegram|headless/i;
const seen = new Map<string, number>();

export async function POST(req: NextRequest) {
  const ua = req.headers.get("user-agent") ?? "";
  if (!ua || BOT.test(ua)) return NextResponse.json({ ok: true });
  const body = (await req.json().catch(() => null)) as {
    path?: unknown;
  } | null;
  const path =
    typeof body?.path === "string"
      ? body.path.split(/[?#]/)[0].slice(0, 200)
      : "";
  if (!/^\/(prodi(\/[\w./-]*)?)?$/.test(path))
    return NextResponse.json({ ok: true });
  // Abaikan muat ulang beruntun dari pengunjung yang sama (± per IP, 30 detik).
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
  const k = `${ip}|${path}`;
  const now = Date.now();
  if ((seen.get(k) ?? 0) > now - 30_000) return NextResponse.json({ ok: true });
  seen.set(k, now);
  if (seen.size > 5000) seen.clear();
  const day = new Date().toLocaleDateString("en-CA", {
    timeZone: "Asia/Jakarta",
  });
  await recordPageView(path === "/prodi" ? "/" : path, day).catch(() => {});
  return NextResponse.json({ ok: true });
}
