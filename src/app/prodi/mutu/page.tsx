import type { Metadata } from "next";
import {
  ArrowUpRight,
  ClipboardCheck,
  GraduationCap,
  ShieldCheck,
} from "lucide-react";
import { getSite } from "@/lib/site/get-site";
import { prodi } from "@/lib/site/prodi";
import { HighlightCard } from "@/components/site/highlight-card";
import { PageHeader } from "@/components/site/page-header";
import { Reveal } from "@/components/site/reveal";
import { SectionHeading } from "@/components/site/section-heading";
import { UnduhanList } from "@/components/site/unduhan-list";
import { DataStatistik } from "@/components/site/data-statistik";

export const metadata: Metadata = {
  title: "Mutu & Data",
  description: `Akreditasi, penjaminan mutu, survei kepuasan, dan data statistik ${prodi.fullName} ${prodi.university}.`,
};

export default async function MutuPage() {
  const { identity, mutu, unduhan, kegiatan } = await getSite();
  const docs = unduhan.filter((u) =>
    /akreditasi|mutu|spmi|sertifikat|survei/i.test(`${u.category} ${u.title}`),
  );
  const reviews = kegiatan.filter((k) => /mutu/i.test(k.category)).slice(0, 2);
  const links = [
    {
      url: mutu.surveiUrl,
      title: "Survei kepuasan layanan",
      desc: "Isi survei untuk mahasiswa, dosen, dan mitra.",
      Icon: ClipboardCheck,
    },
    {
      url: mutu.tracerUrl,
      title: "Tracer study alumni",
      desc: "Pelacakan karier lulusan UIN SGD oleh CDC.",
      Icon: GraduationCap,
    },
    {
      url: mutu.sebaranUrl,
      title: "Peta sebaran alumni",
      desc: "Data sebaran tempat kerja lulusan.",
      Icon: ShieldCheck,
    },
  ].filter((l) => l.url);

  return (
    <>
      <PageHeader
        crumb="Mutu & data"
        title="Mutu & data"
        description={mutu.description}
      />

      <section className="px-4 pb-24 sm:px-6">
        <div className="mx-auto grid max-w-[1024px] gap-4 md:grid-cols-2">
          <Reveal>
            <div className="flex h-full flex-col rounded-[28px] bg-accent p-8 text-white sm:p-10">
              <p className="text-[14px] font-bold text-sand">
                Akreditasi Institusi · BAN-PT
              </p>
              <p className="mt-auto pt-12 text-[clamp(3rem,2rem+3vw,4.5rem)] font-extrabold leading-none tracking-[-0.04em]">
                {identity.universityAccreditation}
              </p>
              <p className="mt-3 text-[15px] text-white/80">
                UIN Sunan Gunung Djati Bandung ·{" "}
                {identity.universityAccreditationPeriod}
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.06}>
            <div className="flex h-full flex-col rounded-[28px] bg-mist p-8 sm:p-10">
              <p className="text-[14px] font-bold text-accent">
                Akreditasi Program Studi
              </p>
              <p className="mt-auto pt-12 text-[clamp(2.25rem,1.8rem+2vw,3.25rem)] font-extrabold leading-none tracking-[-0.03em] text-label">
                {identity.prodiAccreditation || "Terakreditasi"}
              </p>
              <p className="mt-3 text-[15px] text-label-2">{prodi.fullName}</p>
            </div>
          </Reveal>
        </div>
      </section>

      {links.length > 0 && (
        <section className="px-4 pb-24 sm:px-6">
          <div className="mx-auto max-w-[1024px]">
            <Reveal>
              <SectionHeading
                align="left"
                eyebrow="Partisipasi"
                title="Survei & tracer study"
              />
            </Reveal>
            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {links.map(({ url, title, desc, Icon }) => (
                <a
                  key={title}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex h-full flex-col rounded-[24px] border border-hairline bg-canvas p-6 transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_48px_-24px_rgba(22,58,69,0.35)]"
                >
                  <span className="flex items-start justify-between">
                    <span className="grid size-11 place-items-center rounded-2xl bg-accent-soft text-accent">
                      <Icon className="size-5" strokeWidth={1.75} />
                    </span>
                    <ArrowUpRight className="size-5 text-label-3 group-hover:text-accent" />
                  </span>
                  <span className="mt-6 text-[18px] font-bold text-label">
                    {title}
                  </span>
                  <span className="mt-1 text-[14.5px] text-label-2">
                    {desc}
                  </span>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      {docs.length > 0 && (
        <section className="bg-mist px-4 py-24 sm:px-6">
          <div className="mx-auto max-w-[1024px]">
            <SectionHeading
              align="left"
              eyebrow="Dokumen"
              title="Dokumen mutu & akreditasi"
            />
            <div className="mt-8">
              <UnduhanList items={docs} />
            </div>
          </div>
        </section>
      )}

      {reviews.length > 0 && (
        <section className="px-4 py-24 sm:px-6">
          <div className="mx-auto max-w-[1024px]">
            <SectionHeading
              align="left"
              eyebrow="Evaluasi"
              title="Peninjauan kurikulum"
            />
            <div className="mt-8 grid gap-5 sm:grid-cols-2">
              {reviews.map((k, i) => (
                <HighlightCard key={`${k.title}-${i}`} item={k} />
              ))}
            </div>
          </div>
        </section>
      )}
      <section
        id="data"
        className="scroll-mt-28 border-t border-hairline px-4 py-24 sm:px-6"
      >
        <div className="mx-auto max-w-[1024px]">
          <SectionHeading
            align="left"
            eyebrow="Data"
            title="Data & statistik"
            description="Angka-angka utama program studi. Sumber data dicantumkan pada tiap grafik."
          />
          <div className="mt-10">
            <DataStatistik />
          </div>
        </div>
      </section>
    </>
  );
}
