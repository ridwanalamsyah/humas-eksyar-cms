import type { Metadata } from "next";
import { HighlightCard } from "@/components/site/highlight-card";
import { PageHeader } from "@/components/site/page-header";
import { Reveal } from "@/components/site/reveal";
import { SectionHeading } from "@/components/site/section-heading";
import { beasiswa, himpunan, kegiatanMahasiswa, kontak, prestasi, prodi, prospekKarir, sorotan } from "@/lib/site/prodi";
import { LocalNav } from "@/components/site/local-nav";
import { PrestasiCard } from "@/components/site/prestasi-card";

export const metadata: Metadata = {
  title: "Kemahasiswaan",
  description: `Himpunan mahasiswa, kegiatan, dan beasiswa di ${prodi.fullName} ${prodi.university}.`,
};

export default function KemahasiswaanPage() {
  return (
    <>
      <PageHeader
        crumb="Kemahasiswaan"
        title="Kampus bukan cuma ruang kelas."
        description="Berorganisasi, berkompetisi, dan mengabdi — bersama keluarga besar Ekonomi Syariah."
      />

      <LocalNav
        items={[
          { id: "hmj", label: "HMJ" },
          { id: "prestasi", label: "Prestasi" },
          { id: "kegiatan", label: "Kegiatan" },
          { id: "beasiswa", label: "Beasiswa" },
          { id: "alumni", label: "Alumni" },
        ]}
      />

      {/* Eksphoria */}
      <section className="px-4 py-24 sm:px-6 sm:py-32">
        <Reveal className="mx-auto max-w-[1024px]">
          <div className="relative overflow-hidden rounded-[32px] bg-accent px-8 py-16 text-center text-white sm:px-16 sm:py-24">
            <p className="relative font-script text-[36px] leading-none text-amber">Program unggulan HMJ</p>
            <h2 className="relative mt-2 text-[clamp(3rem,2rem+4vw,5.5rem)] font-semibold leading-none tracking-[-0.04em]">
              {himpunan.flagship.name}
            </h2>
            <p className="relative mt-2 text-[17px] text-white/60">{himpunan.flagship.full}</p>
            <p className="relative mx-auto mt-6 max-w-xl text-[19px] leading-[1.45] text-white/80">
              {himpunan.flagship.description}
            </p>
          </div>
        </Reveal>
      </section>

      {/* HMJ */}
      <section id="hmj" className="scroll-mt-28 bg-mist px-4 py-24 sm:px-6 sm:py-32">
        <Reveal>
          <SectionHeading eyebrow={himpunan.cabinet} title={himpunan.name} description={himpunan.description} />
          <p className="mt-6 text-center text-[15px] text-label-2">
            Ketua HMJ {himpunan.chairPeriod}: <span className="font-bold text-label">{himpunan.chair}</span>
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
            <a href={himpunan.instagram} target="_blank" rel="noopener noreferrer" className="text-[17px] text-accent hover:underline">
              Instagram ↗
            </a>
            <a href={himpunan.youtube} target="_blank" rel="noopener noreferrer" className="text-[17px] text-accent hover:underline">
              YouTube ↗
            </a>
          </div>
        </Reveal>
        <div className="mx-auto mt-14 grid max-w-[1024px] gap-4 sm:grid-cols-2">
          {kegiatanMahasiswa.map((k, i) => (
            <Reveal key={k.title} delay={(i % 2) * 0.06}>
              <div className="h-full rounded-[28px] bg-canvas p-8">
                <h3 className="text-[21px] font-semibold tracking-[-0.01em] text-label">{k.title}</h3>
                <p className="mt-2 text-[17px] leading-[1.45] text-label-2">{k.description}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Prestasi */}
      <section id="prestasi" className="scroll-mt-28 px-4 py-24 sm:px-6 sm:py-32">
        <Reveal>
          <SectionHeading eyebrow="Mengucapkan" title="Selamat & Sukses." />
        </Reveal>
        <div className="mx-auto mt-14 grid max-w-[1024px] gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {prestasi.map((p, i) => (
            <Reveal key={p.name} delay={(i % 3) * 0.06}>
              <PrestasiCard item={p} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* Sorotan */}
      <section id="kegiatan" className="scroll-mt-28 bg-mist px-4 py-24 sm:px-6 sm:py-32">
        <Reveal>
          <SectionHeading eyebrow="Sorotan" title="Yang terjadi belakangan ini." />
        </Reveal>
        <div className="mx-auto mt-14 grid max-w-[1024px] gap-5 md:grid-cols-2">
          {sorotan.map((s) => (
            <Reveal key={s.title}>
              <HighlightCard item={s} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* Beasiswa */}
      <section id="beasiswa" className="scroll-mt-28 px-4 py-24 sm:px-6 sm:py-32">
        <Reveal>
          <SectionHeading
            eyebrow="Beasiswa"
            title="Biaya bukan penghalang."
            description="Informasi pendaftaran beasiswa diumumkan melalui kanal resmi kampus, fakultas, dan prodi."
          />
        </Reveal>
        <ul className="mx-auto mt-10 flex max-w-3xl flex-wrap justify-center gap-3">
          {beasiswa.map((b) => (
            <li key={b} className="rounded-full bg-mist px-5 py-2.5 text-[15px] font-medium text-label">
              {b}
            </li>
          ))}
        </ul>
      </section>
      {/* Alumni */}
      <section id="alumni" className="scroll-mt-28 bg-mist px-4 py-24 sm:px-6 sm:py-32">
        <Reveal>
          <SectionHeading
            eyebrow="Alumni"
            title="Berkiprah di banyak sektor."
            description="Alumni Ekonomi Syariah berkarya di lembaga keuangan syariah, pemerintahan, filantropi, dunia usaha, dan akademik."
          />
        </Reveal>
        <ul className="mx-auto mt-12 flex max-w-3xl flex-wrap justify-center gap-3">
          {prospekKarir.map((p) => (
            <li key={p.title} className="rounded-full bg-canvas px-5 py-2.5 text-[15px] font-medium text-label">
              {p.title}
            </li>
          ))}
        </ul>
        <p className="mt-10 text-center text-[15px] text-label-2">
          Alumni? Bagikan kabarmu lewat{" "}
          <a href={`mailto:${kontak.email}`} className="font-semibold text-accent hover:underline">
            email
          </a>{" "}
          atau{" "}
          <a href={kontak.instagram} target="_blank" rel="noopener noreferrer" className="font-semibold text-accent hover:underline">
            {kontak.instagramHandle}
          </a>
          .
        </p>
      </section>
    </>
  );
}
