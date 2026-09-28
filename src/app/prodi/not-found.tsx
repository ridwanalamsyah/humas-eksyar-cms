import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function ProdiNotFound() {
  return (
    <section className="grid min-h-[70dvh] place-items-center px-5 pt-32">
      <div className="glass-thick max-w-md rounded-3xl p-8 text-center">
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-foreground/55">404</p>
        <h1 className="mt-2 font-display text-2xl font-semibold tracking-tight">Halaman tidak ditemukan.</h1>
        <p className="mt-2 text-sm text-foreground/65">
          Berita atau halaman yang kamu cari mungkin sudah dipindahkan.
        </p>
        <Link
          href="/prodi"
          className="mt-6 inline-flex h-11 items-center gap-2 rounded-2xl bg-gradient-to-b from-brand-500 to-brand-600 px-5 text-sm font-semibold text-white"
        >
          <ArrowLeft className="size-4" />
          Kembali ke beranda
        </Link>
      </div>
    </section>
  );
}
