import type { Metadata } from "next";
import { PageHeader } from "@/components/site/page-header";
import { UnduhanList } from "@/components/site/unduhan-list";
import { getSite } from "@/lib/site/get-site";
import { prodi } from "@/lib/site/prodi";

export const metadata: Metadata = {
  title: "Unduhan",
  description: `Pedoman akademik, kalender, jadwal kuliah, template surat, dan dokumen resmi ${prodi.fullName}.`,
};

export default async function UnduhanPage() {
  const { unduhan } = await getSite();
  return (
    <>
      <PageHeader
        crumb="Unduhan"
        title="Unduhan dokumen"
        description="Pedoman akademik, kalender akademik, jadwal kuliah, template surat, dan sertifikat akreditasi."
      />
      <section className="px-4 pb-24 sm:px-6 sm:pb-32">
        <div className="mx-auto max-w-[1024px]">
          <UnduhanList items={unduhan} />
        </div>
      </section>
    </>
  );
}
