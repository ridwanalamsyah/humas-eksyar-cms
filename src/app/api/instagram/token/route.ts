/**
 * /api/instagram/token (admin)
 * GET  → status sambungan Instagram (akun yang tersambung, tanpa membuka token).
 * POST → simpan token baru setelah dicek langsung ke Instagram API.
 *
 * Token disimpan di siteSettings "instagram_token"; getToken() di graph.ts
 * membacanya lebih dulu dan memperpanjangnya otomatis setiap 7 hari.
 */
import { NextResponse } from "next/server";
import { getSiteSetting, setSiteSetting } from "@/lib/data/provider";
import { requireEditor } from "@/lib/instagram/auth";

const API = "https://graph.instagram.com";

async function admin() {
  const me = await requireEditor();
  return me && me.role === "admin" ? me : null;
}

async function whoAmI(token: string): Promise<string | null> {
  const res = await fetch(`${API}/me?fields=username&access_token=${encodeURIComponent(token)}`, {
    cache: "no-store",
  });
  if (!res.ok) return null;
  const j = (await res.json()) as { username?: string };
  return j.username ?? null;
}

export async function GET() {
  if (!(await admin())) return NextResponse.json({ error: "Khusus admin." }, { status: 403 });
  const stored = (await getSiteSetting("instagram_token").catch(() => null)) as
    | { token?: string; refreshedAt?: string }
    | null;
  const token = stored?.token || process.env.INSTAGRAM_ACCESS_TOKEN;
  if (!token) return NextResponse.json({ connected: false });
  const username = await whoAmI(token).catch(() => null);
  return NextResponse.json({
    connected: Boolean(username),
    username,
    refreshedAt: stored?.refreshedAt ?? null,
    error: username ? undefined : "Token tersimpan tapi ditolak Instagram. Sambungkan ulang.",
  });
}

export async function POST(req: Request) {
  if (!(await admin())) return NextResponse.json({ error: "Khusus admin." }, { status: 403 });
  const body = (await req.json().catch(() => ({}))) as { token?: unknown };
  const token = typeof body.token === "string" ? body.token.trim() : "";
  if (token.length < 20 || /\s/.test(token))
    return NextResponse.json({ error: "Token tidak valid. Salin ulang token dari Meta." }, { status: 400 });
  const username = await whoAmI(token).catch(() => null);
  if (!username)
    return NextResponse.json(
      { error: "Instagram menolak token ini. Pastikan token dibuat untuk akun profesional @eksyaruinsgd." },
      { status: 400 },
    );
  await setSiteSetting("instagram_token", { token, refreshedAt: new Date().toISOString() });
  return NextResponse.json({ connected: true, username });
}
