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
import { randomBytes, timingSafeEqual } from "node:crypto";
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

const isProd = process.env.NODE_ENV === "production";

/**
 * Kunci penanda tangan sesi. Repo ini publik, jadi kunci cadangan yang tertulis
 * di kode bisa dipakai siapa pun untuk memalsukan sesi admin. Di produksi tanpa
 * AUTH_SECRET dipakai kunci acak per proses: login tidak bisa dipalsukan (tapi
 * sesi tidak awet sampai AUTH_SECRET diisi), dan website publik tetap jalan.
 */
const authSecret =
  readEnv("AUTH_SECRET", "NEXTAUTH_SECRET") ??
  (isProd ? randomBytes(32).toString("hex") : "humas-eksyar-cms-local-dev-secret");
if (isProd && !readEnv("AUTH_SECRET", "NEXTAUTH_SECRET")) {
  console.error("[auth] AUTH_SECRET belum diisi di Vercel: sesi login tidak akan awet.");
}

/**
 * Kata sandi tim untuk login dengan email (CMS_LOGIN_PASSWORD). Tanpa nilai ini
 * di produksi, login email dimatikan dan hanya Google yang bisa dipakai.
 * Di komputer lokal (development) login email tetap bisa tanpa kata sandi.
 */
const teamPassword = readEnv("CMS_LOGIN_PASSWORD");
function passwordOk(given: unknown): boolean {
  if (!teamPassword) return !isProd;
  const a = Buffer.from(typeof given === "string" ? given : "");
  const b = Buffer.from(teamPassword);
  return a.length === b.length && timingSafeEqual(a, b);
}

const baseConfig: NextAuthConfig = {
  secret: authSecret,
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
        password: { label: "Kata sandi tim", type: "password" },
      },
      async authorize(credentials) {
        const rawEmail = (credentials?.email as string)?.trim().toLowerCase() || "";
        if (!rawEmail || !passwordOk(credentials?.password)) return null;

        // Pengurus Admin Utama (Ridwan)
        if (
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
        if (rawEmail.includes("1239220048")) {
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
