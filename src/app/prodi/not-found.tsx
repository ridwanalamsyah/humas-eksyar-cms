import Link from "next/link";

export default function ProdiNotFound() {
  return (
    <section className="grid min-h-[60dvh] place-items-center px-6 py-24 text-center">
      <div>
        <h1 className="text-[clamp(2.5rem,2rem+2vw,3.5rem)] font-semibold tracking-[-0.03em] text-label">
          Halaman tidak ditemukan.
        </h1>
        <p className="mt-3 text-[19px] text-label-2">
          Mungkin sudah dipindahkan atau alamatnya salah.
        </p>
        <Link
          href="/"
          className="mt-6 inline-block text-[17px] text-accent hover:underline"
        >
          Kembali ke beranda ›
        </Link>
      </div>
    </section>
  );
}
