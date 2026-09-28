import Link from "next/link";
import { ArrowRight, BookOpenCheck, Building2, HandHeart, Landmark } from "lucide-react";
import { listEvents } from "@/lib/data/provider";
import type { Event } from "@/lib/data/types";
import { formatDateTime } from "@/lib/format/dates";
import { coverFor, getMediaMap, isAnnouncement, listPublishedNews } from "@/lib/site/content";
import { getSite } from "@/lib/site/get-site";
import { prodi } from "@/lib/site/prodi";
import { AnnouncementList } from "@/components/site/announcement-list";
import { HighlightCard } from "@/components/site/highlight-card";
import { NewsCard } from "@/components/site/news-card";
import { PmbCta } from "@/components/site/pmb-cta";
import { PrestasiCard } from "@/components/site/prestasi-card";
import { ProdiLogo } from "@/components/site/prodi-logo";
import { QuickLinks } from "@/components/site/quick-links";
import { Reveal } from "@/components/site/reveal";
import { SectionHeading } from "@/components/site/section-heading";

// Halaman publik: render ulang paling lama tiap 5 menit agar berita & agenda
// dari CMS ikut ter-update tanpa rebuild.
export const revalidate = 300;

/** Kategori agenda CMS yang boleh tampil ke publik. */
const PUBLIC_EVENT_CATEGORIES: Event["category"][] = ["kajian", "kegiatan_publik", "kompetisi", "pelatihan", "perayaan"];

const BIDANG_ICONS = [Landmark, HandHeart, Building2, BookOpenCheck];

