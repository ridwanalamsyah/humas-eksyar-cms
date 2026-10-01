import type { Metadata } from "next";
import Link from "next/link";
import { getSite } from "@/lib/site/get-site";
import { sisaHari } from "@/lib/site/kalender";
import { DeadlineCard } from "@/components/site/deadline-card";
import { MitraList } from "@/components/site/mitra-list";
import { PageHeader } from "@/components/site/page-header";
import { SectionHeading } from "@/components/site/section-heading";

export const metadata: Metadata = {
  title: "Karier & Magang",
  description:
    "Lowongan asisten dosen, relawan, magang, dan kerja untuk mahasiswa dan lulusan Ekonomi Syariah.",
};

export const revalidate = 3600;

export default async function KarierPage() {
  const { lowongan, mitra } = await getSite();
  const open = [...lowongan].sort(
    (a, b) => (sisaHari(a.deadline) ?? 9999) - (sisaHari(b.deadline) ?? 9999),
  );
  return (
    <>
      <PageHeader
        crumb="Karier"
        title="Karier & magang"
        description="Lowongan asisten dosen, relawan kegiatan, magang di lembaga mitra, dan informasi kerja untuk lulusan."
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
          <div className="mt-8 flex flex-wrap gap-4 text-[15px] font-semibold">
            <Link
              href="/prodi/formulir/mentoring"
              className="text-accent hover:underline"
            >
              Cari mentor alumni ›
            </Link>
            <Link
              href="/prodi/alumni#direktori"
              className="text-accent hover:underline"
            >
              Direktori alumni ›
            </Link>
            <a
              href="https://cdc.uinsgd.ac.id/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent hover:underline"
            >
              Career Development Center ↗
            </a>
          </div>
        </div>
      </section>
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
