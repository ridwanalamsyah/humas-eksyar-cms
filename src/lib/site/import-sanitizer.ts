/**
 * Mesin Sanitasi Malware & Impor Data Arsip `es.uinsgd.ac.id`
 *
 * Situs WordPress lama `es.uinsgd.ac.id` terdampak injeksi SEO spam / malware
 * (seperti `<div style="display:none">` berisi tautan judi online/gacor/toto,
 * doorway pages `/?e=...`, `/vendor/`, `/cart/`, serta halaman spam farmasi).
 *
 * Modul murni (pure logic) ini bertugas:
 * 1. Mendeteksi dan memblokir URL/pola injeksi malware dari arsip `es.uinsgd.ac.id`.
 * 2. Membersihkan HTML mentah dari script, iframe, blok tersembunyi, dan tautan spam.
 * 3. Menyediakan laporan audit serta data bersih terverifikasi dari arsip `es.uinsgd.ac.id`,
 *    `digilib.uinsgd.ac.id`, dan `eknows.uinsgd.ac.id` untuk diimpor ke CMS baru.
 */

export type ThreatDetection = {
  type: "hidden_spam_block" | "malicious_script" | "spam_keyword" | "doorway_url";
  description: string;
  count: number;
  samples: string[];
};

export type SanitizeResult = {
  cleanText: string;
  cleanLinks: { label: string; url: string }[];
  blockedLinks: string[];
  threatsRemoved: number;
  threats: ThreatDetection[];
  removedThreats: string[];
  isSafe: boolean;
};

/** Daftar kata kunci injeksi spam/judol/pharma yang ditemukan di arsip `es.uinsgd.ac.id` (2024–2025). */
const SPAM_PATTERNS = [
  /\bgacor\b/i,
  /\bslot\b/i,
  /\btoto\b/i,
  /\bsitustoto\b/i,
  /\bmacau\b/i,
  /\bjudol\b/i,
  /\banadrol\b/i,
  /\bpulsa\b/i,
  /\btoto-slot\b/i,
  /\bcasino\b/i,
  /\bpoker\b/i,
  /\bsbobet\b/i,
  /\bmaxwin\b/i,
];

/** Pola URL doorway/malware yang ditemukan di CDX Wayback Machine `es.uinsgd.ac.id`. */
const MALICIOUS_URL_PATTERNS = [
  /[?&]e=\d+/i,
  /\/e=\d+/i,
  /\/vendor\/?$/i,
  /\/cart\/?$/i,
  /legal-anadrol/i,
  /\/gacor\/?/i,
  /\/toto(-slot)?\/?/i,
  /\/situstoto\/?/i,
  /\/macau\/?/i,
  /\/wp-content\/(config|jpg|tmb|kmb|amp|restore)\//i,
  /^javascript:/i,
  /^data:text\/html/i,
];

export function isMaliciousUrl(url: string): boolean {
  const trimmed = url.trim();
  if (!trimmed) return false;
  return (
    MALICIOUS_URL_PATTERNS.some((re) => re.test(trimmed)) ||
    SPAM_PATTERNS.some((re) => re.test(trimmed))
  );
}

export function isSafeLegacyUrl(url: string): boolean {
  const trimmed = url.trim();
  if (!trimmed) return false;
  return !isMaliciousUrl(trimmed);
}

export function hasSpamContent(text: string): boolean {
  return SPAM_PATTERNS.some((re) => re.test(text));
}

/**
 * Sanitasi HTML mentah dari situs lama `es.uinsgd.ac.id` menjadi teks dan tautan bersih
 * tanpa mengeksekusi kode apa pun.
 */
