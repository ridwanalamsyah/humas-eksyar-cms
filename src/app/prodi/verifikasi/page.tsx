import type { Metadata } from "next";
import { ShieldCheck } from "lucide-react";
import { PageHeader } from "@/components/site/page-header";

export const metadata: Metadata = {
  title: "Verifikasi Sertifikat",
  description:
    "Periksa keaslian sertifikat kegiatan Program Studi Ekonomi Syariah UIN SGD.",
};

export default function VerifikasiPage() {
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
      </section>
    </>
  );
}
