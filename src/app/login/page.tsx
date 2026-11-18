"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, ArrowRight, Loader2, Mail } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ThemeToggle } from "@/components/ui/theme-toggle";
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
    <Suspense fallback={<div className="min-h-dvh flex items-center justify-center bg-[#FAF9F5] dark:bg-[#0B171C]" />}>
      <LoginInner />
    </Suspense>
  );
}

function LoginInner() {
  const [busy, setBusy] = useState(false);
  const [emailInput, setEmailInput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const params = useSearchParams();
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
    if (!emailInput.trim()) return;
    setBusy(true);
    setError(null);
    try {
      await signIn("credentials", {
        email: emailInput.trim(),
        redirectTo: callbackUrl,
      });
    } catch {
      setBusy(false);
      setError("Kendala saat memproses login. Silakan periksa format email Anda.");
    }
  };

  return (
    <main className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden bg-[#FAF9F5] px-4 py-12 text-[#1E221E] dark:bg-[#0B171C] dark:text-white">
      {/* Ambient Background Glow Orbs */}
      <motion.div
        aria-hidden="true"
        animate={
          reduce
            ? undefined
            : {
                scale: [1, 1.1, 1],
                opacity: [0.18, 0.3, 0.18],
              }
        }
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="pointer-events-none absolute -top-32 left-1/2 -z-10 h-[440px] w-[440px] -translate-x-1/2 rounded-full bg-[#237A74] blur-[130px] dark:opacity-15"
      />
      <motion.div
        aria-hidden="true"
        animate={
          reduce
            ? undefined
            : {
                scale: [1, 1.12, 1],
                opacity: [0.12, 0.22, 0.12],
              }
        }
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="pointer-events-none absolute -bottom-36 left-1/2 -z-10 h-[380px] w-[380px] -translate-x-1/2 rounded-full bg-[#EEB25F] blur-[130px] dark:opacity-10"
      />

      {/* Top right theme toggle */}
      <motion.div
        initial={reduce ? false : { opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: EASE_OPUS }}
        className="absolute right-4 top-4 sm:right-8 sm:top-6"
      >
        <ThemeToggle />
      </motion.div>

      <div className="w-full max-w-[420px]">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 22, scale: 0.97, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
          transition={{ duration: 0.55, ease: EASE_OPUS }}
          className="rounded-2xl border border-neutral-200/80 bg-white/95 p-7 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.07)] backdrop-blur-md dark:border-white/10 dark:bg-[#121F25]/95 dark:shadow-[0_24px_60px_-15px_rgba(0,0,0,0.45)] sm:p-9"
        >
          {/* Brand Header */}
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: EASE_OPUS, delay: 0.08 }}
            className="flex flex-col items-center text-center"
          >
            <motion.div
              whileHover={reduce ? undefined : { scale: 1.06, rotate: -3 }}
              transition={{ type: "spring", stiffness: 400, damping: 22 }}
            >
              <EksyarLogo size={52} />
            </motion.div>
            <h1 className="mt-4 font-jakarta text-[22px] font-extrabold tracking-tight text-[#1E221E] dark:text-white">
              Portal Humas
            </h1>
            <p className="mt-1 text-[13px] text-neutral-500 dark:text-neutral-400">
              CMS Humas Jurusan Ekonomi Syariah FEBI UIN SGD
            </p>
          </motion.div>

          <AnimatePresence mode="wait">
            {error && (
              <motion.div
                key="login-error"
                initial={{ opacity: 0, y: -6, height: 0 }}
                animate={{ opacity: 1, y: 0, height: "auto", x: [0, -5, 5, -3, 3, 0] }}
                exit={{ opacity: 0, y: -6, height: 0 }}
                transition={{ duration: 0.35, ease: EASE_OPUS }}
                className="mt-5 overflow-hidden rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-center text-[12.5px] font-medium text-red-600 dark:text-red-400"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Opsi Google SSO Utama */}
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: EASE_OPUS, delay: 0.15 }}
            className="mt-7"
          >
            <motion.button
              type="button"
              onClick={handleGoogle}
              disabled={busy}
              whileHover={reduce ? undefined : { y: -1.5, scale: 1.008 }}
              whileTap={reduce ? undefined : { scale: 0.985 }}
              transition={{ type: "spring", stiffness: 420, damping: 28 }}
              className="flex h-11 w-full items-center justify-center gap-3 rounded-xl border border-neutral-200 bg-white px-4 text-[13.5px] font-medium text-neutral-700 shadow-2xs transition-colors hover:bg-neutral-50 hover:shadow-xs disabled:opacity-50 dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
            >
              <GoogleMark className="size-4.5" />
              <span>Masuk dengan Akun Google</span>
            </motion.button>
          </motion.div>

          {/* Divider */}
          <motion.div
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.45, ease: EASE_OPUS, delay: 0.22 }}
            className="relative my-6 flex items-center justify-center"
          >
            <div className="w-full border-t border-neutral-200 dark:border-white/10" />
            <span className="absolute bg-white px-3 text-[11.5px] font-medium text-neutral-400 dark:bg-[#121F25] dark:text-neutral-400">
              atau masuk dengan email
            </span>
          </motion.div>

          {/* Form Email Resmi */}
          <motion.form
            onSubmit={handleEmailSubmit}
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: EASE_OPUS, delay: 0.28 }}
            className="space-y-3"
          >
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-neutral-400" />
              <input
                type="email"
                required
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="nama@uinsgd.ac.id"
                disabled={busy}
                className="h-11 w-full rounded-xl border border-neutral-200 bg-neutral-50/50 pl-10 pr-3.5 text-[13.5px] text-neutral-900 transition-all placeholder:text-neutral-400 focus:border-[#237A74] focus:bg-white focus:outline-none focus:ring-3 focus:ring-[#237A74]/15 dark:border-white/15 dark:bg-white/5 dark:text-white"
              />
            </div>
            <motion.button
              type="submit"
              disabled={busy || !emailInput.trim()}
              whileHover={reduce ? undefined : { y: -1.5, scale: 1.008 }}
              whileTap={reduce ? undefined : { scale: 0.985 }}
              transition={{ type: "spring", stiffness: 420, damping: 28 }}
              className="group flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#237A74] text-[13.5px] font-semibold text-white shadow-xs transition-colors hover:bg-[#1D6964] hover:shadow-sm disabled:opacity-50"
            >
              {busy ? <Loader2 className="size-4 animate-spin" /> : "Masuk ke Dashboard"}
              <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
            </motion.button>
          </motion.form>
        </motion.div>

        {/* Back to Home Link */}
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: EASE_OPUS, delay: 0.35 }}
          className="mt-6 text-center"
        >
          <Link
            href="/"
            className="group inline-flex items-center gap-1.5 text-[13px] font-medium text-neutral-500 transition-colors hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
          >
            <ArrowLeft className="size-3.5 transition-transform duration-300 group-hover:-translate-x-1" />
            Kembali ke beranda website
          </Link>
        </motion.div>
      </div>
    </main>
  );
}
