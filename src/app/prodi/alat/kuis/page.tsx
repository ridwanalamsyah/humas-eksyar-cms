import type { Metadata } from "next";
import { getSite } from "@/lib/site/get-site";
import { PageHeader } from "@/components/site/page-header";
import { KuisMinat } from "@/components/site/alat/kuis-minat";

export const metadata: Metadata = {
  title: "Kuis Minat Ekonomi Syariah",
  description:
    "Kuis singkat untuk calon mahasiswa: bidang kajian Ekonomi Syariah yang paling sesuai minatmu.",
};

export default async function KuisPage() {
  const { bidangKajian, prospekKarir } = await getSite();
  return (
    <>
      <PageHeader
        crumb="Kuis minat"
        title="Cocok di bidang apa?"
        description="Jawab 8 pertanyaan singkat. Tidak ada jawaban benar atau salah."
      />
      <section className="px-4 pb-24 sm:px-6">
        <div className="mx-auto max-w-[820px]">
          <KuisMinat
            bidang={bidangKajian}
            karier={prospekKarir.map((p) => p.title)}
          />
        </div>
      </section>
    </>
  );
}
