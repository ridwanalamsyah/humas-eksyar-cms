import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { ProdiLogo } from "./prodi-logo";
import { utilityLinks } from "@/lib/site/prodi";

const NAV_LINKS = [
  { href: "/prodi/profil", label: "Profil" },
  { href: "/prodi/akademik", label: "Kurikulum" },
  { href: "/prodi/skripsi", label: "Skripsi" },
  { href: "/prodi/berita", label: "Kabar" },
  { href: "/prodi/alumni", label: "Alumni" },
  { href: "/prodi/kontak", label: "Kontak" },
  { href: "/prodi/mahasiswa-baru", label: "Info pendaftaran" },
];

/** Sistem kampus yang paling sering dipakai mahasiswa (dulu di bawah hero). */
const PORTAL = utilityLinks.slice(0, 4);

const link =
  "flex min-h-11 shrink-0 snap-start items-center whitespace-nowrap transition-colors hover:text-accent md:min-h-0 md:py-1";

/** Di ponsel daftar tautan menjadi satu baris yang digeser ke samping; di desktop kolom biasa. */
const row =
  "-mx-4 mt-1 flex snap-x gap-x-6 overflow-x-auto px-4 [scrollbar-width:none] md:mx-0 md:mt-2 md:block md:overflow-visible md:px-0 [&::-webkit-scrollbar]:hidden";

/** Footer: identitas dan kontak, sistem kampus, tautan halaman, media sosial. */
export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-hairline bg-canvas py-10 text-[14px] text-label-2 md:py-14">
      <div className="mx-auto max-w-[1160px] px-4 sm:px-6">
        <div className="grid gap-6 md:gap-10 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_minmax(0,1fr)]">
          <div>
            <div className="flex items-center gap-3">
              <ProdiLogo size={40} />
              <div>
                <p className="text-[16px] font-bold text-label">Program Studi Ekonomi Syariah</p>
                <p className="text-[14px] text-label-2">FEBI · UIN Sunan Gunung Djati Bandung</p>
              </div>
            </div>
            <a
              href="https://wa.me/6285642686526"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-flex min-h-11 items-center gap-1 font-semibold text-accent hover:underline md:mt-4"
            >
              Hubungi admin jurusan <ArrowUpRight className="size-4" />
            </a>
          </div>

          <nav aria-label="Sistem kampus">
            <p className="text-[14px] font-semibold text-label">Sistem kampus</p>
            <ul className={row}>
              {PORTAL.map((l) => (
                <li key={l.href}>
                  <a href={l.href} target="_blank" rel="noopener noreferrer" className={link}>
                    {l.label}
                    <ArrowUpRight className="ml-1 size-3.5 text-label-3" />
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Navigasi footer">
            <p className="text-[14px] font-semibold text-label">Jelajahi</p>
            <ul className={row}>
              {NAV_LINKS.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className={link}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-8 flex flex-col-reverse items-start justify-between gap-1 border-t border-hairline/60 pt-4 text-[13px] text-label-3 sm:flex-row sm:items-center sm:gap-4 sm:pt-6 md:mt-10">
          <p>© {year} Ekonomi Syariah UIN SGD Bandung</p>
          <div className="flex items-center gap-5 text-[14px] font-medium text-label-2">
            <a
              href="https://instagram.com/eksyaruinsgd"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center hover:text-accent"
            >
              Instagram
            </a>
            <a
              href="https://www.youtube.com/channel/UC7loqPCpEN3H_IbrulKBi6w"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center hover:text-accent"
            >
              YouTube
            </a>
            <Link href="/login" className="inline-flex min-h-11 items-center text-accent hover:underline">
              Masuk Humas
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
