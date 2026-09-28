import type { Metadata } from "next";
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
  const facts = [
    { v: String(prodi.totalCredits), u: "SKS", k: "Beban studi" },
    { v: "8", u: "semester", k: "Masa studi normal" },
    { v: String(prodi.maxSemesters), u: "semester", k: "Batas maksimal" },
    { v: "S.E.", u: "", k: "Gelar lulusan" },
  ];

  return (
    <>
      <PageHeader
        crumb="Akademik"
        title="Belajar ekonomi, dengan nilai."
        description="Kurikulum yang memadukan teori ekonomi, fiqh muamalah, dan praktik industri."
      />

      {/* Angka */}
      <section className="px-4 pb-24 sm:px-6 sm:pb-32">
        <dl className="mx-auto grid max-w-[1024px] grid-cols-2 gap-y-12 text-center md:grid-cols-4">
          {facts.map((f) => (
            <Reveal key={f.k}>
              <dd className="text-[clamp(2.75rem,2rem+2.5vw,4rem)] font-semibold leading-none tracking-[-0.04em] text-label">
                {f.v}
                {f.u && <span className="ml-1.5 text-[0.35em] font-semibold tracking-[-0.01em] text-label-2">{f.u}</span>}
              </dd>
              <dt className="mt-3 text-[15px] text-label-2">{f.k}</dt>
            </Reveal>
          ))}
        </dl>
      </section>

      {/* Struktur */}
      <section className="bg-mist px-4 py-24 sm:px-6 sm:py-32">
        <Reveal>
          <SectionHeading
            eyebrow="Struktur Kurikulum"
            title="Tiga kelompok mata kuliah."
            description="Setiap kelompok berkontribusi pada kompetensi lulusan yang berbeda."
          />
        </Reveal>
        <div className="mx-auto mt-14 grid max-w-[1024px] gap-4 md:grid-cols-3">
          {kelompokMataKuliah.map((k, i) => (
            <Reveal key={k.code} delay={i * 0.06}>
              <div className="h-full rounded-[28px] bg-canvas p-8">
                <p className="text-[40px] font-semibold leading-none tracking-[-0.03em] text-accent">{k.code}</p>
                <h3 className="mt-6 text-[21px] font-semibold leading-snug tracking-[-0.01em] text-label">{k.title}</h3>
                <p className="mt-2 text-[16px] leading-[1.45] text-label-2">{k.description}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <div className="mx-auto mt-24 max-w-[1024px]">
          <Reveal>
            <SectionHeading
              eyebrow="Sebaran Mata Kuliah"
              title="Tahun demi tahun."
              description="Gambaran mata kuliah per semester. Daftar resmi tersedia di dokumen kurikulum prodi."
            />
          </Reveal>
          <Reveal className="mt-10">
            <KurikulumTabs years={kurikulum} />
          </Reveal>
        </div>
      </section>

      {/* Profil lulusan */}
      <section className="px-4 py-24 sm:px-6 sm:py-32">
        <Reveal>
          <SectionHeading eyebrow="Profil Lulusan" title="Menjadi siapa setelah lulus." />
        </Reveal>
        <div className="mx-auto mt-14 grid max-w-[1024px] gap-x-12 gap-y-10 sm:grid-cols-2">
          {profilLulusan.map((p) => (
            <Reveal key={p.title} className="border-t border-hairline pt-6">
              <h3 className="text-[21px] font-semibold tracking-[-0.01em] text-label">{p.title}</h3>
              <p className="mt-2 text-[17px] leading-[1.45] text-label-2">{p.description}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* CPL */}
      <section className="bg-label px-4 py-24 text-white sm:px-6 sm:py-32">
        <Reveal className="mx-auto max-w-3xl text-center">
          <p className="font-script text-[36px] leading-none text-amber">Capaian Pembelajaran</p>
          <h2 className="mt-1 text-[clamp(2rem,1.4rem+2.4vw,3.5rem)] font-extrabold leading-[1.07] tracking-[-0.03em]">
            Kompetensi yang dibangun.
          </h2>
        </Reveal>
        <div className="mx-auto mt-14 grid max-w-[1024px] gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {capaianPembelajaran.map((c) => (
            <Reveal key={c.title}>
              <div className="h-full rounded-[28px] bg-white/[0.06] p-7">
                <h3 className="text-[19px] font-semibold text-white">{c.title}</h3>
                <p className="mt-2 text-[15px] leading-[1.45] text-white/65">{c.description}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Karir */}
      <section className="px-4 py-24 sm:px-6 sm:py-32">
        <Reveal>
          <SectionHeading
            eyebrow="Prospek Karir"
            title="Banyak pintu terbuka."
            description="Industri keuangan syariah dan ekonomi halal terus tumbuh — begitu pula kebutuhan akan lulusannya."
          />
        </Reveal>
        <ul className="mx-auto mt-14 grid max-w-[1024px] gap-x-12 sm:grid-cols-2">
          {prospekKarir.map((p) => (
            <li key={p.title} className="flex items-baseline justify-between gap-6 border-b border-hairline py-5">
              <span className="text-[19px] font-semibold tracking-[-0.01em] text-label">{p.title}</span>
              <span className="hidden text-right text-[14px] text-label-2 lg:block">{p.description}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Layanan */}
      <section className="bg-mist px-4 py-24 sm:px-6">
        <div className="mx-auto grid max-w-[1024px] gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {layananAkademik.map((l) => (
            <a
              key={l.href}
              href={l.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group rounded-[20px] bg-canvas p-6 border border-hairline transition-colors duration-300 hover:border-accent/40"
            >
              <p className="text-[17px] font-semibold text-label">{l.title}</p>
              <p className="mt-1 text-[14px] text-label-2">{l.description}</p>
              <p className="mt-4 text-[14px] text-accent group-hover:underline">Buka ↗</p>
            </a>
          ))}
        </div>
      </section>
    </>
  );
}
