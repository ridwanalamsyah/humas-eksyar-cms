import type { Metadata } from "next";
import Link from "next/link";
import { KurikulumTabs } from "@/components/site/kurikulum-tabs";
import { PageHeader } from "@/components/site/page-header";
import { PrintButton } from "@/components/site/print-button";
import { Reveal } from "@/components/site/reveal";
import { SectionHeading } from "@/components/site/section-heading";
import { getSite } from "@/lib/site/get-site";
import { getAkademik } from "@/lib/site/akademik";
import { MataKuliahDirectory } from "@/components/site/matakuliah-directory";
import { RpsList } from "@/components/site/rps-list";
import { layananAkademik, prodi } from "@/lib/site/prodi";

export const metadata: Metadata = {
  title: "Akademik",
  description: `Kurikulum, profil lulusan, capaian pembelajaran, dan prospek karir ${prodi.fullName}.`,
};

export default async function AkademikPage() {
  const {
    identity,
    kelompokMataKuliah,
    kurikulum,
    profilLulusan,
    capaianPembelajaran,
    prospekKarir,
    peminatan,
    rps,
  } = await getSite();
  const akademik = await getAkademik();
  const facts = [
    { v: String(identity.totalCredits), u: "SKS", k: "Beban studi" },
    {
      v: identity.normalDuration.replace(/\D+/g, "") || "8",
      u: "semester",
      k: "Masa studi normal",
    },
    { v: String(identity.maxSemesters), u: "semester", k: "Batas maksimal" },
    {
      v: identity.degree.match(/\(([^)]+)\)/)?.[1] ?? identity.degree,
      u: "",
      k: "Gelar lulusan",
    },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "EducationalOccupationalProgram",
            name: `Program Studi Sarjana (S1) ${prodi.fullName}`,
            description: identity.heroDescription,
            provider: {
              "@type": "CollegeOrUniversity",
              name: prodi.university,
              url: "https://uinsgd.ac.id",
            },
            educationalCredentialAwarded: identity.degree,
            timeToComplete: "P4Y",
            numberOfCredits: identity.totalCredits,
            occupationalCategory:
              "Ekonom Syariah, Praktisi Perbankan Syariah, Analis Pasar Modal Syariah, Auditor Halal",
          }).replace(/</g, "\\u003c"),
        }}
      />
      <PageHeader
        crumb="Akademik"
        title="Akademik"
        description="Kurikulum yang memadukan teori ekonomi, fiqh muamalah, dan praktik industri."
      />
      {/* Dibuka langsung dengan mata kuliah per tahun: yang paling dicari. */}
      <section
        id="kurikulum"
        className="scroll-mt-28 px-4 pb-16 sm:px-6 sm:pb-24"
      >
        <div className="mx-auto max-w-[1024px]">
          <KurikulumTabs years={kurikulum} />
          <div className="mt-8 flex justify-center" data-print-hide>
            <PrintButton />
          </div>
        </div>
      </section>

      {/* Angka */}
      <section className="border-t border-hairline px-4 py-16 sm:px-6 sm:py-24">
        <dl className="mx-auto grid max-w-[1024px] grid-cols-2 gap-y-12 text-center md:grid-cols-4">
          {facts.map((f) => (
            <Reveal key={f.k}>
              <dd className="text-[clamp(2.75rem,2rem+2.5vw,4rem)] font-semibold leading-none tracking-[-0.04em] text-label">
                {f.v}
                {f.u && (
                  <span className="ml-1.5 text-[0.35em] font-semibold tracking-[-0.01em] text-label-2">
                    {f.u}
                  </span>
                )}
              </dd>
              <dt className="mt-3 text-[16px] text-label-2">{f.k}</dt>
            </Reveal>
          ))}
        </dl>
      </section>

      {/* Struktur */}
      <section className="bg-mist px-4 py-14 sm:px-6 sm:py-32">
        <Reveal>
          <SectionHeading
            eyebrow="Struktur Kurikulum"
            title="Kelompok mata kuliah"
          />
        </Reveal>
        <div className="mx-auto mt-8 grid max-w-[1024px] grid-cols-1 gap-5 sm:mt-14 sm:gap-8 md:grid-cols-3">
          {kelompokMataKuliah.map((k, i) => (
            <Reveal key={k.code} delay={i * 0.06}>
              <div className="h-full pt-6 border-t border-hairline">
                <p className="text-[24px] font-semibold leading-none tracking-[-0.03em] text-accent sm:text-[32px]">
                  {k.code}
                </p>
                <h3 className="mt-2 text-[17px] font-semibold leading-snug sm:mt-4 sm:text-[20px] tracking-[-0.01em] text-label">
                  {k.title}
                </h3>
                <p className="mt-2 hidden text-[16px] leading-[1.45] text-label-2 sm:block">
                  {k.description}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Peminatan & roadmap */}
      {peminatan.length > 0 && (
        <section
          id="peminatan"
          className="scroll-mt-28 px-4 py-14 sm:px-6 sm:py-24"
        >
          <div className="mx-auto max-w-[1024px]">
            <Reveal>
              <SectionHeading
                align="left"
                eyebrow="Roadmap studi"
                title="Peminatan"
                description="Pilihan fokus studi beserta mata kuliah yang disarankan dan arah kariernya."
              />
            </Reveal>
            <div className="mt-8 grid grid-cols-1 gap-x-10 gap-y-8 md:grid-cols-2">
              {peminatan.map((p) => (
                <div key={p.nama} className="border-t-2 border-accent pt-5">
                  <h3 className="text-[22px] font-bold leading-snug tracking-[-0.01em] text-label">
                    {p.nama}
                  </h3>
                  <p className="mt-2 text-[16px] leading-relaxed text-label-2">
                    {p.deskripsi}
                  </p>
                  {(p.mataKuliah.length > 0 || p.karier.length > 0) && (
                    <details className="group mt-3">
                      <summary className="inline-flex min-h-11 cursor-pointer list-none items-center gap-1.5 text-[15px] font-semibold text-accent">
                        <span className="group-open:hidden">
                          Lihat mata kuliah & karier
                        </span>
                        <span className="hidden group-open:inline">Tutup</span>
                      </summary>
                      {p.mataKuliah.length > 0 && (
                        <ol className="mt-4 space-y-1.5 text-[15px] text-label">
                          {p.mataKuliah.map((mk, k) => (
                            <li key={mk} className="flex gap-2">
                              <span className="font-bold tabular-nums opacity-60">
                                {k + 1}.
                              </span>{" "}
                              {mk}
                            </li>
                          ))}
                        </ol>
                      )}
                      {p.karier.length > 0 && (
                        <p className="mt-4 text-[14px] leading-relaxed text-label-3">
                          Arah karier: {p.karier.join(", ")}
                        </p>
                      )}
                    </details>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* RPS & referensi */}
      {rps.length > 0 && (
        <section
          id="rps"
          className="scroll-mt-28 bg-mist px-4 py-14 sm:px-6 sm:py-24"
        >
          <div className="mx-auto max-w-[1024px]">
            <Reveal>
              <SectionHeading
                align="left"
                eyebrow="Bahan kuliah"
                title="RPS & referensi mata kuliah"
              />
            </Reveal>
            <div className="mt-8">
              <RpsList items={rps} />
            </div>
          </div>
        </section>
      )}

      {/* Mata kuliah & dosen pengampu (e-Knows) */}
      {akademik && akademik.mataKuliah.length > 0 && (
        <section
          id="mata-kuliah"
          className="scroll-mt-28 px-4 py-14 sm:px-6 sm:py-32"
        >
          <div className="mx-auto max-w-[1024px]">
            <Reveal>
              <SectionHeading
                align="left"
                eyebrow="Perkuliahan"
                title="Mata kuliah & dosen pengampu"
                description={`${akademik.mataKuliah.length} mata kuliah di kelas daring e-Knows Prodi Ekonomi Syariah, diperbarui ${new Date(akademik.at).toLocaleDateString("id-ID", { dateStyle: "long" })}.`}
              />
            </Reveal>
            <div className="mt-10">
              <MataKuliahDirectory items={akademik.mataKuliah} />
            </div>
          </div>
        </section>
      )}

      {/* Profil lulusan */}
      <section className="px-4 py-14 sm:px-6 sm:py-32">
        <Reveal>
          <SectionHeading eyebrow="Profil Lulusan" title="Profil lulusan" />
        </Reveal>
        <div className="mx-auto mt-14 grid max-w-[1024px] gap-x-12 gap-y-10 sm:grid-cols-2">
          {profilLulusan.map((p) => (
            <Reveal key={p.title} className="border-t border-hairline pt-6">
              <h3 className="text-[24px] font-semibold tracking-[-0.01em] text-label">
                {p.title}
              </h3>
              <p className="mt-2 text-[16px] leading-[1.45] text-label-2">
                {p.description}
              </p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* CPL */}
      <section className="bg-navy px-4 py-16 text-white sm:px-6 sm:py-32">
        <Reveal className="mx-auto max-w-3xl text-center">
          <p className="text-[16px] font-semibold uppercase tracking-[0.08em] text-amber">
            Capaian pembelajaran
          </p>
          <h2 className="mt-3 text-[clamp(2rem,1.4rem+2.4vw,3.5rem)] font-extrabold leading-[1.07] tracking-[-0.03em]">
            Kompetensi yang dibangun.
          </h2>
        </Reveal>
        <div className="mx-auto mt-14 grid max-w-[1024px] gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {capaianPembelajaran.map((c) => (
            <Reveal key={c.title}>
              <div className="h-full border-t border-white/15 pt-5">
                <h3 className="text-[18px] font-semibold text-white">
                  {c.title}
                </h3>
                <p className="mt-2 text-[16px] leading-[1.55] text-white/75">
                  {c.description}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Karir */}
      <section className="px-4 py-14 sm:px-6 sm:py-32">
        <Reveal>
          <SectionHeading
            eyebrow="Prospek Karir"
            title="Bidang kerja lulusan"
            description="Lulusan Ekonomi Syariah bekerja di perbankan dan keuangan syariah, lembaga zakat dan wakaf, industri halal, pemerintahan, pendidikan, hingga berwirausaha."
          />
        </Reveal>
        <ul className="mx-auto mt-14 grid max-w-[1024px] gap-x-12 sm:grid-cols-2">
          {prospekKarir.map((p) => (
            <li
              key={p.title}
              className="flex items-baseline justify-between gap-6 border-b border-hairline py-5"
            >
              <span className="text-[18px] font-semibold tracking-[-0.01em] text-label">
                {p.title}
              </span>
              <span className="hidden text-right text-[14px] text-label-2 lg:block">
                {p.description}
              </span>
            </li>
          ))}
        </ul>
      </section>

      {/* Sumber belajar */}
      <section className="px-4 pb-24 sm:px-6">
        <div className="mx-auto grid max-w-[1024px] gap-4 sm:grid-cols-2">
          {[
            {
              href: "/prodi/layanan#unduhan",
              t: "Unduhan dokumen",
              d: "Pedoman akademik, kalender, jadwal kuliah, dan template.",
            },
            {
              href: "/prodi/skripsi",
              t: "Cek judul skripsi",
              d: "Periksa kemiripan judul sebelum mengajukan proposal.",
            },
          ].map((c) => (
            <Link
              key={c.href}
              href={c.href}
              className="group flex items-center justify-between gap-6 rounded-[24px] bg-accent p-8 text-white transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_48px_-24px_rgba(22,58,69,0.5)]"
            >
              <span>
                <span className="block text-[24px] font-extrabold tracking-[-0.02em]">
                  {c.t}
                </span>
                <span className="mt-1 block text-[16px] text-white/80">
                  {c.d}
                </span>
              </span>
              <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-white/15 text-[18px] transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Layanan */}
      <section className="bg-mist px-4 py-14 sm:px-6 sm:py-24">
        <div className="mx-auto grid max-w-[1024px] gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {layananAkademik.map((l) => (
            <a
              key={l.href}
              href={l.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group border-t border-hairline pt-6 transition duration-300"
            >
              <p className="text-[16px] font-semibold text-label">{l.title}</p>
              <p className="mt-1 text-[14px] text-label-2">{l.description}</p>
              <p className="mt-4 text-[14px] text-accent group-hover:underline">
                Buka ↗
              </p>
            </a>
          ))}
        </div>
      </section>
    </>
  );
}
