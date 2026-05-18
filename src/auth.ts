/**
 * Auth.js (NextAuth v5) configuration.
 *
 * Uses Google OAuth via the Drizzle adapter. Sessions are stored in the
 * Neon Postgres `sessions` table for parity with browser cookies.
 *
 * The config gracefully no-ops when `DATABASE_URL` is absent so local builds
 * and preview deploys without env vars still compile.
 */

import NextAuth, { type NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db, isDbEnabled } from "@/lib/db";
import { recordAuthError } from "@/lib/auth-debug";

/**
 * Read an OAuth credential. Accepts Auth.js v5 convention (`AUTH_GOOGLE_ID`)
 * and falls back to the older `GOOGLE_CLIENT_ID`. Treats placeholder values
 * (the literal string of any candidate name) as missing — guards against the
 * common mistake of pasting the variable name as its own value in Vercel.
 */
function readEnv(...names: string[]): string | undefined {
  for (const n of names) {
    const v = process.env[n];
    if (!v) continue;
    if (names.includes(v)) continue; // placeholder echo of the name itself
    return v;
  }
  return undefined;
}

const googleClientId = readEnv("AUTH_GOOGLE_ID", "GOOGLE_CLIENT_ID");
const googleClientSecret = readEnv("AUTH_GOOGLE_SECRET", "GOOGLE_CLIENT_SECRET");

if (process.env.NODE_ENV === "production" && (!googleClientId || !googleClientSecret)) {
  // Don't crash boot — Auth.js will still expose /api/auth/* with no provider.
  // Logged so it shows up in Vercel runtime logs for quick diagnosis.
  console.warn(
    "[auth] Google OAuth credentials missing — set AUTH_GOOGLE_ID and AUTH_GOOGLE_SECRET",
  );
}

const baseConfig: NextAuthConfig = {
  providers: [
    Google({
      clientId: googleClientId,
      clientSecret: googleClientSecret,
      allowDangerousEmailAccountLinking: true,
    }),
  ],
  pages: {
    signIn: "/login",
  },
  trustHost: true,
  debug: true,
  logger: {
    error(error) {
      recordAuthError(error);
      console.error("[auth][error]", error);
    },
    warn(code) {
      console.warn("[auth][warn]", code);
    },
  },
  callbacks: {
    async session({ session, user }) {
      if (session.user && user?.id) {
        session.user.id = user.id;
      }
      return session;
    },
  },
};

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...baseConfig,
  ...(isDbEnabled && db
    ? {
        adapter: DrizzleAdapter(db),
        session: { strategy: "database" },
      }
    : {
        session: { strategy: "jwt" },
      }),
});
