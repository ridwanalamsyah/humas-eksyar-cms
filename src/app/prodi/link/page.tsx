import type { Metadata } from "next";
import Link from "next/link";
import { getSite } from "@/lib/site/get-site";
import { prodi } from "@/lib/site/prodi";
import { ProdiLogo } from "@/components/site/prodi-logo";

export const metadata: Metadata = {
  title: { absolute: `Tautan · ${prodi.fullName}` },
  description: "Semua tautan penting Program Studi Ekonomi Syariah UIN SGD.",
};

export default async function LinkPage() {
  const { kontak, medsos, kampanyePmb } = await getSite();
  const links: {
    href: string;
    label: string;
    primary?: boolean;
    external?: boolean;
  }[] = [
    ...(kampanyePmb.aktif && kampanyePmb.judul
      ? [
          {
            href: "/prodi/mahasiswa-baru",
            label: kampanyePmb.judul,
            primary: true,
          },
        ]
      : []),
    { href: "/", label: "Website Prodi Ekonomi Syariah" },
    { href: "/prodi/skripsi", label: "Direktori & cek judul skripsi" },
    { href: "/prodi/kalender", label: "Kalender akademik" },
    { href: "/prodi/beasiswa", label: "Info beasiswa" },
    { href: "/prodi/agenda", label: "Agenda & pendaftaran acara" },
    { href: "/prodi/formulir", label: "Formulir online" },
    { href: "/prodi/alat/zakat", label: "Kalkulator zakat" },
    { href: "/prodi/mahasiswa-baru", label: "Info mahasiswa baru" },
    ...(kontak.whatsapp
      ? [
          {
            href: kontak.whatsapp,
            label: "Tanya prodi via WhatsApp",
            external: true,
          },
        ]
      : []),
    ...(medsos.whatsappChannel
      ? [
          {
            href: medsos.whatsappChannel,
            label: "Saluran WhatsApp prodi",
            external: true,
          },
        ]
      : []),
  ];
  return (
    <section className="px-4 py-14">
      <div className="mx-auto max-w-[480px] text-center">
        <ProdiLogo size={80} className="mx-auto" />
        <h1 className="mt-4 text-[22px] font-extrabold tracking-[-0.02em] text-label">
          {prodi.fullName}
        </h1>
        <p className="text-[14px] text-label-2">{prodi.university}</p>
        <ul className="mt-8 grid gap-3">
          {links.map((l) => {
            const cls = l.primary
              ? "block rounded-full bg-accent px-6 py-4 text-[15.5px] font-bold text-white hover:bg-accent-strong"
              : "block rounded-full border border-hairline bg-canvas px-6 py-4 text-[15.5px] font-semibold text-label transition hover:-translate-y-0.5 hover:border-accent";
            return (
              <li key={l.href + l.label}>
                {l.external ? (
                  <a
                    href={l.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cls}
                  >
                    {l.label}
                  </a>
                ) : (
                  <Link href={l.href} className={cls}>
                    {l.label}
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
        <p className="mt-8 text-[13px] text-label-3">{kontak.email}</p>
      </div>
    </section>
  );
}
