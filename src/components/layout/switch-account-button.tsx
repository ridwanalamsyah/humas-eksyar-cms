"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import { Loader2, LogOut, ArrowLeft, Clock, ShieldAlert } from "lucide-react";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";

const EASE_OPUS: [number, number, number, number] = [0.16, 1, 0.3, 1];

export function PendingAccountActions() {
  const [busy, setBusy] = useState(false);
  const reduce = useReducedMotion();

  const handleSignOut = async () => {
    setBusy(true);
    try {
      await signOut({ callbackUrl: "/login", redirect: false });
    } catch {
      // ignore error, will redirect manually
    }
    window.location.href = "/login";
  };

  return (
    <div className="flex flex-col gap-2.5">
      <motion.button
        type="button"
        disabled={busy}
        onClick={handleSignOut}
        whileHover={reduce ? undefined : { y: -1.5, scale: 1.008 }}
        whileTap={reduce ? undefined : { scale: 0.985 }}
        transition={{ type: "spring", stiffness: 420, damping: 28 }}
        className="group relative inline-flex h-11 w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-accent px-4 text-[14px] font-semibold text-white shadow-sm transition-colors hover:bg-accent-strong disabled:opacity-50"
      >
        {busy ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <LogOut className="size-4 transition-transform duration-300 group-hover:-translate-x-0.5" />
        )}
        <span>Pindah / Ganti Akun Lain</span>
      </motion.button>

      <motion.div
        whileHover={reduce ? undefined : { y: -1 }}
        whileTap={reduce ? undefined : { scale: 0.99 }}
        transition={{ type: "spring", stiffness: 420, damping: 28 }}
      >
        <Link
          href="/"
          className="group inline-flex h-10 w-full items-center justify-center gap-1.5 rounded-xl border border-hairline bg-canvas px-4 text-[13.5px] font-medium text-label-2 transition-colors hover:bg-mist hover:text-label"
        >
          <ArrowLeft className="size-3.5 transition-transform duration-300 group-hover:-translate-x-1" />
          <span>Kembali ke Website Publik</span>
        </Link>
      </motion.div>
    </div>
  );
}

export function PendingAccountView({ identifier }: { identifier: string }) {
  const reduce = useReducedMotion();

  return (
    <div className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden bg-background p-6 text-center text-foreground">
      {/* Ambient floating light orbs */}
      <motion.div
        aria-hidden="true"
        animate={
          reduce
            ? undefined
            : {
                scale: [1, 1.08, 1],
                opacity: [0.35, 0.55, 0.35],
              }
        }
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        className="pointer-events-none absolute -top-24 left-1/2 -z-10 h-[360px] w-[360px] -translate-x-1/2 rounded-full bg-amber-500/10 blur-[110px] dark:bg-amber-400/10"
      />
      <motion.div
        aria-hidden="true"
        animate={
          reduce
            ? undefined
            : {
                scale: [1, 1.12, 1],
                opacity: [0.25, 0.45, 0.25],
              }
        }
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
        className="pointer-events-none absolute -bottom-28 left-1/2 -z-10 h-[320px] w-[320px] -translate-x-1/2 rounded-full bg-accent/10 blur-[110px]"
      />

      <motion.div
        initial={reduce ? false : { opacity: 0, y: 24, scale: 0.96, filter: "blur(8px)" }}
        animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
        transition={{ duration: 0.55, ease: EASE_OPUS }}
        className="relative w-full max-w-md rounded-2xl border border-hairline bg-canvas/95 p-8 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.08)] backdrop-blur-md dark:shadow-[0_24px_60px_-15px_rgba(0,0,0,0.45)]"
      >
        {/* Animated Icon Badge */}
        <motion.div
          initial={reduce ? false : { opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.45, ease: EASE_OPUS, delay: 0.08 }}
          className="relative mx-auto flex size-15 items-center justify-center"
        >
          {!reduce && (
            <motion.span
              aria-hidden="true"
              animate={{ scale: [1, 1.28, 1], opacity: [0.4, 0, 0.4] }}
              transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
              className="absolute inset-0 rounded-2xl bg-amber-500/20 dark:bg-amber-400/20"
            />
          )}
          <div className="relative flex size-14 items-center justify-center rounded-2xl bg-amber-500/12 text-amber-600 shadow-2xs dark:bg-amber-400/15 dark:text-amber-400">
            <motion.div
              animate={reduce ? undefined : { rotate: [0, 8, -6, 0] }}
              transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
            >
              <Clock className="size-7" />
            </motion.div>
          </div>
        </motion.div>

        <motion.h1
          initial={reduce ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: EASE_OPUS, delay: 0.14 }}
          className="mt-4 text-xl font-bold tracking-tight text-label"
        >
          Menunggu Konfirmasi Admin
        </motion.h1>

        <motion.p
          initial={reduce ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: EASE_OPUS, delay: 0.2 }}
          className="mt-2 text-sm leading-relaxed text-label-2"
        >
          Akun Anda (<strong className="font-semibold text-label">{identifier}</strong>) berhasil masuk dan menunggu persetujuan dari Admin Humas Jurusan Ekonomi Syariah.
        </motion.p>

        <motion.div
          initial={reduce ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: EASE_OPUS, delay: 0.26 }}
          className="mt-5 flex items-start gap-2.5 rounded-xl border border-hairline bg-mist/80 p-3.5 text-left text-[12.5px] leading-relaxed text-label-2"
        >
          <ShieldAlert className="mt-0.5 size-4 shrink-0 text-amber-600 dark:text-amber-400" />
          <span>
            Silakan hubungi tim Humas atau tunggu hingga admin mengaktifkan peran Anda (Kontributor / Pengurus Humas) di CMS.
          </span>
        </motion.div>

        <motion.div
          initial={reduce ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: EASE_OPUS, delay: 0.32 }}
          className="mt-6"
        >
          <PendingAccountActions />
        </motion.div>
      </motion.div>
    </div>
  );
}

export function CmsPageTransition({ children }: { children: React.ReactNode }) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 10, filter: "blur(4px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 0.42, ease: EASE_OPUS }}
    >
      {children}
    </motion.div>
  );
}
