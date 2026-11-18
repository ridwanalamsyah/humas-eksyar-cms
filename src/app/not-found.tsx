import Link from "next/link";
import { Compass, Home, LogIn } from "lucide-react";

export default function NotFound() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center bg-[#FAF9F5] p-6 text-center text-[#1E221E] dark:bg-[#0B171C] dark:text-white">
      <div className="w-full max-w-md rounded-2xl border border-neutral-200/80 bg-white/95 p-8 shadow-sm dark:border-white/15 dark:bg-[#121B15]/95">
        <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-teal-500/10 text-[#237A74] dark:text-[#7BC8C0]">
          <Compass className="size-7" strokeWidth={1.75} />
        </div>
        <p className="mt-4 font-mono text-[13px] font-medium text-neutral-400">
          404 · Halaman tidak ditemukan
        </p>
        <h1 className="mt-2 text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
          Halaman Tidak Ditemukan
        </h1>
        <p className="mx-auto mt-2 text-[13.5px] leading-relaxed text-neutral-500 dark:text-neutral-400">
          Halaman yang kamu tuju belum tersedia atau telah dipindahkan.
        </p>
        <div className="mt-6 flex flex-col gap-2.5 sm:flex-row sm:justify-center">
          <Link
            href="/"
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-[#237A74] px-5 text-[13.5px] font-semibold text-white shadow-xs transition-all hover:bg-[#1D6964]"
          >
            <Home className="size-4" />
            <span>Beranda Website</span>
          </Link>
          <Link
            href="/login"
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-neutral-200 bg-white px-5 text-[13.5px] font-medium text-neutral-700 transition-all hover:bg-neutral-50 dark:border-white/15 dark:bg-white/5 dark:text-white"
          >
            <LogIn className="size-4" />
            <span>Login CMS</span>
          </Link>
        </div>
      </div>
    </main>
  );
}
