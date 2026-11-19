import type { Metadata } from "next";
import { Photo } from "@/components/site/photo";
import { Reveal } from "@/components/site/reveal";
import { PageHeader } from "@/components/site/page-header";
import { getSite } from "@/lib/site/get-site";
import { prodi } from "@/lib/site/prodi";

export const metadata: Metadata = {
  title: "Fasilitas",
  description: `Fasilitas akademik dan laboratorium ${prodi.fullName} ${prodi.university}.`,
};

export default async function Page() {
  const { fasilitas } = await getSite();

  return (
    <>
      <PageHeader crumb="Fasilitas" title="Fasilitas" />

      {/* Fasilitas & Ruang Akademik */}
      <section
        id="fasilitas"
        className="scroll-mt-28 px-4 pb-16 pt-2 sm:px-6 sm:py-20"
      >
        <div className="mx-auto max-w-[1060px]">
          <div className="mt-8 grid gap-x-5 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
            {fasilitas.map((f, i) => (
              <Reveal key={`${f.title}-${i}`} delay={(i % 3) * 0.04}>
                <div className="group flex h-full flex-col">
                  <Photo src={f.image} alt={f.title} ratio="landscape" className="rounded-[20px]" />
                  <div className="pt-4">
                    <h3 className="text-[16px] font-bold tracking-[-0.01em] text-label">
                      {f.title}
                    </h3>
                    <p className="mt-1.5 text-[14px] leading-[1.55] text-label-2">
                      {f.description}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
