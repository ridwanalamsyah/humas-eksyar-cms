import Link from "next/link";
import { Mail, MapPin, Clock } from "lucide-react";
import { EksyarLogo } from "@/components/brand/eksyar-logo";
import { kontak, layananAkademik, navLinks, prodi } from "@/lib/site/prodi";

export function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="site-pattern bg-pine-900 text-pine-100">
      <div className="bg-gradient-to-b from-pine-900/80 to-pine-900">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 py-16 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
          <div>
            <div className="flex items-center gap-3">
              <span className="grid size-14 place-items-center rounded-full bg-paper">
                <EksyarLogo size={40} alt="Logo Ekonomi Syariah" />
              </span>
              <div>
                <p className="font-serif text-xl font-semibold text-paper">{prodi.fullName}</p>
                <p className="text-sm text-pine-100/70">{prodi.faculty}</p>
              </div>
            </div>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-pine-100/70">
              {prodi.university} — {prodi.paradigm}.
            </p>
            <p className="mt-4 font-serif italic text-saffron-300">“{prodi.tagline}”</p>
          </div>

          <FooterList title="Jelajahi" items={navLinks.map((l) => ({ href: l.href, label: l.label }))} internal />
          <FooterList title="Layanan" items={layananAkademik.map((l) => ({ href: l.href, label: l.title }))} />

          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-saffron-300">Kontak</p>
            <ul className="mt-5 grid gap-4 text-sm text-pine-100/80">
              <li className="flex gap-3">
                <MapPin className="mt-0.5 size-4 shrink-0 text-saffron-300" />
                <span>
                  {kontak.address}
                  <br />
                  {kontak.street}
                </span>
              </li>
              <li className="flex gap-3">
                <Mail className="mt-0.5 size-4 shrink-0 text-saffron-300" />
                <a href={`mailto:${kontak.email}`} className="break-all hover:text-paper">
                  {kontak.email}
                </a>
              </li>
              <li className="flex gap-3">
                <Clock className="mt-0.5 size-4 shrink-0 text-saffron-300" />
                {kontak.hours}
              </li>
            </ul>
            <div className="mt-5 flex flex-wrap gap-2 text-xs font-semibold">
              <SocialLink href={kontak.instagram} label="Instagram" />
              <SocialLink href={kontak.tiktok} label="TikTok" />
              <SocialLink href={kontak.febiInstagram} label="FEBI" />
            </div>
          </div>
        </div>
        <div className="border-t border-white/10">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-2 px-6 py-5 text-xs text-pine-100/60">
            <p>
              © {year} {prodi.fullName} · {prodi.university}
            </p>
            <a href={prodi.officialSite} target="_blank" rel="noopener noreferrer" className="hover:text-paper">
              es.uinsgd.ac.id
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterList({
  title,
  items,
  internal = false,
}: {
  title: string;
  items: { href: string; label: string }[];
  internal?: boolean;
}) {
  return (
    <div>
      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-saffron-300">{title}</p>
      <ul className="mt-5 grid gap-2.5 text-sm">
        {items.map((i) => (
          <li key={i.href}>
            {internal ? (
              <Link href={i.href} className="text-pine-100/80 hover:text-paper">
                {i.label}
              </Link>
            ) : (
              <a href={i.href} target="_blank" rel="noopener noreferrer" className="text-pine-100/80 hover:text-paper">
                {i.label}
              </a>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

function SocialLink({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="rounded-sm border border-white/15 px-3 py-1.5 uppercase tracking-[0.08em] hover:border-saffron-300 hover:text-saffron-300"
    >
      {label}
    </a>
  );
}
