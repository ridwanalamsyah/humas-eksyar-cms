"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

type TopicGroup = {
  id: string;
  title: string;
  count: number;
  description: string;
  keywords: string[];
  sampleTitles: string[];
};

const TOPIC_GROUPS: TopicGroup[] = [
  {
    id: "perbankan",
    title: "Perbankan Syariah",
    count: 184,
    description: "Analisis produk mudharabah, murabahah, mitigasi risiko pembiayaan (NPF), efisiensi BOPO, dan merger BSI.",
    keywords: ["BSI", "Pembiayaan Murabahah", "NPF", "Bank Syariah", "BPRS"],
    sampleTitles: [
      "Pengaruh Tingkat Bagi Hasil dan Non-Performing Financing terhadap Volume Pembiayaan Mudharabah",
      "Analisis Efisiensi Biaya Operasional terhadap Pendapatan Operasional Pasca Merger BSI",
      "Implementasi Akad Musyarakah Mutanaqisah pada Pembiayaan Kepemilikan Rumah",
    ],
  },
  {
    id: "pasarmodal",
    title: "Pasar Modal & Investasi",
    count: 112,
    description: "Kinerja saham syariah (ISSI/JII), penerbitan Green Sukuk, reksadana syariah, dan literasi investasi generasi Z.",
    keywords: ["Saham Syariah", "Sukuk", "ISSI", "JII", "Reksadana"],
    sampleTitles: [
      "Analisis Volatilitas Indeks Saham Syariah Indonesia (ISSI) terhadap Fluktuasi Makroekonomi",
      "Peran Green Sukuk dalam Pembiayaan Pembangunan Infrastruktur Berkelanjutan di Indonesia",
      "Faktor Penentu Minat Mahasiswa Berinvestasi pada Galeri Investasi Syariah",
    ],
  },
  {
    id: "ziswaf",
    title: "Filantropi & ZISWAF",
    count: 98,
    description: "Efektivitas pendayagunaan dana zakat, infaq, shadaqah, dan tata kelola wakaf produktif untuk pengentasan kemiskinan.",
    keywords: ["BAZNAS", "Wakaf Produktif", "LAZ", "Pemberdayaan Ummat", "Zakat"],
    sampleTitles: [
      "Efektivitas Penyaluran Zakat Produktif BAZNAS terhadap Peningkatan Pendapatan Mustahik",
      "Model Tata Kelola Wakaf Uang Berkelanjutan Berbasis Digital di Wilayah Bandung Raya",
      "Transparansi dan Akuntabilitas Pelaporan Keuangan pada Lembaga Amil Zakat",
    ],
  },
  {
    id: "fintech",
    title: "Fintech & Ekonomi Digital",
    count: 73,
    description: "Kesesuaian syariah pada paylater, P2P lending syariah, transaksi QRIS muamalah, dan payment gateway digital.",
    keywords: ["Fintech Syariah", "P2P Lending", "QRIS", "Paylater Syariah", "E-Wallet"],
    sampleTitles: [
      "Tinjauan Fatwa DSN-MUI terhadap Penggunaan Fitur Paylater pada Aplikasi Marketplace",
      "Analisis Minat Penggunaan Peer-to-Peer Lending Syariah pada UMKM Binaan",
      "Dampak Digitalisasi Transaksi QRIS terhadap Omzet Pedagang Berdasarkan Prinsip Muamalah",
    ],
  },
  {
    id: "halal",
    title: "Industri & Bisnis Halal",
    count: 48,
    description: "Rantai pasok halal (Halal Supply Chain), kesadaran sertifikasi halal UMKM, dan pariwisata ramah muslim.",
    keywords: ["Sertifikasi Halal", "Halal Value Chain", "Wisata Halal", "UMKM", "SJPH"],
    sampleTitles: [
      "Pengaruh Kesadaran Sertifikasi Halal terhadap Keputusan Pembelian Produk Kuliner UMKM",
      "Strategi Pengembangan Destinasi Pariwisata Ramah Muslim di Wilayah Jawa Barat",
      "Analisis Kesiapan Pelaku Usaha Mikro dalam Memenuhi Standar Sistem Jaminan Produk Halal",
    ],
  },
];

