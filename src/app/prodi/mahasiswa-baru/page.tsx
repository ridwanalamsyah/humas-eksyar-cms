import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { getSite } from "@/lib/site/get-site";
import { prodi } from "@/lib/site/prodi";
import { FaqList } from "@/components/site/faq-list";
import { PageHeader } from "@/components/site/page-header";
import { PmbCta } from "@/components/site/pmb-cta";
import { PmbCampaign } from "@/components/site/pmb-campaign";
import { Reveal } from "@/components/site/reveal";
import { SectionHeading } from "@/components/site/section-heading";

export const metadata: Metadata = {
  title: "Mahasiswa Baru",
  description: `Jalur masuk, biaya kuliah, beasiswa, dan prospek karir ${prodi.fullName} ${prodi.university}.`,
};

export default async function MahasiswaBaruPage() {
  const {
    identity,
    jalurMasuk,
    infoMaba,
    bidangKajian,
    prospekKarir,
    beasiswa,
    faq,
    mitra,
    kampanyePmb,
    kontak,
    panduanMaba,
  } = await getSite();
  const facts = [
    { v: String(identity.totalCredits), k: "SKS untuk gelar S.E." },
    { v: identity.normalDuration, k: "Masa studi normal" },
    {
      v: identity.universityAccreditation,
      k: `Akreditasi UIN SGD (${identity.universityAccreditationPeriod})`,
    },
    { v: String(beasiswa.length), k: "Program beasiswa terbuka" },
  ];

  return (
    <>
      <PageHeader
        crumb="Mahasiswa baru"
        title="Kuliah di Ekonomi Syariah"
        description={`Informasi untuk calon mahasiswa ${prodi.fullName}, ${prodi.faculty}, ${prodi.university}.`}
      />
      {kampanyePmb.aktif && kampanyePmb.judul && (
        <PmbCampaign
          judul={kampanyePmb.judul}
          teks={kampanyePmb.teks}
          tenggat={kampanyePmb.tenggat}
          pmbUrl={kontak.pmbUrl}
        />
      )}

      <section className="px-4 pb-20 sm:px-6">
        <div className="mx-auto grid max-w-[1024px] gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {facts.map((f, i) => (
            <Reveal key={f.k} delay={i * 0.05}>
              <div className="h-full rounded-[24px] bg-mist p-6">
                <p className="text-[clamp(1.75rem,1.4rem+1.2vw,2.5rem)] font-extrabold leading-none tracking-[-0.03em] text-label">
                  {f.v}
                </p>
                <p className="mt-2 text-[14px] text-label-2">{f.k}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="px-4 pb-24 sm:px-6">
        <div className="mx-auto max-w-[1024px]">
          <Reveal>
            <SectionHeading
              align="left"
              eyebrow="Yang dipelajari"
              title="Bidang kajian"
            />
          </Reveal>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {bidangKajian.map((b) => (
              <div
                key={b.title}
                className="rounded-[24px] border border-hairline bg-canvas p-6"
              >
                <h3 className="text-[18px] font-bold text-label">{b.title}</h3>
                <p className="mt-1.5 text-[15px] leading-[1.5] text-label-2">
                  {b.description}
                </p>
              </div>
            ))}
          </div>
          <Link
            href="/prodi/akademik"
            className="mt-6 inline-block text-[16px] font-semibold text-accent hover:underline"
          >
            Lihat kurikulum lengkap ›
          </Link>
        </div>
      </section>

      {jalurMasuk.length > 0 && (
        <section className="bg-mist px-4 py-24 sm:px-6">
          <div className="mx-auto max-w-[1024px]">
            <Reveal>
              <SectionHeading
                align="left"
                eyebrow="Pendaftaran"
                title="Jalur masuk"
              />
            </Reveal>
            <ol className="mt-8 grid gap-4 md:grid-cols-2">
              {jalurMasuk.map((j, i) => (
                <li
                  key={j.title}
                  className="flex gap-4 rounded-[24px] bg-canvas p-6"
                >
                  <span className="grid size-9 shrink-0 place-items-center rounded-full bg-accent text-[14px] font-bold text-white">
                    {i + 1}
                  </span>
                  <span>
                    <span className="block text-[17px] font-bold text-label">
                      {j.title}
                    </span>
                    <span className="mt-1 block text-[15px] leading-[1.5] text-label-2">
                      {j.description}
                    </span>
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </section>
      )}

      {infoMaba.length > 0 && (
        <section className="px-4 py-24 sm:px-6">
          <div className="mx-auto max-w-[1024px]">
            <Reveal>
              <SectionHeading
                align="left"
                eyebrow="Biaya & administrasi"
                title="Informasi resmi"
              />
            </Reveal>
            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {infoMaba.map((t) => (
                <a
                  key={t.url}
                  href={t.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex h-full flex-col rounded-[24px] border border-hairline bg-canvas p-6 transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_48px_-24px_rgba(22,58,69,0.35)]"
                >
                  <span className="flex items-start justify-between gap-3">
                    <span className="text-[17px] font-bold leading-snug text-label group-hover:text-accent">
                      {t.name}
                    </span>
                    <ArrowUpRight className="size-5 shrink-0 text-label-3 group-hover:text-accent" />
                  </span>
                  <span className="mt-2 text-[14.5px] leading-[1.5] text-label-2">
                    {t.description}
                  </span>
                </a>
              ))}
            </div>
            <p className="mt-6 text-[15px] text-label-2">
              Tersedia {beasiswa.length} program beasiswa untuk mahasiswa UIN
              SGD.{" "}
              <Link
                href="/prodi/beasiswa"
                className="font-semibold text-accent hover:underline"
              >
                Lihat beasiswa ›
              </Link>
            </p>
          </div>
        </section>
      )}

      <section className="bg-navy px-4 py-24 text-white sm:px-6">
        <div className="mx-auto max-w-[1024px]">
          <p className="text-[15px] font-semibold uppercase tracking-[0.08em] text-sand">
            Setelah lulus
          </p>
          <h2 className="mt-3 text-[clamp(1.75rem,1.3rem+1.6vw,2.5rem)] font-bold tracking-[-0.02em]">
            Prospek karir lulusan
          </h2>
          <ul className="mt-8 flex flex-wrap gap-3">
            {prospekKarir.map((p) => (
              <li
                key={p.title}
                className="rounded-full bg-white/10 px-4 py-2 text-[15px] font-medium"
              >
                {p.title}
              </li>
            ))}
          </ul>
          {mitra.length > 0 && (
            <p className="mt-8 text-[15px] text-white/75">
              Belajar langsung bersama mitra:{" "}
              {mitra
                .slice(0, 5)
                .map((m) => m.name)
                .join(", ")}
              .
            </p>
          )}
        </div>
      </section>

      {panduanMaba.length > 0 && (
        <section className="px-4 pt-24 sm:px-6">
          <div className="mx-auto max-w-[820px]">
            <SectionHeading
              title="Sudah diterima? Lakukan ini"
              description="Langkah awal setelah dinyatakan lulus seleksi."
            />
            <ol className="mt-10 grid gap-3">
              {panduanMaba.map((p, i) => (
                <li key={p.url}>
                  <a
                    href={p.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-4 rounded-[20px] border border-hairline bg-canvas p-5 hover:border-accent/40"
                  >
                    <span className="grid size-9 shrink-0 place-items-center rounded-full bg-accent text-[14px] font-bold text-white">
                      {i + 1}
                    </span>
                    <span className="flex-1">
                      <span className="block text-[16px] font-bold text-label group-hover:text-accent">
                        {p.name}
                      </span>
                      <span className="block text-[14px] text-label-2">
                        {p.description}
                      </span>
                    </span>
                  </a>
                </li>
              ))}
            </ol>
          </div>
        </section>
      )}

      {faq.length > 0 && (
        <section className="px-4 py-24 sm:px-6">
          <div className="mx-auto max-w-[820px]">
            <SectionHeading title="Pertanyaan calon mahasiswa" />
            <div className="mt-10">
              <FaqList items={faq} />
            </div>
          </div>
        </section>
      )}

      <PmbCta />
    </>
  );
}
