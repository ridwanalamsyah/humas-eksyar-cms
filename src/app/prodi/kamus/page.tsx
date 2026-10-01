import type { Metadata } from "next";
import { getSite } from "@/lib/site/get-site";
import { KamusList } from "@/components/site/kamus-list";
import { PageHeader } from "@/components/site/page-header";

export const metadata: Metadata = {
  title: "Kamus Istilah Ekonomi Syariah",
  description:
    "Penjelasan singkat istilah ekonomi dan keuangan syariah: akad, ZISWAF, pasar modal syariah, dan lembaga keuangan.",
};

export default async function KamusPage() {
  const { kamus } = await getSite();
  return (
    <>
      <PageHeader
        crumb="Kamus"
        title="Kamus istilah ekonomi syariah"
        description={`${kamus.length} istilah dasar ekonomi dan keuangan syariah, disusun untuk mahasiswa dan masyarakat umum.`}
      />
      <section className="px-4 pb-24 sm:px-6">
        <div className="mx-auto max-w-[1024px]">
          <KamusList items={kamus} />
        </div>
      </section>
    </>
  );
}
