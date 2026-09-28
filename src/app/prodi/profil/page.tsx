import type { Metadata } from "next";
import { PageHeader } from "@/components/site/page-header";
import { Reveal } from "@/components/site/reveal";
import { SectionHeading } from "@/components/site/section-heading";
import { misi, pimpinan, prodi, sejarah, sorotan, tujuan, visi } from "@/lib/site/prodi";
import { HighlightCard } from "@/components/site/highlight-card";

export const metadata: Metadata = {
  title: "Profil",
  description: `Sejarah, visi, misi, tujuan, pimpinan, dan akreditasi ${prodi.fullName} ${prodi.university}.`,
};

const sections = [
  { id: "sejarah", label: "Sejarah" },
  { id: "visi-misi", label: "Visi, Misi & Tujuan" },
  { id: "pimpinan", label: "Pimpinan" },
  { id: "akreditasi", label: "Akreditasi & Mutu" },
];

export default function ProfilPage() {
  const mutu = sorotan.find((s) => s.category === "Penjaminan Mutu");

  return (
    <>
      <PageHeader
        crumb="Profil"
        title="Profil Program Studi Ekonomi Syariah"
        description={`Mengenal lebih dekat ${prodi.fullName}, ${prodi.faculty} ${prodi.university}.`}
      />

      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-16 lg:grid-cols-[220px_1fr]">
        {/* Navigasi samping */}
        <aside className="hidden lg:block">
          <nav aria-label="Isi halaman" className="sticky top-36 border-l-2 border-pine-800/10">
            {sections.map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                className="-ml-0.5 block border-l-2 border-transparent py-2 pl-4 text-[14px] text-ink/65 hover:border-saffron-500 hover:text-pine-700"
              >
                {s.label}
              </a>
            ))}
          </nav>
        </aside>

        <div className="min-w-0 space-y-24">
          <section id="sejarah" className="scroll-mt-36">
            <Reveal>
              <SectionHeading eyebrow="Sejarah" title="Tumbuh bersama FEBI UIN Sunan Gunung Djati." />
              <div className="mt-6 max-w-3xl space-y-4 text-[16.5px] leading-[1.8] text-ink/75">
                {sejarah.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </Reveal>
          </section>

          <section id="visi-misi" className="scroll-mt-36">
            <Reveal>
              <SectionHeading eyebrow="Visi, Misi & Tujuan" title="Arah dan komitmen program studi." />
            </Reveal>
            <Reveal className="mt-8">
              <div className="site-pattern bg-pine-800 p-8 sm:p-10">
                <p className="text-[12px] font-semibold uppercase tracking-[0.22em] text-saffron-300">Visi</p>
                <p className="mt-4 font-serif text-[clamp(1.2rem,1rem+0.8vw,1.6rem)] leading-relaxed text-paper">{visi}</p>
              </div>
            </Reveal>
            <div className="mt-8 grid gap-10 md:grid-cols-2">
              <Reveal>
                <h3 className="border-b-2 border-saffron-500 pb-2 font-serif text-2xl font-semibold text-pine-800">Misi</h3>
                <ol className="mt-5 space-y-4">
                  {misi.map((m, i) => (
                    <li key={i} className="flex gap-4 text-[15.5px] leading-relaxed text-ink/75">
                      <span className="font-serif text-xl font-semibold text-saffron-600">{i + 1}.</span>
                      {m}
                    </li>
                  ))}
                </ol>
              </Reveal>
              <Reveal delay={0.05}>
                <h3 className="border-b-2 border-saffron-500 pb-2 font-serif text-2xl font-semibold text-pine-800">Tujuan</h3>
                <ol className="mt-5 space-y-4">
                  {tujuan.map((t, i) => (
                    <li key={i} className="flex gap-4 text-[15.5px] leading-relaxed text-ink/75">
                      <span className="font-serif text-xl font-semibold text-saffron-600">{i + 1}.</span>
                      {t}
                    </li>
                  ))}
                </ol>
              </Reveal>
            </div>
          </section>

          <section id="pimpinan" className="scroll-mt-36">
            <Reveal>
              <SectionHeading eyebrow="Pimpinan" title="Struktur pimpinan fakultas & program studi." />
            </Reveal>
            <div className="mt-10 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {pimpinan.map((p, i) => (
                <Reveal key={p.name} delay={i * 0.05}>
                  <div className="h-full border border-pine-800/15 bg-white/50">
                    <div className="site-pattern-light grid aspect-[4/3] place-items-center bg-paper-2">
                      <span className="grid size-24 place-items-center rounded-full bg-pine-700 font-serif text-3xl font-semibold text-paper ring-4 ring-saffron-500/30">
                        {p.initials}
                      </span>
                    </div>
                    <div className="border-t-[3px] border-saffron-500 p-5">
                      <p className="font-serif text-lg font-semibold leading-snug text-pine-800">{p.name}</p>
                      <p className="mt-1 text-[14px] text-ink/60">{p.role}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </section>

          <section id="akreditasi" className="scroll-mt-36">
            <Reveal>
              <SectionHeading eyebrow="Akreditasi & Penjaminan Mutu" title="Berkomitmen pada mutu pendidikan." />
            </Reveal>
            <div className="mt-10 grid gap-6 md:grid-cols-2">
              <Reveal>
                <div className="h-full border border-pine-800/15 p-7">
                  <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-ink/50">Akreditasi Institusi</p>
                  <p className="mt-3 font-serif text-4xl font-semibold text-pine-700">{prodi.universityAccreditation}</p>
                  <p className="mt-2 text-[15px] text-ink/65">
                    {prodi.university} terakreditasi {prodi.universityAccreditation} oleh BAN-PT, berlaku{" "}
                    {prodi.universityAccreditationPeriod}.
                  </p>
                </div>
              </Reveal>
              <Reveal delay={0.05}>
                <div className="h-full border border-pine-800/15 p-7">
                  <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-ink/50">Akreditasi Program Studi</p>
                  <p className="mt-3 font-serif text-4xl font-semibold text-pine-700">
                    {prodi.prodiAccreditation ?? "Terakreditasi"}
                  </p>
                  <p className="mt-2 text-[15px] text-ink/65">
                    Sertifikat akreditasi program studi dapat dilihat pada website resmi prodi.
                  </p>
                </div>
              </Reveal>
            </div>
            {mutu && (
              <Reveal className="mt-6 max-w-xl">
                <HighlightCard item={mutu} />
              </Reveal>
            )}
          </section>
        </div>
      </div>
    </>
  );
}
