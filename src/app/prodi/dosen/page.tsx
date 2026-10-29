import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/site/page-header";
import { DosenDirectory } from "@/components/site/dosen-directory";
import { Reveal } from "@/components/site/reveal";
import { getSite } from "@/lib/site/get-site";
import { getAkademik } from "@/lib/site/akademik";
import { buildDosenIndex } from "@/lib/site/dosen-index";
import { getSkripsi } from "@/lib/site/skripsi";
import { DosenIndex } from "@/components/site/dosen-index";
import { initials } from "@/lib/site/names";
import { prodi } from "@/lib/site/prodi";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Dosen & Staf",
  description: `Dosen tetap, pengampu mata kuliah, pembimbing skripsi, dan tenaga kependidikan ${prodi.fullName} ${prodi.university}.`,
};

type Props = { searchParams: Promise<{ q?: string; tab?: string }> };

export default async function DosenPage({ searchParams }: Props) {
  const [{ dosen, pimpinan, tendik }, akademik, skripsi, sp] =
    await Promise.all([getSite(), getAkademik(), getSkripsi(), searchParams]);
  const q = sp.q ?? "";
  const index = buildDosenIndex([...pimpinan, ...dosen], akademik, skripsi);
  const activeTab =
    sp.tab === "pengampu" || (q && !sp.tab)
      ? "pengampu"
      : sp.tab === "tendik"
        ? "tendik"
        : "dosen";

  const TABS = [
    { key: "dosen", label: `Dosen Tetap Prodi (${dosen.length})` },
    {
      key: "pengampu",
      label: `Pengampu & Pembimbing Skripsi (${index.length})`,
    },
    { key: "tendik", label: `Tenaga Kependidikan (${tendik.length})` },
  ] as const;

  return (
    <>
      <PageHeader
        crumb="Dosen & Staf"
        title="Dosen & tenaga kependidikan"
        description="Profil keahlian dosen tetap, daftar pengampu mata kuliah Semester 1–8 & pembimbing skripsi, serta staf layanan akademik."
      />

      <section className="px-4 pb-20 sm:px-6 sm:pb-24">
        <div className="mx-auto max-w-[1060px]">
          {/* Tab Switcher agar halaman ringkas & tidak terlalu panjang */}
          <div className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-hairline pb-4">
            <nav
              aria-label="Kategori SDM"
              className="inline-flex flex-wrap gap-1.5 rounded-full bg-mist p-1"
            >
              {TABS.map((t) => (
                <Link
                  key={t.key}
                  href={
                    t.key === "dosen"
                      ? "/prodi/dosen"
                      : `/prodi/dosen?tab=${t.key}`
                  }
                  className={cn(
                    "rounded-full px-4 py-2 text-[13.5px] font-semibold transition-colors",
                    activeTab === t.key
                      ? "bg-accent text-white shadow-xs"
                      : "text-label-2 hover:text-label",
                  )}
                >
                  {t.label}
                </Link>
              ))}
            </nav>

            <Link
              href="/prodi/formulir/profil-dosen"
              className="text-[13.5px] font-semibold text-accent hover:underline"
            >
              Pembaruan profil dosen ›
            </Link>
          </div>

          {activeTab === "dosen" && <DosenDirectory dosen={dosen} />}

          {activeTab === "pengampu" && (
            <div id="direktori" className="scroll-mt-28">
              <div className="mb-5 rounded-[18px] bg-mist/70 p-4 text-[14px] text-label-2">
                Menampilkan keterkaitan dosen dengan mata kuliah yang diampu di{" "}
                <strong className="font-semibold text-label">e-Knows</strong>{" "}
                dan jumlah bimbingan skripsi yang terdata di{" "}
                <strong className="font-semibold text-label">
                  Digilib UIN SGD
                </strong>
                .
              </div>
              <DosenIndex items={index} initialQuery={q.slice(0, 120)} />
            </div>
          )}

          {activeTab === "tendik" && (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {tendik.map((t, i) => (
                <div
                  key={`${t.name}-${i}`}
                  className="flex items-center gap-3.5 rounded-[18px] border border-hairline bg-canvas p-5"
                >
                  {t.photo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={t.photo}
                      alt={t.name}
                      className="size-13 shrink-0 rounded-full object-cover"
                    />
                  ) : (
                    <span className="grid size-13 shrink-0 place-items-center rounded-full bg-accent-soft text-[15px] font-bold text-accent">
                      {initials(t.name)}
                    </span>
                  )}
                  <div>
                    <h3 className="text-[15.5px] font-bold text-label">
                      {t.name}
                    </h3>
                    <p className="mt-0.5 text-[13px] text-label-2">{t.role}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          <Reveal className="mt-10">
            <div className="flex flex-col items-start justify-between gap-4 rounded-[20px] border border-hairline bg-mist/60 p-6 sm:flex-row sm:items-center">
              <div>
                <p className="text-[16px] font-bold text-label">
                  Pangkalan Data Pendidikan Tinggi (PDDikti) & SINTA
                </p>
                <p className="mt-0.5 text-[14px] text-label-2">
                  Verifikasi rekam jejak tridarma, HKI, dan sitasi ilmiah dosen Program Studi Ekonomi Syariah.
                </p>
              </div>
              <div className="flex flex-wrap gap-2.5">
                <a
                  href="https://sinta.kemdikbud.go.id/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border border-hairline bg-canvas px-4 py-2 text-[13.5px] font-semibold text-label hover:border-accent hover:text-accent"
                >
                  Portal SINTA ↗
                </a>
                <a
                  href="https://pddikti.kemdiktisaintek.go.id"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full bg-accent px-4 py-2 text-[13.5px] font-semibold text-white hover:bg-accent-hover"
                >
                  Buka PDDikti ↗
                </a>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
