import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageHeader } from "@/components/site/page-header";
import { Reveal } from "@/components/site/reveal";
import { SectionHeading } from "@/components/site/section-heading";
import { getSite } from "@/lib/site/get-site";
import { prodi } from "@/lib/site/prodi";

export const metadata: Metadata = {
  title: "Profil",
  description: `Sejarah, visi, misi, dan tujuan ${prodi.fullName} ${prodi.university}.`,
};

export default async function ProfilPage() {
  const { profil, identity, timeline } = await getSite();
  const sortedTimeline = [...timeline].sort((a, b) => {
    const ya = parseInt(String(a.year).replace(/\D/g, ""), 10) || 0;
    const yb = parseInt(String(b.year).replace(/\D/g, ""), 10) || 0;
    return ya - yb;
  });

  return (
    <>
      <PageHeader
        crumb="Profil"
        title="Profil program studi"
        description={`${prodi.fullName}, ${prodi.faculty}, ${prodi.university}.`}
      />

      {/* Sejarah: paragraf pembuka + satu garis waktu yang menyambung */}
      <section id="sejarah" className="scroll-mt-28 px-4 py-14 sm:px-6 sm:py-20">
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

          <div className="mt-8 grid gap-x-10 gap-y-2 md:grid-cols-2">
            {[
              { title: "Misi Program Studi", items: profil.misi },
              { title: "Tujuan Pendidikan", items: profil.tujuan },
            ].map((g) => (
              <Reveal key={g.title}>
                <details className="group h-full border-t border-hairline pt-2">
                  <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4">
                    <h2 className="text-[20px] font-bold tracking-[-0.02em] text-label sm:text-[24px]">
                      {g.title} <span className="font-normal text-label-3">({g.items.length})</span>
                    </h2>
                    <span aria-hidden className="text-[24px] leading-none text-accent transition-transform group-open:rotate-45">+</span>
                  </summary>
                  <ol className="mb-4 mt-2 space-y-3">
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
                </details>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Bagian lain dipisah ke halamannya sendiri supaya halaman ini ringan */}
      <section className="px-4 py-14 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-[1060px]">
          <h2 className="text-[clamp(1.75rem,1.4rem+1.4vw,2.5rem)] font-extrabold tracking-[-0.03em] text-label">
            Selengkapnya
          </h2>
          <ul className="mt-6 divide-y divide-hairline border-y border-hairline">
            {[
              { href: "/prodi/pimpinan", label: "Pimpinan & struktur", note: "Dekan, kaprodi, dan bagan organisasi" },
              { href: "/prodi/fasilitas", label: "Fasilitas", note: "Laboratorium, galeri investasi, perpustakaan" },
              { href: "/prodi/mitra", label: "Mitra kerja sama", note: "Bursa, bank syariah, regulator" },
              { href: "/prodi/mutu", label: `Akreditasi ${identity.prodiAccreditation || ""}`.trim(), note: "Data mutu dan sertifikat" },
            ].map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="group flex min-h-16 items-center gap-4 py-4">
                  <span className="min-w-0 flex-1">
                    <span className="block text-[18px] font-bold text-label group-hover:text-accent">{l.label}</span>
                    <span className="block text-[14px] text-label-2">{l.note}</span>
                  </span>
                  <ArrowRight className="size-5 shrink-0 text-label-3 transition-transform group-hover:translate-x-0.5 group-hover:text-accent" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
