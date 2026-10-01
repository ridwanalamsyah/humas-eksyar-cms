import type { Metadata } from "next";
import { getSite } from "@/lib/site/get-site";
import { getSkripsi } from "@/lib/site/skripsi";
import { BarChart } from "@/components/site/bar-chart";
import { PageHeader } from "@/components/site/page-header";
import { SectionHeading } from "@/components/site/section-heading";

export const metadata: Metadata = {
  title: "Data & Statistik",
  description:
    "Statistik mahasiswa, lulusan, dosen, skripsi, dan infografis Program Studi Ekonomi Syariah.",
};

export default async function DataPage() {
  const [{ statistik, infografis }, skripsi] = await Promise.all([
    getSite(),
    getSkripsi(),
  ]);
  const rows = [...statistik].sort((a, b) => a.tahun.localeCompare(b.tahun));
  const measures = [
    { key: "mahasiswaAktif", title: "Mahasiswa aktif", unit: "orang" },
    { key: "mahasiswaBaru", title: "Mahasiswa baru", unit: "orang" },
    { key: "lulusan", title: "Lulusan", unit: "orang" },
    { key: "dosen", title: "Dosen", unit: "orang" },
  ] as const;
  const perTahun = new Map<number, number>();
  for (const s of skripsi)
    perTahun.set(s.tahun, (perTahun.get(s.tahun) ?? 0) + 1);
  const skripsiData = [...perTahun]
    .sort((a, b) => a[0] - b[0])
    .slice(-10)
    .map(([t, n]) => ({ label: String(t), nilai: n }));

  return (
    <>
      <PageHeader
        crumb="Data"
        title="Data & statistik"
        description="Angka-angka utama program studi. Sumber data dicantumkan pada tiap grafik."
      />
      <section className="px-4 pb-24 sm:px-6">
        <div className="mx-auto grid max-w-[1024px] gap-16">
          {rows.length > 0 && (
            <div>
              <SectionHeading
                align="left"
                eyebrow="Statistik prodi"
                title="Mahasiswa, lulusan & dosen"
              />
              <div className="mt-8 grid gap-4 md:grid-cols-2">
                {measures.map((m) => (
                  <BarChart
                    key={m.key}
                    title={m.title}
                    unit={m.unit}
                    data={rows.map((r) => ({
                      label: r.tahun,
                      nilai: r[m.key],
                    }))}
                  />
                ))}
              </div>
            </div>
          )}
          {skripsiData.length > 1 && (
            <div>
              <SectionHeading
                align="left"
                eyebrow="Penelitian mahasiswa"
                title="Skripsi per tahun"
              />
              <div className="mt-8">
                <BarChart
                  title="Skripsi tercatat di direktori"
                  unit="judul"
                  data={skripsiData}
                />
              </div>
              <p className="mt-2 text-[13px] text-label-3">
                Sumber: direktori skripsi (Digital Library UIN SGD).
              </p>
            </div>
          )}
          {infografis.map((g) => (
            <div key={g.judul}>
              <SectionHeading
                align="left"
                eyebrow="Infografis"
                title={g.judul}
                description={g.deskripsi}
              />
              <div className="mt-8">
                <BarChart title={g.judul} unit={g.satuan} data={g.data} />
              </div>
              {g.sumber && (
                <p className="mt-2 text-[13px] text-label-3">
                  Sumber: {g.sumber}
                </p>
              )}
            </div>
          ))}
          {rows.length === 0 &&
            infografis.length === 0 &&
            skripsiData.length <= 1 && (
              <p className="rounded-[24px] bg-mist p-10 text-center text-[17px] text-label-2">
                Data statistik sedang disiapkan.
              </p>
            )}
        </div>
      </section>
    </>
  );
}
