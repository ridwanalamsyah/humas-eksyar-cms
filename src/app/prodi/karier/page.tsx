import type { Metadata } from "next";
import { getSite } from "@/lib/site/get-site";
import { sisaHari } from "@/lib/site/kalender";
import { DeadlineCard } from "@/components/site/deadline-card";
import { MitraList } from "@/components/site/mitra-list";
import { PageHeader } from "@/components/site/page-header";
import { SectionHeading } from "@/components/site/section-heading";
import { Carousel } from "@/components/site/carousel";
import { Reveal } from "@/components/site/reveal";
import { TestimoniCard } from "@/components/site/testimoni-card";

export const metadata: Metadata = {
  title: "Karier & Alumni",
  description:
    "Lowongan, bidang kerja lulusan, cerita alumni, dan tracer study Ekonomi Syariah UIN SGD.",
};

export const revalidate = 3600;

export default async function KarierPage() {
  const { lowongan, mitra, prospekKarir, testimoni, mutu } = await getSite();
  const open = [...lowongan].sort(
    (a, b) => (sisaHari(a.deadline) ?? 9999) - (sisaHari(b.deadline) ?? 9999),
  );
  return (
    <>
      <PageHeader
        crumb="Karier & alumni"
        title="Karier & alumni"
        description="Lowongan asisten dosen, relawan, dan magang; bidang kerja lulusan; serta cerita dan tracer study alumni."
      />
      <section className="px-4 pb-24 sm:px-6">
        <div className="mx-auto max-w-[1024px]">
          {open.length ? (
            <div className="grid gap-4 md:grid-cols-2">
              {open.map((l) => (
                <DeadlineCard
                  key={l.title}
                  title={l.title}
                  meta={l.jenis}
                  description={l.deskripsi}
                  deadline={l.deadline}
                  href={l.url || "/prodi/formulir/rekrutmen"}
                  cta="Daftar"
                />
              ))}
            </div>
          ) : (
            <p className="rounded-[24px] bg-mist p-10 text-center text-[17px] text-label-2">
              Belum ada lowongan yang dibuka. Info karier UIN SGD juga tersedia
              di{" "}
              <a
                href="https://cdc.uinsgd.ac.id/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-accent hover:underline"
              >
                CDC UIN SGD
              </a>
              .
            </p>
          )}
          <a
            href="https://cdc.uinsgd.ac.id/"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-block text-[15px] font-semibold text-accent hover:underline"
          >
            Career Development Center UIN SGD ↗
          </a>
        </div>
      </section>
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

      {mitra.length > 0 && (
        <section className="bg-mist px-4 py-24 sm:px-6">
          <div className="mx-auto max-w-[1024px]">
            <SectionHeading
              align="left"
              eyebrow="Tempat magang"
              title="Lembaga mitra prodi"
            />
            <div className="mt-8">
              <MitraList items={mitra} />
            </div>
          </div>
        </section>
      )}
    </>
  );
}
