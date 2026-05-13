import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Humas Eksyar — Ekosistem Organisasi",
    short_name: "Humas Eksyar",
    description:
      "Pusat ekosistem organisasi Ekonomi Syariah UIN SGD — manajemen anggota, content pipeline, AI caption generator, kegiatan, gamifikasi.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#f7f8f6",
    theme_color: "#0d9488",
    categories: ["productivity", "social", "education"],
    lang: "id",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" },
      { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
    shortcuts: [
      {
        name: "AI Caption Generator",
        short_name: "AI Caption",
        description: "Generate caption Instagram dengan AI",
        url: "/captions/playground",
        icons: [{ src: "/icon-192.png", sizes: "192x192" }],
      },
      {
        name: "Konten Baru",
        short_name: "Konten Baru",
        description: "Tulis postingan baru",
        url: "/content/new",
        icons: [{ src: "/icon-192.png", sizes: "192x192" }],
      },
      {
        name: "Kalender",
        short_name: "Kalender",
        description: "Lihat agenda dan kegiatan",
        url: "/calendar",
        icons: [{ src: "/icon-192.png", sizes: "192x192" }],
      },
    ],
  };
}
