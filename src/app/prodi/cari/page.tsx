import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Search } from "lucide-react";
import { contentExcerpt, listPublishedNews } from "@/lib/site/content";
import { getSite } from "@/lib/site/get-site";
import { navGroups, prodi } from "@/lib/site/prodi";
import { getSkripsi } from "@/lib/site/skripsi";
import { PageHeader } from "@/components/site/page-header";

export const metadata: Metadata = {
  title: "Cari",
  description: `Cari berita, dosen, dokumen, beasiswa, dan skripsi di website ${prodi.fullName}.`,
  robots: { index: false },
};

type Hit = {
  title: string;
  href: string;
  snippet?: string;
  external?: boolean;
};
type Props = { searchParams: Promise<{ q?: string }> };

const SUGGEST = [
  "Beasiswa",
  "Kurikulum",
  "Skripsi zakat",
  "Kalender akademik",
  "KIP Kuliah",
  "Magang",
];

function hit(text: string, words: string[]) {
  const t = text.toLowerCase();
  return words.every((w) => t.includes(w));
}

export default async function CariPage({ searchParams }: Props) {
  const q = ((await searchParams).q ?? "").trim().slice(0, 120);
  const words = q
    .toLowerCase()
    .split(/\s+/)
    .filter((w) => w.length > 1);

  const groups: { label: string; hits: Hit[]; more?: string }[] = [];
  if (words.length) {
    const [site, news, skripsi] = await Promise.all([
      getSite(),
      listPublishedNews(),
      getSkripsi(),
    ]);
    const m = (s: string) => hit(s, words);

    const pages = navGroups.flatMap((g) => [
      { href: g.href, label: g.label, description: "" },
      ...(g.items ?? []),
    ]);
    groups.push({
      label: "Halaman",
      hits: pages
        .filter((p) => m(`${p.label} ${p.description ?? ""}`))
        .map((p) => ({ title: p.label, href: p.href, snippet: p.description })),
    });
    groups.push({
      label: "Berita & pengumuman",
      hits: news
        .filter((n) => m(`${n.title} ${n.body ?? ""}`))
        .slice(0, 8)
        .map((n) => ({
          title: n.title,
          href: `/prodi/berita/${n.slug}`,
          snippet: contentExcerpt(n, 140),
        })),
    });
    groups.push({
      label: "Kegiatan",
      hits: site.kegiatan
        .filter((k) => m(`${k.title} ${k.summary} ${k.category}`))
        .map((k) => ({
          title: k.title,
          href: k.source || "/prodi/berita#kegiatan",
          snippet: k.summary,
          external: !!k.source,
        })),
    });
    groups.push({
      label: "Dosen & staf",
      hits: [...site.pimpinan, ...site.dosen, ...site.tendik]
        .filter((d, i, arr) => arr.findIndex((x) => x.name === d.name) === i)
        .filter((d) =>
          m(`${d.name} ${d.role} ${(d.expertise ?? []).join(" ")}`),
        )
        .map((d) => ({ title: d.name, href: "/prodi/dosen", snippet: d.role })),
    });
    groups.push({
      label: "Beasiswa",
      hits: site.beasiswa
        .filter((b) => m(`${b.name} ${b.provider} ${b.description}`))
        .map((b) => ({
          title: b.name,
          href: "/prodi/beasiswa",
          snippet: `${b.provider} · ${b.period}`,
        })),
    });
    groups.push({
      label: "Dokumen",
      hits: site.unduhan
        .filter((u) => m(`${u.title} ${u.category} ${u.description ?? ""}`))
        .map((u) => ({
          title: u.title,
          href: u.url,
          snippet: u.category,
          external: true,
        })),
    });
    groups.push({
      label: "Kurikulum & akademik",
      hits: [
        ...site.bidangKajian,
        ...site.profilLulusan,
        ...site.prospekKarir,
        ...site.kurikulum.flatMap((y) =>
          y.semesters.flatMap((s) =>
            s.courses.map((c) => ({
              title: c,
              description: `${y.label} · ${s.name}`,
            })),
          ),
        ),
      ]
        .filter((t) => m(`${t.title} ${t.description}`))
        .slice(0, 10)
        .map((t) => ({
          title: t.title,
          href: "/prodi/akademik",
          snippet: t.description,
        })),
    });
    groups.push({
      label: "Tanya jawab",
      hits: site.faq
        .filter((f) => m(`${f.q} ${f.a}`))
        .map((f) => ({ title: f.q, href: "/prodi/layanan#faq", snippet: f.a })),
    });
    const sk = skripsi.filter((s) => m(`${s.judul} ${s.nama}`));
    groups.push({
      label: "Skripsi",
      hits: sk
        .slice(0, 6)
        .map((s) => ({
          title: s.judul,
          href: s.url ?? `/prodi/skripsi?q=${encodeURIComponent(q)}`,
          snippet: `${s.tahun}${s.nama ? ` · ${s.nama}` : ""}`,
          external: !!s.url,
        })),
      more:
        sk.length > 6 ? `/prodi/skripsi?q=${encodeURIComponent(q)}` : undefined,
    });
  }
  const found = groups.filter((g) => g.hits.length);
  const total = found.reduce((n, g) => n + g.hits.length, 0);

  return (
    <>
      <PageHeader crumb="Cari" title="Cari di website" />
      <section className="px-4 pb-24 sm:px-6">
        <div className="mx-auto max-w-[760px]">
          <form
            action="/prodi/cari"
            className="-mt-8 flex items-center gap-2 rounded-full border border-hairline bg-canvas p-2 pl-5 focus-within:border-accent focus-within:ring-4 focus-within:ring-accent/10"
          >
            <Search className="size-5 shrink-0 text-label-3" />
            <input
              name="q"
              defaultValue={q}
              autoFocus
              maxLength={120}
              placeholder="Beasiswa, kurikulum, nama dosen, judul skripsi…"
              className="min-w-0 flex-1 bg-transparent py-2 text-[17px] text-label outline-none placeholder:text-label-3"
            />
            <button
              type="submit"
              className="shrink-0 rounded-full bg-accent px-6 py-2.5 text-[15px] font-semibold text-white hover:bg-accent-strong"
            >
              Cari
            </button>
          </form>

          {!q ? (
            <div className="mt-8 flex flex-wrap justify-center gap-2">
              {SUGGEST.map((s) => (
                <Link
                  key={s}
                  href={`/prodi/cari?q=${encodeURIComponent(s)}`}
                  className="rounded-full bg-mist px-4 py-2 text-[14px] font-medium text-label-2 hover:text-accent"
                >
                  {s}
                </Link>
              ))}
            </div>
          ) : (
            <>
              <p
                className="mt-6 text-center text-[14px] text-label-3"
                aria-live="polite"
              >
                {total
                  ? `${total} hasil untuk “${q}”`
                  : `Tidak ada hasil untuk “${q}”. Coba kata lain.`}
              </p>
              {found.map((g) => (
                <div key={g.label} className="mt-10">
                  <h2 className="text-[13px] font-semibold uppercase tracking-[0.08em] text-accent">
                    {g.label}
                  </h2>
                  <ul className="mt-3 divide-y divide-hairline overflow-hidden rounded-[20px] border border-hairline bg-canvas">
                    {g.hits.map((h, i) => {
                      const inner = (
                        <>
                          <span className="min-w-0 flex-1">
                            <span className="block text-[16px] font-semibold leading-snug text-label group-hover:text-accent">
                              {h.title}
                            </span>
                            {h.snippet && (
                              <span className="mt-1 line-clamp-2 block text-[14px] text-label-2">
                                {h.snippet}
                              </span>
                            )}
                          </span>
                          {h.external && (
                            <ArrowUpRight className="mt-1 size-4 shrink-0 text-label-3" />
                          )}
                        </>
                      );
                      return (
                        <li key={`${h.href}-${i}`}>
                          {h.external ? (
                            <a
                              href={h.href}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="group flex gap-3 px-5 py-4 hover:bg-mist/60"
                            >
                              {inner}
                            </a>
                          ) : (
                            <Link
                              href={h.href}
                              className="group flex gap-3 px-5 py-4 hover:bg-mist/60"
                            >
                              {inner}
                            </Link>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                  {g.more && (
                    <Link
                      href={g.more}
                      className="mt-3 inline-block text-[15px] font-semibold text-accent hover:underline"
                    >
                      Lihat semua skripsi yang cocok ›
                    </Link>
                  )}
                </div>
              ))}
            </>
          )}
        </div>
      </section>
    </>
  );
}
