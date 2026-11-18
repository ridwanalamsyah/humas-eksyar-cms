import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Inter, Inter_Tight, Fraunces } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { SessionProvider } from "@/components/providers/session-provider";
import { LenisProvider } from "@/components/providers/lenis-provider";
import { Toaster } from "sonner";
import { PWARegister } from "@/components/providers/pwa-register";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const interTight = Inter_Tight({
  variable: "--font-inter-tight",
  subsets: ["latin"],
  display: "swap",
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
  axes: ["opsz", "SOFT"],
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Eksyar — Program Studi Ekonomi Syariah UIN Sunan Gunung Djati Bandung",
    template: "%s · Eksyar UIN SGD",
  },
  description:
    "Portal resmi & CMS Program Studi Ekonomi Syariah FEBI UIN Sunan Gunung Djati Bandung: profil prodi, kurikulum, direktori dosen, skripsi Digilib, artikel mahasiswa, dan kegiatan akademik.",
  applicationName: "Eksyar",
  authors: [{ name: "Program Studi Ekonomi Syariah UIN SGD" }],
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/prodi/icon-eksyar.png", sizes: "128x128", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: "Eksyar — Program Studi Ekonomi Syariah UIN SGD",
    description:
      "Portal resmi & CMS Program Studi Ekonomi Syariah FEBI UIN Sunan Gunung Djati Bandung: profil prodi, kurikulum, direktori dosen, skripsi Digilib, artikel mahasiswa, dan kegiatan akademik.",
    type: "website",
    images: [{ url: "/prodi/logo-eksyar.png", alt: "Logo Program Studi Ekonomi Syariah" }],
  },
  keywords: [
    "Eksyar",
    "Ekonomi Syariah",
    "UIN SGD",
    "UIN Sunan Gunung Djati Bandung",
    "FEBI UIN SGD",
    "Skripsi Eksyar",
    "Kurikulum Ekonomi Syariah",
  ],
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Eksyar UIN SGD",
  },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f7f8f6" },
    { media: "(prefers-color-scheme: dark)", color: "#0a1410" },
  ],
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${interTight.variable} ${fraunces.variable} ${geistSans.variable} ${geistMono.variable} relative min-h-dvh bg-background text-foreground transition-colors duration-150 font-sans antialiased`}
      >
        <SessionProvider>
        <ThemeProvider>
          <LenisProvider>
            {/* Soft mesh gradient background, fixed behind content. */}
            <div className="bg-mesh fixed inset-0 -z-10" aria-hidden />
            <div className="bg-noise fixed inset-0 -z-10" aria-hidden />
            {children}
            <Toaster
              position="top-center"
              containerAriaLabel="Pemberitahuan"
              toastOptions={{
                style: {
                  background: "var(--glass-thick-bg)",
                  backdropFilter: "blur(40px) saturate(200%)",
                  border: "1px solid var(--glass-border)",
                  borderRadius: "1rem",
                  color: "var(--foreground)",
                  fontFamily: "var(--font-sans)",
                  boxShadow: "0 24px 48px -16px rgba(13, 148, 136, 0.25)",
                },
                className: "glass-thick",
              }}
            />
            <PWARegister />
          </LenisProvider>
        </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
