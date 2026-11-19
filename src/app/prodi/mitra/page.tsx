import type { Metadata } from "next";
import { MitraList } from "@/components/site/mitra-list";
import { Reveal } from "@/components/site/reveal";
import { PageHeader } from "@/components/site/page-header";
import { getSite } from "@/lib/site/get-site";
import { prodi } from "@/lib/site/prodi";

export const metadata: Metadata = {
  title: "Mitra kerja sama",
  description: `Mitra kerja sama ${prodi.fullName} ${prodi.university}: bursa, perbankan syariah, regulator, dan lembaga filantropi.`,
};

export default async function Page() {
  const { mitra } = await getSite();

  return (
    <>
      <PageHeader crumb="Mitra kerja sama" title="Mitra kerja sama" />

      {/* Mitra Kerja Sama Resmi */}
      {mitra.length > 0 && (
        <section
          id="mitra"
          className="scroll-mt-28 bg-mist px-4 pb-16 pt-2 sm:px-6 sm:py-20"
        >
          <div className="mx-auto max-w-[1060px]">
            <Reveal className="mt-8">
              <MitraList items={mitra} />
            </Reveal>
          </div>
        </section>
      )}
    </>
  );
}
