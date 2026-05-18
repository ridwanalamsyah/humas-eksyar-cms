/**
 * Next.js 16 Proxy (formerly Middleware) — login gate.
 *
 * Forces every route through `/login` when the user is not authenticated,
 * except a small allowlist of public surfaces:
 *
 *   - `/login` itself
 *   - `/bio` (public Linktree-style page)
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
  "/api/auth",
  "/api/holidays",
  "/manifest",
  "/sw",
  "/icon-",
];

function isPublic(pathname: string, method: string): boolean {
  if (pathname === "/") return false; // home is private
  for (const prefix of PUBLIC_PREFIXES) {
    if (pathname === prefix || pathname.startsWith(prefix + "/")) return true;
  }
  // /api/bio is public on GET only — writes go through admin check inside the route.
  if (pathname === "/api/bio" && method === "GET") return true;
  return false;
}

export default auth((req) => {
  const { nextUrl, method } = req;
  const isLoggedIn = !!req.auth;
  const path = nextUrl.pathname;

  if (isPublic(path, method)) return;
  if (isLoggedIn) return;

  // Send the user to /login with a callbackUrl so they bounce back after sign-in.
  const url = new URL("/login", nextUrl);
  if (path !== "/") {
    url.searchParams.set("callbackUrl", path + nextUrl.search);
  }
  return NextResponse.redirect(url);
});

export const config = {
  // Run on every route except Next.js internals and static assets.
  matcher: [
    "/((?!_next/static|_next/image|_next/data|favicon\\.ico|.*\\.(?:png|jpg|jpeg|gif|svg|webp|ico|woff2?|ttf|otf|css|js|map)$).*)",
  ],
};
