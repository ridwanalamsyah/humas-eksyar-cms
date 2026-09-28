import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import { KurikulumTabs } from "@/components/site/kurikulum-tabs";
import { PageHeader } from "@/components/site/page-header";
import { Reveal } from "@/components/site/reveal";
import { SectionHeading } from "@/components/site/section-heading";
import {
  capaianPembelajaran,
  kelompokMataKuliah,
  kurikulum,
  layananAkademik,
  prodi,
  profilLulusan,
  prospekKarir,
} from "@/lib/site/prodi";

export const metadata: Metadata = {
  title: "Akademik",
  description: `Kurikulum ${prodi.totalCredits} SKS, profil lulusan, capaian pembelajaran, dan prospek karir ${prodi.fullName}.`,
};

export default function AkademikPage() {
  return (
    <>
      <PageHeader
        crumb="Akademik"
        title="Kurikulum & Pembelajaran"
        description="Kurikulum yang memadukan teori ekonomi, fiqh muamalah, dan praktik industri untuk membentuk sarjana ekonomi syariah yang kompeten."
      />

      {/* Ringkasan */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <dl className="grid gap-px bg-pine-800/15 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { k: "Gelar", v: prodi.degree },
              { k: "Beban Studi", v: `${prodi.totalCredits} SKS` },
              { k: "Masa Studi Normal", v: prodi.normalDuration },
              { k: "Batas Maksimal", v: `${prodi.maxSemesters} semester` },
            ].map((x) => (
              <div key={x.k} className="bg-paper p-6">
                <dt className="text-[12px] font-semibold uppercase tracking-[0.18em] text-ink/50">{x.k}</dt>
                <dd className="mt-2 font-serif text-2xl font-semibold text-pine-800">{x.v}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-20 grid gap-12 lg:grid-cols-[1fr_1.4fr]">
            <Reveal>
              <SectionHeading
                eyebrow="Struktur Kurikulum"
                title="Tiga kelompok mata kuliah."
                description="Mata kuliah dikelompokkan berdasarkan kontribusinya terhadap kompetensi lulusan."
              />
            </Reveal>
            <div className="divide-y divide-pine-800/15 border-y border-pine-800/15">
              {kelompokMataKuliah.map((k) => (
                <Reveal key={k.code}>
                  <div className="grid gap-2 py-6 sm:grid-cols-[90px_1fr]">
                    <span className="font-serif text-2xl font-semibold text-saffron-600">{k.code}</span>
                    <div>
                      <h3 className="font-serif text-lg font-semibold text-pine-800">{k.title}</h3>
                      <p className="mt-1 text-[15px] leading-relaxed text-ink/65">{k.description}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Sebaran mata kuliah */}
      <section className="bg-paper-2 px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <Reveal>
            <SectionHeading
              eyebrow="Sebaran Mata Kuliah"
              title="Perjalanan belajar dari tahun ke tahun."
              description="Gambaran mata kuliah per semester. Daftar resmi dan bobot SKS terbaru tersedia di dokumen kurikulum prodi."
            />
          </Reveal>
          <Reveal className="mt-10">
            <KurikulumTabs years={kurikulum} />
          </Reveal>
        </div>
      </section>

      {/* Profil lulusan & CPL */}
      <section className="px-6 py-20">
        <div className="mx-auto grid max-w-7xl gap-16 lg:grid-cols-2">
          <div>
            <Reveal>
              <SectionHeading eyebrow="Profil Lulusan" title="Siapa lulusan kami." />
            </Reveal>
            <div className="mt-8 space-y-4">
              {profilLulusan.map((p, i) => (
                <Reveal key={p.title} delay={i * 0.04}>
                  <div className="border-l-[3px] border-saffron-500 bg-white/50 p-5">
                    <h3 className="font-serif text-lg font-semibold text-pine-800">{p.title}</h3>
                    <p className="mt-1 text-[15px] leading-relaxed text-ink/65">{p.description}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
          <div>
            <Reveal>
              <SectionHeading eyebrow="Capaian Pembelajaran" title="Kompetensi yang dibangun." />
            </Reveal>
            <div className="mt-8 grid gap-px bg-pine-800/15 sm:grid-cols-2">
              {capaianPembelajaran.map((c) => (
                <Reveal key={c.title} className="bg-paper">
                  <div className="h-full p-6">
                    <h3 className="font-serif text-lg font-semibold text-pine-700">{c.title}</h3>
                    <p className="mt-2 text-[14.5px] leading-relaxed text-ink/65">{c.description}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Prospek karir */}
      <section className="site-pattern bg-pine-800 px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <Reveal>
            <SectionHeading eyebrow="Prospek Karir" title="Ke mana lulusan melangkah." tone="dark" />
          </Reveal>
          <div className="mt-10 grid gap-px bg-white/10 sm:grid-cols-2 lg:grid-cols-4">
            {prospekKarir.map((p) => (
              <div key={p.title} className="bg-pine-900/85 p-6">
                <h3 className="font-serif text-lg font-semibold text-paper">{p.title}</h3>
                <p className="mt-2 text-[14px] leading-relaxed text-pine-100/70">{p.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Layanan */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <Reveal>
            <SectionHeading eyebrow="Layanan Akademik" title="Akses sistem akademik kampus." />
          </Reveal>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {layananAkademik.map((l) => (
              <a
                key={l.href}
                href={l.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group border border-pine-800/15 p-6 transition-colors hover:border-pine-700 hover:bg-pine-800"
              >
                <div className="flex items-start justify-between gap-3">
                  <span className="font-serif text-lg font-semibold text-pine-800 group-hover:text-paper">{l.title}</span>
                  <ArrowUpRight className="size-4 shrink-0 text-saffron-600 group-hover:text-saffron-300" />
                </div>
                <p className="mt-2 text-[14px] text-ink/60 group-hover:text-pine-100/75">{l.description}</p>
              </a>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
