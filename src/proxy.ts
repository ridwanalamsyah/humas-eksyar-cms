/**
 * Next.js 16 Proxy (formerly Middleware) — login gate.
 *
 * Forces every route through `/login` when the user is not authenticated,
 * except a small allowlist of public surfaces:
 *
 *   - `/login` itself
 *   - `/bio` (public Linktree-style page)
 *   - `/` → website publik prodi (di-rewrite ke `/prodi`); CMS ada di `/dashboard`
 *   - `/prodi` (public program-study website + berita)
 *   - `/api/auth/*` (NextAuth handlers + health probe)
 *   - `/api/bio` GET only (public read of bio config)
 *   - `/api/holidays` (public read of calendar)
 *   - `/manifest.webmanifest`, `/sw.js`, static favicon/icons
 *
 * Note: Proxy defaults to the Node.js runtime in Next.js 16, so the database
 * session adapter from Auth.js works here without any special handling.
 */

import { auth } from "@/auth";
import { NextResponse } from "next/server";

const PUBLIC_PREFIXES = [
  "/login",
  "/bio",
  "/prodi",
  "/api/auth",
  "/api/holidays",
  // Endpoint cron memverifikasi CRON_SECRET / sesi admin sendiri.
  "/api/cron",
  // Formulir publik & penghitung kunjungan website.
  "/api/formulir",
  "/api/views",
  "/verifikasi",
  "/link",
  "/manifest",
  "/sw",
  "/icon-",
];

function isPublic(pathname: string, method: string): boolean {
  for (const prefix of PUBLIC_PREFIXES) {
    if (pathname === prefix || pathname.startsWith(prefix + "/")) return true;
  }
  // /api/bio is public on GET only — writes go through admin check inside the route.
  if (pathname === "/api/bio" && method === "GET") return true;
  return false;
}

/** Tautan pendek publik, mis. untuk bio Instagram jurusan. */
const SHORT_LINKS: Record<string, string> = {
  "/skripsi": "/prodi/skripsi",
  "/beasiswa": "/prodi/beasiswa",
  "/unduhan": "/prodi/unduhan",
  "/agenda": "/prodi/agenda",
  "/cms": "/dashboard",
  "/link": "/prodi/link",
  "/verifikasi": "/prodi/verifikasi",
  "/kamus": "/prodi/kamus",
  "/zakat": "/prodi/alat/zakat",
  "/formulir": "/prodi/formulir",
};

export default auth((req) => {
  const { nextUrl, method } = req;
  const isLoggedIn = !!req.auth;
  const path = nextUrl.pathname;

  // Domain utama langsung membuka website prodi; alamat /prodi dirapikan ke /.
  if (path === "/") return NextResponse.rewrite(new URL("/prodi" + nextUrl.search, nextUrl));
  if (path === "/prodi") return NextResponse.redirect(new URL("/" + nextUrl.search, nextUrl), 308);
  // /verifikasi/KODE (dari QR sertifikat) dan formulir cek kode.
  if (path === "/verifikasi/cek") {
    const kode = (nextUrl.searchParams.get("kode") ?? "").trim().toUpperCase().replace(/[^A-Z0-9-]/g, "");
    return NextResponse.redirect(new URL(`/prodi/verifikasi/${kode || ""}`, nextUrl));
  }
  if (path.startsWith("/verifikasi/")) return NextResponse.rewrite(new URL(`/prodi${path}`, nextUrl));
  const short = SHORT_LINKS[path.replace(/\/$/, "")];
  if (short) return NextResponse.redirect(new URL(short + nextUrl.search, nextUrl), 308);

  if (isPublic(path, method)) return;
  if (isLoggedIn) return;

  // Send the user to /login with a callbackUrl so they bounce back after sign-in.
  const url = new URL("/login", nextUrl);
  url.searchParams.set("callbackUrl", path + nextUrl.search);
  return NextResponse.redirect(url);
});

export const config = {
  // Run on every route except Next.js internals and static assets.
  matcher: [
    "/((?!_next/static|_next/image|_next/data|favicon\\.ico|.*\\.(?:png|jpg|jpeg|gif|svg|webp|ico|woff2?|ttf|otf|css|js|map)$).*)",
  ],
};
