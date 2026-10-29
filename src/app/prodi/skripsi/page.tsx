import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, ChevronRight, RefreshCw, Search } from "lucide-react";
import { PageHeader } from "@/components/site/page-header";
import { SectionHeading } from "@/components/site/section-heading";
import { getSite } from "@/lib/site/get-site";
import { todayJakarta } from "@/lib/site/kalender";
import { normName } from "@/lib/site/names";
import { prodi } from "@/lib/site/prodi";
import {
  getSkripsi,
  getSkripsiSync,
  searchSkripsi,
  tokens,
  type SkripsiItem,
} from "@/lib/site/skripsi";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Direktori & Pojok Skripsi",
  description: `Telusuri 515+ skripsi mahasiswa ${prodi.fullName} ${prodi.university}, periksa kemiripan judul, serta lihat rekomendasi topik dan jadwal sidang.`,
};

export const revalidate = 300;

const PER_PAGE = 30;

type Props = {
  searchParams: Promise<{
    q?: string;
    mode?: string;
    tahun?: string;
    hal?: string;
    pembimbing?: string;
  }>;
};

function level(score: number) {
  if (score >= 0.6)
    return { label: "Sangat mirip", cls: "bg-red-50 text-red-700" };
  if (score >= 0.35) return { label: "Mirip", cls: "bg-sand text-label" };
  return { label: "Terkait", cls: "bg-mist text-label-2" };
}

function href(params: Record<string, string | number | undefined>) {
  const sp = new URLSearchParams();
  for (const [k, v] of Object.entries(params))
    if (v !== undefined && v !== "") sp.set(k, String(v));
  const qs = sp.toString();
  return `/prodi/skripsi${qs ? `?${qs}` : ""}`;
}

