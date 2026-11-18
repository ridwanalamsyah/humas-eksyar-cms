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

      {/* Sejarah: paragraf pembuka + satu garis waktu yang menyambung */}
      <section id="sejarah" className="scroll-mt-28 px-4 py-14 sm:px-6 sm:py-14 sm:py-20">
        <div className="mx-auto grid max-w-[1060px] gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-16">
          <Reveal className="lg:sticky lg:top-28 lg:self-start">
            <SectionHeading align="left" title="Sejarah singkat" />
            {profil.sejarah[0] && (
              <p className="mt-4 text-[16px] leading-[1.75] text-label-2 sm:text-[17px]">
                {profil.sejarah[0]}
              </p>
            )}
            {profil.sejarah.length > 1 && (
              <details className="group mt-2">
                <summary className="inline-flex min-h-11 cursor-pointer list-none items-center text-[16px] font-semibold text-accent">
                  <span className="group-open:hidden">Baca selengkapnya</span>
                  <span className="hidden group-open:inline">Tutup</span>
                </summary>
                <div className="mt-2 space-y-4 text-[16px] leading-[1.75] text-label-2">
                  {profil.sejarah.slice(1).map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>
              </details>
            )}
          </Reveal>

          {sortedTimeline.length > 0 && (
            <ol className="relative">
              {/* Satu garis utuh dari tahun pertama sampai terakhir */}
              <span aria-hidden className="absolute bottom-3 left-[5px] top-3 w-0.5 bg-accent/25" />
              {sortedTimeline.map((t, i) => (
                <li key={`${t.year}-${i}`} className="relative pb-8 pl-8 last:pb-0">
                  <span
                    aria-hidden
                    className="absolute left-0 top-[6px] size-3 rounded-full border-2 border-accent bg-canvas"
                  />
                  <p className="text-[24px] font-extrabold leading-none tracking-[-0.03em] text-accent tabular-nums">
                    {t.year}
                  </p>
                  <h3 className="mt-1.5 text-[16px] font-bold leading-snug text-label">{t.title}</h3>
                  <p className="mt-1 text-[15px] leading-relaxed text-label-2">{t.description}</p>
                </li>
              ))}
            </ol>
          )}
        </div>
      </section>

      {/* Visi, Misi & Tujuan */}
      <section
        id="visi-misi"
        className="scroll-mt-28 bg-mist px-4 py-16 sm:px-6 sm:py-14 sm:py-20"
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
                <div className="h-full border-t border-hairline pt-6 sm:pt-8">
                  <h2 className="text-[24px] font-extrabold tracking-[-0.02em] text-label">
                    {g.title}
                  </h2>
                  <ol className="mt-4 space-y-3.5">
                    {g.items.map((m, i) => (
                      <li
                        key={i}
                        className="flex gap-3.5 text-[16px] leading-[1.55] text-label-2"
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
        className="scroll-mt-28 px-4 py-16 sm:px-6 sm:py-14 sm:py-20"
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
                <div className="flex h-full items-center gap-4 border-t border-hairline pt-5">
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
            <details id="struktur" className="group mt-10 scroll-mt-28 border-t border-hairline pt-4">
              <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between text-[16px] font-semibold text-accent">
                Lihat bagan struktur organisasi
                <span aria-hidden className="text-[20px] transition-transform group-open:rotate-45">+</span>
              </summary>
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
            </details>
          )}
        </div>
      </section>

      {/* Mitra Kerja Sama Resmi */}
      {mitra.length > 0 && (
        <section
          id="mitra"
          className="scroll-mt-28 bg-mist px-4 py-16 sm:px-6 sm:py-14 sm:py-20"
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
        className="scroll-mt-28 px-4 py-16 sm:px-6 sm:py-14 sm:py-20"
      >
        <div className="mx-auto max-w-[1060px]">
          <Reveal className="flex flex-wrap items-end justify-between gap-4">
            <SectionHeading
              align="left"
              eyebrow="Sarana & Laboratorium"
              title="Fasilitas akademik & laboratorium"
            />
          </Reveal>
          <div className="rail mt-8 grid gap-x-5 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
            {fasilitas.map((f, i) => (
              <Reveal key={`${f.title}-${i}`} delay={(i % 3) * 0.04}>
                <div className="group flex h-full flex-col">
                  <Photo src={f.image} alt={f.title} ratio="landscape" className="rounded-[20px]" />
                  <div className="pt-4">
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
        className="w-full max-w-full scroll-mt-28 bg-mist px-4 py-16 sm:px-6 sm:py-14 sm:py-20"
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
              <div className="flex h-full flex-col border-t border-hairline pt-6 sm:pt-7">
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
