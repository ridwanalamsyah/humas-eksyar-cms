import type { Metadata } from "next";
import Link from "next/link";
import { getSite } from "@/lib/site/get-site";
import { sisaHari } from "@/lib/site/kalender";
import { DeadlineCard } from "@/components/site/deadline-card";
import { PageHeader } from "@/components/site/page-header";
import { PrestasiGrid } from "@/components/site/prestasi-grid";

export const metadata: Metadata = {
  title: "Info Lomba",
  description:
    "Info lomba ekonomi syariah, esai, business plan, dan karya tulis untuk mahasiswa.",
};

export const revalidate = 3600;

export default async function LombaPage() {
  const { lomba, prestasi } = await getSite();
  const sorted = [...lomba].sort((a, b) => {
    const da = sisaHari(a.deadline) ?? 9999;
    const db = sisaHari(b.deadline) ?? 9999;
    return (da < 0 ? 1e6 - da : da) - (db < 0 ? 1e6 - db : db);
  });
  return (
    <>
      <PageHeader
        crumb="Lomba"
        title="Info lomba"
        description="Kompetisi ekonomi syariah, esai, business plan, dan karya tulis ilmiah yang bisa diikuti mahasiswa."
      />
      <section className="px-4 pb-24 sm:px-6">
        <div className="mx-auto max-w-[1024px]">
          {sorted.length ? (
            <div className="grid gap-4 md:grid-cols-2">
              {sorted.map((l) => (
                <DeadlineCard
                  key={l.nama}
                  title={l.nama}
                  meta={`${l.tingkat} · ${l.penyelenggara}`}
                  description={l.deskripsi}
                  deadline={l.deadline}
                  href={l.url}
                  cta="Info & daftar"
                />
              ))}
            </div>
          ) : (
            <p className="rounded-[24px] bg-mist p-10 text-center text-[17px] text-label-2">
              Belum ada info lomba yang dibuka.
            </p>
          )}
          <p className="mt-8 text-[15px] text-label-2">
            Sudah juara?{" "}
            <Link
              href="/prodi/formulir/prestasi"
              className="font-semibold text-accent hover:underline"
            >
              Laporkan prestasimu ›
            </Link>
          </p>
          {prestasi.length > 0 && (
            <div className="mt-16">
              <h2 className="text-[28px] font-bold tracking-[-0.02em] text-label">
                Prestasi terdahulu
              </h2>
              <div className="mt-8">
                <PrestasiGrid items={prestasi} />
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
