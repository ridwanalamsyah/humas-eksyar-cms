import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { getSite } from "@/lib/site/get-site";
import { prodi, utilityLinks } from "@/lib/site/prodi";
import { ProdiLogo } from "./prodi-logo";

const NAV_UTAMA = [
  { href: "/prodi/profil", label: "Profil Program Studi" },
  { href: "/prodi/akademik", label: "Kurikulum & Akademik" },
  { href: "/prodi/dosen", label: "Dosen & Tenaga Kependidikan" },
  { href: "/prodi/kemahasiswaan", label: "Kemahasiswaan & HMJ" },
  { href: "/prodi/penelitian", label: "Penelitian & Jurnal LIKUID" },
  { href: "/prodi/berita", label: "Berita & Buletin Artikel HMJ" },
];

const NAV_LAYANAN = [
  { href: "/prodi/skripsi", label: "Direktori & Pojok Skripsi" },
  { href: "/prodi/layanan", label: "Formulir & Layanan Online" },
  { href: "/prodi/kalender", label: "Kalender Akademik" },
  { href: "/prodi/beasiswa", label: "Informasi Beasiswa" },
  { href: "/prodi/galeri", label: "Galeri & Dokumentasi Video" },
  { href: "/prodi/kontak", label: "Kontak & Peta Kampus" },
];

/** Footer rapi 4 kolom dengan tautan internal & ekosistem UIN SGD yang sejajar vertikal. */
export async function SiteFooter() {
  const { kontak, medsos } = await getSite();
  const year = new Date().getFullYear();
  const youtubeHref = medsos.youtubeChannelId
    ? `https://www.youtube.com/channel/${medsos.youtubeChannelId}`
    : "https://www.youtube.com/channel/UC7loqPCpEN3H_IbrulKBi6w";
  const sosial = [
    { href: kontak.instagram, label: "Instagram" },
    { href: youtubeHref, label: "YouTube" },
    { href: kontak.tiktok, label: "TikTok" },
    { href: kontak.x, label: "X" },
    { href: medsos.whatsappChannel, label: "WhatsApp" },
    { href: kontak.linktree, label: "Linktree" },
  ].filter((s) => s.href);

  return (
    <footer className="border-t border-hairline bg-mist text-[13.5px] leading-relaxed text-label-2">
      <div className="mx-auto grid max-w-[1080px] gap-10 px-4 py-12 sm:px-6 md:grid-cols-2 lg:grid-cols-[1.45fr_1fr_1fr_1fr]">
        {/* Kolom 1: Identitas Prodi */}
        <div className="flex flex-col items-start">
          <div className="flex items-center gap-3">
            <ProdiLogo size={42} />
            <div>
              <p className="text-[15.5px] font-bold leading-tight text-label">
                {prodi.fullName}
              </p>
              <p className="mt-0.5 text-[12.5px] font-medium text-label-2">
                {prodi.faculty}
              </p>
            </div>
          </div>
          <p className="mt-4 text-[13px] leading-relaxed text-label-2">
            {prodi.university}
            <br />
            {kontak.address}
            {kontak.street ? ` — ${kontak.street}` : ""}
          </p>
          <div className="mt-3 flex flex-col gap-1 text-[13px]">
            <a
              href={`mailto:${kontak.email}`}
              className="font-semibold text-accent hover:underline"
            >
              {kontak.email}
            </a>
            <span className="text-label-3">{kontak.hours}</span>
          </div>
        </div>

        {/* Kolom 2: Navigasi Utama */}
        <nav aria-label="Navigasi utama footer">
          <p className="text-[12px] font-bold uppercase tracking-[0.08em] text-label">
            Navigasi Utama
          </p>
          <ul className="mt-4 space-y-2.5">
            {NAV_UTAMA.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="block text-[13.5px] text-label-2 transition-colors hover:text-accent"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Kolom 3: Layanan & Informasi */}
        <nav aria-label="Layanan mahasiswa footer">
          <p className="text-[12px] font-bold uppercase tracking-[0.08em] text-label">
            Layanan & Akademik
          </p>
          <ul className="mt-4 space-y-2.5">
            {NAV_LAYANAN.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="block text-[13.5px] text-label-2 transition-colors hover:text-accent"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Kolom 4: Sistem & Web Resmi UIN SGD (sejajar vertikal) */}
        <nav aria-label="Portal resmi UIN Sunan Gunung Djati">
          <p className="text-[12px] font-bold uppercase tracking-[0.08em] text-label">
            Ekosistem UIN SGD
          </p>
          <ul className="mt-4 space-y-2.5">
            {utilityLinks.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-1.5 text-[13.5px] text-label-2 transition-colors hover:text-accent"
                >
                  <span>{l.label}</span>
                  <ArrowUpRight className="size-3.5 shrink-0 text-label-3 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent" />
                </a>
              </li>
            ))}
            <li>
              <Link
                href="/prodi/privasi"
                className="block text-[13.5px] text-label-2 transition-colors hover:text-accent"
              >
                Kebijakan Privasi
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      <div className="border-t border-hairline bg-canvas/40">
        <div className="mx-auto flex max-w-[1080px] flex-col items-start justify-between gap-3 px-4 py-4 sm:flex-row sm:items-center sm:px-6">
          <p className="text-[12.5px] text-label-2">
            © {year} {prodi.fullName} · {prodi.faculty} {prodi.universityShort}
          </p>
          <ul className="flex flex-wrap items-center gap-x-5 gap-y-1.5 text-[12.5px] font-medium">
            {sosial.map((s) => (
              <li key={s.href}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-label-2 transition-colors hover:text-accent"
                >
                  {s.label}
                </a>
              </li>
            ))}
            <li>
              <Link
                href="/login"
                className="text-label-3 transition-colors hover:text-accent"
              >
                Portal Pengurus
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
