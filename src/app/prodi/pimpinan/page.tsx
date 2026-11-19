import type { Metadata } from "next";
import Link from "next/link";
import { Reveal } from "@/components/site/reveal";
import { initials } from "@/lib/site/names";
import { PageHeader } from "@/components/site/page-header";
import { getSite } from "@/lib/site/get-site";
import { prodi } from "@/lib/site/prodi";

export const metadata: Metadata = {
  title: "Pimpinan & struktur",
  description: `Pimpinan fakultas dan ${prodi.fullName} ${prodi.university}, beserta bagan struktur organisasi.`,
};

export default async function Page() {
  const { pimpinan, struktur } = await getSite();
  const levels = [1, 2, 3, 4]
    .map((l) => struktur.filter((x) => x.level === l))
    .filter((x) => x.length);
  return (
    <>
      <PageHeader crumb="Pimpinan & struktur" title="Pimpinan & struktur" />

      {/* Pimpinan & Struktur Organisasi (Ringkas) */}
      <section
        id="pimpinan"
        className="scroll-mt-28 px-4 pb-16 pt-2 sm:px-6 sm:py-20"
      >
        <div className="mx-auto max-w-[1060px]">
          <Reveal className="flex flex-wrap items-end justify-between gap-4">
            <Link
              href="/prodi/dosen"
              className="text-[14px] font-semibold text-accent hover:underline"
            >
              Lihat seluruh dosen & staf ›
            </Link>
          </Reveal>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {pimpinan.map((p, i) => (
              <Reveal key={`${p.name}-${i}`} delay={(i % 3) * 0.04}>
                <div className="flex h-full items-center gap-4 border-t border-hairline pt-5">
                  {p.photo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={p.photo}
                      alt={p.name}
                      className="size-13 shrink-0 rounded-2xl object-cover"
                    />
                  ) : (
                    <span className="grid size-13 shrink-0 place-items-center rounded-xl bg-accent-soft text-[16px] font-bold text-accent">
                      {initials(p.name)}
                    </span>
                  )}
                  <div className="min-w-0">
                    <h3 className="text-[16px] font-bold leading-snug text-label">
                      {p.name}
                    </h3>
                    <p className="mt-0.5 text-[14px] leading-snug text-label-2">
                      {p.role}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          {levels.length > 0 && (
            <details open id="struktur" className="group mt-10 scroll-mt-28 border-t border-hairline pt-4">
              <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between text-[16px] font-semibold text-accent">
                Lihat bagan struktur organisasi
                <span aria-hidden className="text-[20px] transition-transform group-open:rotate-45">+</span>
              </summary>
              <div className="mt-6 flex flex-col items-center gap-4">
                {levels.map((row, i) => (
                  <div key={i} className="flex w-full flex-col items-center">
                    {i > 0 && (
                      <span aria-hidden className="mb-4 h-4 w-px bg-hairline" />
                    )}
                    <ul className="flex w-full flex-wrap justify-center gap-2.5">
                      {row.map((x) => (
                        <li
                          key={`${x.jabatan}-${x.nama}`}
                          className={
                            i === 0
                              ? "w-full rounded-[16px] bg-accent px-4 py-3 text-center text-white sm:w-auto sm:min-w-[210px]"
                              : "w-full rounded-[16px] border border-hairline bg-canvas px-4 py-3 text-center sm:w-auto sm:min-w-[190px]"
                          }
                        >
                          <p
                            className={
                              i === 0
                                ? "text-[14px] font-semibold text-sand"
                                : "text-[14px] font-semibold text-accent"
                            }
                          >
                            {x.jabatan}
                          </p>
                          <p
                            className={
                              i === 0
                                ? "mt-0.5 text-[14px] font-bold"
                                : "mt-0.5 text-[14px] font-bold text-label"
                            }
                          >
                            {x.nama}
                          </p>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </details>
          )}
        </div>
      </section>
    </>
  );
}
