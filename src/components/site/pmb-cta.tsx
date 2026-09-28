import Link from "next/link";
import { jalurMasuk, kontak } from "@/lib/site/prodi";
import { Reveal } from "./reveal";

export function PmbCta() {
  return (
    <section id="pmb" className="eksyar-sky scroll-mt-16 px-4 py-24 sm:px-6 sm:py-32">
      <Reveal className="mx-auto max-w-3xl rounded-[32px] bg-white/85 px-6 py-14 text-center shadow-[0_20px_50px_-20px_rgba(22,58,69,0.35)] backdrop-blur sm:px-12">
        <p className="font-script text-[clamp(1.9rem,1.5rem+1.2vw,2.6rem)] leading-none text-accent">Penerimaan Mahasiswa Baru</p>
        <h2 className="mt-3 text-[clamp(2.1rem,1.5rem+2.6vw,3.6rem)] font-extrabold leading-[1.05] tracking-[-0.035em] text-label text-balance">
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
            className="rounded-full bg-accent px-7 py-3 text-[17px] font-semibold text-white transition-colors hover:bg-accent-strong"
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
