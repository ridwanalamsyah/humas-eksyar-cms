import { ArrowUpRight } from "lucide-react";
import { jalurMasuk, kontak, prodi } from "@/lib/site/prodi";

export function PmbCta() {
  return (
    <section id="pmb" className="site-pattern scroll-mt-28 bg-pine-800">
      <div className="bg-gradient-to-br from-pine-900 via-pine-900/85 to-pine-800/60">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 py-20 lg:grid-cols-[1fr_1.2fr] lg:items-center">
          <div>
            <p className="flex items-center gap-3 text-[12px] font-semibold uppercase tracking-[0.22em] text-saffron-300">
              <span className="h-px w-8 bg-saffron-300" aria-hidden />
              Penerimaan Mahasiswa Baru
            </p>
            <h2 className="mt-4 font-serif text-[clamp(1.9rem,1.4rem+1.8vw,2.9rem)] font-semibold leading-tight text-paper">
              Bergabunglah bersama keluarga besar Ekonomi Syariah.
            </h2>
            <p className="mt-4 max-w-md text-[16px] leading-relaxed text-pine-100/80">
              Pilih jalur seleksi yang sesuai dan pantau jadwal resmi di portal PMB {prodi.university}.
            </p>
            <a
              href={kontak.pmbUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex h-12 items-center gap-2 rounded-sm bg-saffron-500 px-7 text-[13px] font-bold uppercase tracking-[0.1em] text-pine-900 transition-colors hover:bg-saffron-300"
            >
              Portal PMB UIN SGD <ArrowUpRight className="size-4" />
            </a>
          </div>
          <ol className="grid gap-px bg-white/10 sm:grid-cols-2">
            {jalurMasuk.map((j, i) => (
              <li key={j.title} className="bg-pine-900/80 p-6">
                <span className="font-serif text-3xl font-semibold text-saffron-300">{String(i + 1).padStart(2, "0")}</span>
                <p className="mt-3 text-lg font-semibold text-paper">{j.title}</p>
                <p className="mt-1.5 text-sm leading-relaxed text-pine-100/70">{j.description}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
