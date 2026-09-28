import type { Metadata } from "next";
import { FaqList } from "@/components/site/faq-list";
import { PageHeader } from "@/components/site/page-header";
import { Reveal } from "@/components/site/reveal";
import { SectionHeading } from "@/components/site/section-heading";
import { getSite } from "@/lib/site/get-site";
import { layananAkademik, prodi } from "@/lib/site/prodi";

export const metadata: Metadata = {
  title: "Layanan",
  description: `Layanan akademik dan administrasi mahasiswa ${prodi.fullName} ${prodi.university}.`,
};

export default async function LayananPage() {
  const { faq, kontak, layananAdministrasi, layananFormUrl } = await getSite();
  return (
    <>
      <PageHeader
        crumb="Layanan"
        title="Semua layanan, satu tempat."
        description="Akses sistem akademik kampus dan ajukan layanan administrasi mahasiswa."
      />

      {/* Layanan digital */}
      <section className="px-4 pb-24 sm:px-6 sm:pb-32">
        <Reveal>
          <SectionHeading eyebrow="Layanan digital" title="Sistem akademik kampus." />
        </Reveal>
        <div className="mx-auto mt-12 grid max-w-[1024px] gap-4 sm:grid-cols-2">
          {layananAkademik.map((l) => (
            <a
              key={l.href}
              href={l.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-start justify-between gap-6 rounded-[24px] border border-hairline bg-canvas p-7 transition duration-300 hover:-translate-y-1 hover:border-transparent hover:shadow-[0_24px_48px_-24px_rgba(22,58,69,0.35)]"
            >
              <span>
                <span className="block text-[19px] font-bold tracking-[-0.01em] text-label">{l.title}</span>
                <span className="mt-1 block text-[15px] text-label-2">{l.description}</span>
              </span>
              <span className="grid size-9 shrink-0 place-items-center rounded-full bg-mist text-accent transition-colors duration-300 group-hover:bg-accent group-hover:text-white">↗</span>
            </a>
          ))}
        </div>
      </section>

      {/* Administrasi */}
      <section className="bg-mist px-4 py-24 sm:px-6 sm:py-32">
        <Reveal>
          <SectionHeading
            eyebrow="Administrasi"
            title="Surat & layanan mahasiswa."
            description={`Ajukan melalui sekretariat program studi atau email ${kontak.email}, dengan menyertakan nama, NIM, dan keperluan.`}
          />
        </Reveal>
        <ul className="mx-auto mt-12 grid max-w-[1024px] gap-4 sm:grid-cols-2">
          {layananAdministrasi.map((l) => (
            <li key={l.title} className="rounded-[24px] bg-canvas p-7">
              <p className="text-[19px] font-bold tracking-[-0.01em] text-label">{l.title}</p>
              <p className="mt-1 text-[15px] leading-[1.45] text-label-2">{l.description}</p>
            </li>
          ))}
        </ul>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-center">
          {layananFormUrl && (
            <a
              href={layananFormUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-accent px-7 py-3 text-[16px] font-semibold text-white transition-colors hover:bg-accent-strong"
            >
              Ajukan layanan
            </a>
          )}
          <a
            href={`mailto:${kontak.email}`}
            className={
              layananFormUrl
                ? "text-[16px] font-semibold text-accent hover:underline"
                : "rounded-full bg-accent px-7 py-3 text-[16px] font-semibold text-white transition-colors hover:bg-accent-strong"
            }
          >
            Kirim email
          </a>
          <p className="text-[15px] text-label-2">Jam layanan: {kontak.hours}</p>
        </div>
      </section>

      <section className="px-4 py-24 sm:px-6 sm:py-32">
        <Reveal>
          <SectionHeading title="Pertanyaan umum." />
        </Reveal>
        <Reveal className="mt-10">
          <FaqList items={faq} />
        </Reveal>
      </section>
    </>
  );
}