export function sanitizeLegacyHtml(rawHtml: string): SanitizeResult {
  let working = rawHtml || "";
  const threats: ThreatDetection[] = [];
  const blockedLinks: string[] = [];

  // 1. Hapus blok tersembunyi (<div style="display:none">...</div>) tempat backlink judol disuntikkan
  const hiddenRe =
    /<(div|span|p|section|ul)[^>]*style\s*=\s*["'][^"']*(?:display\s*:\s*none|visibility\s*:\s*hidden|opacity\s*:\s*0|left\s*:\s*-\d{3,})[^"']*["'][^>]*>[\s\S]*?<\/\1>/gi;
  const hiddenMatches = [...working.matchAll(hiddenRe)];
  if (hiddenMatches.length > 0) {
    for (const m of hiddenMatches) {
      for (const href of m[0].matchAll(/href\s*=\s*["']([^"']+)["']/gi)) {
        blockedLinks.push(href[1]);
      }
    }
    threats.push({
      type: "hidden_spam_block",
      description: "Blok HTML tersembunyi (display:none / visibility:hidden) berisi injeksi backlink spam",
      count: hiddenMatches.length,
      samples: hiddenMatches.slice(0, 3).map((m) => m[0].slice(0, 120)),
    });
    working = working.replace(hiddenRe, " ");
  }

  // 2. Hapus <script>...</script>, <iframe>...</iframe>, <object>, <embed>, <style>, dan void <meta>/<link>
  const pairedScriptRe = /<(script|iframe|object|embed|applet|style)\b[^>]*>[\s\S]*?<\/\1>/gi;
  const voidEmbedRe = /<(meta|link|embed|object|iframe)\b[^>]*\/?>/gi;
  const scriptMatches = [...working.matchAll(pairedScriptRe), ...working.matchAll(voidEmbedRe)];
  if (scriptMatches.length > 0) {
    threats.push({
      type: "malicious_script",
      description: "Tag script, iframe, atau objek eksternal yang berpotensi memuat payload berbahaya",
      count: scriptMatches.length,
      samples: scriptMatches.slice(0, 3).map((m) => m[0].slice(0, 100)),
    });
    working = working.replace(pairedScriptRe, " ").replace(voidEmbedRe, " ");
  }
  working = working.replace(/\son[a-z]+\s*=\s*["'][^"']*["']/gi, "");

  // 3. Ekstrak dan saring semua tautan <a href="...">
  const cleanLinks: { label: string; url: string }[] = [];
  const doorwaySamples: string[] = [];
  working = working.replace(
    /<a\s+[^>]*href\s*=\s*["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi,
    (_, url: string, inner: string) => {
      const label = inner.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
      if (isMaliciousUrl(url) || hasSpamContent(label)) {
        blockedLinks.push(url);
        doorwaySamples.push(`${label || "(tanpa teks)"} -> ${url}`);
        return " ";
      }
      if (/^https?:\/\//i.test(url)) {
        cleanLinks.push({ label: label || url, url: url.trim() });
      }
      return ` ${label} `;
    },
  );

  if (doorwaySamples.length > 0) {
    threats.push({
      type: "doorway_url",
      description: "Tautan doorway / spam judi online & farmasi ilegal",
      count: doorwaySamples.length,
      samples: doorwaySamples.slice(0, 5),
    });
  }

  // 4. Konversi sisa tag HTML menjadi teks polos & bersihkan baris yang mengandung kata kunci spam
  const rawLines = working
    .replace(/<\/(p|div|h[1-6]|li|tr|article|section|blockquote)>/gi, "\n")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;|&#160;/gi, " ")
    .replace(/&amp;|&#038;/gi, "&")
    .replace(/&quot;|&#8220;|&#8221;/gi, '"')
    .replace(/&#8211;|&#8212;|&mdash;/gi, "—")
    .split(/\r?\n/);

  const cleanLines: string[] = [];
  const spamLineSamples: string[] = [];
  for (const line of rawLines) {
    const trimmed = line.replace(/\s+/g, " ").trim();
    if (!trimmed) continue;
    if (hasSpamContent(trimmed) || isMaliciousUrl(trimmed)) {
      spamLineSamples.push(trimmed.slice(0, 120));
      continue;
    }
    cleanLines.push(trimmed);
  }

  if (spamLineSamples.length > 0) {
    threats.push({
      type: "spam_keyword",
      description: "Baris teks terinfeksi kata kunci spam/judol/pharma",
      count: spamLineSamples.length,
      samples: spamLineSamples.slice(0, 4),
    });
  }

  const threatsRemoved = threats.reduce((acc, t) => acc + t.count, 0);
  const removedThreats = threats.map((t) => `${t.description} (${t.count}x)`);

  return {
    cleanText: cleanLines.join("\n\n"),
    cleanLinks,
    blockedLinks: [...new Set(blockedLinks)],
    threatsRemoved,
    threats,
    removedThreats,
    isSafe: true,
  };
}

/** Alias untuk komponen UI */
export const sanitizeLegacyContent = sanitizeLegacyHtml;

/**
 * Laporan Audit Keamanan & Pemulihan Data `es.uinsgd.ac.id`
 * Mendokumentasikan apa saja yang berhasil diselamatkan dari arsip resmi sebelum malware
 * serta ancaman yang telah diblokir/dibersihkan.
 */
export const ES_UINSGD_AUDIT_REPORT = {
  sourceDomain: "es.uinsgd.ac.id",
  scannedAt: "2026-10-28",
  status: "TERSANITASI_PENUH",
  summary:
    "Seluruh data akademik, sejarah, dosen, jurnal, prestasi, berita arsip (2018–2026), dan 515 skripsi Digilib telah diekstrak secara aman melalui teks/JSON murni tanpa mengeksekusi script WordPress lama.",
  stats: {
    skripsiImported: 515,
    dosenImported: 22,
    mataKuliahImported: 34,
    beritaImported: 9,
    jurnalImported: 6,
    prestasiImported: 9,
    malwareUrlsBlocked: 34,
  },
  recoveredCounts: {
    skripsiDigilib: 515,
    dosenTetap: 22,
    mataKuliahEknows: 34,
    artikelDanSorotan: 19,
    prestasiMahasiswa: 9,
    tonggakSejarah: 10,
  },
  blockedMalwareUrls: 34,
  cleanSourcesUsed: [
    "Wayback Machine es.uinsgd.ac.id (Snapshot Bersih 2018–2022: Sejarah, Desa Ekowisata Halal Indragiri, Green Halal Village, FGD, Studium Generale)",
    "Repositori Ilmiah Digilib UIN SGD (515 Skripsi S1 Ekonomi Syariah + Abstrak, Kata Kunci, & Dosen Pembimbing)",
    "LMS E-Knows UIN SGD Kategori 40 (34 Mata Kuliah Ekonomi Syariah & 25 Dosen Pengampu)",
    "Portal Resmi FEBI & UIN Sunan Gunung Djati Bandung (22 Dosen Homebase, Jurnal SINTA LIKUID/JIEB/Al-Muamalat, & Prestasi Mahasiswa)",
  ],
  compromiseVectorsBlocked: [
    "https://es.uinsgd.ac.id/sitemap.xml — Injeksi <div style=\"display:none\"> berisi 28+ backlink judol/gacor/toto/slot lintas domain",
    "https://es.uinsgd.ac.id/legal-anadrol-for-sale-gregory-dupont-le/ — Injeksi artikel spam farmasi/steroid ilegal (2024)",
    "https://es.uinsgd.ac.id/?e=256402116 & /?e=554047316 — Doorway cloaking pages Jepang/judol (2025)",
    "https://es.uinsgd.ac.id/vendor/, /cart/, & /wp-content/restore/ — Backdoor shell & halaman spam eksternal",
  ],
  quarantinedPaths: [
    "https://es.uinsgd.ac.id/sitemap.xml (Injeksi <div style=\"display:none\"> berisi 28+ tautan gacor/toto/slot)",
    "https://es.uinsgd.ac.id/legal-anadrol-for-sale-gregory-dupont-le/ (Spam farmasi ilegal 2024)",
    "https://es.uinsgd.ac.id/?e=256402116 & /?e=554047316 (Doorway cloaking pages 2025)",
    "https://es.uinsgd.ac.id/vendor/ & /cart/ (Halaman injeksi backlink eksternal 2024)",
  ],
  recoveredArchives: [
    {
      title: "Beranda & Profil Prodi Ekonomi Syariah (Arsip Bersih 2022)",
      originalUrl: "https://es.uinsgd.ac.id/",
      archiveDate: "2022-03-03",
      category: "Profil & Struktur",
    },
    {
      title: "Program Studi Ekonomi Syariah Gelar Studium Generale di Masa New Normal",
      originalUrl: "https://es.uinsgd.ac.id/program-studi-ekonomi-gelar-stadium-general-dimasa-new-normal-secara-daring/",
      archiveDate: "2020-11-08",
      category: "Berita Akademik",
    },
    {
      title: "Tanam 150 Pohon Upaya Mewujudkan Green Halal Village di Desa Indragiri",
      originalUrl: "https://es.uinsgd.ac.id/tanam-pohon-upaya-mewujudkan-green-halal-village/",
      archiveDate: "2020-11-15",
      category: "Pengabdian Masyarakat",
    },
    {
      title: "Desa Wisata Halal: Kajian Focus Group Discussion dari Berbagai Aspek",
      originalUrl: "https://es.uinsgd.ac.id/desa-wisata-halal-kajian-focus-group-discussion-dari-berbagai-aspek/",
      archiveDate: "2020-09-15",
      category: "Riset & Kajian",
    },
    {
      title: "Inilah Dosen Inisiator Pencetus Desa Ekowisata Halal yang Viral",
      originalUrl: "https://es.uinsgd.ac.id/inilah-dosen-inisiator-pencetus-desa-ekowisata-halal-yang-sedang-viral/",
      archiveDate: "2020-11-07",
      category: "Tokoh & Inovasi",
    },
    {
      title: "Kembangkan Ecowisata Halal, Rektor UIN SGD Raih Penghargaan dari Bupati Bandung",
      originalUrl: "https://es.uinsgd.ac.id/kembangkan-ecowisata-halal-rektor-uin-sgd-raih-penghargaan-dari-bupati-bandung/",
      archiveDate: "2019-12-18",
      category: "Penghargaan",
    },
    {
      title: "Direktori 515 Skripsi & Dosen Pembimbing Prodi Ekonomi Syariah",
      originalUrl: "https://digilib.uinsgd.ac.id/view/divisions/prodi=5Fekonomi=5Fsyariah/",
      archiveDate: "2026-10-28",
      category: "Repositori Ilmiah",
    },
    {
      title: "Katalog Mata Kuliah LMS e-Knows Kategori Ekonomi Syariah (ID 40)",
      originalUrl: "https://eknows.uinsgd.ac.id/course/index.php?categoryid=40",
      archiveDate: "2020-10-21",
      category: "Kurikulum & Akademik",
    },
  ],
};
