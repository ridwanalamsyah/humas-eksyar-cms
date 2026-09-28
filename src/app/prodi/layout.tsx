import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { SiteNavbar } from "@/components/site/site-navbar";
import { SiteFooter } from "@/components/site/site-footer";
import { getSite } from "@/lib/site/get-site";
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
  const { kontak } = await getSite();
  return (
    <div
      className={`${jakarta.variable} relative flex min-h-dvh flex-col bg-canvas font-jakarta text-label antialiased [color-scheme:light]`}
    >
      <a
        href="#konten"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-accent focus:px-4 focus:py-2 focus:text-white"
      >
        Lewati ke konten
      </a>
      <SiteNavbar pmbUrl={kontak.pmbUrl} />
      <main id="konten" className="flex-1">
        {children}
      </main>
      <SiteFooter />
    </div>
  );
}
