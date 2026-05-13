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

const baseConfig: NextAuthConfig = {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
  ],
  pages: {
    signIn: "/login",
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
