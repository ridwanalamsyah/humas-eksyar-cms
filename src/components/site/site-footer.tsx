import Link from "next/link";
import { getSite } from "@/lib/site/get-site";
import { prodi, utilityLinks } from "@/lib/site/prodi";
import { ProdiLogo } from "./prodi-logo";

const LINKS = [
  { href: "/prodi/profil", label: "Profil" },
  { href: "/prodi/akademik", label: "Akademik" },
  { href: "/prodi/skripsi", label: "Skripsi" },
  { href: "/prodi/layanan", label: "Layanan" },
  { href: "/prodi/kontak", label: "Kontak" },
  { href: "/prodi/privasi", label: "Privasi" },
];

/** Footer ringkas: identitas, tautan penting, media sosial. */
export async function SiteFooter() {
  const { kontak, medsos } = await getSite();
  const year = new Date().getFullYear();
  const sosial = [
    { href: kontak.instagram, label: "Instagram" },
    { href: kontak.tiktok, label: "TikTok" },
    { href: kontak.x, label: "X" },
    { href: medsos.whatsappChannel, label: "WhatsApp" },
  ].filter((s) => s.href);

  return (
    <footer className="border-t border-hairline bg-mist text-[13px] leading-relaxed text-label-2">
      <div className="mx-auto grid max-w-[1024px] gap-8 px-4 py-10 sm:px-6 md:grid-cols-[1.2fr_1fr]">
        <div className="flex items-start gap-3">
          <ProdiLogo size={40} />
          <div>
            <p className="text-[15px] font-bold text-label">{prodi.fullName}</p>
            <p>
              {kontak.address}
              {kontak.street ? `, ${kontak.street}` : ""}
            </p>
            <a
              href={`mailto:${kontak.email}`}
              className="break-all font-medium text-accent hover:underline"
            >
              {kontak.email}
            </a>
          </div>
        </div>
        <nav aria-label="Tautan footer" className="grid gap-3">
          <ul className="flex flex-wrap gap-x-5 gap-y-2 font-medium text-label">
            {LINKS.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="hover:text-accent">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
          <ul className="flex flex-wrap gap-x-5 gap-y-2">
            {utilityLinks.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-label"
                >
                  {l.label} ↗
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <div className="mx-auto flex max-w-[1024px] flex-wrap items-center justify-between gap-3 border-t border-hairline px-4 py-4 sm:px-6">
        <p>
          © {year} {prodi.fullName} {prodi.universityShort}
        </p>
        <ul className="flex flex-wrap items-center gap-x-4 gap-y-1">
          {sosial.map((s) => (
            <li key={s.href}>
              <a
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-label"
              >
                {s.label}
              </a>
            </li>
          ))}
          <li>
            <Link href="/login" className="hover:text-label">
              Masuk pengurus
            </Link>
          </li>
        </ul>
      </div>
    </footer>
  );
}
