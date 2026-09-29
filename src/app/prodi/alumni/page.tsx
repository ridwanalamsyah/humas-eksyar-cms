import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import { getSite } from "@/lib/site/get-site";
import { prodi } from "@/lib/site/prodi";
import { Carousel } from "@/components/site/carousel";
import { PageHeader } from "@/components/site/page-header";
import { Reveal } from "@/components/site/reveal";
import { SectionHeading } from "@/components/site/section-heading";
import { TestimoniCard } from "@/components/site/testimoni-card";

export const metadata: Metadata = {
  title: "Alumni & Karir",
  description: `Kiprah lulusan, tracer study, dan prospek karir ${prodi.fullName} ${prodi.university}.`,
};

export default async function AlumniPage() {
  const { prospekKarir, profilLulusan, testimoni, mutu } = await getSite();

  return (
    <>
      <PageHeader
        crumb="Alumni"
        title="Alumni & karir"
        description="Lulusan Ekonomi Syariah bekerja di perbankan dan keuangan syariah, lembaga zakat dan wakaf, industri halal, pemerintahan, pendidikan, hingga berwirausaha."
      />

      {(mutu.tracerUrl || mutu.sebaranUrl) && (
        <section className="px-4 pb-20 sm:px-6">
          <Reveal className="mx-auto max-w-[1024px]">
            <div className="flex flex-col items-start justify-between gap-6 rounded-[28px] bg-accent p-8 text-white sm:flex-row sm:items-center sm:p-10">
              <div>
                <p className="text-[14px] font-bold text-sand">Untuk alumni</p>
                <p className="mt-2 text-[clamp(1.5rem,1.2rem+1vw,2rem)] font-bold leading-tight tracking-[-0.02em]">
                  Isi tracer study UIN SGD
                </p>
                <p className="mt-2 max-w-lg text-[15px] text-white/80">
                  Data karier alumni dipakai untuk evaluasi kurikulum dan
                  akreditasi. Pengisian dikelola Career Development Center UIN
                  SGD.
                </p>
              </div>
              <div className="flex shrink-0 flex-wrap gap-3">
                {mutu.tracerUrl && (
                  <a
                    href={mutu.tracerUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full bg-canvas px-6 py-3 text-[15px] font-semibold text-accent hover:bg-sand"
                  >
                    Isi tracer study ↗
                  </a>
                )}
                {mutu.sebaranUrl && (
                  <a
                    href={mutu.sebaranUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full border border-white/40 px-6 py-3 text-[15px] font-semibold text-white hover:bg-white/10"
                  >
                    Peta sebaran ↗
                  </a>
                )}
              </div>
            </div>
          </Reveal>
        </section>
      )}

      {testimoni.length > 0 && (
        <section className="bg-mist py-24">
          <Reveal className="mx-auto max-w-[1024px] px-4 sm:px-0">
            <SectionHeading
              align="left"
              eyebrow="Cerita alumni"
              title="Kata mereka"
            />
          </Reveal>
          <div className="mt-10">
            <Carousel label="Testimoni alumni">
              {testimoni.map((t, i) => (
                <TestimoniCard key={`${t.name}-${i}`} item={t} />
              ))}
            </Carousel>
          </div>
        </section>
      )}

      <section className="px-4 py-24 sm:px-6">
        <div className="mx-auto max-w-[1024px]">
          <Reveal>
            <SectionHeading
              align="left"
              eyebrow="Prospek"
              title="Bidang kerja lulusan"
            />
          </Reveal>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {prospekKarir.map((p, i) => (
              <Reveal key={p.title} delay={(i % 4) * 0.05}>
                <div className="h-full rounded-[24px] border border-hairline bg-canvas p-6 transition duration-300 hover:-translate-y-1 hover:border-transparent hover:shadow-[0_24px_48px_-24px_rgba(22,58,69,0.35)]">
                  <span className="text-[13px] font-bold tabular-nums text-accent">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-3 text-[18px] font-bold leading-snug text-label">
                    {p.title}
                  </h3>
                  <p className="mt-1.5 text-[14.5px] leading-[1.5] text-label-2">
                    {p.description}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {profilLulusan.length > 0 && (
        <section className="bg-mist px-4 py-24 sm:px-6">
          <div className="mx-auto max-w-[1024px]">
            <SectionHeading
              align="left"
              eyebrow="Kompetensi"
              title="Profil lulusan"
            />
            <ul className="mt-8 grid gap-4 md:grid-cols-2">
              {profilLulusan.map((p) => (
                <li key={p.title} className="rounded-[24px] bg-canvas p-6">
                  <h3 className="text-[18px] font-bold text-label">
                    {p.title}
                  </h3>
                  <p className="mt-1.5 text-[15px] leading-[1.5] text-label-2">
                    {p.description}
                  </p>
                </li>
              ))}
            </ul>
            <a
              href="https://cdc.uinsgd.ac.id/"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex items-center gap-1.5 text-[16px] font-semibold text-accent hover:underline"
            >
              Info lowongan & karier di CDC UIN SGD{" "}
              <ArrowUpRight className="size-4" />
            </a>
          </div>
        </section>
      )}
    </>
  );
}
