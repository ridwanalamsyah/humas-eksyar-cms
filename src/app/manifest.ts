import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Eksyar — Program Studi Ekonomi Syariah UIN SGD",
    short_name: "Eksyar",
    description:
      "Website resmi Program Studi Ekonomi Syariah FEBI UIN Sunan Gunung Djati Bandung.",
    start_url: "/prodi",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#f7f8f6",
    theme_color: "#165b4c",
    categories: ["education", "productivity"],
    lang: "id",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
    shortcuts: [
      {
        name: "Artikel & Berita",
        short_name: "Artikel",
        description: "Baca artikel dan kabar terbaru",
        url: "/prodi/berita",
        icons: [{ src: "/prodi/icon-eksyar.png", sizes: "192x192" }],
      },
      {
        name: "Direktori Skripsi",
        short_name: "Skripsi",
        description: "Telusuri judul skripsi Digilib",
        url: "/prodi/skripsi",
        icons: [{ src: "/prodi/icon-eksyar.png", sizes: "192x192" }],
      },
      {
        name: "Panel Humas Eksyar",
        short_name: "Humas",
        description: "Kelola website & publikasi",
        url: "/dashboard",
        icons: [{ src: "/prodi/icon-eksyar.png", sizes: "192x192" }],
      },
    ],
  };
}
