import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Building2, FolderDown, ScanSearch } from "lucide-react";
import { FaqList } from "@/components/site/faq-list";
import { LocalNav } from "@/components/site/local-nav";
import { PageHeader } from "@/components/site/page-header";
import { Reveal } from "@/components/site/reveal";
import { SectionHeading } from "@/components/site/section-heading";
import { getSite } from "@/lib/site/get-site";
import { layananAkademik, prodi } from "@/lib/site/prodi";

export const metadata: Metadata = {
  title: "Layanan",
  description: `Layanan digital, dokumen, dan sumber akademik ${prodi.fullName} ${prodi.university}.`,
};

const FEBI_URL = "https://febi.uinsgd.ac.id";

export default async function LayananPage() {
  const { faq, kontak } = await getSite();

  return (
    <>
      <PageHeader
        crumb="Layanan"
        title="Layanan mahasiswa"
        description="Sistem akademik kampus, dokumen prodi, dan alat bantu skripsi."
      />

      <LocalNav
        items={[
          { id: "prodi", label: "Layanan prodi" },
          { id: "digital", label: "Sistem kampus" },
          { id: "faq", label: "FAQ" },
        ]}
      />

      {/* Layanan prodi */}
      <section id="prodi" className="scroll-mt-28 px-4 py-24 sm:px-6 sm:py-32">
        <Reveal>
          <SectionHeading
            eyebrow="Layanan prodi"
            title="Layanan program studi"
          />
        </Reveal>
        <div className="mx-auto mt-12 grid max-w-[1024px] gap-4 md:grid-cols-3">
          {[
            {
              href: "/prodi/unduhan",
              Icon: FolderDown,
              t: "Unduhan dokumen",
              d: "Pedoman akademik, kalender, jadwal kuliah, template, dan sertifikat.",
            },
            {
              href: "/prodi/skripsi",
              Icon: ScanSearch,
              t: "Cek judul skripsi",
              d: "Periksa kemiripan rencana judul dengan skripsi terdahulu.",
            },
          ].map(({ href, Icon, t, d }) => (
            <Link
              key={href}
              href={href}
              className="group flex h-full flex-col rounded-[24px] border border-hairline bg-canvas p-7 transition duration-300 hover:-translate-y-1 hover:border-transparent hover:shadow-[0_24px_48px_-24px_rgba(22,58,69,0.35)]"
            >
              <span className="grid size-12 place-items-center rounded-2xl bg-accent-soft text-accent transition-colors duration-300 group-hover:bg-accent group-hover:text-white">
                <Icon className="size-6" strokeWidth={1.75} />
              </span>
              <span className="mt-6 text-[20px] font-bold tracking-[-0.01em] text-label">
                {t}
              </span>
              <span className="mt-2 text-[15px] leading-relaxed text-label-2">
                {d}
              </span>
            </Link>
          ))}
          <a
            href={FEBI_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex h-full flex-col rounded-[24px] bg-accent p-7 text-white transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_48px_-24px_rgba(22,58,69,0.5)]"
          >
            <span className="grid size-12 place-items-center rounded-2xl bg-white/15">
              <Building2 className="size-6" strokeWidth={1.75} />
            </span>
            <span className="mt-6 text-[20px] font-bold tracking-[-0.01em]">
              Surat & administrasi
            </span>
            <span className="mt-2 text-[15px] leading-relaxed text-white/80">
              Surat aktif kuliah, rekomendasi, dan izin penelitian dilayani Tata
              Usaha FEBI.
            </span>
            <span className="mt-auto pt-5 text-[14px] font-semibold">
              Ke website FEBI ↗
            </span>
          </a>
        </div>
      </section>

      {/* Sistem kampus */}
      <section
        id="digital"
        className="scroll-mt-28 bg-mist px-4 py-24 sm:px-6 sm:py-32"
      >
        <Reveal>
          <SectionHeading
            eyebrow="Sistem kampus"
            title="Sistem informasi UIN SGD"
          />
        </Reveal>
        <div className="mx-auto mt-12 grid max-w-[1024px] gap-4 sm:grid-cols-2">
          {layananAkademik.map((l) => (
            <a
              key={l.href}
              href={l.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-start justify-between gap-6 rounded-[24px] bg-canvas p-7 transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_48px_-24px_rgba(22,58,69,0.35)]"
            >
              <span>
                <span className="block text-[19px] font-bold tracking-[-0.01em] text-label">
                  {l.title}
                </span>
                <span className="mt-1 block text-[15px] text-label-2">
                  {l.description}
                </span>
              </span>
              <span className="grid size-9 shrink-0 place-items-center rounded-full bg-mist text-accent transition-colors duration-300 group-hover:bg-accent group-hover:text-white">
                <ArrowUpRight className="size-4" />
              </span>
            </a>
          ))}
        </div>
        <p className="mt-10 text-center text-[15px] text-label-2">
          Butuh bantuan? Email{" "}
          <a
            href={`mailto:${kontak.email}`}
            className="font-semibold text-accent hover:underline"
          >
            {kontak.email}
          </a>{" "}
          · {kontak.hours}
        </p>
      </section>

      <section id="faq" className="scroll-mt-28 px-4 py-24 sm:px-6 sm:py-32">
        <Reveal>
          <SectionHeading title="Pertanyaan yang sering diajukan" />
        </Reveal>
        <Reveal className="mt-10">
          <FaqList items={faq} />
        </Reveal>
      </section>
    </>
  );
}
