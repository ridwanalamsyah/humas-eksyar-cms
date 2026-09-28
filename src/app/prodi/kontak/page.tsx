import type { Metadata } from "next";
import { FaqList } from "@/components/site/faq-list";
import { PageHeader } from "@/components/site/page-header";
import { Reveal } from "@/components/site/reveal";
import { SectionHeading } from "@/components/site/section-heading";
import { getSite } from "@/lib/site/get-site";
import { prodi } from "@/lib/site/prodi";

export const metadata: Metadata = {
  title: "Kontak",
  description: `Alamat, email, dan media sosial ${prodi.fullName} ${prodi.university}.`,
};


export default async function KontakPage() {
  const { faq, himpunan, kontak } = await getSite();
  const mapsEmbed = `https://www.google.com/maps?q=${encodeURIComponent(`${kontak.address}, ${kontak.street}`)}&output=embed`;
  const sosial = [
    { label: "Instagram Prodi", handle: kontak.instagramHandle, href: kontak.instagram },
    { label: "TikTok Prodi", handle: "TikTok", href: kontak.tiktok },
    { label: "Instagram HMJ", handle: "HMJ Ekonomi Syariah", href: himpunan.instagram },
    { label: "Linktree", handle: "Semua tautan", href: kontak.linktree },
  ].filter((s) => s.href);
  return (
    <>
      <PageHeader
        crumb="Kontak"
        title="Ada pertanyaan? Kami siap membantu."
        description="Seputar perkuliahan, pendaftaran, atau kerja sama."
      />

      <section className="px-4 pb-24 sm:px-6 sm:pb-32">
        <div className="mx-auto grid max-w-[1024px] gap-4 md:grid-cols-3">
          <Card label="Email">
            <a href={`mailto:${kontak.email}`} className="break-all text-[21px] font-semibold tracking-[-0.01em] text-label hover:text-accent">
              {kontak.email}
            </a>
          </Card>
          <Card label="Jam layanan">
            <p className="text-[21px] font-semibold tracking-[-0.01em] text-label">{kontak.hours}</p>
          </Card>
          <Card label="Alamat">
            <p className="text-[17px] font-semibold leading-snug text-label">{kontak.address}</p>
            <p className="mt-1 text-[15px] text-label-2">{kontak.street}</p>
            <a href={kontak.mapsUrl} target="_blank" rel="noopener noreferrer" className="mt-3 inline-block text-[15px] text-accent hover:underline">
              Petunjuk arah ↗
            </a>
          </Card>
        </div>

        <Reveal className="mx-auto mt-4 max-w-[1024px]">
          <div className="overflow-hidden rounded-[28px] bg-mist">
            <iframe
              title={`Peta lokasi ${prodi.university}`}
              src={mapsEmbed}
              className="h-[420px] w-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </Reveal>

        <div className="mx-auto mt-4 grid max-w-[1024px] gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {sosial.map((s) => (
            <a
              key={s.href}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group rounded-[20px] bg-mist p-6 transition duration-300 hover:-translate-y-1 hover:bg-accent hover:text-white"
            >
              <p className="text-[13px] text-label-2 group-hover:text-white/75">{s.label}</p>
              <p className="mt-1 text-[17px] font-semibold text-label group-hover:text-white">{s.handle}</p>
            </a>
          ))}
        </div>
      </section>

      <section className="bg-mist px-4 py-24 sm:px-6 sm:py-32">
        <Reveal>
          <SectionHeading title="Pertanyaan umum." />
        </Reveal>
        <Reveal className="mt-10">
          <FaqList items={faq} />
        </Reveal>
      </section>
    </>
  );
}

function Card({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <Reveal>
      <div className="flex h-full flex-col rounded-[28px] bg-mist p-8">
        <p className="text-[14px] font-semibold text-accent">{label}</p>
        <div className="mt-auto pt-10">{children}</div>
      </div>
    </Reveal>
  );
}
