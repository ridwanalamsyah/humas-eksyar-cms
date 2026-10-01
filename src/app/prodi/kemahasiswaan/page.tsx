import type { Metadata } from "next";
import Link from "next/link";
import { BeasiswaCard } from "@/components/site/beasiswa-card";
import { HighlightCard } from "@/components/site/highlight-card";
import { LocalNav } from "@/components/site/local-nav";
import { PageHeader } from "@/components/site/page-header";
import { PrestasiGrid } from "@/components/site/prestasi-grid";
import { Reveal } from "@/components/site/reveal";
import { SectionHeading } from "@/components/site/section-heading";
import { getSite } from "@/lib/site/get-site";
import { prodi } from "@/lib/site/prodi";

export const metadata: Metadata = {
  title: "Mahasiswa",
  description: `Prestasi, kegiatan, beasiswa, dan alumni ${prodi.fullName} ${prodi.university}.`,
};

export default async function KemahasiswaanPage() {
  const {
    prestasi,
    kegiatan,
    kegiatanMahasiswa,
    beasiswa,
    prospekKarir,
    kontak,
  } = await getSite();

  return (
    <>
      <PageHeader
        crumb="Mahasiswa"
        title="Kemahasiswaan"
        description="Prestasi, kegiatan, beasiswa, dan alumni Program Studi Ekonomi Syariah."
      />

      <LocalNav
        items={[
          { id: "organisasi", label: "Kegiatan" },
          { id: "prestasi", label: "Prestasi" },
          { id: "kegiatan", label: "Kegiatan" },
          { id: "beasiswa", label: "Beasiswa" },
          { id: "alumni", label: "Alumni" },
        ]}
      />

      {/* Kegiatan mahasiswa */}
      <section
        id="organisasi"
        className="scroll-mt-28 bg-mist px-4 py-24 sm:px-6 sm:py-32"
      >
        <Reveal>
          <SectionHeading
            eyebrow="Pengembangan diri"
            title="Kegiatan mahasiswa"
            description="Kegiatan akademik dan nonakademik yang dapat diikuti mahasiswa Ekonomi Syariah di luar perkuliahan."
          />
        </Reveal>
        <div className="mx-auto mt-14 grid max-w-[1024px] gap-4 sm:grid-cols-2">
          {kegiatanMahasiswa.map((k, i) => (
            <Reveal key={`${k.title}-${i}`} delay={(i % 2) * 0.06}>
              <div className="h-full rounded-[24px] bg-canvas p-8 transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_48px_-24px_rgba(22,58,69,0.35)]">
                <h3 className="text-[21px] font-bold tracking-[-0.01em] text-label">
                  {k.title}
                </h3>
                <p className="mt-2 text-[16px] leading-[1.5] text-label-2">
                  {k.description}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Prestasi */}
      <section
        id="prestasi"
        className="scroll-mt-28 px-4 py-24 sm:px-6 sm:py-32"
      >
        <Reveal>
          <SectionHeading
            eyebrow="Selamat & Sukses"
            title="Prestasi mahasiswa & dosen"
          />
        </Reveal>
        <div className="mx-auto mt-10 max-w-[1024px]">
          <PrestasiGrid items={prestasi} />
        </div>
      </section>

      {/* Kegiatan */}
      <section
        id="kegiatan"
        className="scroll-mt-28 bg-mist px-4 py-24 sm:px-6 sm:py-32"
      >
        <Reveal>
          <SectionHeading eyebrow="Kegiatan" title="Kegiatan terbaru" />
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
      <section
        id="beasiswa"
        className="scroll-mt-28 px-4 py-24 sm:px-6 sm:py-32"
      >
        <Reveal>
          <SectionHeading
            eyebrow="Beasiswa"
            title="Beasiswa untuk mahasiswa"
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
          <Link
            href="/prodi/beasiswa"
            className="text-[16px] font-semibold text-accent hover:underline"
          >
            Lihat semua beasiswa ›
          </Link>
        </p>
      </section>

      {/* Alumni */}
      <section
        id="alumni"
        className="scroll-mt-28 bg-mist px-4 py-24 sm:px-6 sm:py-32"
      >
        <Reveal>
          <SectionHeading
            eyebrow="Alumni"
            title="Sebaran karir alumni"
            description="Alumni Ekonomi Syariah berkarya di lembaga keuangan syariah, pemerintahan, filantropi, dunia usaha, dan akademik."
          />
        </Reveal>
        <ul className="mx-auto mt-12 flex max-w-3xl flex-wrap justify-center gap-3">
          {prospekKarir.map((p) => (
            <li
              key={p.title}
              className="rounded-full bg-canvas px-5 py-2.5 text-[15px] font-medium text-label"
            >
              {p.title}
            </li>
          ))}
        </ul>
        <p className="mt-10 text-center">
          <Link
            href="/prodi/alumni"
            className="text-[16px] font-semibold text-accent hover:underline"
          >
            Alumni & tracer study ›
          </Link>
        </p>
        <p className="mt-4 text-center text-[15px] text-label-2">
          Alumni? Bagikan kabarmu lewat{" "}
          <a
            href={`mailto:${kontak.email}`}
            className="font-semibold text-accent hover:underline"
          >
            email
          </a>
          {kontak.instagram && (
            <>
              {" "}
              atau{" "}
              <a
                href={kontak.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-accent hover:underline"
              >
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
