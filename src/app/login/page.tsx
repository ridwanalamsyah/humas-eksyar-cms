"use client";

import { Suspense, useState } from "react";
import { motion } from "motion/react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { ShieldCheck, Sparkles, Loader2 } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { EksyarLogo } from "@/components/brand/eksyar-logo";

function GoogleMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden focusable="false">
      <path
        d="M21.35 11.1H12v2.9h5.35c-.25 1.4-1.66 4.1-5.35 4.1-3.22 0-5.85-2.66-5.85-5.94 0-3.27 2.63-5.94 5.85-5.94 1.83 0 3.05.78 3.75 1.45l2.55-2.45C16.95 3.79 14.7 2.9 12 2.9 6.94 2.9 2.9 6.94 2.9 12s4.04 9.1 9.1 9.1c5.26 0 8.74-3.7 8.74-8.9 0-.6-.07-1.05-.16-1.5z"
        fill="#4285F4"
      />
      <path d="M12 5.94c1.83 0 3.05.78 3.75 1.45l2.55-2.45C16.95 3.79 14.7 2.9 12 2.9c-3.6 0-6.7 2.05-8.2 5.04l3 2.32C7.6 7.85 9.6 5.94 12 5.94z" fill="#34A853" opacity="0" />
    </svg>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginShell busy={false} handleGoogle={() => {}} />}>
      <LoginInner />
    </Suspense>
  );
}

function LoginInner() {
  const [busy, setBusy] = useState(false);
  const params = useSearchParams();
  const callbackUrl = params.get("callbackUrl") || "/";

  const handleGoogle = async () => {
    setBusy(true);
    try {
      await signIn("google", { redirectTo: callbackUrl });
    } catch {
      setBusy(false);
    }
  };
  return <LoginShell busy={busy} handleGoogle={handleGoogle} />;
}

function LoginShell({
  busy,
  handleGoogle,
}: {
  busy: boolean;
  handleGoogle: () => void;
}) {

  return (
    <main className="relative flex min-h-dvh items-center justify-center px-4 py-10 sm:py-16">
      <div className="absolute inset-x-0 top-0 z-10 flex items-center justify-end px-4 py-5 sm:px-8">
        <ThemeToggle />
      </div>

      <div className="grid w-full max-w-5xl gap-8 lg:grid-cols-[1.1fr_1fr] lg:gap-12">
        {/* Left side — brand pitch */}
        <motion.div
          className="hidden flex-col justify-between lg:flex"
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ type: "spring", stiffness: 220, damping: 28 }}
        >
          <div className="flex items-center gap-3">
            <EksyarLogo size={56} />
            <div className="leading-tight">
              <p className="font-display text-2xl font-semibold tracking-tight">Humas Eksyar</p>
              <p className="text-sm text-foreground/55">Ekonomi Syariah · UIN SGD</p>
            </div>
          </div>

          <div className="space-y-6">
            <h1 className="font-display text-[clamp(2rem,1.4rem+2vw,3rem)] font-semibold leading-[1.05] tracking-tight text-balance">
              Satu ruang untuk seluruh{" "}
              <span className="text-brand-600 dark:text-brand-300">
                ekosistem konten organisasi
              </span>
              .
            </h1>
            <p className="max-w-[44ch] text-pretty text-foreground/70">
              Manajemen anggota, editorial pipeline, AI caption, dan kalender kegiatan
              dalam satu platform.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <GlassCard variant="thin" className="p-4">
              <div className="flex items-center gap-2 text-foreground/55">
                <Sparkles className="size-4 text-gold-500" strokeWidth={1.75} />
                <span className="text-[11px] uppercase tracking-wider">AI Caption</span>
              </div>
              <p className="mt-1.5 font-display text-sm font-semibold leading-snug">
                Multimodal — paham foto + tema acara
              </p>
            </GlassCard>
            <GlassCard variant="thin" className="p-4">
              <div className="flex items-center gap-2 text-foreground/55">
                <ShieldCheck className="size-4 text-brand-500" strokeWidth={1.75} />
                <span className="text-[11px] uppercase tracking-wider">Akses</span>
              </div>
              <p className="mt-1.5 font-display text-sm font-semibold leading-snug">
                Hak akses menyesuaikan peran pengurus
              </p>
            </GlassCard>
          </div>
        </motion.div>

        {/* Right side — sign in card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 240, damping: 28, delay: 0.05 }}
        >
          <GlassCard variant="thick" className="p-7 sm:p-10">
            <div className="flex items-center gap-3 lg:hidden">
              <EksyarLogo size={40} />
              <div className="leading-tight">
                <p className="font-display text-base font-semibold">Humas Eksyar</p>
                <p className="text-[12px] text-foreground/55">Ekonomi Syariah · UIN SGD</p>
              </div>
            </div>

            <div className="mt-6 lg:mt-0">
              <p className="text-[11px] uppercase tracking-[0.18em] text-foreground/55">
                Masuk
              </p>
              <h2 className="mt-1 font-display text-3xl font-semibold tracking-tight text-balance">
                Selamat datang kembali.
              </h2>
              <p className="mt-2 text-pretty text-foreground/65">
                Gunakan akun email kampus atau Google untuk masuk. Tim baru menunggu undangan
                dari pengurus.
              </p>
            </div>

            <div className="mt-7 space-y-3">
              <Button
                size="lg"
                variant="primary"
                className="w-full justify-center gap-3 text-base"
                onClick={handleGoogle}
                disabled={busy}
              >
                {busy ? (
                  <Loader2 className="size-5 animate-spin" />
                ) : (
                  <GoogleMark className="size-5" />
                )}
                {busy ? "Mengarahkan…" : "Masuk dengan Google"}
              </Button>
            </div>

            <p className="mt-6 text-center text-[12px] leading-relaxed text-foreground/55">
              Dengan masuk, Anda setuju dengan{" "}
              <Link href="/terms" className="text-brand-600 underline-offset-2 hover:underline dark:text-brand-300">
                Syarat
              </Link>{" "}
              dan{" "}
              <Link href="/privacy" className="text-brand-600 underline-offset-2 hover:underline dark:text-brand-300">
                Kebijakan Privasi
              </Link>
              .
            </p>
          </GlassCard>

          <p className="mt-4 text-center text-[12px] text-foreground/45">
            Bukan anggota Eksyar?{" "}
            <Link
              href="/bio"
              className="text-foreground/65 underline-offset-2 hover:underline"
            >
              Lihat profil publik
            </Link>
          </p>
        </motion.div>
      </div>
    </main>
  );
}
