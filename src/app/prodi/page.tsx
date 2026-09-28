import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  ChevronDown,
  Clock,
  Compass,
  GraduationCap,
  Mail,
  MapPin,
  Quote,
  Target,
} from "lucide-react";
import { listEvents } from "@/lib/data/provider";
import type { Event } from "@/lib/data/types";
import { formatDateTime, formatShortDate } from "@/lib/format/dates";
import { coverFor, getMediaMap, listPublishedNews } from "@/lib/site/content";
import {
  faq,
  jalurMasuk,
  keunggulan,
  konsentrasi,
  kontak,
  kurikulum,
  misi,
  prodi,
  prospekKarir,
  sambutan,
  stats,
  testimoni,
  visi,
} from "@/lib/site/prodi";
import { EksyarLogo } from "@/components/brand/eksyar-logo";
import { KurikulumTabs } from "@/components/site/kurikulum-tabs";
import { NewsCard } from "@/components/site/news-card";
import { Reveal } from "@/components/site/reveal";
import { SectionHeading } from "@/components/site/section-heading";
import { SiteIcon } from "@/components/site/site-icon";

// Halaman publik: render ulang paling lama tiap 5 menit agar berita & agenda
// dari CMS ikut ter-update tanpa rebuild.
export const revalidate = 300;

/** Kategori agenda CMS yang boleh tampil ke publik. */
const PUBLIC_EVENT_CATEGORIES: Event["category"][] = [
  "kajian",
  "kegiatan_publik",
  "kompetisi",
  "pelatihan",
  "perayaan",
];

