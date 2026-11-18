import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { GrowBar } from "./grow-bar";

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

/**
 * Topik skripsi terbanyak: satu batang per topik dengan jumlah judulnya, langsung
 * menuju pencarian. Contoh judul dan kata kunci ada di halaman Pojok Skripsi.
 */
export function SkripsiTrendExplorer() {
  const max = Math.max(...TOPIC_GROUPS.map((g) => g.count));
  const total = TOPIC_GROUPS.reduce((n, g) => n + g.count, 0);
  return (
    <section className="border-t border-hairline/80 px-4 py-12 sm:px-6 sm:py-24">
      <div className="mx-auto grid max-w-[1160px] gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] lg:items-center">
        <div>
          <h2 className="text-[clamp(1.75rem,1.3rem+1.8vw,2.5rem)] font-extrabold leading-[1.1] tracking-[-0.03em] text-label text-balance">
            Topik skripsi terbanyak
          </h2>
          <p className="mt-3 text-[16px] leading-[1.5] text-label-2 sm:text-[18px]">
            {total}+ judul di Digilib UIN SGD, dikelompokkan per topik.
          </p>
          <Link
            href="/prodi/skripsi"
            className="mt-7 inline-flex h-12 items-center gap-2 rounded-full bg-accent px-6 text-[16px] font-semibold text-white transition-colors hover:bg-accent-strong"
          >
            Cari skripsi <ArrowRight className="size-4" />
          </Link>
        </div>
        <ul className="grid grid-cols-1 gap-2">
          {TOPIC_GROUPS.map((g, i) => (
            <li key={g.id}>
              <Link
                href={`/prodi/skripsi?q=${encodeURIComponent(g.keywords[0])}`}
                className="group grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-4 gap-y-2 rounded-2xl px-4 py-3 transition-colors hover:bg-mist"
              >
                <span className="text-[16px] font-semibold text-label group-hover:text-accent">
                  {g.title}
                </span>
                <span className="text-[16px] font-bold tabular-nums text-label">{g.count}</span>
                <span className="col-span-2 block h-2 overflow-hidden rounded-full bg-mist group-hover:bg-canvas">
                  <GrowBar pct={(g.count / max) * 100} delay={i * 90} />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
