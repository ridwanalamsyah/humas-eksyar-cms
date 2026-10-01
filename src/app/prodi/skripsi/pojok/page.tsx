import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, BookOpen, ScanSearch } from "lucide-react";
import { getSite } from "@/lib/site/get-site";
import { todayJakarta } from "@/lib/site/kalender";
import { PageHeader } from "@/components/site/page-header";
import { SectionHeading } from "@/components/site/section-heading";

export const metadata: Metadata = {
  title: "Pojok Skripsi",
  description:
    "Topik skripsi yang disarankan dosen, jadwal seminar & sidang, panduan, dan integritas akademik.",
};

export const revalidate = 3600;

export default async function PojokSkripsiPage() {
  const { topikSkripsi, jadwalSidang, panduanSkripsi, integritas } =
    await getSite();
  const today = todayJakarta();
  const sidang = [...jadwalSidang]
    .filter((j) => j.tanggal >= today)
    .sort((a, b) => a.tanggal.localeCompare(b.tanggal));
  const perDosen = new Map<string, typeof topikSkripsi>();
  for (const t of topikSkripsi)
    perDosen.set(t.dosen || "Prodi", [
      ...(perDosen.get(t.dosen || "Prodi") ?? []),
      t,
    ]);

  return (
    <>
      <PageHeader
        crumb="Pojok skripsi"
        title="Pojok skripsi"
        description="Semua yang dibutuhkan untuk menyusun skripsi, dari mencari topik sampai sidang."
      />

      <section className="px-4 pb-20 sm:px-6">
        <div className="mx-auto grid max-w-[1024px] gap-4 md:grid-cols-2">
          <Link
            href="/prodi/skripsi"
            className="group flex items-center gap-4 rounded-[24px] bg-accent p-6 text-white hover:bg-accent-strong"
          >
            <BookOpen className="size-8 shrink-0 text-sand" strokeWidth={1.5} />
            <span>
              <span className="block text-[18px] font-bold">
                Direktori skripsi
              </span>
              <span className="text-[14px] text-white/80">
                Telusuri skripsi Eksyar terdahulu beserta abstraknya.
              </span>
            </span>
          </Link>
          <Link
            href="/prodi/skripsi?mode=cek"
            className="group flex items-center gap-4 rounded-[24px] bg-mist p-6 hover:bg-hairline"
          >
            <ScanSearch
              className="size-8 shrink-0 text-accent"
              strokeWidth={1.5}
            />
            <span>
              <span className="block text-[18px] font-bold text-label">
                Cek kemiripan judul
              </span>
              <span className="text-[14px] text-label-2">
                Pastikan rencana judulmu belum pernah diteliti.
              </span>
            </span>
          </Link>
        </div>
      </section>

      {topikSkripsi.length > 0 && (
        <section className="px-4 pb-24 sm:px-6">
          <div className="mx-auto max-w-[1024px]">
            <SectionHeading
              align="left"
              eyebrow="Inspirasi"
              title="Topik yang disarankan dosen"
            />
            <div className="mt-8 grid gap-4 md:grid-cols-2">
              {[...perDosen].map(([dosen, list]) => (
                <div
                  key={dosen}
                  className="rounded-[24px] border border-hairline bg-canvas p-6"
                >
                  <p className="text-[13px] font-semibold text-accent">
                    {dosen}
                  </p>
                  <ul className="mt-3 grid gap-3">
                    {list.map((t) => (
                      <li key={t.topik}>
                        <p className="text-[16px] font-semibold leading-snug text-label">
                          {t.topik}
                        </p>
                        {t.deskripsi && (
                          <p className="mt-0.5 text-[14px] text-label-2">
                            {t.deskripsi}
                          </p>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {sidang.length > 0 && (
        <section className="bg-mist px-4 py-24 sm:px-6">
          <div className="mx-auto max-w-[1024px]">
            <SectionHeading
              align="left"
              eyebrow="Jadwal"
              title="Seminar & sidang mendatang"
            />
            <div className="mt-8 overflow-x-auto rounded-[20px] border border-hairline bg-canvas">
              <table className="w-full min-w-[640px] text-left text-[14.5px]">
                <thead className="text-[12.5px] uppercase tracking-wide text-label-3">
                  <tr>
                    <th className="px-5 py-3 font-semibold">Tanggal</th>
                    <th className="px-5 py-3 font-semibold">Jenis</th>
                    <th className="px-5 py-3 font-semibold">
                      Mahasiswa & judul
                    </th>
                    <th className="px-5 py-3 font-semibold">Ruang</th>
                  </tr>
                </thead>
                <tbody>
                  {sidang.map((j, i) => (
                    <tr
                      key={`${j.nama}-${i}`}
                      className="border-t border-hairline align-top"
                    >
                      <td className="whitespace-nowrap px-5 py-3 text-label">
                        {new Date(
                          `${j.tanggal}T00:00:00+07:00`,
                        ).toLocaleDateString("id-ID", {
                          weekday: "short",
                          day: "numeric",
                          month: "short",
                          timeZone: "Asia/Jakarta",
                        })}
                      </td>
                      <td className="px-5 py-3 text-label-2">{j.jenis}</td>
                      <td className="px-5 py-3">
                        <span className="font-semibold text-label">
                          {j.nama}
                        </span>
                        <span className="mt-0.5 block text-label-2">
                          {j.judul}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-label-2">{j.ruang}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      <section className="px-4 py-24 sm:px-6">
        <div className="mx-auto grid max-w-[1024px] gap-12 lg:grid-cols-2">
          {panduanSkripsi.length > 0 && (
            <div>
              <SectionHeading
                align="left"
                eyebrow="Panduan"
                title="Panduan & referensi"
              />
              <ul className="mt-8 grid gap-3">
                {panduanSkripsi.map((p) => (
                  <li key={p.url}>
                    <a
                      href={p.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-start justify-between gap-4 rounded-[20px] border border-hairline bg-canvas p-5 hover:border-accent/40"
                    >
                      <span>
                        <span className="block text-[16px] font-bold text-label group-hover:text-accent">
                          {p.name}
                        </span>
                        <span className="mt-0.5 block text-[14px] text-label-2">
                          {p.description}
                        </span>
                      </span>
                      <ArrowUpRight className="size-5 shrink-0 text-label-3" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {integritas.length > 0 && (
            <div id="integritas" className="scroll-mt-28">
              <SectionHeading
                align="left"
                eyebrow="Etika"
                title="Integritas akademik"
              />
              <ol className="mt-8 grid gap-4">
                {integritas.map((t, i) => (
                  <li key={i} className="flex gap-4">
                    <span className="grid size-8 shrink-0 place-items-center rounded-full bg-accent-soft text-[14px] font-bold text-accent">
                      {i + 1}
                    </span>
                    <p className="pt-1 text-[15.5px] leading-relaxed text-label">
                      {t}
                    </p>
                  </li>
                ))}
              </ol>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
