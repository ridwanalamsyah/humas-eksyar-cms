import type { Metadata } from "next";
import { PageHeader } from "@/components/site/page-header";
import { PersonCard } from "@/components/site/person-card";
import { Reveal } from "@/components/site/reveal";
import { dosen, prodi } from "@/lib/site/prodi";

export const metadata: Metadata = {
  title: "Dosen",
  description: `Dosen dan tenaga pengajar ${prodi.fullName} ${prodi.university}.`,
};

export default function DosenPage() {
  return (
    <>
      <PageHeader
        crumb="Dosen"
        title="Pengajar yang juga peneliti."
        description="Dosen Ekonomi Syariah aktif mengajar, meneliti, dan mengabdi di bidang ekonomi dan keuangan Islam."
      />

      <section className="px-4 pb-24 sm:px-6 sm:pb-32">
        <div className="mx-auto grid max-w-[1024px] gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {dosen.map((d, i) => (
            <Reveal key={d.name} delay={(i % 3) * 0.06}>
              <PersonCard name={d.name} initials={d.initials} role={d.role} tags={d.expertise} />
            </Reveal>
          ))}
        </div>

        <Reveal className="mx-auto mt-10 max-w-[1024px]">
          <div className="flex flex-col items-start justify-between gap-4 rounded-[24px] bg-mist p-7 sm:flex-row sm:items-center">
            <div>
              <p className="text-[17px] font-bold text-label">Profil akademik dosen</p>
              <p className="mt-1 text-[15px] text-label-2">
                Publikasi dan rekam jejak dosen dapat dilihat melalui PDDikti dan SINTA.
              </p>
            </div>
            <a
              href="https://pddikti.kemdiktisaintek.go.id"
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 text-[15px] font-semibold text-accent hover:underline"
            >
              Buka PDDikti ↗
            </a>
          </div>
        </Reveal>
      </section>
    </>
  );
}
