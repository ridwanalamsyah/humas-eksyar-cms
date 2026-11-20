"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, Loader2 } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { EksyarLogo } from "@/components/brand/eksyar-logo";

const EASE_OPUS: [number, number, number, number] = [0.16, 1, 0.3, 1];

function GoogleMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden focusable="false">
      <path
        d="M21.35 11.1H12v2.9h5.35c-.25 1.4-1.66 4.1-5.35 4.1-3.22 0-5.85-2.66-5.85-5.94 0-3.27 2.63-5.94 5.85-5.94 1.83 0 3.05.78 3.75 1.45l2.55-2.45C16.95 3.79 14.7 2.9 12 2.9 6.94 2.9 2.9 6.94 2.9 12s4.04 9.1 9.1 9.1c5.26 0 8.74-3.7 8.74-8.9 0-.6-.07-1.05-.16-1.5z"
        fill="#4285F4"
      />
      <path
        d="M12 21.4c2.7 0 4.96-.89 6.62-2.42l-3.23-2.51c-.9.6-2.04.96-3.39.96-2.6 0-4.81-1.76-5.6-4.12H3.07v2.59C4.74 18.98 8.1 21.4 12 21.4z"
        fill="#34A853"
      />
      <path
        d="M6.4 13.31c-.2-.6-.31-1.24-.31-1.91s.11-1.31.31-1.91V6.9H3.07C2.41 8.21 2.04 9.68 2.04 11.4s.37 3.19 1.03 4.5l3.33-2.59z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.47 0 2.79.5 3.82 1.49l2.87-2.87C16.96 2.42 14.7 1.4 12 1.4 8.1 1.4 4.74 3.82 3.07 6.9l3.33 2.59c.79-2.36 3-4.11 5.6-4.11z"
        fill="#EA4335"
      />
    </svg>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-dvh flex items-center justify-center bg-white" />}>
      <LoginInner />
    </Suspense>
  );
}

function LoginInner() {
  const [busy, setBusy] = useState(false);
  const [emailInput, setEmailInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const params = useSearchParams();
  // Auth.js mengembalikan ?error=CredentialsSignin saat email/kata sandi tidak cocok.
  const [error, setError] = useState<string | null>(
    params.get("error") === "CredentialsSignin" ? "Email atau kata sandi tim salah." : null,
  );
  const callbackUrl = params.get("callbackUrl") || "/dashboard";
  const reduce = useReducedMotion();

  const handleGoogle = async () => {
    setBusy(true);
    setError(null);
    try {
      await signIn("google", { redirectTo: callbackUrl });
    } catch {
      setBusy(false);
      setError("Gagal menghubungkan ke Google SSO. Pastikan koneksi internet stabil.");
    }
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim() || !passwordInput) return;
    setBusy(true);
    setError(null);
    try {
      await signIn("credentials", {
        email: emailInput.trim(),
        password: passwordInput,
        redirectTo: callbackUrl,
      });
    } catch {
      setBusy(false);
      setError("Login gagal. Periksa email dan kata sandi tim, lalu coba lagi.");
    }
  };

  return (
    <main className="relative flex min-h-dvh items-center justify-center bg-[#F4F6F5] px-5 py-12 text-[#14201a]">
      {/* Cahaya lembut di belakang kartu, tanpa foto */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 50% at 50% 0%, rgba(25,122,111,0.14), transparent 70%), radial-gradient(40% 40% at 100% 100%, rgba(238,178,95,0.10), transparent 70%)",
        }}
      />

      <motion.div
        initial={reduce ? false : { opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: EASE_OPUS }}
        className="relative w-full max-w-[400px]"
      >
        <div className="rounded-[24px] bg-white px-6 py-8 shadow-[0_1px_2px_rgba(20,32,26,0.06),0_24px_48px_-24px_rgba(20,32,26,0.25)] sm:px-8 sm:py-10">
          <div className="flex items-center justify-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/prodi/logo-eksyar.png" alt="Ekonomi Syariah" className="size-12 rounded-full" />
            <span aria-hidden className="h-8 w-px bg-[#14201a]/10" />
            <EksyarLogo size={44} />
          </div>
          <h1 className="mt-5 text-center text-[24px] font-extrabold tracking-[-0.02em]">Humas Eksyar</h1>

          <AnimatePresence mode="wait">
            {error && (
              <motion.p
                key="login-error"
                role="alert"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3, ease: EASE_OPUS }}
                className="mt-4 overflow-hidden rounded-xl bg-red-50 px-4 py-3 text-center text-[14px] font-medium text-red-700"
              >
                {error}
              </motion.p>
            )}
          </AnimatePresence>

          <button
            type="button"
            onClick={handleGoogle}
            disabled={busy}
            className="mt-7 flex h-12 w-full items-center justify-center gap-3 rounded-xl border border-[#14201a]/12 bg-white text-[15px] font-semibold transition-colors hover:bg-[#f4f6f5] disabled:opacity-50"
          >
            <GoogleMark className="size-5" />
            Masuk dengan Google
          </button>

          <div className="my-6 flex items-center gap-3 text-[13px] text-[#758a80]">
            <span className="h-px flex-1 bg-[#14201a]/10" />
            atau
            <span className="h-px flex-1 bg-[#14201a]/10" />
          </div>

          <form onSubmit={handleEmailSubmit} className="space-y-3">
            <input
              type="email"
              required
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              placeholder="Email"
              aria-label="Email"
              disabled={busy}
              autoComplete="email"
              className="h-12 w-full rounded-xl border border-[#14201a]/12 bg-[#f9faf9] px-4 text-[15px] outline-none transition placeholder:text-[#758a80] focus:border-[#197a6f] focus:bg-white focus:ring-3 focus:ring-[#197a6f]/15"
            />
            <input
              type="password"
              required
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              placeholder="Kata sandi tim"
              aria-label="Kata sandi tim"
              autoComplete="current-password"
              disabled={busy}
              className="h-12 w-full rounded-xl border border-[#14201a]/12 bg-[#f9faf9] px-4 text-[15px] outline-none transition placeholder:text-[#758a80] focus:border-[#197a6f] focus:bg-white focus:ring-3 focus:ring-[#197a6f]/15"
            />
            <button
              type="submit"
              disabled={busy || !emailInput.trim() || !passwordInput}
              className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#197a6f] text-[15px] font-semibold text-white transition-colors hover:bg-[#14635a] disabled:opacity-45"
            >
              {busy ? <Loader2 className="size-4 animate-spin" /> : "Masuk"}
            </button>
          </form>
        </div>

        <Link
          href="/"
          className="mx-auto mt-6 flex min-h-11 w-fit items-center gap-1.5 text-[14px] font-medium text-[#4a5c54] hover:text-[#14201a]"
        >
          <ArrowLeft className="size-4" /> Kembali ke website
        </Link>
      </motion.div>
    </main>
  );
}
