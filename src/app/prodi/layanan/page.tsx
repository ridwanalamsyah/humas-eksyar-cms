import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, ChevronRight } from "lucide-react";
import { FaqList } from "@/components/site/faq-list";
import { FormRenderer } from "@/components/site/form-renderer";
import { LocalNav } from "@/components/site/local-nav";
import { PageHeader } from "@/components/site/page-header";
import { ProsedurList } from "@/components/site/prosedur-list";
import { Reveal } from "@/components/site/reveal";
import { SectionHeading } from "@/components/site/section-heading";
import { StatusLayanan } from "@/components/site/status-layanan";
import { UnduhanList } from "@/components/site/unduhan-list";
import { ACTIVE_FORMS, findActiveForm } from "@/lib/site/forms";
import { getSite } from "@/lib/site/get-site";
import { prodi } from "@/lib/site/prodi";

export const metadata: Metadata = {
  title: "Layanan",
  description: `Formulir online, unduhan dokumen, alur layanan, dan FAQ ${prodi.fullName} ${prodi.university}.`,
};

const FEBI_URL = "https://febi.uinsgd.ac.id";
const tanyaForm = findActiveForm("tanya")!;

export default async function LayananPage() {
  const { faq, kontak, aksesCepat, prosedur, statusLayanan, unduhan } =
    await getSite();
  const forms = ACTIVE_FORMS.filter((f) => !f.embedded);

  return (
    <>
      <PageHeader
        crumb="Layanan"
        title="Layanan mahasiswa"
        description="Formulir online, dokumen prodi, alur layanan, dan jawaban atas pertanyaan yang sering diajukan."
      />
      <div className="px-4 sm:px-6">
        <StatusLayanan
          status={statusLayanan.status}
          pesan={statusLayanan.pesan}
        />
      </div>

      <LocalNav
        items={[
          { id: "formulir", label: "Formulir" },
          ...(unduhan.length ? [{ id: "unduhan", label: "Unduhan" }] : []),
          ...(prosedur.length ? [{ id: "alur", label: "Alur layanan" }] : []),
          { id: "digital", label: "Sistem kampus" },
          { id: "faq", label: "FAQ" },
        ]}
      />

      {/* Formulir online */}
      <section
        id="formulir"
        className="scroll-mt-28 px-4 py-24 sm:px-6 sm:py-28"
      >
        <div className="mx-auto max-w-[1024px]">
          <Reveal>
            <SectionHeading
              align="left"
              eyebrow="Tanpa perlu datang ke ruang prodi"
              title="Formulir online"
            />
          </Reveal>
          <ul className="mt-10 grid gap-3 md:grid-cols-2">
            {forms.map((f) => (
              <li key={f.slug}>
                <Link
                  href={`/prodi/formulir/${f.slug}`}
                  className="group flex h-full items-start justify-between gap-4 rounded-[20px] border border-hairline bg-canvas p-5 transition-colors hover:border-accent/40"
                >
                  <span>
                    <span className="block text-[17px] font-bold text-label group-hover:text-accent">
                      {f.title}
                    </span>
                    <span className="mt-1 block text-[14.5px] leading-[1.5] text-label-2">
                      {f.description}
                    </span>
                  </span>
                  <ChevronRight className="mt-1 size-5 shrink-0 text-label-3 group-hover:text-accent" />
                </Link>
              </li>
            ))}
            <li>
              <a
                href={FEBI_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex h-full items-start justify-between gap-4 rounded-[20px] bg-accent p-5 text-white transition-colors hover:bg-accent-strong"
              >
                <span>
                  <span className="block text-[17px] font-bold">
                    Surat & administrasi
                  </span>
                  <span className="mt-1 block text-[14.5px] leading-[1.5] text-white/80">
                    Surat aktif kuliah, rekomendasi, dan izin penelitian
                    dilayani Tata Usaha FEBI.
                  </span>
                </span>
                <ArrowUpRight className="mt-1 size-5 shrink-0" />
              </a>
            </li>
          </ul>
        </div>
      </section>

      {/* Unduhan */}
      {unduhan.length > 0 && (
        <section
          id="unduhan"
          className="scroll-mt-28 bg-mist px-4 py-24 sm:px-6 sm:py-28"
        >
          <div className="mx-auto max-w-[1024px]">
            <Reveal>
              <SectionHeading
                align="left"
                eyebrow="Dokumen"
                title="Unduhan"
                description="Pedoman akademik, kalender, jadwal kuliah, template surat, dan sertifikat akreditasi."
              />
            </Reveal>
            <div className="mt-10">
              <UnduhanList items={unduhan} />
            </div>
          </div>
        </section>
      )}

      {/* Alur layanan akademik */}
      {prosedur.length > 0 && (
        <section id="alur" className="scroll-mt-28 px-4 py-24 sm:px-6 sm:py-28">
          <div className="mx-auto max-w-[860px]">
            <Reveal>
              <SectionHeading
                eyebrow="Tata cara"
                title="Alur layanan akademik"
              />
            </Reveal>
            <div className="mt-10">
              <ProsedurList items={prosedur} />
            </div>
          </div>
        </section>
      )}

      {/* Sistem kampus */}
      <section
        id="digital"
        className="scroll-mt-28 bg-mist px-4 py-24 sm:px-6 sm:py-28"
      >
        <Reveal>
          <SectionHeading eyebrow="Sistem kampus" title="Akses cepat" />
        </Reveal>
        <div className="mx-auto mt-12 grid max-w-[1024px] gap-4 sm:grid-cols-2">
          {aksesCepat.map((l) => (
            <a
              key={l.url}
              href={l.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-start justify-between gap-6 rounded-[24px] bg-canvas p-7 transition-colors hover:bg-canvas/70"
            >
              <span>
                <span className="block text-[19px] font-bold tracking-[-0.01em] text-label">
                  {l.name}
                </span>
                <span className="mt-1 block text-[15px] text-label-2">
                  {l.description}
                </span>
              </span>
              <span className="grid size-9 shrink-0 place-items-center rounded-full bg-mist text-accent transition-colors group-hover:bg-accent group-hover:text-white">
                <ArrowUpRight className="size-4" />
              </span>
            </a>
          ))}
        </div>
      </section>

      {/* FAQ + kirim pertanyaan */}
      <section id="faq" className="scroll-mt-28 px-4 py-24 sm:px-6 sm:py-28">
        <Reveal>
          <SectionHeading title="Pertanyaan yang sering diajukan" />
        </Reveal>
        <Reveal className="mt-10">
          <FaqList items={faq} />
        </Reveal>
        <div className="mx-auto mt-14 max-w-[720px] rounded-[24px] border border-hairline p-6 sm:p-8">
          <h3 className="text-[20px] font-bold tracking-[-0.01em] text-label">
            {tanyaForm.title}
          </h3>
          <p className="mt-1 text-[15px] text-label-2">
            {tanyaForm.description}
          </p>
          <div className="mt-6">
            <FormRenderer def={tanyaForm} compact />
          </div>
          <p className="mt-6 text-[13.5px] text-label-3">
            Atau email{" "}
            <a
              href={`mailto:${kontak.email}`}
              className="font-semibold text-accent hover:underline"
            >
              {kontak.email}
            </a>{" "}
            · {kontak.hours}
          </p>
        </div>
      </section>
    </>
  );
}
