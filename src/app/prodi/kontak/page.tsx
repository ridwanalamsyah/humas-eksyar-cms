import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { FormRenderer } from "@/components/site/form-renderer";
import { PageHeader } from "@/components/site/page-header";
import { Reveal } from "@/components/site/reveal";
import { SectionHeading } from "@/components/site/section-heading";
import { StatusLayanan } from "@/components/site/status-layanan";
import { findActiveForm } from "@/lib/site/forms";
import { getSite } from "@/lib/site/get-site";
import { prodi, utilityLinks } from "@/lib/site/prodi";

export const metadata: Metadata = {
  title: "Kontak",
  description: `Alamat, email, jam layanan, peta kampus, dan media sosial resmi ${prodi.fullName} ${prodi.university}.`,
};

const tanyaForm = findActiveForm("tanya")!;
const FEBI_MAPS_EMBED =
  "https://maps.google.com/maps?q=-6.9427728,107.7024383+(Gedung+FEBI+Kampus+2+UIN+Sunan+Gunung+Djati+Bandung)&hl=id&z=17&output=embed";
const FEBI_MAPS_URL =
  "https://maps.app.goo.gl/hJU8bxaQuhncp6Dm7";

export default async function KontakPage() {
  const { kontak, medsos, statusLayanan, pressKit } = await getSite();
  const youtubeHref = medsos.youtubeChannelId
    ? `https://www.youtube.com/channel/${medsos.youtubeChannelId}`
    : "https://www.youtube.com/channel/UC7loqPCpEN3H_IbrulKBi6w";
  const sosial = [
    { name: "Instagram", handle: kontak.instagramHandle || "@eksyaruinsgd", href: kontak.instagram || "https://instagram.com/eksyaruinsgd" },
    { name: "YouTube", handle: "Kanal YouTube Resmi", href: youtubeHref },
  ];

  return (
    <>
      <PageHeader
        crumb="Kontak"
        title="Hubungi program studi"
        description={`${prodi.fullName}, ${prodi.faculty}, ${prodi.university}.`}
      />

      {/* Kartu kontak */}
      <section className="px-4 py-16 sm:px-6 sm:py-14 sm:py-20">
        <div className="mx-auto grid max-w-[1024px] gap-4 md:grid-cols-2">
          <Reveal>
            <div className="flex h-full flex-col justify-between rounded-[28px] bg-mist p-8 sm:p-10">
              <div>
                <p className="text-[14px] font-bold text-accent">
                  Lokasi Kampus
                </p>
                <p className="mt-4 text-[24px] font-extrabold leading-[1.2] tracking-[-0.02em] text-label">
                  {kontak.address}
                </p>
                <p className="mt-2 text-[16px] leading-relaxed text-label-2">
                  {kontak.street}
                </p>
              </div>
              <a
                href={FEBI_MAPS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 inline-flex items-center gap-1.5 text-[16px] font-semibold text-accent hover:underline"
              >
                Buka di Google Maps{" "}
                <ArrowUpRight className="size-4" />
              </a>
            </div>
          </Reveal>

          <Reveal delay={0.06}>
            <div className="flex h-full flex-col justify-between rounded-[28px] bg-accent p-8 text-white sm:p-10">
              <div>
                <p className="text-[14px] font-bold text-sand">
                  Kontak Admin & Layanan
                </p>
                <p className="mt-4 block text-[clamp(1.4rem,1.15rem+1vw,1.95rem)] font-extrabold leading-[1.15] tracking-[-0.02em]">
                  Layanan Mahasiswa &amp; Perkuliahan
                </p>
                <p className="mt-2 text-[16px] text-white/90">
                  Konsultasi administrasi akademik, informasi jurusan, dan layanan mahasiswa.
                </p>
                <div className="mt-4 border-t border-white/20 pt-3">
                  <p className="text-[14px] text-sand font-medium">Email Resmi</p>
                  <a
                    href={`mailto:${kontak.email}`}
                    className="text-[16px] font-semibold hover:underline"
                  >
                    {kontak.email}
                  </a>
                  <p className="mt-1 text-[14px] text-white/80">{kontak.hours}</p>
                </div>
              </div>
              <a
                href="https://wa.me/6285642686526"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 inline-flex w-fit items-center gap-2 rounded-xl bg-white px-6 py-3 text-[14px] font-semibold text-label shadow-sm transition-all hover:bg-white/90 hover:scale-[1.01]"
              >
                Hubungi Admin Jurusan <ArrowUpRight className="size-4" />
              </a>
            </div>
          </Reveal>
        </div>

        {/* Peta */}
        <Reveal className="mx-auto mt-4 max-w-[1024px]">
          <div className="overflow-hidden rounded-[28px] border border-hairline bg-mist">
            <iframe
              title={`Lokasi ${prodi.fullName} — Gedung FEBI Kampus II UIN Sunan Gunung Djati Bandung`}
              src={FEBI_MAPS_EMBED}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="h-[380px] w-full border-0 sm:h-[440px]"
            />
          </div>
        </Reveal>
      </section>

      {/* Kirim pertanyaan */}
      <section className="px-4 pb-20 sm:px-6">
        <div className="mx-auto max-w-[720px] border-t border-hairline pt-6 sm:pt-10">
          <p className="text-[14px] font-semibold uppercase tracking-[0.08em] text-accent">
            Tanya prodi
          </p>
          <h2 className="mt-1 text-[24px] font-extrabold tracking-[-0.02em] text-label">
            {tanyaForm.title}
          </h2>
          <p className="mt-1 text-[16px] text-label-2">
            {tanyaForm.description}{" "}
            <Link
              href="/prodi/layanan#faq"
              className="font-semibold text-accent hover:underline"
            >
              Lihat juga FAQ ›
            </Link>
          </p>
          <div className="mt-6">
            <FormRenderer def={tanyaForm} compact />
          </div>
        </div>
      </section>

      {/* Media sosial */}
      <section className="bg-mist px-4 py-14 sm:py-20 sm:px-6">
        <Reveal>
          <SectionHeading eyebrow="Kanal resmi" title="Media sosial" />
        </Reveal>
        <div className="mx-auto mt-10 grid max-w-[1024px] gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sosial.map((s, i) => (
            <Reveal key={s.name} delay={i * 0.05}>
              <a
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex h-full flex-col justify-between pt-6 border-t border-hairline"
              >
                <span className="flex size-9 items-center justify-center self-end rounded-xl bg-mist text-accent transition-colors group-hover:bg-accent group-hover:text-white">
                  <ArrowUpRight className="size-4" />
                </span>
                <div className="mt-6">
                  <p className="text-[18px] font-bold tracking-[-0.01em] text-label">
                    {s.name}
                  </p>
                  <p className="mt-0.5 text-[14px] text-label-2">{s.handle}</p>
                </div>
              </a>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Tautan UIN */}
      <section className="px-4 py-14 sm:py-20 sm:px-6">
        <div className="mx-auto max-w-[1024px]">
          <Reveal>
            <h2 className="text-[24px] font-bold tracking-[-0.015em] text-label">
              Portal UIN Sunan Gunung Djati
            </h2>
          </Reveal>
          <ul className="mt-6 divide-y divide-hairline border-y border-hairline">
            {utilityLinks.map((u) => (
              <li key={u.href}>
                <a
                  href={u.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-between py-4 text-[16px] font-medium text-label transition-colors hover:text-accent"
                >
                  {u.label}
                  <ArrowUpRight className="size-5 text-label-3 transition-transform group-hover:translate-x-0.5 group-hover:text-accent" />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {pressKit.profilSingkat && (
        <section
          id="media"
          className="scroll-mt-28 bg-mist px-4 py-14 sm:py-20 sm:px-6"
        >
          <div className="mx-auto max-w-[760px]">
            <SectionHeading
              align="left"
              eyebrow="Ruang media"
              title="Informasi untuk jurnalis & mitra"
            />
            <p className="mt-6 whitespace-pre-line text-[16px] leading-relaxed text-label">
              {pressKit.profilSingkat}
            </p>
            <div className="mt-6 flex flex-wrap gap-3 text-[14px]">
              <a
                href={prodi.logo}
                download
                className="rounded-xl bg-accent px-5 py-2.5 font-semibold text-white hover:bg-accent-strong"
              >
                Unduh logo prodi
              </a>
              {pressKit.kontakMedia && (
                <a
                  href={`mailto:${pressKit.kontakMedia}`}
                  className="rounded-xl bg-canvas px-5 py-2.5 font-semibold text-label hover:text-accent"
                >
                  Kontak media: {pressKit.kontakMedia}
                </a>
              )}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
