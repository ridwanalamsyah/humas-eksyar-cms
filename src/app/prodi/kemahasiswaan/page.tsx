import type { Metadata } from "next";
import Link from "next/link";
import { BeasiswaCard } from "@/components/site/beasiswa-card";
import { HighlightCard } from "@/components/site/highlight-card";
import { LocalNav } from "@/components/site/local-nav";
import { PageHeader } from "@/components/site/page-header";
import { PrestasiCard } from "@/components/site/prestasi-card";
import { Reveal } from "@/components/site/reveal";
import { SectionHeading } from "@/components/site/section-heading";
import { getSite } from "@/lib/site/get-site";
import { prodi } from "@/lib/site/prodi";

export const metadata: Metadata = {
  title: "Mahasiswa",
  description: `Himpunan mahasiswa, prestasi, kegiatan, beasiswa, dan alumni ${prodi.fullName} ${prodi.university}.`,
};

export default async function KemahasiswaanPage() {
  const { himpunan, prestasi, kegiatan, kegiatanMahasiswa, beasiswa, prospekKarir, kontak } = await getSite();

  return (
    <>
      <PageHeader
        crumb="Mahasiswa"
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

      {/* Program unggulan */}
      <section className="px-4 py-24 sm:px-6 sm:py-32">
        <Reveal className="mx-auto max-w-[1024px]">
          <div className="rounded-[32px] bg-accent px-8 py-16 text-center text-white sm:px-16 sm:py-24">
            <p className="text-[15px] font-semibold uppercase tracking-[0.08em] text-sand">Program unggulan HMJ</p>
            <h2 className="mt-3 text-[clamp(3rem,2rem+4vw,5.5rem)] font-extrabold leading-none tracking-[-0.04em]">
              {himpunan.flagshipName}
            </h2>
            <p className="mt-3 text-[17px] text-white/70">{himpunan.flagshipFull}</p>
            <p className="mx-auto mt-6 max-w-xl text-[19px] leading-[1.45] text-white/85">{himpunan.flagshipDescription}</p>
          </div>
        </Reveal>
      </section>

      {/* HMJ */}
      <section id="hmj" className="scroll-mt-28 bg-mist px-4 py-24 sm:px-6 sm:py-32">
        <Reveal>
          <SectionHeading eyebrow={himpunan.cabinet} title={himpunan.name} description={himpunan.description} />
          {himpunan.chair && (
            <p className="mt-6 text-center text-[15px] text-label-2">
              Ketua HMJ {himpunan.chairPeriod}: <span className="font-bold text-label">{himpunan.chair}</span>
            </p>
          )}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            {himpunan.instagram && (
              <a href={himpunan.instagram} target="_blank" rel="noopener noreferrer" className="rounded-full bg-canvas px-5 py-2.5 text-[15px] font-semibold text-accent transition-colors hover:bg-accent hover:text-white">
                Instagram ↗
              </a>
            )}
            {himpunan.youtube && (
              <a href={himpunan.youtube} target="_blank" rel="noopener noreferrer" className="rounded-full bg-canvas px-5 py-2.5 text-[15px] font-semibold text-accent transition-colors hover:bg-accent hover:text-white">
                YouTube ↗
              </a>
            )}
          </div>
        </Reveal>
        <div className="mx-auto mt-14 grid max-w-[1024px] gap-4 sm:grid-cols-2">
          {kegiatanMahasiswa.map((k, i) => (
            <Reveal key={`${k.title}-${i}`} delay={(i % 2) * 0.06}>
              <div className="h-full rounded-[24px] bg-canvas p-8 transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_48px_-24px_rgba(22,58,69,0.35)]">
                <h3 className="text-[21px] font-bold tracking-[-0.01em] text-label">{k.title}</h3>
                <p className="mt-2 text-[16px] leading-[1.5] text-label-2">{k.description}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Prestasi */}
      <section id="prestasi" className="scroll-mt-28 px-4 py-24 sm:px-6 sm:py-32">
        <Reveal>
          <SectionHeading eyebrow="Selamat & Sukses" title="Prestasi & amanah." />
        </Reveal>
        <div className="mx-auto mt-14 grid max-w-[1024px] gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {prestasi.map((p, i) => (
            <Reveal key={`${p.name}-${i}`} delay={(i % 3) * 0.06}>
              <PrestasiCard item={p} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* Kegiatan */}
      <section id="kegiatan" className="scroll-mt-28 bg-mist px-4 py-24 sm:px-6 sm:py-32">
        <Reveal>
          <SectionHeading eyebrow="Kegiatan" title="Yang terjadi belakangan ini." />
        </Reveal>
        <div className="mx-auto mt-14 grid max-w-[1024px] gap-5 md:grid-cols-2 lg:grid-cols-3">
          {kegiatan.map((s, i) => (
            <Reveal key={`${s.title}-${i}`} delay={(i % 3) * 0.05}>
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
            description="Beasiswa pemerintah, lembaga zakat, perbankan, dan kampus yang terbuka untuk mahasiswa."
          />
        </Reveal>
        <div className="mx-auto mt-12 grid max-w-[1024px] gap-5 md:grid-cols-3">
          {beasiswa.slice(0, 3).map((b, i) => (
            <Reveal key={`${b.name}-${i}`} delay={i * 0.05}>
              <BeasiswaCard item={b} compact />
            </Reveal>
          ))}
        </div>
        <p className="mt-10 text-center">
          <Link href="/prodi/beasiswa" className="text-[16px] font-semibold text-accent hover:underline">
            Lihat semua beasiswa ›
          </Link>
        </p>
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
          </a>
          {kontak.instagram && (
            <>
              {" "}atau{" "}
              <a href={kontak.instagram} target="_blank" rel="noopener noreferrer" className="font-semibold text-accent hover:underline">
                {kontak.instagramHandle}
              </a>
            </>
          )}
          .
        </p>
      </section>
    </>
  );
}
