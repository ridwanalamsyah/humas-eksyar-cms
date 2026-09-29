import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Search } from "lucide-react";
import { PageHeader } from "@/components/site/page-header";
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
  title: "Direktori Skripsi",
  description: `Telusuri skripsi mahasiswa ${prodi.fullName} ${prodi.university} dan periksa kemiripan rencana judul.`,
};

export const revalidate = 300;

const PER_PAGE = 30;

type Props = {
  searchParams: Promise<{
    q?: string;
    mode?: string;
    tahun?: string;
    hal?: string;
  }>;
};

function level(score: number) {
  if (score >= 0.6)
    return { label: "Sangat mirip", cls: "bg-red-50 text-red-700" };
  if (score >= 0.35) return { label: "Mirip", cls: "bg-sand text-label" };
  return { label: "Terkait", cls: "bg-mist text-label-2" };
}

/** Bangun URL halaman ini dengan parameter yang diganti. */
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
  const mode = sp.mode === "cek" ? "cek" : "telusuri";
  const [list, sync] = await Promise.all([getSkripsi(), getSkripsiSync()]);

  const years = [...new Set(list.map((s) => s.tahun))].sort((a, b) => b - a);
  const counts = new Map<number, number>();
  list.forEach((s) => counts.set(s.tahun, (counts.get(s.tahun) ?? 0) + 1));
  const tahun = years.includes(Number(sp.tahun)) ? Number(sp.tahun) : undefined;

  // Mode telusuri: filter kata kunci (semua kata harus muncul) + tahun.
  let browse: SkripsiItem[] = [];
  if (mode === "telusuri") {
    const words = q.toLowerCase().split(/\s+/).filter(Boolean);
    browse = list.filter(
      (s) =>
        (!tahun || s.tahun === tahun) &&
        words.every((w) =>
          `${s.judul} ${s.nama} ${s.tahun}`.toLowerCase().includes(w),
        ),
    );
  }
  const pages = Math.max(1, Math.ceil(browse.length / PER_PAGE));
  const page = Math.min(pages, Math.max(1, Number(sp.hal) || 1));
  const pageItems = browse.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const results = mode === "cek" && q ? searchSkripsi(list, q) : [];
  const tooShort = mode === "cek" && q && tokens(q).size < 2;

  return (
    <>
      <PageHeader
        crumb="Direktori skripsi"
        title="Direktori skripsi"
        description="Telusuri skripsi mahasiswa Ekonomi Syariah dari Digital Library UIN SGD, atau cek kemiripan rencana judulmu sebelum mengajukan proposal."
      />

      <section className="px-4 pb-24 sm:px-6 sm:pb-32">
        <div className="mx-auto max-w-[860px]">
          {/* Tab mode */}
          <div className="mx-auto flex w-fit rounded-full bg-mist p-1">
            {(
              [
                ["telusuri", "Telusuri skripsi"],
                ["cek", "Cek kemiripan judul"],
              ] as const
            ).map(([m, label]) => (
              <Link
                key={m}
                href={href({ mode: m === "cek" ? "cek" : undefined })}
                aria-current={mode === m ? "page" : undefined}
                className={cn(
                  "rounded-full px-5 py-2 text-[14px] font-semibold transition-colors",
                  mode === m
                    ? "bg-canvas text-label shadow-sm"
                    : "text-label-2 hover:text-label",
                )}
              >
                {label}
              </Link>
            ))}
          </div>

          <form
            action="/prodi/skripsi"
            className="mt-6 flex items-center gap-2 rounded-full border border-hairline bg-canvas p-2 pl-5 focus-within:border-accent focus-within:ring-4 focus-within:ring-accent/10"
          >
            {mode === "cek" && <input type="hidden" name="mode" value="cek" />}
            {mode === "telusuri" && tahun && (
              <input type="hidden" name="tahun" value={tahun} />
            )}
            <Search className="size-5 shrink-0 text-label-3" />
            <input
              name="q"
              defaultValue={q}
              maxLength={300}
              placeholder={
                mode === "cek"
                  ? "Tulis rencana judul, mis. pengaruh literasi keuangan syariah terhadap minat menabung"
                  : "Cari judul, nama, atau kata kunci (mis. zakat, BSI, halal)"
              }
              className="min-w-0 flex-1 bg-transparent py-2 text-[16px] text-label outline-none placeholder:text-label-3"
            />
            <button
              type="submit"
              className="shrink-0 rounded-full bg-accent px-6 py-2.5 text-[15px] font-semibold text-white hover:bg-accent-strong"
            >
              {mode === "cek" ? "Cek" : "Cari"}
            </button>
          </form>
          <p className="mt-3 text-center text-[13px] text-label-3">
            {list.length.toLocaleString("id-ID")} skripsi
            {sync
              ? ` · diperbarui dari Digilib ${new Date(sync.at).toLocaleDateString("id-ID", { dateStyle: "long" })}`
              : ""}
          </p>

          {mode === "telusuri" ? (
            <>
              {years.length > 1 && (
                <div className="-mx-4 mt-8 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0">
                  <YearChip
                    href={href({ q })}
                    active={!tahun}
                    label="Semua"
                    count={list.length}
                  />
                  {years.map((y) => (
                    <YearChip
                      key={y}
                      href={href({ q, tahun: y })}
                      active={tahun === y}
                      label={String(y)}
                      count={counts.get(y) ?? 0}
                    />
                  ))}
                </div>
              )}

              <p className="mt-8 text-[14px] text-label-3">
                {browse.length.toLocaleString("id-ID")} hasil
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
                      page > 1 ? href({ q, tahun, hal: page - 1 }) : undefined
                    }
                    label="‹ Sebelumnya"
                  />
                  <span className="px-3 text-[14px] tabular-nums text-label-2">
                    {page} / {pages}
                  </span>
                  <PageLink
                    href={
                      page < pages
                        ? href({ q, tahun, hal: page + 1 })
                        : undefined
                    }
                    label="Berikutnya ›"
                  />
                </nav>
              )}
            </>
          ) : (
            <div className="mt-10">
              {!q ? (
                <p className="rounded-[20px] bg-mist p-6 text-[15px] leading-relaxed text-label-2">
                  Tulis rencana judul lengkap. Sistem membandingkan kata kunci
                  judulmu dengan {list.length.toLocaleString("id-ID")} skripsi
                  di direktori dan menampilkan yang paling mirip. Hasil bersifat
                  indikatif; keputusan tetap di dosen pembimbing.
                </p>
              ) : (
                <>
                  <h2 className="text-[19px] font-bold text-label">
                    {results.length
                      ? `${results.length} judul serupa`
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
        {item.nama && (
          <span className="mt-1 block text-[13px] text-label-2">
            {item.nama}
          </span>
        )}
      </span>
      {item.url && (
        <ArrowUpRight className="mt-0.5 size-4 shrink-0 text-label-3 group-hover:text-accent" />
      )}
    </>
  );
  return (
    <li>
      {item.url ? (
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
