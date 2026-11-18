import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { getSite } from "@/lib/site/get-site";
import { Carousel } from "@/components/site/carousel";
import { MitraList } from "@/components/site/mitra-list";
import { PageHeader } from "@/components/site/page-header";
import { Reveal } from "@/components/site/reveal";
import { SectionHeading } from "@/components/site/section-heading";
import { TestimoniCard } from "@/components/site/testimoni-card";
import { prodi } from "@/lib/site/prodi";

export const metadata: Metadata = {
  title: "Ikatan Alumni & Jejaring Lulusan",
  description: `Profil lulusan, cerita sukses alumni, tracer study, dan direktori kiprah alumni ${prodi.fullName} ${prodi.university}.`,
};

export const revalidate = 3600;

export default async function AlumniPage() {
  const { prospekKarir, testimoni, mutu, mitra } = await getSite();

  const ALUMNI_STATS = [
    {
      value: "85%+",
      label: "Tingkat Serapan Kerja",
      desc: "Lulusan terserap kerja & studi lanjut dalam waktu < 6 bulan setelah wisuda.",
    },
    {
      value: "500+",
      label: "Jejaring Alumni Aktif",
      desc: "Tersebar di perbankan syariah, lembaga regulator, filantropi, dan industri.",
    },
    {
      value: "Unggul",
      label: "Daya Saing Lulusan",
      desc: "Dibekali sertifikasi kompetensi perbankan syariah, pasar modal, dan fatwa.",
    },
    {
      value: "Nasional",
      label: "Sebaran Kiprah",
      desc: "Bekerja di BSI, OJK, Bank Muamalat, BAZNAS, Bappenas, hingga akademisi.",
    },
  ];

  return (
    <>
      <PageHeader
        crumb="Alumni"
        title="Ikatan Alumni &amp; Jejaring Lulusan"
        description={`Kiprah, cerita sukses, tracer study, dan jejaring sarjana ${prodi.fullName} ${prodi.faculty} ${prodi.university}.`}
      />

      {/* 4 Kartu Profil & Statistik Alumni */}
      <section className="px-4 pb-20 sm:px-6">
        <div className="mx-auto max-w-[1060px]">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {ALUMNI_STATS.map((s, i) => (
              <Reveal key={s.label} delay={i * 0.05}>
                <div className="flex h-full flex-col justify-between rounded-[24px] border border-hairline bg-canvas p-6 shadow-xs">
                  <div>
                    <p className="font-display text-[24px] font-black tracking-tight text-accent">
                      {s.value}
                    </p>
                    <h3 className="mt-1.5 text-[16px] font-bold text-label">
                      {s.label}
                    </h3>
                    <p className="mt-2 text-[14px] leading-relaxed text-label-2">
                      {s.desc}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Bidang Kerja & Prospek Karier Lulusan */}
      <section className="border-t border-hairline bg-mist/40 px-4 py-20 sm:px-6 sm:py-24">
        <div className="mx-auto max-w-[1060px]">
          <Reveal>
            <SectionHeading
              align="left"
              eyebrow="Profil Lulusan"
              title="Bidang kerja & profesi utama alumni"
            />
          </Reveal>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {prospekKarir.map((p, i) => (
              <Reveal key={p.title} delay={(i % 4) * 0.05}>
                <div className="flex h-full flex-col justify-between rounded-[24px] border border-hairline bg-canvas p-6 transition duration-300 hover:-translate-y-1 hover:border-accent/30 hover:shadow-md">
                  <div>
                    <span className="font-mono text-[14px] font-bold text-accent">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h3 className="mt-3 text-[16px] font-bold leading-snug text-label">
                      {p.title}
                    </h3>
                    <p className="mt-2 text-[14px] leading-relaxed text-label-2">
                      {p.description}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Cerita & Testimoni Alumni */}
      {testimoni.length > 0 && (
        <section className="px-4 py-20 sm:px-6 sm:py-24">
          <div className="mx-auto max-w-[1060px]">
            <Reveal>
              <SectionHeading
                align="left"
                eyebrow="Cerita Alumni"
                title="Kiprah nyata di industri &amp; masyarakat"
              />
            </Reveal>
          </div>
          <div className="mt-10">
            <Carousel label="Testimoni alumni">
              {testimoni.map((t, i) => (
                <TestimoniCard key={`${t.name}-${i}`} item={t} />
              ))}
            </Carousel>
          </div>
        </section>
      )}

      {/* Tracer Study & Peta Sebaran Alumni */}
      {(mutu.tracerUrl || mutu.sebaranUrl) && (
        <section className="px-4 pb-20 sm:px-6">
          <Reveal className="mx-auto max-w-[1060px]">
            <div className="flex flex-col items-start justify-between gap-6 rounded-[28px] bg-accent p-8 text-white sm:flex-row sm:items-center sm:p-10 shadow-lg">
              <div>
                <p className="text-[14px] font-bold uppercase tracking-wider text-sand">
                  Portal Khusus Alumni
                </p>
                <h2 className="mt-2 text-[clamp(1.6rem,1.3rem+1vw,2.2rem)] font-extrabold leading-tight tracking-tight">
                  Tracer Study &amp; Sebaran Alumni UIN SGD
                </h2>
                <p className="mt-2 max-w-xl text-[16px] leading-relaxed text-white/85">
                  Partisipasi Anda dalam Tracer Study sangat penting untuk evaluasi kurikulum, pengembangan akreditasi internasional, dan pemeringkatan program studi.
                </p>
              </div>
              <div className="flex shrink-0 flex-wrap gap-3">
                {mutu.tracerUrl && (
                  <a
                    href={mutu.tracerUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-xl bg-white px-6 py-3.5 text-[14px] font-bold text-accent shadow-xs transition hover:bg-sand"
                  >
                    Isi Tracer Study <ArrowUpRight className="size-4" />
                  </a>
                )}
                {mutu.sebaranUrl && (
                  <a
                    href={mutu.sebaranUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-xl border border-white/40 px-6 py-3.5 text-[14px] font-semibold text-white transition hover:bg-white/10"
                  >
                    Peta Sebaran Alumni ↗
                  </a>
                )}
              </div>
            </div>
          </Reveal>
        </section>
      )}

      {/* Ajakan Berjejaring & Info Karier */}
      <section className="border-t border-hairline bg-canvas px-4 py-20 sm:px-6">
        <div className="mx-auto grid max-w-[1060px] gap-8 md:grid-cols-2">
          {/* Card 1: Kabar Alumni & Donasi Buku */}
          <div className="rounded-[24px] border border-hairline bg-mist/60 p-8">
            <h3 className="text-[18px] font-bold tracking-tight text-label">
              Bagi Kabar &amp; Lowongan Magang
            </h3>
            <p className="mt-2 text-[14px] leading-relaxed text-label-2">
              Punya lowongan kerja, peluang magang, atau kabar promosi di institusi Anda? Bagikan kepada adik-adik tingkat di Program Studi Ekonomi Syariah.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/prodi/kontak"
                className="inline-flex items-center gap-2 rounded-xl bg-accent px-5 py-2.5 text-[14px] font-semibold text-white hover:bg-accent-hover shadow-xs"
              >
                Hubungi Admin Jurusan <ArrowRight className="size-4" />
              </Link>
              <Link
                href="/prodi/karier"
                className="inline-flex items-center gap-1.5 rounded-xl border border-hairline bg-canvas px-5 py-2.5 text-[14px] font-semibold text-label hover:border-accent"
              >
                Pusat Karier &amp; Lowongan
              </Link>
            </div>
          </div>

          {/* Card 2: Bimbingan & Kuliah Tamu */}
          <div className="rounded-[24px] border border-hairline bg-mist/60 p-8">
            <h3 className="text-[18px] font-bold tracking-tight text-label">
              Alumni Mengajar &amp; Mentoring
            </h3>
            <p className="mt-2 text-[14px] leading-relaxed text-label-2">
              Prodi secara rutin mengundang praktisi alumni untuk mengisi seminar, kuliah tamu, dan mentoring skripsi praktis di bidang perbankan serta keuangan Islam.
            </p>
            <div className="mt-6">
              <a
                href="https://cdc.uinsgd.ac.id"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-[14px] font-semibold text-accent hover:underline"
              >
                Kunjungi Portal Career Development Center (CDC) UIN SGD <ArrowUpRight className="size-4" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Mitra Strategis Tempat Alumni Bekerja */}
      {mitra.length > 0 && (
        <section className="border-t border-hairline bg-mist/50 px-4 py-20 sm:px-6">
          <div className="mx-auto max-w-[1060px]">
            <SectionHeading
              align="left"
              eyebrow="Mitra Industri"
              title="Lembaga mitra &amp; tempat alumni berkiprah"
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
