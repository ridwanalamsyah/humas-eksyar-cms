import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, BookMarked } from "lucide-react";
import { getSite } from "@/lib/site/get-site";
import { prodi } from "@/lib/site/prodi";
import { HighlightCard } from "@/components/site/highlight-card";
import { PageHeader } from "@/components/site/page-header";
import { PublikasiList } from "@/components/site/publikasi-list";
import { Reveal } from "@/components/site/reveal";
import { SectionHeading } from "@/components/site/section-heading";

export const metadata: Metadata = {
  title: "Penelitian & Publikasi",
  description: `Publikasi dosen, jurnal ilmiah, dan pengabdian masyarakat ${prodi.fullName} ${prodi.university}.`,
};

export default async function PenelitianPage() {
  const { publikasi, jurnal, kegiatan } = await getSite();
  const pengabdian = kegiatan
    .filter((k) => /pengabdian|penelitian/i.test(k.category))
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 4);

  return (
    <>
      <PageHeader
        crumb="Penelitian"
        title="Penelitian & publikasi"
        description="Karya ilmiah dosen, jurnal yang dikelola kampus, dan program pengabdian kepada masyarakat."
      />

      {jurnal.length > 0 && (
        <section className="px-4 pb-20 sm:px-6">
          <div className="mx-auto grid max-w-[1024px] gap-4 md:grid-cols-3">
            {jurnal.map((j, i) => (
              <Reveal key={j.name} delay={i * 0.06}>
                <a
                  href={j.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={
                    i === 0
                      ? "group flex h-full flex-col rounded-[28px] bg-accent p-7 text-white transition-transform duration-500 hover:scale-[1.015]"
                      : "group flex h-full flex-col rounded-[28px] bg-mist p-7 transition-transform duration-500 hover:scale-[1.015]"
                  }
                >
                  <span className="flex items-start justify-between">
                    <BookMarked
                      className={
                        i === 0 ? "size-7 text-sand" : "size-7 text-accent"
                      }
                      strokeWidth={1.5}
                    />
                    <ArrowUpRight
                      className={
                        i === 0
                          ? "size-5 text-white/70"
                          : "size-5 text-label-3 group-hover:text-accent"
                      }
                    />
                  </span>
                  <span
                    className={
                      i === 0
                        ? "mt-8 text-[20px] font-bold leading-snug"
                        : "mt-8 text-[20px] font-bold leading-snug text-label"
                    }
                  >
                    {j.name}
                  </span>
                  <span
                    className={
                      i === 0
                        ? "mt-2 text-[14.5px] leading-[1.5] text-white/80"
                        : "mt-2 text-[14.5px] leading-[1.5] text-label-2"
                    }
                  >
                    {j.description}
                  </span>
                </a>
              </Reveal>
            ))}
          </div>
        </section>
      )}

      <section className="bg-mist px-4 py-24 sm:px-6">
        <div className="mx-auto max-w-[1024px]">
          <Reveal>
            <SectionHeading
              align="left"
              eyebrow="Publikasi"
              title="Karya ilmiah dosen"
            />
          </Reveal>
          <div className="mt-8">
            <PublikasiList items={publikasi} />
          </div>
          <p className="mt-6 text-[14px] text-label-2">
            Rekam jejak lengkap dosen tersedia di{" "}
            <a
              href="https://pddikti.kemdiktisaintek.go.id"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-accent hover:underline"
            >
              PDDikti
            </a>
            . Skripsi mahasiswa ada di{" "}
            <Link
              href="/prodi/skripsi"
              className="font-semibold text-accent hover:underline"
            >
              direktori skripsi
            </Link>
            .
          </p>
        </div>
      </section>

      {pengabdian.length > 0 && (
        <section className="px-4 py-24 sm:px-6">
          <div className="mx-auto max-w-[1024px]">
            <Reveal>
              <SectionHeading
                align="left"
                eyebrow="Pengabdian"
                title="Pengabdian kepada masyarakat"
              />
            </Reveal>
            <div className="mt-8 grid gap-5 sm:grid-cols-2">
              {pengabdian.map((k, i) => (
                <HighlightCard key={`${k.title}-${i}`} item={k} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