export default async function ProdiLandingPage() {
  const [news, events, media] = await Promise.all([
    listPublishedNews(),
    listEvents({ fromDate: new Date().toISOString() }),
    getMediaMap(),
  ]);

  const latestNews = news.slice(0, 3);
  const upcomingEvents = events
    .filter((e) => PUBLIC_EVENT_CATEGORIES.includes(e.category))
    .slice(0, 4);

  return (
    <>
      {/* ─── Hero ─────────────────────────────────────────── */}
      <section className="relative overflow-hidden px-5 pb-16 pt-32 sm:pt-40">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-40 -top-40 size-[520px] rounded-full bg-brand-400/25 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -left-32 top-64 size-[380px] rounded-full bg-gold-300/20 blur-3xl"
        />
        <div className="relative mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[1.25fr_1fr]">
          <Reveal>
            <span className="glass-thin inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold text-foreground/75">
              <span className="size-1.5 rounded-full bg-brand-500" aria-hidden />
              {prodi.level} · {prodi.faculty}
            </span>
            <h1 className="mt-6 font-display text-[clamp(2.25rem,1.5rem+2.8vw,3.75rem)] font-semibold leading-[1.05] tracking-tight text-balance">
              {prodi.heroTitle}{" "}
              <span className="font-serif italic text-brand-600 dark:text-brand-300">
                {prodi.heroHighlight}
              </span>
            </h1>
            <p className="mt-6 max-w-xl text-[17px] leading-relaxed text-foreground/70 text-pretty">
              {prodi.heroDescription}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href={kontak.pmbUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-12 items-center gap-2 rounded-2xl bg-gradient-to-b from-brand-500 to-brand-600 px-6 text-[15px] font-semibold text-white shadow-[0_12px_32px_-10px_rgba(13,148,136,0.6)] transition hover:brightness-110"
              >
                Daftar Mahasiswa Baru
                <ArrowUpRight className="size-4" />
              </a>
              <Link
                href="#kurikulum"
                className="glass-regular inline-flex h-12 items-center gap-2 rounded-2xl px-6 text-[15px] font-semibold transition hover:bg-white/70 dark:hover:bg-white/5"
              >
                Lihat Kurikulum
                <ArrowRight className="size-4" />
              </Link>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="glass-thick specular-edge relative rounded-[2rem] p-7 sm:p-8">
              <div className="flex items-center gap-4">
                <EksyarLogo size={64} alt="Logo Ekonomi Syariah" />
                <div>
                  <p className="font-display text-xl font-semibold leading-tight">{prodi.fullName}</p>
                  <p className="text-sm text-foreground/60">{prodi.university}</p>
                </div>
              </div>
              <dl className="mt-7 grid grid-cols-2 gap-3">
                {[
                  { label: "Gelar", value: prodi.degree },
                  { label: "Akreditasi", value: prodi.accreditation },
                  { label: "Beban Studi", value: `${prodi.totalCredits} SKS` },
                  { label: "Masa Studi", value: prodi.studyDuration },
                ].map((f) => (
                  <div key={f.label} className="rounded-2xl bg-foreground/[0.04] p-4">
                    <dt className="text-[11px] font-semibold uppercase tracking-[0.14em] text-foreground/50">
                      {f.label}
                    </dt>
                    <dd className="mt-1 font-display text-[15px] font-semibold leading-snug">{f.value}</dd>
                  </div>
                ))}
              </dl>
              <p className="mt-6 border-t border-foreground/10 pt-5 text-center font-serif text-[15px] italic text-foreground/70">
                “{prodi.tagline}”
              </p>
            </div>
          </Reveal>
        </div>

        {/* Statistik */}
        <Reveal className="relative mx-auto mt-16 max-w-6xl" delay={0.15}>
          <dl className="glass-regular grid grid-cols-2 divide-foreground/10 rounded-3xl sm:grid-cols-4 sm:divide-x">
            {stats.map((s) => (
              <div key={s.label} className="p-6 text-center">
                <dd className="font-display text-3xl font-semibold tracking-tight text-brand-600 dark:text-brand-300 sm:text-4xl">
                  {s.value}
                </dd>
                <dt className="mt-1 text-sm text-foreground/60">{s.label}</dt>
              </div>
            ))}
          </dl>
        </Reveal>
      </section>

      {/* ─── Tentang: sambutan + visi misi ─────────────────── */}
      <section id="tentang" className="scroll-mt-24 px-5 py-20">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <SectionHeading
              eyebrow="Tentang Program Studi"
              title="Ilmu ekonomi yang berpijak pada nilai."
              description={`${prodi.fullName} berada di bawah ${prodi.faculty}, ${prodi.university} — kampus dengan paradigma wahyu memandu ilmu.`}
            />
          </Reveal>

          <div className="mt-12 grid gap-6 lg:grid-cols-[1fr_1.2fr]">
            <Reveal>
              <figure className="relative h-full overflow-hidden rounded-3xl bg-gradient-to-br from-brand-600 to-brand-900 p-8 text-cream-50 sm:p-10">
                <Quote aria-hidden className="absolute -right-4 -top-4 size-40 text-white/5" />
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-300">Sambutan</p>
                <blockquote className="relative mt-5 font-serif text-xl leading-relaxed sm:text-2xl">
                  “{sambutan.quote}”
                </blockquote>
                <figcaption className="mt-8 flex items-center gap-3">
                  <span className="grid size-12 place-items-center rounded-full bg-white/15">
                    <GraduationCap className="size-6" />
                  </span>
                  <span>
                    <span className="block font-semibold">{sambutan.name}</span>
                    <span className="block text-sm text-cream-100/70">{sambutan.role}</span>
                  </span>
                </figcaption>
              </figure>
            </Reveal>

            <div className="grid gap-6">
              <Reveal>
                <div className="glass-regular rounded-3xl p-8">
                  <div className="flex items-center gap-3">
                    <span className="grid size-10 place-items-center rounded-xl bg-brand-500/10 text-brand-600 dark:text-brand-300">
                      <Compass className="size-5" />
                    </span>
                    <h3 className="font-display text-xl font-semibold">Visi</h3>
                  </div>
                  <p className="mt-4 leading-relaxed text-foreground/75">{visi}</p>
                </div>
              </Reveal>
              <Reveal delay={0.05}>
                <div className="glass-regular rounded-3xl p-8">
                  <div className="flex items-center gap-3">
                    <span className="grid size-10 place-items-center rounded-xl bg-gold-500/15 text-gold-600">
                      <Target className="size-5" />
                    </span>
                    <h3 className="font-display text-xl font-semibold">Misi</h3>
                  </div>
                  <ol className="mt-4 grid gap-3">
                    {misi.map((m, i) => (
                      <li key={i} className="flex gap-3 text-[15px] leading-relaxed text-foreground/75">
                        <span className="font-mono text-sm font-semibold text-brand-600 dark:text-brand-300">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        {m}
                      </li>
                    ))}
                  </ol>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Keunggulan ───────────────────────────────────── */}
      <section className="px-5 py-20">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <SectionHeading
              eyebrow="Mengapa Ekonomi Syariah?"
              title="Belajar di prodi yang menyiapkan kamu untuk dunia nyata."
              align="center"
            />
          </Reveal>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {keunggulan.map((k, i) => (
              <Reveal key={k.title} delay={(i % 3) * 0.05}>
                <div className="glass-regular specular-edge h-full rounded-3xl p-7 transition-transform duration-300 hover:-translate-y-1">
                  <span className="grid size-12 place-items-center rounded-2xl bg-gradient-to-br from-brand-400 to-brand-600 text-white shadow-[0_10px_24px_-10px_rgba(13,148,136,0.7)]">
                    <SiteIcon name={k.icon} className="size-6" />
                  </span>
                  <h3 className="mt-5 font-display text-lg font-semibold">{k.title}</h3>
                  <p className="mt-2 text-[14px] leading-relaxed text-foreground/65">{k.description}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Konsentrasi ──────────────────────────────────── */}
      <section className="px-5 py-20">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <SectionHeading
              eyebrow="Konsentrasi Keilmuan"
              title="Pilih jalur keahlian sesuai minatmu."
              description="Mulai semester lima, mahasiswa memperdalam salah satu konsentrasi berikut."
            />
          </Reveal>
          <div className="mt-12 grid gap-5 lg:grid-cols-3">
            {konsentrasi.map((k, i) => (
              <Reveal key={k.title} delay={i * 0.05}>
                <article className="glass-regular flex h-full flex-col rounded-3xl p-7">
                  <span className="font-mono text-sm font-semibold text-gold-500">0{i + 1}</span>
                  <h3 className="mt-3 font-display text-xl font-semibold leading-snug">{k.title}</h3>
                  <p className="mt-3 text-[14px] leading-relaxed text-foreground/65">{k.description}</p>
                  <ul className="mt-auto flex flex-wrap gap-2 pt-6">
                    {k.topics.map((t) => (
                      <li
                        key={t}
                        className="rounded-full bg-brand-500/10 px-3 py-1 text-xs font-medium text-brand-700 dark:text-brand-200"
                      >
                        {t}
                      </li>
                    ))}
                  </ul>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Kurikulum ────────────────────────────────────── */}
      <section id="kurikulum" className="scroll-mt-24 px-5 py-20">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <SectionHeading
              eyebrow="Kurikulum"
              title={`${prodi.totalCredits} SKS dalam ${prodi.studyDuration.toLowerCase()}.`}
              description="Kurikulum berbasis Outcome-Based Education (OBE) dan Merdeka Belajar, dengan porsi praktik yang meningkat setiap tahun."
            />
          </Reveal>
          <Reveal className="mt-10">
            <KurikulumTabs years={kurikulum} />
          </Reveal>
        </div>
      </section>

      {/* ─── Prospek karir ────────────────────────────────── */}
      <section id="karir" className="scroll-mt-24 px-5 py-20">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <SectionHeading
              eyebrow="Prospek Karir"
              title="Lulusan dibutuhkan di banyak sektor."
              description="Pertumbuhan industri keuangan syariah dan ekonomi halal membuka peluang karir yang luas."
              align="center"
            />
          </Reveal>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {prospekKarir.map((p, i) => (
              <Reveal key={p.title} delay={(i % 4) * 0.04}>
                <div className="glass-thin h-full rounded-2xl p-5">
                  <SiteIcon name={p.icon} className="size-6 text-brand-600 dark:text-brand-300" />
                  <h3 className="mt-4 font-semibold">{p.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-foreground/60">{p.description}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Berita & agenda (dari CMS) ───────────────────── */}
      <section id="berita" className="scroll-mt-24 px-5 py-20">
        <div className="mx-auto max-w-6xl">
          <Reveal className="flex flex-wrap items-end justify-between gap-4">
            <SectionHeading
              eyebrow="Kabar Terbaru"
              title="Berita & kegiatan prodi."
            />
            {news.length > 0 && (
              <Link
                href="/prodi/berita"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600 hover:underline dark:text-brand-300"
              >
                Semua berita
                <ArrowRight className="size-4" />
              </Link>
            )}
          </Reveal>

          <div className="mt-10 grid gap-6 lg:grid-cols-[2fr_1fr]">
            {latestNews.length > 0 ? (
              <div className="grid gap-5 sm:grid-cols-2">
                {latestNews.map((n, i) => (
                  <Reveal key={n.id} delay={i * 0.05} className={i === 0 ? "sm:col-span-2" : undefined}>
                    <NewsCard item={n} cover={coverFor(n, media)} />
                  </Reveal>
                ))}
              </div>
            ) : (
              <div className="glass-thin grid place-items-center rounded-3xl p-10 text-center">
                <p className="max-w-sm text-sm text-foreground/60">
                  Berita akan tampil di sini setelah tim Humas mempublikasikan konten melalui CMS.
                </p>
              </div>
            )}

            <aside className="glass-regular h-fit rounded-3xl p-6">
              <div className="flex items-center gap-2">
                <CalendarDays className="size-5 text-brand-500" />
                <h3 className="font-display text-lg font-semibold">Agenda Mendatang</h3>
              </div>
              {upcomingEvents.length > 0 ? (
                <ul className="mt-5 grid gap-4">
                  {upcomingEvents.map((e) => {
                    // "Sen 12 Mei" → ["Sen", "12", "Mei"]
                    const [, day, month] = formatShortDate(e.startsAt).split(" ");
                    return (
                    <li key={e.id} className="flex gap-4">
                      <div className="grid w-14 shrink-0 place-items-center rounded-2xl bg-brand-500/10 py-2 text-center">
                        <span className="text-[11px] font-semibold uppercase text-brand-600 dark:text-brand-300">
                          {month}
                        </span>
                        <span className="font-display text-xl font-semibold leading-none">
                          {day}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold leading-snug">{e.title}</p>
                        <p className="mt-1 flex items-center gap-1 text-xs text-foreground/55">
                          <Clock className="size-3" />
                          {formatDateTime(e.startsAt)}
                        </p>
                        <p className="mt-0.5 truncate text-xs text-foreground/55">
                          {e.isOnline ? "Daring" : e.location}
                        </p>
                      </div>
                    </li>
                    );
                  })}
                </ul>
              ) : (
                <p className="mt-4 text-sm text-foreground/60">Belum ada agenda terjadwal.</p>
              )}
            </aside>
          </div>
        </div>
      </section>

      {/* ─── Testimoni ────────────────────────────────────── */}
      <section className="px-5 py-20">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <SectionHeading eyebrow="Kata Alumni" title="Cerita mereka setelah lulus." align="center" />
          </Reveal>
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {testimoni.map((t, i) => (
              <Reveal key={t.name} delay={i * 0.05}>
                <figure className="glass-regular flex h-full flex-col rounded-3xl p-7">
                  <Quote className="size-7 text-gold-500" aria-hidden />
                  <blockquote className="mt-4 flex-1 text-[15px] leading-relaxed text-foreground/75">
                    {t.quote}
                  </blockquote>
                  <figcaption className="mt-6 border-t border-foreground/10 pt-4">
                    <p className="font-semibold">{t.name}</p>
                    <p className="text-sm text-foreground/55">{t.role}</p>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Pendaftaran ──────────────────────────────────── */}
      <section id="pmb" className="scroll-mt-24 px-5 py-20">
        <Reveal className="mx-auto max-w-6xl">
          <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-brand-600 via-brand-700 to-ink-soft p-8 text-cream-50 sm:p-12">
            <div aria-hidden className="absolute -right-24 -top-24 size-80 rounded-full bg-gold-400/20 blur-3xl" />
            <div className="relative grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-center">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-300">
                  Penerimaan Mahasiswa Baru
                </p>
                <h2 className="mt-3 font-display text-[length:var(--font-h2)] font-semibold leading-tight tracking-tight">
                  Siap jadi bagian dari keluarga Eksyar?
                </h2>
                <p className="mt-4 max-w-md leading-relaxed text-cream-100/80">
                  Pilih jalur seleksi yang sesuai, siapkan berkasmu, dan pantau jadwal resmi di portal PMB {prodi.university}.
                </p>
                <a
                  href={kontak.pmbUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-8 inline-flex h-12 items-center gap-2 rounded-2xl bg-gradient-to-b from-gold-400 to-gold-500 px-6 text-[15px] font-semibold text-ink-soft transition hover:brightness-110"
                >
                  Kunjungi Portal PMB
                  <ArrowUpRight className="size-4" />
                </a>
              </div>
              <ol className="grid gap-3 sm:grid-cols-2">
                {jalurMasuk.map((j, i) => (
                  <li key={j.title} className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
                    <span className="font-mono text-xs text-gold-300">Jalur {i + 1}</span>
                    <p className="mt-1 font-display text-lg font-semibold">{j.title}</p>
                    <p className="mt-1 text-sm leading-relaxed text-cream-100/70">{j.description}</p>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ─── FAQ ──────────────────────────────────────────── */}
      <section className="px-5 py-20">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1fr_1.5fr]">
          <Reveal>
            <SectionHeading
              eyebrow="FAQ"
              title="Pertanyaan yang sering diajukan."
              description="Belum menemukan jawaban? Hubungi kami lewat email atau Instagram."
            />
          </Reveal>
          <Reveal>
            <div className="grid gap-3">
              {faq.map((f) => (
                <details key={f.q} className="glass-regular group rounded-2xl p-5 open:pb-6">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold [&::-webkit-details-marker]:hidden">
                    {f.q}
                    <ChevronDown className="size-5 shrink-0 text-foreground/50 transition-transform group-open:rotate-180" />
                  </summary>
                  <p className="mt-3 text-[15px] leading-relaxed text-foreground/70">{f.a}</p>
                </details>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ─── Kontak ───────────────────────────────────────── */}
      <section id="kontak" className="scroll-mt-24 px-5 py-20">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <SectionHeading eyebrow="Kontak" title="Kunjungi atau hubungi kami." />
          </Reveal>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            <Reveal>
              <a
                href={kontak.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="glass-regular group flex h-full flex-col rounded-3xl p-7 md:col-span-1"
              >
                <MapPin className="size-6 text-brand-500" />
                <p className="mt-4 font-semibold">Alamat</p>
                <p className="mt-1.5 text-sm leading-relaxed text-foreground/65">{kontak.address}</p>
                <span className="mt-auto inline-flex items-center gap-1 pt-4 text-sm font-semibold text-brand-600 group-hover:underline dark:text-brand-300">
                  Buka di Maps <ArrowUpRight className="size-4" />
                </span>
              </a>
            </Reveal>
            <Reveal delay={0.05}>
              <a href={`mailto:${kontak.email}`} className="glass-regular group flex h-full flex-col rounded-3xl p-7">
                <Mail className="size-6 text-brand-500" />
                <p className="mt-4 font-semibold">Email</p>
                <p className="mt-1.5 break-all text-sm text-foreground/65">{kontak.email}</p>
                <span className="mt-auto inline-flex items-center gap-1 pt-4 text-sm font-semibold text-brand-600 group-hover:underline dark:text-brand-300">
                  Kirim email <ArrowUpRight className="size-4" />
                </span>
              </a>
            </Reveal>
            <Reveal delay={0.1}>
              <a
                href={kontak.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="glass-regular group flex h-full flex-col rounded-3xl p-7"
              >
                <span className="font-display text-2xl font-semibold text-brand-500">@</span>
                <p className="mt-3 font-semibold">Instagram</p>
                <p className="mt-1.5 text-sm text-foreground/65">@eksyaruinsgd — info kegiatan & pengumuman terbaru.</p>
                <span className="mt-auto inline-flex items-center gap-1 pt-4 text-sm font-semibold text-brand-600 group-hover:underline dark:text-brand-300">
                  Ikuti kami <ArrowUpRight className="size-4" />
                </span>
              </a>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
