import type { Metadata } from "next";
import Link from "next/link";
import { HighlightCard } from "@/components/site/highlight-card";
import { MitraList } from "@/components/site/mitra-list";
import { PageHeader } from "@/components/site/page-header";
import { Photo } from "@/components/site/photo";
import { Reveal } from "@/components/site/reveal";
import { SectionHeading } from "@/components/site/section-heading";
import { getSite } from "@/lib/site/get-site";
import { initials } from "@/lib/site/names";
import { prodi } from "@/lib/site/prodi";

export const metadata: Metadata = {
  title: "Profil",
  description: `Sejarah, visi, misi, tujuan, pimpinan, fasilitas, dan akreditasi ${prodi.fullName} ${prodi.university}.`,
};

export default async function ProfilPage() {
  const {
    profil,
    pimpinan,
    fasilitas,
    identity,
    kegiatan,
    kontak,
    timeline,
    mitra,
    struktur,
    ruangAlat,
  } = await getSite();
  const sortedTimeline = [...timeline].sort((a, b) => {
    const ya = parseInt(String(a.year).replace(/\D/g, ""), 10) || 0;
    const yb = parseInt(String(b.year).replace(/\D/g, ""), 10) || 0;
    return ya - yb;
  });
  const levels = [1, 2, 3, 4]
    .map((l) => struktur.filter((x) => x.level === l))
    .filter((x) => x.length);
  const mutu = kegiatan.find(
    (s) => s.category.toLowerCase() === "penjaminan mutu",
  );

  return (
    <>
      <PageHeader
        crumb="Profil"
        title="Profil program studi"
        description={`${prodi.fullName}, ${prodi.faculty}, ${prodi.university}.`}
      />

      {/* Sejarah & Tonggak Perkembangan (2 Kolom Rapi & Justify) */}
      <section
        id="sejarah"
        className="scroll-mt-28 px-4 py-16 sm:px-6 sm:py-20"
      >
        <div className="mx-auto max-w-[1060px]">
          <Reveal>
            <SectionHeading
              align="left"
              eyebrow="Sejarah & Perkembangan"
              title="Sejarah singkat Program Studi Ekonomi Syariah"
            />
          </Reveal>

          <div className="mt-8 grid items-start gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
            <div className="space-y-4">
              {profil.sejarah.map((p, i) => (
                <Reveal key={i} delay={i * 0.1}>
                  <div className="rounded-[22px] border border-hairline bg-canvas p-6 sm:p-7 shadow-xs transition-all hover:border-accent/40">
                    <div className="flex items-center gap-2 text-[14px] font-bold uppercase tracking-wider text-accent mb-2.5">
                      <span className="size-1.5 rounded-xs bg-accent" />
                      Fase Perkembangan {i + 1}
                    </div>
                    <p className="text-justify text-[16px] leading-[1.75] text-label hyphens-auto">
                      {p}
                    </p>
                  </div>
                </Reveal>
              ))}

              <Reveal delay={0.25}>
                <div className="grid grid-cols-3 gap-3 rounded-[22px] border border-hairline bg-mist/60 p-5 text-center">
                  <div className="rounded-xl bg-canvas p-3 border border-hairline/60">
                    <p className="text-[18px] font-extrabold text-accent">2015</p>
                    <p className="text-[14px] font-semibold text-label-2 mt-0.5">
                      SK Pendirian
                    </p>
                  </div>
                  <div className="rounded-xl bg-canvas p-3 border border-hairline/60">
                    <p className="text-[18px] font-extrabold text-accent">2020</p>
                    <p className="text-[14px] font-semibold text-label-2 mt-0.5">
                      Fakultas Mandiri
                    </p>
                  </div>
                  <div className="rounded-xl bg-canvas p-3 border border-hairline/60">
                    <p className="text-[18px] font-extrabold text-accent">
                      {identity.totalCredits} SKS
                    </p>
                    <p className="text-[14px] font-semibold text-label-2 mt-0.5">
                      Kurikulum S.E.
                    </p>
                  </div>
                </div>
              </Reveal>
            </div>

            {sortedTimeline.length > 0 && (
              <div className="space-y-3 lg:sticky lg:top-24">
                <Reveal>
                  <div className="rounded-[22px] border border-hairline bg-canvas p-6 sm:p-7 shadow-xs">
                    <div className="flex items-center justify-between border-b border-hairline/80 pb-3 mb-4">
                      <h3 className="text-[16px] font-bold text-label">
                        Tonggak Sejarah Utama
                      </h3>
                      <span className="rounded-md bg-accent/10 px-2.5 py-0.5 text-[14px] font-bold text-accent">
                        {sortedTimeline.length} Peristiwa
                      </span>
                    </div>

                    <ol className="relative border-l-2 border-accent/25 pl-5 space-y-5">
                      {sortedTimeline.map((t, i) => (
                        <Reveal key={`${t.year}-${i}`} delay={0.05 * i}>
                          <li className="relative group">
                            <span
                              aria-hidden
                              className="absolute -left-[25px] top-1.5 size-2.5 rounded-xs bg-accent ring-4 ring-canvas transition-transform group-hover:scale-125"
                            />
                            <div className="flex items-center gap-2">
                              <span className="rounded-md bg-accent px-2 py-0.5 text-[14px] font-bold text-white tabular-nums">
                                {t.year}
                              </span>
                              <h4 className="text-[14px] font-bold leading-snug text-label group-hover:text-accent transition-colors">
                                {t.title}
                              </h4>
                            </div>
                            <p className="mt-1.5 text-justify text-[14px] leading-[1.6] text-label-2">
                              {t.description}
                            </p>
                          </li>
                        </Reveal>
                      ))}
                    </ol>
                  </div>
                </Reveal>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Visi, Misi & Tujuan */}
      <section
        id="visi-misi"
        className="scroll-mt-28 bg-mist px-4 py-16 sm:px-6 sm:py-20"
      >
        <div className="mx-auto max-w-[1060px]">
          <Reveal className="rounded-[24px] bg-accent p-7 text-center text-white sm:p-10">
            <p className="text-[14px] font-semibold uppercase tracking-[0.1em] text-sand">
              Visi Keilmuan Program Studi
            </p>
            <p className="mx-auto mt-3 max-w-4xl text-[clamp(1.25rem,1rem+1.1vw,1.85rem)] font-bold leading-[1.35] tracking-[-0.015em] text-balance">
              “{profil.visi}”
            </p>
          </Reveal>

          <div className="mt-5 grid gap-5 md:grid-cols-2">
            {[
              { title: "Misi Program Studi", items: profil.misi },
              { title: "Tujuan Pendidikan", items: profil.tujuan },
            ].map((g) => (
              <Reveal key={g.title}>
                <div className="h-full rounded-[24px] border border-hairline bg-canvas p-6 sm:p-8">
                  <h2 className="text-[24px] font-extrabold tracking-[-0.02em] text-label">
                    {g.title}
                  </h2>
                  <ol className="mt-4 space-y-3.5">
                    {g.items.map((m, i) => (
                      <li
                        key={i}
                        className="flex gap-3.5 text-justify text-[16px] leading-[1.55] text-label-2"
                      >
                        <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-md bg-accent-soft text-[14px] font-bold text-accent">
                          {i + 1}
                        </span>
                        <span>{m}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Pimpinan & Struktur Organisasi (Ringkas) */}
      <section
        id="pimpinan"
        className="scroll-mt-28 px-4 py-16 sm:px-6 sm:py-20"
      >
        <div className="mx-auto max-w-[1060px]">
          <Reveal className="flex flex-wrap items-end justify-between gap-4">
            <SectionHeading
              align="left"
              eyebrow="Tata Kelola"
              title="Pimpinan Fakultas & Program Studi"
            />
            <Link
              href="/prodi/dosen"
              className="text-[14px] font-semibold text-accent hover:underline"
            >
              Lihat seluruh dosen & staf ›
            </Link>
          </Reveal>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {pimpinan.map((p, i) => (
              <Reveal key={`${p.name}-${i}`} delay={(i % 3) * 0.04}>
                <div className="flex h-full items-center gap-4 rounded-2xl border border-hairline bg-canvas p-5 shadow-xs">
                  {p.photo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={p.photo}
                      alt={p.name}
                      className="size-13 shrink-0 rounded-2xl object-cover"
                    />
                  ) : (
                    <span className="grid size-13 shrink-0 place-items-center rounded-xl bg-accent-soft text-[16px] font-bold text-accent">
                      {initials(p.name)}
                    </span>
                  )}
                  <div className="min-w-0">
                    <h3 className="text-[16px] font-bold leading-snug text-label">
                      {p.name}
                    </h3>
                    <p className="mt-0.5 text-[14px] leading-snug text-label-2">
                      {p.role}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          {levels.length > 0 && (
            <div id="struktur" className="mt-12 scroll-mt-28 rounded-[24px] border border-hairline bg-mist/50 p-6 sm:p-8">
              <h3 className="text-center text-[18px] font-bold text-label">
                Bagan Struktur Organisasi FEBI & Prodi Ekonomi Syariah
              </h3>
              <div className="mt-6 flex flex-col items-center gap-4">
                {levels.map((row, i) => (
                  <div key={i} className="flex w-full flex-col items-center">
                    {i > 0 && (
                      <span aria-hidden className="mb-4 h-4 w-px bg-hairline" />
                    )}
                    <ul className="flex w-full flex-wrap justify-center gap-2.5">
                      {row.map((x) => (
                        <li
                          key={`${x.jabatan}-${x.nama}`}
                          className={
                            i === 0
                              ? "w-full rounded-[16px] bg-accent px-4 py-3 text-center text-white sm:w-auto sm:min-w-[210px]"
                              : "w-full rounded-[16px] border border-hairline bg-canvas px-4 py-3 text-center sm:w-auto sm:min-w-[190px]"
                          }
                        >
                          <p
                            className={
                              i === 0
                                ? "text-[14px] font-semibold text-sand"
                                : "text-[14px] font-semibold text-accent"
                            }
                          >
                            {x.jabatan}
                          </p>
                          <p
                            className={
                              i === 0
                                ? "mt-0.5 text-[14px] font-bold"
                                : "mt-0.5 text-[14px] font-bold text-label"
                            }
                          >
                            {x.nama}
                          </p>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Mitra Kerja Sama Resmi */}
      {mitra.length > 0 && (
        <section
          id="mitra"
          className="scroll-mt-28 bg-mist px-4 py-16 sm:px-6 sm:py-20"
        >
          <div className="mx-auto max-w-[1060px]">
            <Reveal>
              <SectionHeading
                align="left"
                eyebrow="Jejaring Kemitraan"
                title="Mitra kerja sama strategis"
                description="Kolaborasi aktif Prodi Ekonomi Syariah dan FEBI bersama bursa, perbankan syariah, regulator, dan lembaga filantropi nasional."
              />
            </Reveal>
            <Reveal className="mt-8">
              <MitraList items={mitra} />
            </Reveal>
          </div>
        </section>
      )}

      {/* Fasilitas & Ruang Akademik */}
      <section
        id="fasilitas"
        className="scroll-mt-28 px-4 py-16 sm:px-6 sm:py-20"
      >
        <div className="mx-auto max-w-[1060px]">
          <Reveal className="flex flex-wrap items-end justify-between gap-4">
            <SectionHeading
              align="left"
              eyebrow="Sarana & Laboratorium"
              title="Fasilitas akademik & laboratorium"
            />
          </Reveal>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {fasilitas.map((f, i) => (
              <Reveal key={`${f.title}-${i}`} delay={(i % 3) * 0.04}>
                <div className="group flex h-full flex-col overflow-hidden rounded-[20px] border border-hairline bg-canvas transition duration-300 hover:border-accent/35">
                  <Photo src={f.image} alt={f.title} ratio="landscape" />
                  <div className="p-5">
                    <h3 className="text-[16px] font-bold tracking-[-0.01em] text-label">
                      {f.title}
                    </h3>
                    <p className="mt-1.5 text-[14px] leading-[1.55] text-label-2">
                      {f.description}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Akreditasi & Mutu */}
      <section
        id="akreditasi"
        className="w-full max-w-full scroll-mt-28 bg-mist px-4 py-16 sm:px-6 sm:py-20"
      >
        <div className="mx-auto max-w-[1060px]">
          <Reveal>
            <SectionHeading
              align="left"
              eyebrow="Akreditasi & Mutu"
              title="Akreditasi & penjaminan mutu"
              description="Visi, misi, dan kurikulum ditinjau berkala bersama asosiasi, regulator, praktisi, alumni, dan mahasiswa."
            />
          </Reveal>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <Reveal>
              <div className="flex h-full flex-col rounded-[22px] bg-accent p-6 sm:p-7 text-white">
                <p className="text-[14px] font-bold text-sand">
                  Akreditasi Institusi UIN SGD
                </p>
                <p className="mt-auto pt-8 text-[40px] sm:text-[40px] font-extrabold leading-none tracking-[-0.03em] break-words">
                  {identity.universityAccreditation}
                </p>
                <p className="mt-2.5 text-[14px] text-white/80">
                  BAN-PT · {identity.universityAccreditationPeriod}
                </p>
              </div>
            </Reveal>
            <Reveal delay={0.05}>
              <div className="flex h-full flex-col rounded-[22px] border border-hairline bg-canvas p-6 sm:p-7">
                <p className="text-[14px] font-bold text-accent">
                  Akreditasi Program Studi
                </p>
                <p className="mt-auto pt-8 text-[24px] sm:text-[40px] font-extrabold leading-none tracking-[-0.03em] text-label break-words">
                  {identity.prodiAccreditation || "Baik Sekali"}
                </p>
                <Link
                  href="/prodi/mutu"
                  className="mt-2.5 text-[14px] font-semibold text-accent hover:underline"
                >
                  Data mutu & sertifikat ›
                </Link>
              </div>
            </Reveal>
            {mutu && (
              <Reveal delay={0.1}>
                <HighlightCard item={mutu} />
              </Reveal>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
