import type { Metadata } from "next";
import { ArrowUpRight, Clock, Mail, MapPin } from "lucide-react";
import { FaqList } from "@/components/site/faq-list";
import { PageHeader } from "@/components/site/page-header";
import { Reveal } from "@/components/site/reveal";
import { SectionHeading } from "@/components/site/section-heading";
import { faq, himpunan, kontak, prodi } from "@/lib/site/prodi";

export const metadata: Metadata = {
  title: "Kontak",
  description: `Alamat, email, dan media sosial ${prodi.fullName} ${prodi.university}.`,
};

const sosial = [
  { label: "Instagram Prodi", handle: kontak.instagramHandle, href: kontak.instagram },
  { label: "TikTok Prodi", handle: "@eksyaruinsgd", href: kontak.tiktok },
  { label: "Instagram HMJ", handle: "@hmjeksyaruinbdg", href: himpunan.instagram },
  { label: "Instagram FEBI", handle: "@febiuinsgdbdg", href: kontak.febiInstagram },
];

export default function KontakPage() {
  return (
    <>
      <PageHeader
        crumb="Kontak"
        title="Hubungi Kami"
        description="Punya pertanyaan seputar perkuliahan, pendaftaran, atau kerja sama? Kami siap membantu."
      />

      <section className="px-6 py-20">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1fr_1.3fr]">
          <Reveal>
            <SectionHeading eyebrow="Sekretariat" title={prodi.fullName} />
            <ul className="mt-8 divide-y divide-pine-800/15 border-y border-pine-800/15">
              <li className="flex gap-4 py-5">
                <MapPin className="mt-1 size-5 shrink-0 text-saffron-600" />
                <div>
                  <p className="font-semibold text-pine-800">Alamat</p>
                  <p className="mt-1 text-[15px] leading-relaxed text-ink/70">
                    {kontak.address}
                    <br />
                    {kontak.street}
                  </p>
                  <a
                    href={kontak.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-flex items-center gap-1 text-[14px] font-semibold text-pine-700 hover:text-saffron-600"
                  >
                    Petunjuk arah <ArrowUpRight className="size-3.5" />
                  </a>
                </div>
              </li>
              <li className="flex gap-4 py-5">
                <Mail className="mt-1 size-5 shrink-0 text-saffron-600" />
                <div>
                  <p className="font-semibold text-pine-800">Email</p>
                  <a href={`mailto:${kontak.email}`} className="mt-1 block break-all text-[15px] text-ink/70 hover:text-pine-700">
                    {kontak.email}
                  </a>
                </div>
              </li>
              <li className="flex gap-4 py-5">
                <Clock className="mt-1 size-5 shrink-0 text-saffron-600" />
                <div>
                  <p className="font-semibold text-pine-800">Jam Layanan</p>
                  <p className="mt-1 text-[15px] text-ink/70">{kontak.hours}</p>
                </div>
              </li>
            </ul>

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {sosial.map((s) => (
                <a
                  key={s.href}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group border border-pine-800/15 p-4 hover:border-pine-700 hover:bg-pine-50"
                >
                  <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-ink/50">{s.label}</p>
                  <p className="mt-1 flex items-center justify-between font-serif text-[17px] font-semibold text-pine-800">
                    {s.handle}
                    <ArrowUpRight className="size-4 text-saffron-600" />
                  </p>
                </a>
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.05}>
            <div className="h-full min-h-[420px] border border-pine-800/15 bg-paper-2 p-2">
              <iframe
                title={`Peta lokasi ${prodi.university}`}
                src={kontak.mapsEmbed}
                className="size-full min-h-[420px] grayscale-[35%]"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </Reveal>
        </div>
      </section>

      <section className="bg-paper-2 px-6 py-20">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1fr_1.6fr]">
          <Reveal>
            <SectionHeading eyebrow="Tanya Jawab" title="Pertanyaan yang sering diajukan." />
          </Reveal>
          <Reveal>
            <FaqList items={faq} />
          </Reveal>
        </div>
      </section>
    </>
  );
}
