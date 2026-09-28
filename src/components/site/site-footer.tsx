import Link from "next/link";
import { AtSign, Mail, MapPin, Music2 } from "lucide-react";
import { EksyarLogo } from "@/components/brand/eksyar-logo";
import { kontak, navLinks, prodi } from "@/lib/site/prodi";

export function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-24 border-t border-foreground/10 bg-foreground/[0.02]">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <div className="flex items-center gap-3">
            <EksyarLogo size={44} alt="Logo Ekonomi Syariah" />
            <div className="leading-tight">
              <p className="font-display text-lg font-semibold">{prodi.fullName}</p>
              <p className="text-sm text-foreground/60">{prodi.faculty}</p>
            </div>
          </div>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-foreground/60">
            {prodi.university}. {prodi.tagline}
          </p>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-foreground/50">Jelajahi</p>
          <ul className="mt-4 grid gap-2 text-sm">
            {navLinks.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-foreground/70 hover:text-brand-600 dark:hover:text-brand-300">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-foreground/50">Hubungi</p>
          <ul className="mt-4 grid gap-3 text-sm text-foreground/70">
            <li className="flex gap-2.5">
              <MapPin className="mt-0.5 size-4 shrink-0 text-brand-500" />
              <span>{kontak.address}</span>
            </li>
            <li>
              <a href={`mailto:${kontak.email}`} className="flex items-center gap-2.5 hover:text-brand-600 dark:hover:text-brand-300">
                <Mail className="size-4 shrink-0 text-brand-500" />
                {kontak.email}
              </a>
            </li>
            <li className="flex gap-2">
              <a
                href={kontak.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="grid size-9 place-items-center rounded-xl border border-foreground/10 hover:border-brand-500 hover:text-brand-600"
              >
                <AtSign className="size-4" />
              </a>
              <a
                href={kontak.tiktok}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok"
                className="grid size-9 place-items-center rounded-xl border border-foreground/10 hover:border-brand-500 hover:text-brand-600"
              >
                <Music2 className="size-4" />
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-foreground/10">
        <p className="mx-auto max-w-6xl px-5 py-5 text-xs text-foreground/50">
          © {year} {prodi.fullName} · {prodi.university}
        </p>
      </div>
    </footer>
  );
}
