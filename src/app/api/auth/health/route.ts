/**
 * Returns whether auth is configured correctly, without exposing secrets.
 *
 * Useful to diagnose "can't login" issues in production:
 *   curl https://<host>/api/auth/health
 */

import { NextResponse } from "next/server";
import { readAuthErrors } from "@/lib/auth-debug";

function present(...names: string[]): boolean {
  for (const n of names) {
    const v = process.env[n];
    if (!v) continue;
    if (names.includes(v)) continue; // placeholder echo of the name itself
    return true;
  }
  return false;
}

export async function GET() {
  return NextResponse.json({
    AUTH_SECRET: present("AUTH_SECRET", "NEXTAUTH_SECRET"),
    AUTH_URL: process.env.AUTH_URL ?? process.env.NEXTAUTH_URL ?? null,
    GOOGLE_CLIENT_ID: present("AUTH_GOOGLE_ID", "GOOGLE_CLIENT_ID"),
    GOOGLE_CLIENT_SECRET: present("AUTH_GOOGLE_SECRET", "GOOGLE_CLIENT_SECRET"),
    DATABASE_URL: present("DATABASE_URL"),
    NODE_ENV: process.env.NODE_ENV,
    VERCEL_ENV: process.env.VERCEL_ENV ?? null,
    VERCEL_URL: process.env.VERCEL_URL ?? null,
    VERCEL_PROJECT_PRODUCTION_URL:
      process.env.VERCEL_PROJECT_PRODUCTION_URL ?? null,
    recentErrors: readAuthErrors(),
  });
}
