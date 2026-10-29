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
  const youtubeHref = medsos.youtubeChannelId
    ? `https://www.youtube.com/channel/${medsos.youtubeChannelId}`
    : "https://www.youtube.com/channel/UC7loqPCpEN3H_IbrulKBi6w";
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
    { href: "/", label: "Website Prodi Ekonomi Syariah", primary: !kampanyePmb.aktif },
    { href: "/prodi/skripsi", label: "Direktori 515+ Skripsi & Cek Judul" },
    { href: "/prodi/galeri", label: "Galeri Foto & Video YouTube" },
    { href: "/prodi/kalender", label: "Kalender Akademik & Agenda" },
    { href: "/prodi/beasiswa", label: "Info Beasiswa Mahasiswa" },
    { href: "/prodi/layanan#formulir", label: "Formulir Layanan Online" },
    { href: "/prodi/berita?kategori=buletin_hmj", label: "Buletin Artikel — Kolaborasi HMJ" },
    { href: "/prodi/alat/zakat", label: "Kalkulator Zakat & Kamus Syariah" },
    { href: "/prodi/mahasiswa-baru", label: "Info Mahasiswa Baru (PMB)" },
    {
      href: youtubeHref,
      label: "YouTube Resmi FEBI & Eksyar UIN SGD",
      external: true,
    },
    ...(kontak.instagram
      ? [
          {
            href: kontak.instagram,
            label: `Instagram Resmi (${kontak.instagramHandle || "@eksyaruinsgd"})`,
            external: true,
          },
        ]
      : []),
    ...(kontak.tiktok
      ? [
          {
            href: kontak.tiktok,
            label: "TikTok Resmi (@eksyaruinsgd)",
            external: true,
          },
        ]
      : []),
    {
      href: "https://journal.uinsgd.ac.id/index.php/likuid",
      label: "Jurnal LIKUID: Ekonomi Industri Halal",
      external: true,
    },
    {
      href: "https://eknows.uinsgd.ac.id/course/index.php?categoryid=40",
      label: "LMS e-Knows Ekonomi Syariah",
      external: true,
    },
    {
      href: "https://simak.uinsgd.ac.id/beranda/",
      label: "Portal Akademik SALAM UIN SGD",
      external: true,
    },
    ...(kontak.whatsapp
      ? [
          {
            href: kontak.whatsapp,
            label: "Tanya Prodi via WhatsApp",
            external: true,
          },
        ]
      : []),
    ...(medsos.whatsappChannel
      ? [
          {
            href: medsos.whatsappChannel,
            label: "Saluran WhatsApp Prodi",
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
