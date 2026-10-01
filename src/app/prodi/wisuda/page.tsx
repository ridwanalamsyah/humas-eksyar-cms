import type { Metadata } from "next";
import { getSite } from "@/lib/site/get-site";
import { PageHeader } from "@/components/site/page-header";

export const metadata: Metadata = {
  title: "Wisudawan",
  description:
    "Daftar wisudawan Program Studi Ekonomi Syariah beserta judul skripsinya.",
};

export default async function WisudaPage() {
  const { wisuda } = await getSite();
  const periods = [...wisuda].sort((a, b) =>
    (b.tanggal ?? "").localeCompare(a.tanggal ?? ""),
  );
  return (
    <>
      <PageHeader
        crumb="Wisuda"
        title="Selamat, wisudawan!"
        description="Lulusan Program Studi Ekonomi Syariah per periode wisuda."
      />
      <section className="px-4 pb-24 sm:px-6">
        <div className="mx-auto grid max-w-[1024px] gap-12">
          {periods.length === 0 && (
            <p className="rounded-[24px] bg-mist p-10 text-center text-[17px] text-label-2">
              Daftar wisudawan akan ditampilkan setiap periode wisuda.
            </p>
          )}
          {periods.map((w) => {
            const people = w.wisudawan.map((l) => {
              const [nama, judul = ""] = l.split("|").map((x) => x.trim());
              return { nama, judul };
            });
            return (
              <div key={w.periode}>
                {w.image && (
                  <div className="relative mb-6 aspect-[21/9] overflow-hidden rounded-[28px] bg-mist">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={w.image}
                      alt={`Wisuda ${w.periode}`}
                      className="absolute inset-0 size-full object-cover"
                    />
                  </div>
                )}
                <div className="flex flex-wrap items-end justify-between gap-3">
                  <div>
                    <h2 className="text-[26px] font-bold tracking-[-0.02em] text-label">
                      {w.periode}
                    </h2>
                    <p className="text-[14px] text-label-2">
                      {w.tanggal &&
                        new Date(
                          `${w.tanggal}T00:00:00+07:00`,
                        ).toLocaleDateString("id-ID", {
                          dateStyle: "long",
                          timeZone: "Asia/Jakarta",
                        })}{" "}
                      · {people.length} wisudawan
                    </p>
                  </div>
                  {w.url && (
                    <a
                      href={w.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[15px] font-semibold text-accent hover:underline"
                    >
                      Album foto ↗
                    </a>
                  )}
                </div>
                <ul className="mt-5 grid gap-2 md:grid-cols-2">
                  {people.map((p, i) => (
                    <li
                      key={`${p.nama}-${i}`}
                      className="rounded-[16px] border border-hairline bg-canvas px-4 py-3"
                    >
                      <p className="text-[15px] font-semibold text-label">
                        {p.nama}
                      </p>
                      {p.judul && (
                        <p className="mt-0.5 text-[13.5px] text-label-2">
                          {p.judul}
                        </p>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
}
