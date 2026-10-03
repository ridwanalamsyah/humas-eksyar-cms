import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { SiteNavbar } from "@/components/site/site-navbar";
import { SiteFooter } from "@/components/site/site-footer";
import { getSite } from "@/lib/site/get-site";
import { listPublishedNews, recentAnnouncement } from "@/lib/site/content";
import { AnnouncementBar } from "@/components/site/announcement-bar";
import { WhatsAppButton } from "@/components/site/whatsapp-button";
import { SiteShell } from "@/components/site/site-shell";
import { ViewBeacon } from "@/components/site/view-beacon";
import { prodi } from "@/lib/site/prodi";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const { identity } = await getSite();
  return {
    applicationName: prodi.fullName,
    icons: { icon: "/prodi/icon-eksyar.png", apple: prodi.logo },
    title: {
      default: `${prodi.fullName} — ${prodi.university}`,
      template: `%s · ${prodi.name} ${prodi.university}`,
    },
    description: identity.heroDescription,
    keywords: [
      "Ekonomi Syariah",
      "Program Studi Ekonomi Syariah",
      "FEBI",
      "UIN Sunan Gunung Djati",
      "UIN Bandung",
      "Kuliah Ekonomi Islam",
      "Perbankan Syariah",
      "FEBI UIN SGD",
      "Eksyar UIN Bandung",
    ],
    openGraph: {
      type: "website",
      locale: "id_ID",
      siteName: prodi.fullName,
      title: `${prodi.fullName} — ${prodi.university}`,
      description: identity.heroDescription,
      images: [
        { url: prodi.logo, width: 512, height: 512, alt: prodi.fullName },
      ],
    },
  };
}

export default async function ProdiLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [{ kontak, galeri, video, kalender, banner, wisuda, karya }, news] =
    await Promise.all([getSite(), listPublishedNews()]);
  // Sembunyikan menu yang belum ada isinya.
  const hidden = [
    ...(galeri.length || video.length ? [] : ["/prodi/galeri"]),
    ...(kalender.length ? [] : ["/prodi/kalender"]),
    ...(wisuda.length ? [] : ["/prodi/wisuda"]),
    ...(karya.length ? [] : ["/prodi/karya"]),
  ];
  // Pita pengumuman: dari CMS bila diaktifkan, atau pengumuman terbaru (≤ 14 hari).
  const latest = recentAnnouncement(news);
  const bar =
    banner.aktif && banner.teks
      ? { text: banner.teks, href: banner.url || undefined }
      : latest
        ? { text: latest.title, href: `/prodi/berita/${latest.slug}` }
        : null;
  return (
    <SiteShell
      className={`${jakarta.variable} relative flex min-h-dvh flex-col bg-canvas font-jakarta text-label antialiased`}
    >
      <a
        href="#konten"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-accent focus:px-4 focus:py-2 focus:text-white"
      >
        Lewati ke konten
      </a>
      {bar && <AnnouncementBar text={bar.text} href={bar.href} />}
      <SiteNavbar hidden={hidden} />
      <main id="konten" className="flex-1">
        {children}
      </main>
      <SiteFooter />
      <ViewBeacon />
      {kontak.whatsapp && <WhatsAppButton href={kontak.whatsapp} />}
    </SiteShell>
  );
}
