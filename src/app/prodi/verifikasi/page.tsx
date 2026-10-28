import type { Metadata } from "next";
import Link from "next/link";
import { BadgeCheck, ShieldCheck } from "lucide-react";
import { PageHeader } from "@/components/site/page-header";
import { getSite } from "@/lib/site/get-site";

export const metadata: Metadata = {
  title: "Verifikasi Sertifikat",
  description:
    "Periksa keaslian sertifikat kegiatan Program Studi Ekonomi Syariah UIN SGD.",
};

export default async function VerifikasiPage() {
  const { sertifikat } = await getSite();
  return (
    <>
      <PageHeader
        crumb="Verifikasi"
        title="Verifikasi sertifikat"
        description="Masukkan kode yang tertera pada sertifikat, atau pindai kode QR-nya."
      />
      <section className="px-4 pb-24 sm:px-6">
        <form
          action="/verifikasi/cek"
          className="mx-auto flex max-w-[560px] items-center gap-2 rounded-full border border-hairline bg-canvas p-2 pl-5"
        >
          <ShieldCheck className="size-5 shrink-0 text-label-3" />
          <input
            name="kode"
            required
            placeholder="Mis. EKSYAR-2610-AB12C"
            className="min-w-0 flex-1 bg-transparent py-2 text-[16px] uppercase text-label outline-none placeholder:normal-case placeholder:text-label-3"
          />
          <button
            type="submit"
            className="shrink-0 rounded-full bg-accent px-6 py-2.5 text-[15px] font-semibold text-white hover:bg-accent-strong"
          >
            Periksa
          </button>
        </form>

        {sertifikat.length > 0 && (
          <div className="mx-auto mt-12 max-w-[720px]">
            <p className="text-center text-[13px] font-semibold uppercase tracking-[0.08em] text-label-3">
              Sertifikat kegiatan terbaru yang terdaftar
            </p>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {sertifikat.slice(0, 6).map((s) => (
                <li key={s.kode}>
                  <Link
                    href={`/prodi/verifikasi/${encodeURIComponent(s.kode)}`}
                    className="group flex items-start gap-3 rounded-[20px] border border-hairline bg-canvas p-4 transition hover:border-accent"
                  >
                    <BadgeCheck className="mt-0.5 size-5 shrink-0 text-accent" />
                    <div className="min-w-0">
                      <p className="font-mono text-[13px] font-bold text-accent group-hover:underline">
                        {s.kode}
                      </p>
                      <p className="mt-0.5 truncate text-[15px] font-semibold text-label">
                        {s.nama}
                      </p>
                      <p className="mt-0.5 line-clamp-1 text-[13px] text-label-2">
                        {s.kegiatan}
                      </p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>
    </>
  );
}
