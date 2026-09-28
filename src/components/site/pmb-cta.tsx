import Link from "next/link";
import { getSite } from "@/lib/site/get-site";
import { Reveal } from "./reveal";

export async function PmbCta() {
  const { jalurMasuk, kontak } = await getSite();
  const jalur = jalurMasuk.map((j) => j.title);
  const jalurText = jalur.length > 1 ? `${jalur.slice(0, -1).join(", ")}, atau ${jalur.at(-1)}` : jalur[0];

  return (
    <section id="pmb" className="scroll-mt-16 border-t border-hairline px-4 py-24 sm:px-6 sm:py-32">
      <Reveal className="mx-auto max-w-3xl text-center">
        <p className="text-[15px] font-semibold uppercase tracking-[0.08em] text-accent">Penerimaan Mahasiswa Baru</p>
        <h2 className="mt-3 text-[clamp(2.1rem,1.5rem+2.6vw,3.6rem)] font-extrabold leading-[1.05] tracking-[-0.035em] text-label text-balance">
          Mulai perjalananmu di Ekonomi Syariah.
        </h2>
        {jalurText && (
          <p className="mx-auto mt-5 max-w-xl text-[clamp(1.05rem,1rem+0.3vw,1.3rem)] leading-[1.45] text-label-2">
            Daftar melalui {jalurText}.
          </p>
        )}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
          <a
            href={kontak.pmbUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-accent px-7 py-3 text-[17px] font-semibold text-white transition-colors hover:bg-accent-strong"
          >
            Daftar sekarang
          </a>
          <Link href="/prodi/kontak" className="text-[17px] font-semibold text-accent hover:underline">
            Tanya kami ›
          </Link>
        </div>
      </Reveal>
    </section>
  );
}
