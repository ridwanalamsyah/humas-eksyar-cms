import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import { BeasiswaCard } from "@/components/site/beasiswa-card";
import { PageHeader } from "@/components/site/page-header";
import { PrintButton } from "@/components/site/print-button";
import { Reveal } from "@/components/site/reveal";
import { getSite } from "@/lib/site/get-site";
import { prodi } from "@/lib/site/prodi";

export const metadata: Metadata = {
  title: "Beasiswa",
  description: `Informasi beasiswa untuk mahasiswa ${prodi.fullName} ${prodi.university}: KIP Kuliah, BAZNAS, Bank Indonesia, dan lainnya.`,
};

export default async function BeasiswaPage() {
  const { beasiswa } = await getSite();
  return (
    <>
      <PageHeader
        crumb="Beasiswa"
        title="Beasiswa"
        description="Beasiswa pemerintah, lembaga zakat, perbankan, dan kampus yang bisa diikuti mahasiswa Ekonomi Syariah."
      />
      <div className="flex justify-center px-4 pb-8" data-print-hide>
        <PrintButton />
      </div>
      <section className="px-4 pb-24 sm:px-6 sm:pb-32">
        <div className="mx-auto grid max-w-[1024px] gap-5 md:grid-cols-2">
          {beasiswa.map((b, i) => (
            <Reveal key={`${b.name}-${i}`} delay={(i % 2) * 0.06}>
              <BeasiswaCard item={b} />
            </Reveal>
          ))}
        </div>
        <Reveal className="mx-auto mt-10 max-w-[1024px]">
          <a
            href="https://beasiswa.uinsgd.ac.id"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center justify-between gap-4 rounded-[24px] bg-accent p-7 text-white transition duration-300 hover:-translate-y-1"
          >
            <span>
              <span className="block text-[20px] font-bold">
                Portal Beasiswa UIN SGD
              </span>
              <span className="mt-1 block text-[15px] text-white/80">
                Pendaftaran resmi, masuk dengan akun SUPERAPPS mahasiswa.
              </span>
            </span>
            <ArrowUpRight className="size-6 shrink-0 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </a>
        </Reveal>
      </section>
    </>
  );
}
