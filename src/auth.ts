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
import Credentials from "next-auth/providers/credentials";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db, isDbEnabled, schema } from "@/lib/db";
import { recordAuthError } from "@/lib/auth-debug";
import { members } from "@/lib/fixtures/members";

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
  secret:
    readEnv("AUTH_SECRET", "NEXTAUTH_SECRET") ??
    "humas-eksyar-cms-preview-secret-uinsgd-2026",
  session: { strategy: "jwt" },
  providers: [
    Google({
      clientId: googleClientId ?? "preview-google-client-id",
      clientSecret: googleClientSecret ?? "preview-google-client-secret",
      allowDangerousEmailAccountLinking: true,
    }),
    Credentials({
      id: "credentials",
      name: "Akun Email / Roster",
      credentials: {
        email: { label: "Email", type: "email" },
        role: { label: "Role", type: "text" },
      },
      async authorize(credentials) {
        const rawEmail = (credentials?.email as string)?.trim().toLowerCase() || "";
        const role = (credentials?.role as string)?.trim() || "";
        if (!rawEmail && !role) return null;

        // Pengurus Admin Utama (Ridwan)
        if (
          role === "admin" ||
          rawEmail.includes("1239220061") ||
          rawEmail === "admin@eksyar.ac.id" ||
          rawEmail === "humaseksyaruinbdg@gmail.com" ||
          rawEmail === "ridwanalamsyah122@gmail.com"
        ) {
          const m = members.find((x) => x.id === "mbr-ridwan") ?? members[0];
          return {
            id: m.id,
            name: m.name,
            email: "1239220061@student.uinsgd.ac.id",
            image: null,
          };
        }

        // Penulis Berita (Alya)
        if (role === "anggota" || role === "mahasiswa" || rawEmail.includes("1239220048")) {
          const m = members.find((x) => x.id === "mbr-alya") ?? members[1];
          return {
            id: m.id,
            name: m.name,
            email: "1239220048@student.uinsgd.ac.id",
            image: null,
          };
        }

        // Cek kecocokan roster berdasarkan email
        const matched = members.find((x) => x.email.toLowerCase() === rawEmail);
        if (matched) {
          return {
            id: matched.id,
            name: matched.name,
            email: matched.email,
            image: null,
          };
        }

        // Pengguna baru (menunggu konfirmasi admin)
        return {
          id: "pending-" + (rawEmail ? rawEmail.replace(/[^a-z0-9]/g, "-") : "user"),
          name: rawEmail ? rawEmail.split("@")[0].replace(/[\._]/g, " ") : "Pengguna Baru",
          email: rawEmail,
          image: null,
        };
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  trustHost: true,
  debug: false,
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
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.picture = user.image;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        if (token?.id) session.user.id = token.id as string;
        if (token?.email) session.user.email = token.email as string;
        if (token?.name) session.user.name = token.name as string;
        if (token?.picture) session.user.image = token.picture as string;
      }
      return session;
    },
  },
};

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...baseConfig,
  ...(isDbEnabled && db
    ? {
        adapter: DrizzleAdapter(db, {
          usersTable: schema.users,
          accountsTable: schema.accounts,
          sessionsTable: schema.sessions,
          verificationTokensTable: schema.verificationTokens,
        }),
      }
    : {}),
});
