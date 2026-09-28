import type { Metadata } from "next";
import { ArrowUpRight, Check } from "lucide-react";
import { HighlightCard } from "@/components/site/highlight-card";
import { PageHeader } from "@/components/site/page-header";
import { Reveal } from "@/components/site/reveal";
import { SectionHeading } from "@/components/site/section-heading";
import { beasiswa, himpunan, kegiatanMahasiswa, prodi, sorotan } from "@/lib/site/prodi";

export const metadata: Metadata = {
  title: "Kemahasiswaan",
  description: `Himpunan mahasiswa, kegiatan, prestasi, dan beasiswa di ${prodi.fullName} ${prodi.university}.`,
};

export default function KemahasiswaanPage() {
  return (
    <>
      <PageHeader
        crumb="Kemahasiswaan"
        title="Kehidupan Mahasiswa Ekonomi Syariah"
        description="Belajar tidak berhenti di ruang kelas. Mahasiswa aktif berorganisasi, berkompetisi, dan mengabdi kepada masyarakat."
      />

      {/* HMJ */}
      <section className="px-6 py-20">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1.2fr_1fr] lg:items-start">
          <Reveal>
            <SectionHeading eyebrow="Organisasi Mahasiswa" title={himpunan.name} />
            <p className="mt-2 font-serif text-lg italic text-saffron-600">{himpunan.cabinet}</p>
            <p className="mt-5 max-w-2xl text-[16.5px] leading-[1.8] text-ink/75">{himpunan.description}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href={himpunan.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-11 items-center gap-2 rounded-sm bg-pine-700 px-6 text-[13px] font-bold uppercase tracking-[0.1em] text-paper hover:bg-pine-800"
              >
                Instagram HMJ <ArrowUpRight className="size-4" />
              </a>
              <a
                href={himpunan.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-11 items-center gap-2 rounded-sm border border-pine-700 px-6 text-[13px] font-bold uppercase tracking-[0.1em] text-pine-700 hover:bg-pine-50"
              >
                YouTube HMJ <ArrowUpRight className="size-4" />
              </a>
            </div>
          </Reveal>
          <Reveal delay={0.05}>
            <div className="site-pattern bg-pine-800 p-8 text-paper">
              <p className="text-[12px] font-semibold uppercase tracking-[0.22em] text-saffron-300">Program Unggulan</p>
              <p className="mt-3 font-serif text-4xl font-semibold">{himpunan.flagship.name}</p>
              <p className="text-sm italic text-pine-100/70">{himpunan.flagship.full}</p>
              <p className="mt-5 text-[15px] leading-relaxed text-pine-100/85">{himpunan.flagship.description}</p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Kegiatan */}
      <section className="bg-paper-2 px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <Reveal>
            <SectionHeading eyebrow="Kegiatan" title="Ruang tumbuh di luar kelas." />
          </Reveal>
          <div className="mt-10 grid border-l border-t border-pine-800/15 sm:grid-cols-2 lg:grid-cols-4">
            {kegiatanMahasiswa.map((k, i) => (
              <div key={k.title} className="border-b border-r border-pine-800/15 p-6">
                <span className="font-serif text-3xl font-semibold text-saffron-500">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="mt-4 font-serif text-lg font-semibold text-pine-800">{k.title}</h3>
                <p className="mt-2 text-[14.5px] leading-relaxed text-ink/65">{k.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sorotan */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <Reveal>
            <SectionHeading eyebrow="Sorotan" title="Kegiatan terbaru prodi & mahasiswa." />
          </Reveal>
          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {sorotan.map((s) => (
              <Reveal key={s.title}>
                <HighlightCard item={s} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Beasiswa */}
      <section className="border-t border-pine-800/10 px-6 py-20">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1fr_1.4fr]">
          <Reveal>
            <SectionHeading
              eyebrow="Beasiswa"
              title="Kesempatan beasiswa bagi mahasiswa."
              description="Informasi pendaftaran beasiswa diumumkan melalui kanal resmi kampus, fakultas, dan program studi."
            />
          </Reveal>
          <ul className="grid gap-3 sm:grid-cols-2">
            {beasiswa.map((b) => (
              <li key={b} className="flex items-center gap-3 border border-pine-800/15 px-5 py-4 text-[15px] font-medium text-pine-800">
                <Check className="size-4 shrink-0 text-saffron-600" />
                {b}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
