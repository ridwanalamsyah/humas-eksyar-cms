import type { Metadata } from "next";
import Link from "next/link";
import { HighlightCard } from "@/components/site/highlight-card";
import { MitraList } from "@/components/site/mitra-list";
import { TimelineProgress } from "@/components/site/timeline-progress";
import { PageHeader } from "@/components/site/page-header";
import { PersonCard } from "@/components/site/person-card";
import { Photo } from "@/components/site/photo";
import { Reveal } from "@/components/site/reveal";
import { SectionHeading } from "@/components/site/section-heading";
import { getSite } from "@/lib/site/get-site";
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


      <section
        id="sejarah"
        className="scroll-mt-28 px-4 py-24 sm:px-6 sm:py-32"
      >
        <Reveal>
          <SectionHeading eyebrow="Sejarah" title="Sejarah singkat" />
        </Reveal>
        <Reveal className="mx-auto mt-10 max-w-[692px] space-y-5 text-[19px] leading-[1.58] text-label">
          {profil.sejarah.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </Reveal>
        {timeline.length > 0 && (
          <TimelineProgress>
            {timeline.map((t, i) => (
              <Reveal
                key={`${t.year}-${i}`}
                className="relative pb-10 last:pb-0"
              >
                <li>
                  <span
                    aria-hidden
                    className="absolute -left-[39px] top-1.5 size-4 rounded-full border-[3px] border-canvas bg-accent ring-2 ring-accent/20"
                  />
                  <p className="text-[15px] font-bold text-accent">{t.year}</p>
                  <h3 className="mt-1 text-[20px] font-bold tracking-[-0.01em] text-label">
                    {t.title}
                  </h3>
                  <p className="mt-1.5 text-[16px] leading-[1.5] text-label-2">
                    {t.description}
                  </p>
                </li>
              </Reveal>
            ))}
          </TimelineProgress>
        )}
      </section>

      <section
        id="visi-misi"
        className="scroll-mt-28 bg-accent px-4 py-24 text-center text-white sm:px-6 sm:py-32"
      >
        <Reveal className="mx-auto max-w-4xl">
          <p className="text-[15px] font-semibold uppercase tracking-[0.08em] text-sand">
            Visi
          </p>
          <p className="mt-5 text-[clamp(1.6rem,1.1rem+1.8vw,2.6rem)] font-bold leading-[1.22] tracking-[-0.02em] text-balance">
            {profil.visi}
          </p>
        </Reveal>
      </section>

      <section className="bg-mist px-4 py-24 sm:px-6 sm:py-32">
        <div className="mx-auto grid max-w-[1024px] gap-4 md:grid-cols-2">
          {[
            { title: "Misi", items: profil.misi },
            { title: "Tujuan", items: profil.tujuan },
          ].map((g) => (
            <Reveal key={g.title}>
              <div className="h-full rounded-[28px] bg-canvas p-8 sm:p-10">
                <h2 className="text-[30px] font-extrabold tracking-[-0.03em] text-label">
                  {g.title}
                </h2>
                <ol className="mt-6 space-y-5">
                  {g.items.map((m, i) => (
                    <li
                      key={i}
                      className="flex gap-4 text-[17px] leading-[1.45] text-label-2"
                    >
                      <span className="grid size-7 shrink-0 place-items-center rounded-full bg-accent-soft text-[13px] font-bold text-accent">
                        {i + 1}
                      </span>
                      {m}
                    </li>
                  ))}
                </ol>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section
        id="pimpinan"
        className="scroll-mt-28 px-4 py-24 sm:px-6 sm:py-32"
      >
        <Reveal>
          <SectionHeading eyebrow="Pimpinan" title="Pimpinan" />
        </Reveal>
        <div className="mx-auto mt-14 grid max-w-[1024px] gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {pimpinan.map((p, i) => (
            <Reveal key={`${p.name}-${i}`} delay={(i % 3) * 0.06}>
              <PersonCard name={p.name} role={p.role} photo={p.photo} />
            </Reveal>
          ))}
        </div>
      </section>

      {levels.length > 0 && (
        <section id="struktur" className="scroll-mt-28 px-4 pb-24 sm:px-6">
          <div className="mx-auto max-w-[1024px]">
            <SectionHeading eyebrow="Organisasi" title="Struktur organisasi" />
            <div className="mt-10 flex flex-col items-center gap-6">
              {levels.map((row, i) => (
                <div key={i} className="flex w-full flex-col items-center">
                  {i > 0 && (
                    <span aria-hidden className="mb-6 h-6 w-px bg-hairline" />
                  )}
                  <ul className="flex flex-wrap justify-center gap-3">
                    {row.map((x) => (
                      <li
                        key={`${x.jabatan}-${x.nama}`}
                        className={
                          i === 0
                            ? "min-w-[220px] rounded-[20px] bg-accent px-5 py-4 text-center text-white"
                            : "min-w-[200px] rounded-[20px] border border-hairline bg-canvas px-5 py-4 text-center"
                        }
                      >
                        <p
                          className={
                            i === 0
                              ? "text-[12.5px] font-semibold text-sand"
                              : "text-[12.5px] font-semibold text-accent"
                          }
                        >
                          {x.jabatan}
                        </p>
                        <p
                          className={
                            i === 0
                              ? "mt-1 text-[15.5px] font-bold"
                              : "mt-1 text-[15.5px] font-bold text-label"
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
        </section>
      )}

      <section
        id="fasilitas"
        className="scroll-mt-28 bg-mist px-4 py-24 sm:px-6 sm:py-32"
      >
        <Reveal>
          <SectionHeading eyebrow="Fasilitas" title="Fasilitas" />
        </Reveal>
        <div className="mx-auto mt-14 grid max-w-[1024px] gap-5 sm:grid-cols-2">
          {fasilitas.map((f, i) => (
            <Reveal key={`${f.title}-${i}`} delay={(i % 2) * 0.06}>
              <div className="group flex h-full flex-col overflow-hidden rounded-[24px] bg-canvas transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_48px_-24px_rgba(22,58,69,0.35)]">
                {f.image && (
                  <Photo src={f.image} alt={f.title} ratio="landscape" />
                )}
                <div className="p-8">
                  <h3 className="text-[21px] font-bold tracking-[-0.01em] text-label">
                    {f.title}
                  </h3>
                  <p className="mt-2 text-[16px] leading-[1.5] text-label-2">
                    {f.description}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {ruangAlat.length > 0 && (
        <section id="ruang" className="scroll-mt-28 px-4 py-24 sm:px-6">
          <div className="mx-auto max-w-[1024px]">
            <SectionHeading
              align="left"
              eyebrow="Peminjaman"
              title="Ruang & alat yang bisa dipinjam"
            />
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {ruangAlat.map((r) => (
                <div
                  key={r.name}
                  className="overflow-hidden rounded-[24px] border border-hairline bg-canvas"
                >
                  {r.image && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={r.image}
                      alt=""
                      loading="lazy"
                      className="aspect-[16/10] w-full object-cover"
                    />
                  )}
                  <div className="p-5">
                    <p className="text-[16px] font-bold text-label">{r.name}</p>
                    <p className="mt-1 text-[14px] text-label-2">
                      {r.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <Link
              href="/prodi/formulir/pinjam"
              className="mt-6 inline-block rounded-full bg-accent px-6 py-3 text-[15px] font-semibold text-white hover:bg-accent-strong"
            >
              Ajukan peminjaman
            </Link>
          </div>
        </section>
      )}

      {mitra.length > 0 && (
        <section
          id="mitra"
          className="scroll-mt-28 px-4 py-24 sm:px-6 sm:py-32"
        >
          <Reveal>
            <SectionHeading
              eyebrow="Kerja sama"
              title="Mitra program studi"
              description="Kerja sama prodi dan FEBI dengan perbankan, regulator, bursa, dan lembaga zakat."
            />
          </Reveal>
          <Reveal className="mx-auto mt-14 max-w-[1024px]">
            <MitraList items={mitra} />
          </Reveal>
        </section>
      )}

      <section
        id="akreditasi"
        className="scroll-mt-28 bg-mist px-4 py-24 sm:px-6 sm:py-32"
      >
        <Reveal>
          <SectionHeading
            eyebrow="Akreditasi & mutu"
            title="Akreditasi & penjaminan mutu"
            description="Visi, misi, dan kurikulum ditinjau bersama asosiasi, regulator, praktisi, alumni, dan mahasiswa."
          />
        </Reveal>
        <div className="mx-auto mt-14 grid max-w-[1024px] gap-5 md:grid-cols-3">
          <Reveal>
            <div className="flex h-full flex-col rounded-[24px] bg-accent p-8 text-white">
              <p className="text-[14px] font-bold text-sand">
                Akreditasi Institusi
              </p>
              <p className="mt-auto pt-10 text-[48px] font-extrabold leading-none tracking-[-0.03em]">
                {identity.universityAccreditation}
              </p>
              <p className="mt-3 text-[15px] text-white/80">
                BAN-PT · {identity.universityAccreditationPeriod}
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.06}>
            <div className="flex h-full flex-col rounded-[24px] border border-hairline bg-canvas p-8">
              <p className="text-[14px] font-bold text-accent">
                Akreditasi Program Studi
              </p>
              <p className="mt-auto pt-10 text-[36px] font-extrabold leading-none tracking-[-0.03em] text-label">
                {identity.prodiAccreditation || "Terakreditasi"}
              </p>
              {kontak.website && (
                <a
                  href={kontak.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 text-[15px] font-semibold text-accent hover:underline"
                >
                  Lihat sertifikat ›
                </a>
              )}
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
