import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { SiteNavbar } from "@/components/site/site-navbar";
import { SiteFooter } from "@/components/site/site-footer";
import { getSite } from "@/lib/site/get-site";
import { listPublishedNews } from "@/lib/site/content";
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
    icons: {
      icon: [
        { url: "/favicon.ico" },
        { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
        { url: "/prodi/icon-eksyar.png", sizes: "128x128", type: "image/png" },
      ],
      shortcut: "/favicon.ico",
      apple: "/apple-touch-icon.png",
    },
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
        {
          url: "/prodi/og-eksyar.jpg",
          width: 1200,
          height: 630,
          alt: `${prodi.name} ${prodi.university}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${prodi.name} ${prodi.university}`,
      description: identity.heroDescription,
      images: ["/prodi/og-eksyar.jpg"],
    },
  };
}

export default async function ProdiLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [{ galeri, video, banner }, news] = await Promise.all([
    getSite(),
    listPublishedNews(),
  ]);
  // Sembunyikan menu yang belum ada isinya.
  const hidden = [...(galeri.length || video.length ? [] : ["/prodi/galeri"])];
  return (
    <SiteShell
      className={`${jakarta.variable} relative flex min-h-dvh w-full max-w-full min-w-0 flex-col overflow-x-clip bg-[#FAF9F5] font-jakarta text-label antialiased dark:bg-[#0B171C]`}
    >
      <a
        href="#konten"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-xl focus:bg-accent focus:px-4 focus:py-2 focus:text-white"
      >
        Lewati ke konten
      </a>

      {/* Latar bersih bernuansa ivory hangat alami */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden="true">
        <div className="absolute inset-0 bg-[#FAF9F5] dark:bg-[#0B171C] transition-colors duration-300" />
      </div>

      <SiteNavbar hidden={hidden} />
      <main id="konten" className="flex-1 w-full max-w-full min-w-0 overflow-x-clip">
        {children}
      </main>
      <SiteFooter />
      <ViewBeacon />
    </SiteShell>
  );
}
