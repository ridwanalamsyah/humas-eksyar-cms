import Link from "next/link";
import { kontak, layananAkademik, navLinks, prodi } from "@/lib/site/prodi";

export function SiteFooter() {
  const year = new Date().getFullYear();
  const sosial = [
    { href: kontak.instagram, label: "Instagram" },
    { href: kontak.tiktok, label: "TikTok" },
    { href: kontak.x, label: "X" },
    { href: kontak.febiInstagram, label: "Instagram FEBI" },
  ];

  return (
    <footer className="bg-mist text-[12px] leading-relaxed text-label-2">
      <div className="mx-auto max-w-[1024px] px-4 sm:px-6">
        <p className="border-b border-hairline py-4">
          {prodi.fullName} · {prodi.faculty} · {prodi.university}. {prodi.paradigm}.
        </p>

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

        <div className="flex flex-col gap-2 border-t border-hairline py-4 sm:flex-row sm:items-center sm:justify-between">
          <p>
            Hak Cipta © {year} {prodi.fullName} {prodi.universityShort}.
          </p>
          <p className="text-label">{prodi.tagline}</p>
        </div>
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
