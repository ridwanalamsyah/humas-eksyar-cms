import Link from "next/link";
import { jalurMasuk, kontak } from "@/lib/site/prodi";
import { Reveal } from "./reveal";

export function PmbCta() {
  return (
    <section id="pmb" className="scroll-mt-16 px-4 py-24 sm:px-6 sm:py-32">
      <Reveal className="mx-auto max-w-3xl text-center">
        <p className="text-[17px] font-semibold text-accent">Penerimaan Mahasiswa Baru</p>
        <h2 className="mt-1 text-[clamp(2.25rem,1.5rem+3vw,4rem)] font-semibold leading-[1.05] tracking-[-0.03em] text-label text-balance">
          Mulai perjalananmu di Ekonomi Syariah.
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-[clamp(1.05rem,1rem+0.3vw,1.3rem)] leading-[1.45] text-label-2">
          Daftar melalui {jalurMasuk.map((j) => j.title).join(", ").replace(/, ([^,]*)$/, ", atau $1")}.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
          <a
            href={kontak.pmbUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-accent px-7 py-3 text-[17px] font-medium text-white transition-colors hover:bg-accent-strong"
          >
            Daftar sekarang
          </a>
          <Link href="/prodi/kontak" className="text-[17px] text-accent hover:underline">
            Tanya kami ›
          </Link>
        </div>
      </Reveal>
    </section>
  );
}
