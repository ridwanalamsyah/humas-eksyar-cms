import type { Metadata } from "next";
import { PageHeader } from "@/components/site/page-header";
import { Reveal } from "@/components/site/reveal";
import { SectionHeading } from "@/components/site/section-heading";
import { fasilitas, misi, pimpinan, prodi, sejarah, sorotan, tujuan, visi } from "@/lib/site/prodi";
import { LocalNav } from "@/components/site/local-nav";
import { PersonCard } from "@/components/site/person-card";
import { HighlightCard } from "@/components/site/highlight-card";

export const metadata: Metadata = {
  title: "Profil",
  description: `Sejarah, visi, misi, tujuan, pimpinan, dan akreditasi ${prodi.fullName} ${prodi.university}.`,
};

export default function ProfilPage() {
  const mutu = sorotan.find((s) => s.category === "Penjaminan Mutu");

  return (
    <>
      <PageHeader
        crumb="Profil"
        title="Tumbuh bersama FEBI UIN Sunan Gunung Djati."
        description={`${prodi.fullName} — ${prodi.faculty}, ${prodi.university}.`}
      />

      <LocalNav
        items={[
          { id: "sejarah", label: "Sejarah" },
          { id: "visi-misi", label: "Visi & Misi" },
          { id: "pimpinan", label: "Pimpinan" },
          { id: "fasilitas", label: "Fasilitas" },
          { id: "akreditasi", label: "Akreditasi" },
        ]}
      />

      {/* Sejarah */}
      <section id="sejarah" className="scroll-mt-28 px-4 py-24 sm:px-6 sm:py-32">
        <Reveal>
          <SectionHeading eyebrow="Sejarah" title="Dari rintisan 2003 hingga kini." />
        </Reveal>
        <Reveal className="mx-auto mt-10 max-w-[692px] space-y-5 text-[19px] leading-[1.58] text-label">
          {sejarah.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </Reveal>
      </section>

      {/* Visi */}
      <section id="visi-misi" className="scroll-mt-28 bg-accent px-4 py-24 text-center text-white sm:px-6 sm:py-32">
        <Reveal className="mx-auto max-w-4xl">
          <p className="font-script text-[40px] leading-none text-sand">Visi</p>
          <p className="mt-4 text-[clamp(1.6rem,1.1rem+1.8vw,2.6rem)] font-semibold leading-[1.2] tracking-[-0.02em] text-balance">
            {visi}
          </p>
        </Reveal>
      </section>

      {/* Misi & tujuan */}
      <section className="bg-mist px-4 py-24 sm:px-6 sm:py-32">
        <div className="mx-auto grid max-w-[1024px] gap-4 md:grid-cols-2">
          {[
            { title: "Misi", items: misi },
            { title: "Tujuan", items: tujuan },
          ].map((g) => (
            <Reveal key={g.title}>
              <div className="h-full rounded-[28px] bg-canvas p-8 sm:p-10">
                <h2 className="text-[32px] font-semibold tracking-[-0.02em] text-label">{g.title}</h2>
                <ol className="mt-6 space-y-5">
                  {g.items.map((m, i) => (
                    <li key={i} className="flex gap-4 text-[17px] leading-[1.45] text-label-2">
                      <span className="w-5 shrink-0 font-semibold text-accent">{i + 1}</span>
                      {m}
                    </li>
                  ))}
                </ol>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Pimpinan */}
      <section id="pimpinan" className="scroll-mt-28 px-4 py-24 sm:px-6 sm:py-32">
        <Reveal>
          <SectionHeading eyebrow="Pimpinan" title="Orang-orang di balik prodi." />
        </Reveal>
        <div className="mx-auto mt-14 grid max-w-[1024px] gap-5 sm:grid-cols-3">
          {pimpinan.map((p, i) => (
            <Reveal key={p.name} delay={i * 0.06}>
              <PersonCard name={p.name} initials={p.initials} role={p.role} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* Fasilitas */}
      <section id="fasilitas" className="scroll-mt-28 bg-mist px-4 py-24 sm:px-6 sm:py-32">
        <Reveal>
          <SectionHeading eyebrow="Fasilitas" title="Mendukung belajar, di mana saja." />
        </Reveal>
        <div className="mx-auto mt-14 grid max-w-[1024px] gap-4 sm:grid-cols-2">
          {fasilitas.map((f) => (
            <Reveal key={f.title}>
              <div className="h-full rounded-[24px] bg-canvas p-8">
                <h3 className="text-[21px] font-bold tracking-[-0.01em] text-label">{f.title}</h3>
                <p className="mt-2 text-[16px] leading-[1.45] text-label-2">{f.description}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Akreditasi */}
      <section id="akreditasi" className="scroll-mt-28 px-4 py-24 sm:px-6 sm:py-32">
        <Reveal>
          <SectionHeading
            eyebrow="Akreditasi & Mutu"
            title="Berkomitmen pada mutu."
            description="Visi, misi, dan kurikulum ditinjau bersama asosiasi, regulator, praktisi, alumni, dan mahasiswa."
          />
        </Reveal>
        <div className="mx-auto mt-14 grid max-w-[1024px] gap-4 md:grid-cols-3">
          <Reveal>
            <div className="flex h-full flex-col rounded-[28px] bg-accent p-8 text-white">
              <p className="text-[14px] font-bold text-sand">Akreditasi Institusi</p>
              <p className="mt-auto pt-10 text-[48px] font-semibold leading-none tracking-[-0.03em]">
                {prodi.universityAccreditation}
              </p>
              <p className="mt-3 text-[15px] text-white/80">BAN-PT · {prodi.universityAccreditationPeriod}</p>
            </div>
          </Reveal>
          <Reveal delay={0.06}>
            <div className="flex h-full flex-col rounded-[28px] border border-hairline bg-canvas p-8">
              <p className="text-[14px] font-semibold text-accent">Akreditasi Program Studi</p>
              <p className="mt-auto pt-10 text-[36px] font-semibold leading-none tracking-[-0.03em] text-label">
                {prodi.prodiAccreditation ?? "Terakreditasi"}
              </p>
              <a
                href={prodi.officialSite}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 text-[15px] text-accent hover:underline"
              >
                Lihat sertifikat ›
              </a>
            </div>
          </Reveal>
          {mutu && (
            <Reveal delay={0.12}>
              <HighlightCard item={mutu} />
            </Reveal>
          )}
        </div>
      </section>
    </>
  );
}
