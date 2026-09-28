import Link from "next/link";
import { kontak, layananAkademik, navLinks, prodi } from "@/lib/site/prodi";
import { ProdiLogo } from "./prodi-logo";

export function SiteFooter() {
  const year = new Date().getFullYear();
  const sosial = [
    { href: kontak.instagram, label: "Instagram" },
    { href: kontak.tiktok, label: "TikTok" },
    { href: kontak.x, label: "X" },
    { href: kontak.linktree, label: "Linktree" },
    { href: kontak.febiInstagram, label: "Instagram FEBI" },
  ];

  return (
    <footer className="bg-mist text-[12.5px] leading-relaxed text-label-2">
      <div className="mx-auto max-w-[1024px] px-4 sm:px-6">
        <div className="flex flex-col items-start gap-4 border-b border-hairline py-8 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <ProdiLogo size={48} />
            <div>
              <p className="text-[15px] font-bold text-label">{prodi.fullName}</p>
              <p>
                {prodi.faculty} · {prodi.university}
              </p>
            </div>
          </div>
          <p className="font-script text-[26px] leading-none text-accent">{prodi.tagline}</p>
        </div>

        <div className="grid grid-cols-2 gap-8 py-8 md:grid-cols-4">
          <Column title="Jelajahi">
            {navLinks.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="hover:text-label hover:underline">
                  {l.label}
                </Link>
              </li>
            ))}
          </Column>
          <Column title="Layanan Akademik">
            {layananAkademik.map((l) => (
              <li key={l.href}>
                <a href={l.href} target="_blank" rel="noopener noreferrer" className="hover:text-label hover:underline">
                  {l.title}
                </a>
              </li>
            ))}
          </Column>
          <Column title="Ikuti Kami">
            {sosial.map((s) => (
              <li key={s.href}>
                <a href={s.href} target="_blank" rel="noopener noreferrer" className="hover:text-label hover:underline">
                  {s.label}
                </a>
              </li>
            ))}
          </Column>
          <Column title="Kontak">
            <li>{kontak.address}</li>
            <li>{kontak.street}</li>
            <li>
              <a href={`mailto:${kontak.email}`} className="hover:text-label hover:underline">
                {kontak.email}
              </a>
            </li>
          </Column>
        </div>

        <p className="border-t border-hairline py-4">
          Hak Cipta © {year} {prodi.fullName} {prodi.universityShort}. {prodi.paradigm}.
        </p>
      </div>

      {/* Strip kontak — sama seperti footer di setiap postingan IG Eksyar */}
      <div className="bg-accent-strong text-white">
        <ul className="mx-auto flex max-w-[1024px] flex-wrap items-center justify-center gap-x-6 gap-y-1 px-4 py-2.5 text-[12px] font-semibold sm:justify-between">
          <li>
            <a href={`mailto:${kontak.email}`} className="hover:underline">
              {kontak.email}
            </a>
          </li>
          <li>
            <a href={kontak.instagram} target="_blank" rel="noopener noreferrer" className="hover:underline">
              {kontak.instagramHandle}
            </a>
          </li>
          <li>eksyar uin sgd</li>
          <li>
            <a href={prodi.officialSite} target="_blank" rel="noopener noreferrer" className="hover:underline">
              {kontak.website}
            </a>
          </li>
        </ul>
      </div>
    </footer>
  );
}

function Column({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="font-semibold text-label">{title}</p>
      <ul className="mt-2.5 grid gap-2">{children}</ul>
    </div>
  );
}
