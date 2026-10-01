import type { Metadata } from "next";
import { ArrowUpRight, CalendarDays } from "lucide-react";
import { getSite } from "@/lib/site/get-site";
import {
  bulanLabel,
  kalenderStatus,
  rentang,
  todayJakarta,
} from "@/lib/site/kalender";
import { prodi } from "@/lib/site/prodi";
import { PageHeader } from "@/components/site/page-header";
import { CalendarSubscribe } from "@/components/site/calendar-subscribe";
import { PrintButton } from "@/components/site/print-button";
import { Reveal } from "@/components/site/reveal";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Kalender Akademik",
  description: `Jadwal akademik, pembayaran UKT, ujian, dan wisuda untuk mahasiswa ${prodi.fullName}.`,
};

// Status "berlangsung/selesai" dihitung ulang setiap jam.
export const revalidate = 3600;

const STATUS = {
  berlangsung: { label: "Sedang berlangsung", cls: "bg-accent text-white" },
  "akan-datang": { label: "Akan datang", cls: "bg-sand text-navy" },
  selesai: { label: "Selesai", cls: "bg-mist text-label-3" },
};

export default async function KalenderPage() {
  const { kalender, unduhan } = await getSite();
  const today = todayJakarta();
  const items = [...kalender].sort((a, b) => a.mulai.localeCompare(b.mulai));
  const months = new Map<string, typeof items>();
  for (const k of items)
    months.set(bulanLabel(k.mulai), [
      ...(months.get(bulanLabel(k.mulai)) ?? []),
      k,
    ]);
  const dokumen = unduhan.filter((u) => /kalender/i.test(u.title));

  return (
    <>
      <PageHeader
        crumb="Kalender akademik"
        title="Kalender akademik"
        description="Jadwal perkuliahan, pembayaran UKT, ujian, dan wisuda. Untuk keperluan resmi, rujuk dokumen kalender akademik UIN SGD."
      />

      <section className="px-4 pb-24 sm:px-6">
        <div className="mx-auto max-w-[820px]">
          <div
            className="mb-10 flex flex-wrap items-center justify-between gap-3"
            data-print-hide
          >
            <CalendarSubscribe />
            <PrintButton />
          </div>
          {dokumen.length > 0 && (
            <div className="mb-12 grid gap-3 sm:grid-cols-2">
              {dokumen.map((d) => (
                <a
                  key={d.url}
                  href={d.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-4 rounded-[20px] bg-accent p-5 text-white transition hover:bg-accent-strong"
                >
                  <CalendarDays
                    className="size-7 shrink-0 text-sand"
                    strokeWidth={1.5}
                  />
                  <span className="flex-1">
                    <span className="block text-[16px] font-bold">
                      {d.title}
                    </span>
                    {d.description && (
                      <span className="block text-[13.5px] text-white/75">
                        {d.description}
                      </span>
                    )}
                  </span>
                  <ArrowUpRight className="size-5 shrink-0" />
                </a>
              ))}
            </div>
          )}

          {items.length === 0 ? (
            <p className="rounded-[24px] bg-mist p-10 text-center text-[17px] text-label-2">
              Jadwal akademik akan segera diperbarui.
            </p>
          ) : (
            [...months].map(([month, list]) => (
              <div key={month} className="mb-12">
                <h2 className="text-[15px] font-semibold uppercase tracking-[0.08em] text-accent">
                  {month}
                </h2>
                <ol className="relative mt-4 border-l-2 border-hairline pl-6">
                  {list.map((k, i) => {
                    const st = kalenderStatus(k, today);
                    return (
                      <Reveal
                        key={`${k.kegiatan}-${i}`}
                        className="relative pb-6 last:pb-0"
                      >
                        <li>
                          <span
                            aria-hidden
                            className={cn(
                              "absolute -left-[33px] top-1.5 size-4 rounded-full border-[3px] border-canvas",
                              st === "berlangsung"
                                ? "bg-accent ring-4 ring-accent/20"
                                : st === "selesai"
                                  ? "bg-hairline"
                                  : "bg-sand",
                            )}
                          />
                          <div
                            className={cn(
                              "rounded-[20px] border border-hairline p-5",
                              st === "selesai" ? "bg-mist/50" : "bg-canvas",
                            )}
                          >
                            <div className="flex flex-wrap items-center gap-2">
                              <span
                                className={cn(
                                  "rounded-full px-2.5 py-0.5 text-[12px] font-bold",
                                  STATUS[st].cls,
                                )}
                              >
                                {STATUS[st].label}
                              </span>
                              <span className="text-[12.5px] font-semibold text-label-3">
                                {k.kategori}
                              </span>
                            </div>
                            <p
                              className={cn(
                                "mt-2 text-[17px] font-bold leading-snug",
                                st === "selesai"
                                  ? "text-label-2"
                                  : "text-label",
                              )}
                            >
                              {k.kegiatan}
                            </p>
                            <p className="mt-1 text-[14.5px] text-label-2">
                              {rentang(k)}
                            </p>
                            {k.sumber && (
                              <a
                                href={k.sumber}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-2 inline-block text-[13.5px] font-semibold text-accent hover:underline"
                              >
                                Sumber resmi ↗
                              </a>
                            )}
                          </div>
                        </li>
                      </Reveal>
                    );
                  })}
                </ol>
              </div>
            ))
          )}
        </div>
      </section>
    </>
  );
}
