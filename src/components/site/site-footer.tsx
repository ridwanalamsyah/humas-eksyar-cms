import Link from "next/link";
import { ProdiLogo } from "./prodi-logo";

const NAV_LINKS = [
  { href: "/prodi/profil", label: "Profil" },
  { href: "/prodi/akademik", label: "Akademik" },
  { href: "/prodi/berita", label: "Artikel" },
  { href: "/prodi/skripsi", label: "Skripsi" },
  { href: "/prodi/alumni", label: "Alumni" },
  { href: "/prodi/kontak", label: "Kontak" },
];

/** Footer simpel, bersih, elegan, dan proporsional */
export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-hairline bg-canvas py-12 text-[13.5px] text-label-2">
      <div className="mx-auto max-w-[1040px] px-4 sm:px-6">
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-center">
          {/* Identitas Prodi & Kontak Admin */}
          <div>
            <div className="flex items-center gap-3">
              <ProdiLogo size={38} />
              <div>
                <p className="text-[15px] font-bold text-label">
                  Program Studi Ekonomi Syariah
                </p>
                <p className="text-[12.5px] text-label-2">
                  Fakultas Ekonomi dan Bisnis Islam · UIN Sunan Gunung Djati Bandung
                </p>
              </div>
            </div>
            <p className="mt-3.5 text-[13px] text-label-2">
              <a
                href="https://wa.me/6285642686526"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-accent hover:underline inline-flex items-center gap-1"
              >
                Hubungi Admin Jurusan ↗
              </a>
            </p>
          </div>

          {/* Navigasi Simpel Satu Baris */}
          <nav aria-label="Navigasi footer">
            <ul className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[13.5px] font-medium text-label-2">
              {NAV_LINKS.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="transition-colors hover:text-accent"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Baris Bawah: Copyright, Sosmed (Hanya IG & YouTube), dan Portal */}
        <div className="mt-8 flex flex-col items-start justify-between gap-4 border-t border-hairline/60 pt-6 text-[12.5px] text-label-3 sm:flex-row sm:items-center">
          <p>
            © {year} Program Studi Ekonomi Syariah UIN Sunan Gunung Djati Bandung.
          </p>

          <div className="flex items-center gap-5 font-medium text-label-2">
            <a
              href="https://instagram.com/eksyaruinsgd"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-accent transition-colors"
            >
              Instagram
            </a>
            <a
              href="https://www.youtube.com/channel/UC7loqPCpEN3H_IbrulKBi6w"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-accent transition-colors"
            >
              YouTube
            </a>
            <span className="text-hairline">|</span>
            <Link
              href="/login"
              className="text-accent hover:underline font-medium"
            >
              Portal Humas
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