export default async function ProdiHomePage() {
  const [site, news, events, media] = await Promise.all([
    getSite(),
    listPublishedNews(),
    listEvents({ fromDate: new Date().toISOString() }),
    getMediaMap(),
  ]);
  const { identity, kontak } = site;

  const announcements = news.filter(isAnnouncement).slice(0, 4);
  const [featuredNews, ...otherNews] = news.filter((n) => !isAnnouncement(n));
  const upcoming = events.filter((e) => PUBLIC_EVENT_CATEGORIES.includes(e.category)).slice(0, 3);
  const kaprodi = site.pimpinan.find((p) => /ketua program studi/i.test(p.role));

  return (
    <>
      {/* ─── Hero ─────────────────────────────────────────── */}
      <section className="px-4 pb-16 pt-16 text-center sm:px-6 sm:pb-20 sm:pt-24">
        <Reveal>
          <ProdiLogo size={72} priority className="mx-auto" />
          <p className="mt-6 text-[15px] font-semibold uppercase tracking-[0.08em] text-accent">
            {prodi.level} · {prodi.faculty}
          </p>
          <h1 className="mt-3 text-[clamp(3rem,1.8rem+5.4vw,6rem)] font-extrabold leading-[0.95] tracking-[-0.045em] text-label">
            {identity.heroTitle}
          </h1>
          <p className="mt-4 text-[15px] font-semibold text-label-2">{prodi.university}</p>
          <p className="mx-auto mt-6 max-w-2xl text-[clamp(1.05rem,1rem+0.35vw,1.3rem)] leading-[1.5] text-label-2">
            {identity.heroDescription}
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-4">
            <a
              href={kontak.pmbUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-accent px-7 py-3 text-[16px] font-semibold text-white transition-colors hover:bg-accent-strong"
            >
              Daftar sekarang
            </a>
            <Link href="/prodi/profil" className="text-[16px] font-semibold text-accent hover:underline">
              Kenali prodi ›
            </Link>
          </div>
        </Reveal>

        {identity.heroImage && (
          <Reveal delay={0.12} className="mx-auto mt-14 max-w-[1024px]">
            <div className="relative aspect-[16/9] overflow-hidden rounded-[28px] bg-mist">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={identity.heroImage} alt={`Kegiatan ${prodi.fullName}`} className="absolute inset-0 size-full object-cover" />
            </div>
          </Reveal>
        )}
      </section>

      <section className="px-4 pb-8 sm:px-6">
        <QuickLinks pmbUrl={kontak.pmbUrl} />
      </section>

      {/* ─── Sekilas ──────────────────────────────────────── */}
      <section className="px-4 py-24 sm:px-6 sm:py-32">
        <Reveal>
          <SectionHeading eyebrow="Kenapa kuliah di sini" title="Belajar ekonomi, dengan nilai." />
        </Reveal>
        <div className="mx-auto mt-14 grid max-w-[1024px] gap-4 md:grid-cols-6">
          <Tile className="md:col-span-4" label="Kurikulum">
            <p className="text-[clamp(4rem,3rem+4vw,7rem)] font-extrabold leading-none tracking-[-0.05em] text-label">
              {identity.totalCredits}
              <span className="ml-2 text-[0.35em] tracking-[-0.02em] text-label-2">SKS</span>
            </p>
            <p className="mt-4 max-w-md text-[17px] leading-[1.45] text-label-2">
              Teori ekonomi, fiqh muamalah, dan praktik industri — dirangkum dalam {identity.normalDuration} menuju gelar{" "}
              {identity.degree}.
            </p>
          </Tile>
          <Tile className="md:col-span-2" label="Akreditasi UIN SGD" dark>
            <p className="text-[clamp(2.5rem,2rem+2vw,3.5rem)] font-extrabold leading-none tracking-[-0.03em]">
              {identity.universityAccreditation}
            </p>
            <p className="mt-4 text-[15px] leading-[1.45] text-white/80">BAN-PT · {identity.universityAccreditationPeriod}</p>
          </Tile>
          <Tile className="md:col-span-3" label="Galeri Investasi Syariah">
            <p className="text-[24px] font-bold leading-[1.15] tracking-[-0.02em] text-label">Praktik langsung pasar modal syariah.</p>
            <p className="mt-3 text-[16px] leading-[1.45] text-label-2">
              GIS BEI FEBI dan Sekolah Pasar Modal Syariah menyiapkan mahasiswa melek investasi.
            </p>
          </Tile>
          <Tile className="md:col-span-3" label="Berdampak">
            <p className="text-[24px] font-bold leading-[1.15] tracking-[-0.02em] text-label">Ilmu yang turun ke masyarakat.</p>
            <p className="mt-3 text-[16px] leading-[1.45] text-label-2">
              Dari sertifikasi Juru Sembelih Halal hingga literasi keuangan syariah bagi keluarga.
            </p>
          </Tile>
        </div>
      </section>

      {/* ─── Selamat & Sukses ─────────────────────────────── */}
      {site.prestasi.length > 0 && (
        <section className="bg-mist px-4 py-24 sm:px-6 sm:py-32">
          <div className="mx-auto max-w-[1024px]">
            <Reveal className="flex flex-wrap items-end justify-between gap-4">
              <SectionHeading align="left" eyebrow="Selamat & Sukses" title="Prestasi & amanah terbaru." />
              <Link href="/prodi/kemahasiswaan#prestasi" className="text-[16px] font-semibold text-accent hover:underline">
                Lihat semua ›
              </Link>
            </Reveal>
            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {site.prestasi.slice(0, 4).map((p, i) => (
                <Reveal key={`${p.name}-${i}`} delay={(i % 4) * 0.05}>
                  <PrestasiCard item={p} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── Bidang kajian ────────────────────────────────── */}
      <section className="px-4 py-24 sm:px-6 sm:py-32">
        <Reveal>
          <SectionHeading
            eyebrow="Bidang kajian"
            title="Empat bidang. Satu tujuan."
            description="Memahami ekonomi Islam dari teori hingga praktik di berbagai sektor."
          />
        </Reveal>
        <div className="mx-auto mt-14 grid max-w-[1024px] gap-4 sm:grid-cols-2">
          {site.bidangKajian.map((b, i) => {
            const Icon = BIDANG_ICONS[i % BIDANG_ICONS.length];
            return (
              <Reveal key={b.title} delay={(i % 2) * 0.06}>
                <div className="group h-full rounded-[24px] border border-hairline bg-canvas p-8 transition duration-300 hover:-translate-y-1 hover:border-transparent hover:shadow-[0_24px_48px_-24px_rgba(22,58,69,0.35)]">
                  <span className="grid size-12 place-items-center rounded-2xl bg-accent-soft text-accent transition-colors duration-300 group-hover:bg-accent group-hover:text-white">
                    <Icon className="size-6" strokeWidth={1.75} />
                  </span>
                  <h3 className="mt-6 text-[22px] font-bold leading-[1.2] tracking-[-0.02em] text-label">{b.title}</h3>
                  <p className="mt-2 text-[16px] leading-[1.5] text-label-2">{b.description}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
        <p className="mt-10 text-center">
          <Link href="/prodi/akademik" className="inline-flex items-center gap-1.5 text-[16px] font-semibold text-accent hover:underline">
            Lihat kurikulum lengkap <ArrowRight className="size-4" />
          </Link>
        </p>
      </section>

      {/* ─── Nilai ────────────────────────────────────────── */}
      <section className="bg-accent px-4 py-24 text-white sm:px-6 sm:py-28">
        <Reveal className="mx-auto max-w-3xl text-center">
          <p className="text-[15px] font-semibold uppercase tracking-[0.08em] text-sand">Nilai kami</p>
          <p className="mt-5 text-[clamp(1.6rem,1.1rem+1.8vw,2.5rem)] font-bold leading-[1.25] tracking-[-0.02em] text-balance">
            Ekonomi syariah bukan sekadar label, tetapi cara pandang yang menempatkan keadilan dan kemaslahatan di pusat
            aktivitas ekonomi.
          </p>
          {kaprodi && (
            <p className="mt-8 text-[15px] text-white/75">
              Program studi dipimpin oleh <span className="font-semibold text-white">{kaprodi.name}</span>
            </p>
          )}
        </Reveal>
      </section>

      {/* ─── Berita, pengumuman & agenda ──────────────────── */}
      <section className="bg-mist px-4 py-24 sm:px-6 sm:py-32">
        <div className="mx-auto max-w-[1024px]">
          <Reveal className="flex flex-wrap items-end justify-between gap-4">
            <SectionHeading align="left" eyebrow="Kabar Eksyar" title={featuredNews ? "Berita terbaru." : "Kegiatan terbaru."} />
            <Link href="/prodi/berita" className="text-[16px] font-semibold text-accent hover:underline">
              Lihat semua ›
            </Link>
          </Reveal>

          <div className="mt-10 grid gap-5 lg:grid-cols-[2fr_1fr]">
            {featuredNews ? (
              <div className="grid gap-5 sm:grid-cols-2">
                <Reveal className="sm:col-span-2">
                  <NewsCard item={featuredNews} cover={coverFor(featuredNews, media)} />
                </Reveal>
                {otherNews.slice(0, 2).map((n, i) => (
                  <Reveal key={n.id} delay={i * 0.06}>
                    <NewsCard item={n} cover={coverFor(n, media)} />
                  </Reveal>
                ))}
              </div>
            ) : (
              <div className="grid gap-5 sm:grid-cols-2">
                {site.kegiatan.slice(0, 4).map((k, i) => (
                  <Reveal key={`${k.title}-${i}`} delay={(i % 2) * 0.06}>
                    <HighlightCard item={k} />
                  </Reveal>
                ))}
              </div>
            )}

            <div className="flex flex-col gap-5">
              <Reveal>
                <div className="rounded-[24px] border border-hairline bg-canvas px-6 pt-6">
                  <h3 className="text-[19px] font-bold tracking-[-0.01em] text-label">Pengumuman</h3>
                  <AnnouncementList items={announcements} />
                </div>
              </Reveal>
              <Reveal>
                <div className="rounded-[24px] border border-hairline bg-canvas p-6">
                  <h3 className="text-[19px] font-bold tracking-[-0.01em] text-label">Agenda</h3>
                  {upcoming.length > 0 ? (
                    <ul className="mt-2 divide-y divide-hairline">
                      {upcoming.map((e) => (
                        <li key={e.id} className="py-4">
                          <p className="text-[13px] text-label-3">{formatDateTime(e.startsAt)}</p>
                          <p className="mt-1 text-[16px] font-semibold leading-snug text-label">{e.title}</p>
                          <p className="mt-0.5 text-[13px] text-label-2">{e.isOnline ? "Daring" : e.location}</p>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="py-4 text-[15px] text-label-2">Belum ada agenda terjadwal.</p>
                  )}
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      <PmbCta />
    </>
  );
}

function Tile({
  label,
  children,
  className,
  dark = false,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
  dark?: boolean;
}) {
  return (
    <Reveal className={className}>
      <div
        className={
          dark
            ? "flex h-full flex-col justify-between rounded-[28px] bg-accent p-8 text-white sm:p-10"
            : "flex h-full flex-col justify-between rounded-[28px] bg-mist p-8 sm:p-10"
        }
      >
        <p className={dark ? "text-[14px] font-bold text-sand" : "text-[14px] font-bold text-accent"}>{label}</p>
        <div className="mt-10">{children}</div>
      </div>
    </Reveal>
  );
}
