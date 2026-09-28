import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function ProdiNotFound() {
  return (
    <section className="grid min-h-[60dvh] place-items-center px-6 py-24">
      <div className="max-w-md text-center">
        <p className="font-serif text-7xl font-semibold text-saffron-500">404</p>
        <h1 className="mt-4 font-serif text-3xl font-semibold text-pine-800">Halaman tidak ditemukan.</h1>
        <p className="mt-3 text-[15px] text-ink/65">Berita atau halaman yang kamu cari mungkin sudah dipindahkan.</p>
        <Link
          href="/prodi"
          className="mt-8 inline-flex h-12 items-center gap-2 rounded-sm bg-pine-700 px-6 text-[13px] font-bold uppercase tracking-[0.1em] text-paper hover:bg-pine-800"
        >
          <ArrowLeft className="size-4" /> Kembali ke beranda
        </Link>
      </div>
    </section>
  );
}