export default async function SkripsiPage({ searchParams }: Props) {
  const sp = await searchParams;
  const q = (sp.q ?? "").slice(0, 300).trim();
  const mode =
    sp.mode === "cek" ? "cek" : sp.mode === "pojok" ? "pojok" : "telusuri";
  const [list, sync, site] = await Promise.all([
    getSkripsi(),
    getSkripsiSync(),
    getSite(),
  ]);
  const { topikSkripsi, jadwalSidang, panduanSkripsi, integritas } = site;

  const years = [...new Set(list.map((s) => s.tahun))].sort((a, b) => b - a);
  const counts = new Map<number, number>();
  list.forEach((s) => counts.set(s.tahun, (counts.get(s.tahun) ?? 0) + 1));
  const tahun = years.includes(Number(sp.tahun)) ? Number(sp.tahun) : undefined;
  const pb = (sp.pembimbing ?? "").slice(0, 160).trim();
  const pbKey = normName(pb);

  let browse: SkripsiItem[] = [];
  if (mode === "telusuri") {
    const words = q.toLowerCase().split(/\s+/).filter(Boolean);
    browse = list.filter(
      (s) =>
        (!tahun || s.tahun === tahun) &&
        (!pbKey || (s.pembimbing ?? []).some((p) => normName(p) === pbKey)) &&
        words.every((w) =>
          `${s.judul} ${s.nama} ${s.tahun} ${(s.pembimbing ?? []).join(" ")}`
            .toLowerCase()
            .includes(w),
        ),
    );
  }
  const pages = Math.max(1, Math.ceil(browse.length / PER_PAGE));
  const page = Math.min(pages, Math.max(1, Number(sp.hal) || 1));
  const pageItems = browse.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const results = mode === "cek" && q ? searchSkripsi(list, q) : [];
  const tooShort = mode === "cek" && q && tokens(q).size < 2;

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
        crumb="Direktori & Pojok Skripsi"
        title="Direktori & Pojok Skripsi"
        description="Pusat terpadu 515+ arsip skripsi Digilib UIN SGD, pengecekan kemiripan judul baru, rekomendasi topik pembimbing, dan jadwal sidang."
      />

      <section className="px-4 pb-24 sm:px-6 sm:pb-28">
        <div className="mx-auto max-w-[960px]">
          {/* Indikator Sinkronisasi Otomatis Berkelanjutan */}
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-[16px] border border-accent/25 bg-accent-soft/45 px-4 py-3 text-[13px] text-label-2">
            <div className="flex items-center gap-2">
              <RefreshCw className="size-4 shrink-0 text-accent" />
              <span>
                <strong className="font-semibold text-label">
                  Sinkronisasi Otomatis Aktif:
                </strong>{" "}
                Terhubung ke repositori{" "}
                <code className="rounded bg-canvas px-1.5 py-0.5 text-[11.5px] font-semibold text-accent">
                  digilib.uinsgd.ac.id
                </code>{" "}
                (Cron harian 02:17 UTC & tombol sinkron di CMS).
              </span>
            </div>
            <span className="font-semibold text-accent">
              {list.length.toLocaleString("id-ID")} Skripsi Terindeks
              {sync
                ? ` · ${new Date(sync.at).toLocaleDateString("id-ID", { dateStyle: "medium" })}`
                : ""}
            </span>
          </div>

          {/* 3 Tab Terpadu: Telusuri Skripsi, Cek Kemiripan Judul, & Pojok Skripsi */}
          <div className="mx-auto flex w-fit flex-wrap justify-center gap-1 rounded-full bg-mist p-1">
            {(
              [
                ["telusuri", "Telusuri Direktori Skripsi"],
                ["cek", "Cek Kemiripan Judul"],
                ["pojok", "Pojok Skripsi (Topik & Sidang)"],
              ] as const
            ).map(([m, label]) => (
              <Link
                key={m}
                href={href({
                  mode: m === "telusuri" ? undefined : m,
                })}
                aria-current={mode === m ? "page" : undefined}
                className={cn(
                  "rounded-full px-5 py-2 text-[13.5px] font-semibold transition-colors",
                  mode === m
                    ? "bg-accent text-white shadow-xs"
                    : "text-label-2 hover:text-label",
                )}
              >
                {label}
              </Link>
            ))}
          </div>

          {mode !== "pojok" ? (
            <>
              <form
                action="/prodi/skripsi"
                className="mt-6 flex items-center gap-2 rounded-full border border-hairline bg-canvas p-2 pl-5 focus-within:border-accent focus-within:ring-4 focus-within:ring-accent/10"
              >
                {mode === "cek" && (
                  <input type="hidden" name="mode" value="cek" />
                )}
                {mode === "telusuri" && tahun && (
                  <input type="hidden" name="tahun" value={tahun} />
                )}
                {mode === "telusuri" && pb && (
                  <input type="hidden" name="pembimbing" value={pb} />
                )}
                <Search className="size-5 shrink-0 text-label-3" />
                <input
                  name="q"
                  defaultValue={q}
                  maxLength={300}
                  placeholder={
                    mode === "cek"
                      ? "Tulis rencana judul, mis. pengaruh literasi keuangan syariah terhadap minat menabung"
                      : "Cari judul, nama penulis, dosen pembimbing, atau kata kunci (mis. zakat, BSI, halal)"
                  }
                  className="min-w-0 flex-1 bg-transparent py-2 text-[15.5px] text-label outline-none placeholder:text-label-3"
                />
                <button
                  type="submit"
                  className="shrink-0 rounded-full bg-accent px-6 py-2.5 text-[14.5px] font-semibold text-white hover:bg-accent-strong"
                >
                  {mode === "cek" ? "Cek Judul" : "Cari"}
                </button>
              </form>

              {mode === "telusuri" ? (
                <>
                  {years.length > 1 && (
                    <div className="-mx-4 mt-7 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0">
                      <YearChip
                        href={href({ pembimbing: pb, q })}
                        active={!tahun}
                        label="Semua"
                        count={list.length}
                      />
                      {years.map((y) => (
                        <YearChip
                          key={y}
                          href={href({ pembimbing: pb, q, tahun: y })}
                          active={tahun === y}
                          label={String(y)}
                          count={counts.get(y) ?? 0}
                        />
                      ))}
                    </div>
                  )}

                  {pb && (
                    <p className="mt-6 flex flex-wrap items-center gap-2 rounded-[16px] bg-accent-soft px-4 py-3 text-[14px] text-label">
                      Skripsi bimbingan <span className="font-bold">{pb}</span>
                      <Link
                        href={href({ q, tahun })}
                        className="ml-auto font-semibold text-accent hover:underline"
                      >
                        Hapus filter ×
                      </Link>
                    </p>
                  )}
                  <p className="mt-6 text-[13.5px] text-label-3">
                    {browse.length.toLocaleString("id-ID")} hasil ditemukan
                    {pages > 1 && ` · halaman ${page} dari ${pages}`}
                  </p>
                  {pageItems.length ? (
                    <ul className="mt-3 divide-y divide-hairline overflow-hidden rounded-[20px] border border-hairline bg-canvas">
                      {pageItems.map((s, i) => (
                        <SkripsiRow key={`${s.url ?? s.judul}-${i}`} item={s} />
                      ))}
                    </ul>
                  ) : (
                    <p className="mt-3 rounded-[20px] border border-dashed border-hairline p-10 text-center text-[16px] text-label-2">
                      Tidak ada skripsi yang cocok. Coba kata kunci lain.
                    </p>
                  )}

                  {pages > 1 && (
                    <nav
                      aria-label="Halaman"
                      className="mt-6 flex items-center justify-center gap-2"
                    >
                      <PageLink
                        href={
                          page > 1
                            ? href({ pembimbing: pb, q, tahun, hal: page - 1 })
                            : undefined
                        }
                        label="‹ Sebelumnya"
                      />
                      <span className="px-3 text-[14px] tabular-nums text-label-2">
                        {page} / {pages}
                      </span>
                      <PageLink
                        href={
                          page < pages
                            ? href({ pembimbing: pb, q, tahun, hal: page + 1 })
                            : undefined
                        }
                        label="Berikutnya ›"
                      />
                    </nav>
                  )}
                </>
              ) : (
                <div className="mt-8">
                  {!q ? (
                    <p className="rounded-[20px] bg-mist p-6 text-[15px] leading-relaxed text-label-2">
                      Tulis rencana judul lengkap di kotak pencarian di atas.
                      Sistem membandingkan kata kunci judulmu dengan{" "}
                      {list.length.toLocaleString("id-ID")} skripsi di direktori
                      dan menampilkan tingkat kemiripannya.
                    </p>
                  ) : (
                    <>
                      <h2 className="text-[19px] font-bold text-label">
                        {results.length
                          ? `${results.length} judul serupa ditemukan`
                          : "Tidak ada judul yang mirip di direktori."}
                      </h2>
                      {tooShort && (
                        <p className="mt-1 text-[14px] text-label-2">
                          Tulis judul lebih lengkap agar hasilnya lebih akurat.
                        </p>
                      )}
                      <ul className="mt-4 grid gap-3">
                        {results.map(({ item, score }, i) => {
                          const lv = level(score);
                          return (
                            <li
                              key={i}
                              className="rounded-[20px] border border-hairline bg-canvas p-5"
                            >
                              <div className="flex items-start justify-between gap-4">
                                <p className="text-[16px] font-semibold leading-snug text-label">
                                  {item.judul}
                                </p>
                                <span
                                  className={cn(
                                    "shrink-0 rounded-full px-3 py-1 text-[12px] font-bold",
                                    lv.cls,
                                  )}
                                >
                                  {Math.round(score * 100)}% · {lv.label}
                                </span>
                              </div>
                              <p className="mt-1.5 text-[14px] text-label-2">
                                {item.tahun}
                                {item.nama ? ` · ${item.nama}` : ""}
                                {item.url && (
                                  <>
                                    {" · "}
                                    <a
                                      href={item.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="font-semibold text-accent hover:underline"
                                    >
                                      Lihat di Digilib ↗
                                    </a>
                                  </>
                                )}
                              </p>
                            </li>
                          );
                        })}
                      </ul>
                    </>
                  )}
                </div>
              )}
            </>
          ) : (
            /* Tab 3: Pojok Skripsi (Topik, Jadwal Sidang, Panduan & Integritas) */
            <div className="mt-10 space-y-14">
              {topikSkripsi.length > 0 && (
                <div>
                  <SectionHeading
                    align="left"
                    eyebrow="Inspirasi Riset"
                    title="Topik skripsi & dosen pembimbing"
                  />
                  <div className="mt-6 grid gap-4 md:grid-cols-2">
                    {[...perDosen].map(([dosen, listTopik]) => (
                      <div
                        key={dosen}
                        className="rounded-[20px] border border-hairline bg-canvas p-5"
                      >
                        <p className="text-[12.5px] font-semibold text-accent">
                          {dosen}
                        </p>
                        <ul className="mt-2.5 grid gap-3">
                          {listTopik.map((t) => (
                            <li key={t.topik}>
                              <p className="text-[15.5px] font-bold leading-snug text-label">
                                {t.topik}
                              </p>
                              {t.deskripsi && (
                                <p className="mt-1 text-[13.5px] leading-relaxed text-label-2">
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
              )}

              {sidang.length > 0 && (
                <div>
                  <SectionHeading
                    align="left"
                    eyebrow="Jadwal Akademik"
                    title="Seminar proposal, komprehensif & sidang munaqasyah"
                  />
                  <div className="mt-6 overflow-x-auto rounded-[20px] border border-hairline bg-canvas">
                    <table className="w-full min-w-[640px] text-left text-[14px]">
                      <thead className="bg-mist/60 text-[12px] uppercase tracking-wide text-label-3">
                        <tr>
                          <th className="px-5 py-3 font-semibold">Tanggal</th>
                          <th className="px-5 py-3 font-semibold">Jenis</th>
                          <th className="px-5 py-3 font-semibold">
                            Mahasiswa & Judul
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
                            <td className="px-5 py-3 font-medium text-accent">
                              {j.jenis}
                            </td>
                            <td className="px-5 py-3">
                              <span className="font-semibold text-label">
                                {j.nama}
                              </span>
                              <span className="mt-0.5 block text-label-2">
                                {j.judul}
                              </span>
                            </td>
                            <td className="px-5 py-3 text-label-2">
                              {j.ruang}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              <div className="grid gap-10 lg:grid-cols-2">
                {panduanSkripsi.length > 0 && (
                  <div>
                    <SectionHeading
                      align="left"
                      eyebrow="Referensi"
                      title="Panduan & rujukan ilmiah"
                    />
                    <ul className="mt-6 grid gap-3">
                      {panduanSkripsi.map((p) => (
                        <li key={p.url}>
                          <a
                            href={p.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group flex items-start justify-between gap-4 rounded-[18px] border border-hairline bg-canvas p-4 hover:border-accent/40"
                          >
                            <span>
                              <span className="block text-[15px] font-bold text-label group-hover:text-accent">
                                {p.name}
                              </span>
                              <span className="mt-0.5 block text-[13.5px] text-label-2">
                                {p.description}
                              </span>
                            </span>
                            <ArrowUpRight className="size-4.5 shrink-0 text-label-3" />
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
                      eyebrow="Etika Ilmiah"
                      title="Integritas akademik"
                    />
                    <ol className="mt-6 grid gap-3.5">
                      {integritas.map((t, i) => (
                        <li
                          key={i}
                          className="flex gap-3.5 rounded-[16px] bg-mist/60 p-4"
                        >
                          <span className="grid size-7 shrink-0 place-items-center rounded-full bg-accent-soft text-[13px] font-bold text-accent">
                            {i + 1}
                          </span>
                          <p className="text-[14px] leading-relaxed text-label">
                            {t}
                          </p>
                        </li>
                      ))}
                    </ol>
                  </div>
                )}
              </div>
            </div>
          )}

          <a
            href={`https://digilib.uinsgd.ac.id/cgi/search/simple?q=${encodeURIComponent(q || "ekonomi syariah")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="group mt-10 flex items-center justify-between gap-4 rounded-[20px] bg-mist p-5 transition-colors hover:bg-accent hover:text-white"
          >
            <span>
              <span className="block text-[16px] font-bold text-label group-hover:text-white">
                Cari di Digital Library UIN SGD
              </span>
              <span className="block text-[14px] text-label-2 group-hover:text-white/80">
                Repositori lengkap skripsi, tesis, dan disertasi seluruh
                fakultas.
              </span>
            </span>
            <ArrowUpRight className="size-5 shrink-0 text-accent group-hover:text-white" />
          </a>
        </div>
      </section>
    </>
  );
}

function SkripsiRow({ item }: { item: SkripsiItem }) {
  const body = (
    <>
      <span className="w-12 shrink-0 pt-0.5 font-mono text-[13px] text-label-3">
        {item.tahun}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[15.5px] font-medium leading-snug text-label group-hover:text-accent">
          {item.judul}
        </span>
        {(item.nama || item.pembimbing?.length) && (
          <span className="mt-1 block text-[13px] text-label-2">
            {item.nama}
            {item.pembimbing?.length ? (
              <span className="text-label-3">
                {" "}
                · Pembimbing: {item.pembimbing.join(", ")}
              </span>
            ) : null}
          </span>
        )}
      </span>
      {item.id ? (
        <ChevronRight className="mt-0.5 size-4 shrink-0 text-label-3 group-hover:text-accent" />
      ) : item.url ? (
        <ArrowUpRight className="mt-0.5 size-4 shrink-0 text-label-3 group-hover:text-accent" />
      ) : null}
    </>
  );
  return (
    <li>
      {item.id ? (
        <Link
          href={`/prodi/skripsi/${item.id}`}
          className="group flex gap-4 px-5 py-4 hover:bg-mist/60"
        >
          {body}
        </Link>
      ) : item.url ? (
        <a
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex gap-4 px-5 py-4 hover:bg-mist/60"
        >
          {body}
        </a>
      ) : (
        <div className="flex gap-4 px-5 py-4">{body}</div>
      )}
    </li>
  );
}

function YearChip({
  href,
  active,
  label,
  count,
}: {
  href: string;
  active: boolean;
  label: string;
  count: number;
}) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "shrink-0 rounded-full border px-4 py-2 text-[14px] font-semibold transition-colors",
        active
          ? "border-accent bg-accent text-white"
          : "border-hairline bg-canvas text-label-2 hover:border-accent/40 hover:text-accent",
      )}
    >
      {label}{" "}
      <span className={active ? "text-white/70" : "text-label-3"}>{count}</span>
    </Link>
  );
}

function PageLink({ href, label }: { href?: string; label: string }) {
  if (!href)
    return (
      <span className="rounded-full px-4 py-2 text-[14px] font-semibold text-label-3">
        {label}
      </span>
    );
  return (
    <Link
      href={href}
      className="rounded-full bg-mist px-4 py-2 text-[14px] font-semibold text-label hover:bg-hairline"
    >
      {label}
    </Link>
  );
}
