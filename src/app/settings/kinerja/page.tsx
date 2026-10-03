import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft, Download } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { BarChart } from "@/components/site/bar-chart";
import { PrintButton } from "@/components/site/print-button";
import {
  getCurrentMember,
  listEvents,
  listPageViews,
  listSubmissions,
} from "@/lib/data/provider";
import { getAkademik } from "@/lib/site/akademik";
import { listPublishedNews } from "@/lib/site/content";
import { ACTIVE_FORMS } from "@/lib/site/forms";
import { getSite } from "@/lib/site/get-site";
import { getSkripsi } from "@/lib/site/skripsi";

export const metadata = { title: "Kinerja & laporan" };
export const dynamic = "force-dynamic";

type Props = { searchParams: Promise<{ bulan?: string }> };

export default async function KinerjaPage({ searchParams }: Props) {
  const member = await getCurrentMember();
  if (!member) redirect("/login");
  if (member.role !== "admin") redirect("/settings");

  const nowMonth = new Date()
    .toLocaleDateString("en-CA", { timeZone: "Asia/Jakarta" })
    .slice(0, 7);
  const sp = await searchParams;
  const bulan = /^\d{4}-\d{2}$/.test(sp.bulan ?? "") ? sp.bulan! : nowMonth;
  const label = new Date(`${bulan}-01T00:00:00+07:00`).toLocaleDateString(
    "id-ID",
    { month: "long", year: "numeric", timeZone: "Asia/Jakarta" },
  );
  const prev = new Date(`${bulan}-01T00:00:00Z`);
  prev.setUTCMonth(prev.getUTCMonth() - 1);
  const next = new Date(`${bulan}-01T00:00:00Z`);
  next.setUTCMonth(next.getUTCMonth() + 1);

  const [site, news, views, subs, akademik, skripsi, events] =
    await Promise.all([
      getSite(),
      listPublishedNews(),
      listPageViews(`${bulan}-01`),
      listSubmissions({ limit: 10000 }),
      getAkademik(),
      getSkripsi(),
      listEvents({ fromDate: `${bulan}-01T00:00:00.000Z` }),
    ]);
  const monthViews = views.filter((v) => v.day.startsWith(bulan));
  const totalViews = monthViews.reduce((a, v) => a + v.count, 0);
  const perDay = new Map<string, number>();
  monthViews.forEach((v) =>
    perDay.set(v.day, (perDay.get(v.day) ?? 0) + v.count),
  );
  const perPath = new Map<string, number>();
  monthViews.forEach((v) =>
    perPath.set(v.path, (perPath.get(v.path) ?? 0) + v.count),
  );
  const topPages = [...perPath].sort((a, b) => b[1] - a[1]).slice(0, 10);
  const newsMonth = news.filter((n) =>
    (n.publishedAt ?? n.updatedAt).startsWith(bulan),
  );
  const subsMonth = subs.filter((s) => s.createdAt.startsWith(bulan));
  const eventsMonth = events.filter((e) => e.startsAt.startsWith(bulan));
  const kegiatanMonth = site.kegiatan.filter((k) => k.date.startsWith(bulan));
  const survei = subs.filter(
    (s) => s.type === "survei" && typeof s.data.kepuasan === "number",
  );
  const avgPuas = survei.length
    ? survei.reduce((a, s) => a + Number(s.data.kepuasan), 0) / survei.length
    : 0;

  const stats = [
    { k: "Kunjungan website", v: totalViews },
    { k: "Berita terbit", v: newsMonth.length },
    { k: "Isian formulir", v: subsMonth.length },
    { k: "Agenda & kegiatan", v: eventsMonth.length + kegiatanMonth.length },
  ];
  const totals = [
    { k: "Dosen (CMS)", v: site.pimpinan.length + site.dosen.length },
    { k: "Mata kuliah (e-Knows)", v: akademik?.mataKuliah.length ?? 0 },
    { k: "Skripsi di direktori", v: skripsi.length },
    { k: "Publikasi dosen", v: site.publikasi.length },
    { k: "Mitra kerja sama", v: site.mitra.length },
    { k: "Prestasi", v: site.prestasi.length },
    { k: "Sertifikat terbit", v: site.sertifikat.length },
    { k: "Kepuasan layanan", v: avgPuas ? `${avgPuas.toFixed(2)} / 5` : "—" },
  ];
  const rekap = [
    "berita",
    "kegiatan",
    "prestasi",
    "mitra",
    "publikasi",
    "skripsi",
    "dosen",
    "kunjungan",
  ];

  return (
    <AppShell>
      <div data-print-hide>
        <Link
          href="/settings"
          className="inline-flex items-center gap-1 text-sm text-foreground/55 hover:text-foreground"
        >
          <ArrowLeft className="size-4" strokeWidth={1.75} /> Settings
        </Link>
      </div>
      <header className="mt-3 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[12.5px] text-foreground/50">
            Laporan Humas · Website Prodi
          </p>
          <h1 className="mt-1 text-[24px] font-semibold leading-tight tracking-tight sm:text-[28px]">
            Kinerja {label}
          </h1>
        </div>
        <div className="flex items-center gap-2" data-print-hide>
          <Link
            href={`/settings/kinerja?bulan=${prev.toISOString().slice(0, 7)}`}
            className="rounded-lg px-3 py-1.5 text-[13px] hover:bg-foreground/[0.05]"
          >
            ‹ Sebelumnya
          </Link>
          <Link
            href={`/settings/kinerja?bulan=${next.toISOString().slice(0, 7)}`}
            className="rounded-lg px-3 py-1.5 text-[13px] hover:bg-foreground/[0.05]"
          >
            Berikutnya ›
          </Link>
          <PrintButton label="Cetak laporan / PDF" />
        </div>
      </header>

      <dl className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.k} className="glass-regular rounded-xl px-4 py-3.5">
            <dt className="text-[12.5px] text-foreground/55">{s.k}</dt>
            <dd className="mt-1 text-[26px] font-semibold tabular-nums tracking-tight">
              {s.v.toLocaleString("id-ID")}
            </dd>
          </div>
        ))}
      </dl>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <BarChart
          title="Kunjungan per hari"
          unit="kunjungan"
          data={[...perDay]
            .sort()
            .map(([d, n]) => ({ label: d.slice(8), nilai: n }))}
        />
        <section className="glass-regular rounded-xl p-5">
          <h2 className="text-[14px] font-semibold">Halaman terpopuler</h2>
          {topPages.length ? (
            <ol className="mt-3 grid gap-1.5 text-[13px]">
              {topPages.map(([p, n]) => (
                <li key={p} className="flex justify-between gap-3">
                  <span className="truncate">{p}</span>
                  <span className="tabular-nums text-foreground/60">
                    {n.toLocaleString("id-ID")}
                  </span>
                </li>
              ))}
            </ol>
          ) : (
            <p className="mt-3 text-[13px] text-foreground/55">
              Belum ada data kunjungan bulan ini.
            </p>
          )}
        </section>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <section className="glass-regular rounded-xl p-5">
          <h2 className="text-[14px] font-semibold">
            Berita terbit ({newsMonth.length})
          </h2>
          <ul className="mt-3 grid gap-1.5 text-[13px]">
            {newsMonth.map((n) => (
              <li key={n.id} className="flex justify-between gap-3">
                <span className="truncate">{n.title}</span>
                <span className="shrink-0 tabular-nums text-foreground/60">
                  {perPath.get(`/prodi/berita/${n.slug}`) ?? 0} baca
                </span>
              </li>
            ))}
            {!newsMonth.length && (
              <li className="text-foreground/55">Tidak ada berita terbit.</li>
            )}
          </ul>
        </section>
        <section className="glass-regular rounded-xl p-5">
          <h2 className="text-[14px] font-semibold">
            Formulir masuk ({subsMonth.length})
          </h2>
          <ul className="mt-3 grid gap-1.5 text-[13px]">
            {ACTIVE_FORMS.map((f) => {
              const n = subsMonth.filter((s) => s.type === f.slug).length;
              return n ? (
                <li key={f.slug} className="flex justify-between">
                  <span>{f.title}</span>
                  <span className="tabular-nums text-foreground/60">{n}</span>
                </li>
              ) : null;
            })}
            {!subsMonth.length && (
              <li className="text-foreground/55">Tidak ada isian.</li>
            )}
          </ul>
        </section>
      </div>

      <section className="glass-regular mt-6 rounded-xl p-5">
        <h2 className="text-[14px] font-semibold">Data prodi saat ini</h2>
        <dl className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {totals.map((t) => (
            <div key={t.k}>
              <dt className="text-[12px] text-foreground/55">{t.k}</dt>
              <dd className="text-[18px] font-semibold tabular-nums">
                {typeof t.v === "number" ? t.v.toLocaleString("id-ID") : t.v}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="glass-regular mt-6 rounded-xl p-5" data-print-hide>
        <h2 className="text-[14px] font-semibold">Unduh rekap (Excel/CSV)</h2>
        <p className="mt-1 text-[12.5px] text-foreground/55">
          Untuk laporan fakultas/universitas dan bahan akreditasi. Rekap tahun{" "}
          {bulan.slice(0, 4)}.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <a
            href="/api/backup"
            className="inline-flex items-center gap-1.5 rounded-full bg-foreground px-3 py-1.5 text-[12.5px] font-medium text-background"
          >
            <Download className="size-3.5" /> Cadangan lengkap (JSON)
          </a>
          {rekap.map((r) => (
            <a
              key={r}
              href={`/api/ekspor?jenis=${r}&tahun=${bulan.slice(0, 4)}`}
              className="inline-flex items-center gap-1.5 rounded-full bg-foreground/[0.06] px-3 py-1.5 text-[12.5px] font-medium capitalize hover:bg-foreground/[0.1]"
            >
              <Download className="size-3.5" /> {r}
            </a>
          ))}
        </div>
      </section>
    </AppShell>
  );
}