export function SkripsiTrendExplorer() {
  const [selectedId, setSelectedId] = useState(TOPIC_GROUPS[0].id);

  const activeGroup = TOPIC_GROUPS.find((g) => g.id === selectedId) ?? TOPIC_GROUPS[0];

  return (
    <section className="border-t border-hairline/80 px-4 py-10 sm:py-20">
      <div className="mx-auto max-w-[1040px]">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 sm:gap-4">
          <div>
            <p className="text-[11px] sm:text-[12px] font-bold uppercase tracking-[0.14em] text-accent dark:text-sand">
              Peta Riset Mahasiswa
            </p>
            <h2 className="mt-1 text-[20px] sm:text-[28px] font-extrabold tracking-tight text-label">
              Eksplorasi Tren &amp; Topik Skripsi Eksyar
            </h2>
            <p className="mt-1 max-w-2xl text-[13.5px] sm:text-[15px] leading-relaxed text-label-2">
              Klasifikasi bidang kajian dari 515+ judul skripsi terindeks di Digilib UIN SGD untuk menelusuri referensi penelitian terdahulu.
            </p>
          </div>
          <Link
            href="/prodi/skripsi"
            className="inline-flex items-center gap-1.5 self-start sm:self-auto rounded-xl border border-hairline bg-white px-3.5 py-2 text-[13px] sm:text-[13.5px] font-semibold text-accent transition-colors hover:border-accent hover:bg-mist dark:border-white/20 dark:bg-white/10 dark:text-white"
          >
            Buka Katalog 515+ Skripsi ›
          </Link>
        </div>

        {/* Tab Kelompok Topik */}
        <div className="mt-5 sm:mt-7 flex gap-2 overflow-x-auto pb-1 sm:flex-wrap no-scrollbar">
          {TOPIC_GROUPS.map((group) => {
            const isCurrent = group.id === selectedId;
            return (
              <button
                key={group.id}
                type="button"
                onClick={() => setSelectedId(group.id)}
                className={cn(
                  "flex shrink-0 items-center gap-2 rounded-xl border px-3.5 py-2 text-[13px] sm:text-[13.5px] font-semibold transition-all",
                  isCurrent
                    ? "border-accent bg-accent text-white dark:border-[#5eae9e] dark:bg-[#5eae9e] dark:text-[#0b171c]"
                    : "border-hairline bg-mist/60 text-label-2 hover:border-accent/40 hover:bg-mist dark:border-white/15 dark:bg-white/5 dark:text-white/70",
                )}
              >
                <span>{group.title}</span>
                <span
                  className={cn(
                    "rounded-md px-1.5 py-0.5 text-[11px] font-bold tabular-nums",
                    isCurrent
                      ? "bg-white/20 text-white dark:bg-black/20 dark:text-[#0b171c]"
                      : "bg-black/5 text-label-3 dark:bg-white/10 dark:text-white/60",
                  )}
                >
                  {group.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Panel Detail Topik Aktif (Tanpa Ikon AI) */}
        <div className="mt-5 rounded-2xl border border-hairline bg-canvas p-5 sm:p-7 lg:p-8 dark:border-white/15 dark:bg-[#122228]/90">
          <div className="grid gap-6 sm:gap-8 lg:grid-cols-[1fr_1.3fr]">
            <div>
              <p className="text-[12px] font-semibold text-accent dark:text-sand">
                {activeGroup.count} Judul Skripsi Terindeks
              </p>
              <h3 className="mt-1 text-[18px] sm:text-[21px] font-bold text-label">
                {activeGroup.title}
              </h3>

              <p className="mt-2.5 text-[13.5px] sm:text-[14.5px] leading-relaxed text-label-2">
                {activeGroup.description}
              </p>

              <div className="mt-4">
                <p className="text-[11px] font-bold uppercase tracking-wider text-label-3 dark:text-white/50">
                  Kata Kunci
                </p>
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  {activeGroup.keywords.map((kw) => (
                    <Link
                      key={kw}
                      href={`/prodi/skripsi?q=${encodeURIComponent(kw)}`}
                      className="rounded-lg border border-hairline bg-mist/60 px-2.5 py-1 text-[11.5px] sm:text-[12px] font-medium text-label-2 transition-colors hover:border-accent hover:text-accent dark:border-white/15 dark:bg-white/5 dark:text-white/80"
                    >
                      {kw}
                    </Link>
                  ))}
                </div>
              </div>

              <div className="mt-5">
                <Link
                  href={`/prodi/skripsi?q=${encodeURIComponent(activeGroup.keywords[0])}`}
                  className="inline-flex items-center gap-2 rounded-xl bg-accent px-4 py-2 sm:px-5 sm:py-2.5 text-[13px] sm:text-[13.5px] font-semibold text-white transition-colors hover:bg-accent-strong"
                >
                  Telusuri Skripsi Topik Ini
                  <ArrowRight className="size-3.5 sm:size-4" />
                </Link>
              </div>
            </div>

            {/* Contoh Judul Riil */}
            <div className="rounded-xl border border-hairline/80 bg-[#FAF9F5] p-5 sm:p-6 dark:border-white/10 dark:bg-white/5">
              <div className="pb-2.5 border-b border-hairline/60 dark:border-white/10">
                <span className="text-[11.5px] font-bold uppercase tracking-wider text-label-3 dark:text-white/50">
                  Contoh Judul Skripsi
                </span>
              </div>

              <ul className="mt-2.5 divide-y divide-hairline/60 dark:divide-white/10">
                {activeGroup.sampleTitles.map((title, i) => (
                  <li key={i} className={cn("py-2.5 sm:py-3 first:pt-0 last:pb-0", i > 0 && "hidden sm:block")}>
                    <Link
                      href={`/prodi/skripsi?q=${encodeURIComponent(title.split(" ").slice(0, 3).join(" "))}`}
                      className="group flex items-start gap-2.5 text-[13px] sm:text-[13.5px] font-medium leading-snug text-label transition-colors hover:text-accent dark:hover:text-sand"
                    >
                      <span className="mt-0.5 font-mono text-xs text-label-3">0{i + 1}</span>
                      <span className="group-hover:underline">{title}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
