import Link from "next/link";
import { Countdown } from "./countdown";

/** Pita kampanye PMB dengan hitung mundur tenggat pendaftaran. */
export function PmbCampaign({
  judul,
  teks,
  tenggat,
  pmbUrl,
}: {
  judul: string;
  teks: string;
  tenggat?: string;
  pmbUrl: string;
}) {
  return (
    <section className="px-4 py-16 sm:px-6">
      <div className="mx-auto max-w-[1024px] rounded-[32px] bg-navy px-6 py-12 text-center text-white sm:px-12">
        <p className="text-[14px] font-semibold uppercase tracking-[0.08em] text-sand">
          Penerimaan mahasiswa baru
        </p>
        <h2 className="mx-auto mt-3 max-w-2xl text-[clamp(1.8rem,1.3rem+2vw,2.8rem)] font-extrabold leading-[1.1] tracking-[-0.03em]">
          {judul}
        </h2>
        {teks && (
          <p className="mx-auto mt-3 max-w-xl text-[16px] text-white/80">
            {teks}
          </p>
        )}
        {tenggat && (
          <div className="mt-8">
            <Countdown to={tenggat} />
          </div>
        )}
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <a
            href={pmbUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-sand px-7 py-3 text-[15.5px] font-bold text-navy hover:bg-white"
          >
            Daftar sekarang
          </a>
          <Link
            href="/prodi/akademik"
            className="rounded-full border border-white/40 px-7 py-3 text-[15.5px] font-semibold hover:bg-white/10"
          >
            Lihat kurikulum
          </Link>
        </div>
      </div>
    </section>
  );
}
