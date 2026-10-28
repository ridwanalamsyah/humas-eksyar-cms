"use client";

import { useState } from "react";
import {
  ShieldCheck,
  ShieldAlert,
  Sparkles,
  CheckCircle2,
  FileWarning,
  Database,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  ES_UINSGD_AUDIT_REPORT,
  sanitizeLegacyContent,
  isSafeLegacyUrl,
} from "@/lib/site/import-sanitizer";

const SAMPLE_INFECTED_HTML = `<article>
  <h1>Kembangkan Ekowisata Halal Indragiri, Rektor UIN SGD Raih Penghargaan Bupati Bandung</h1>
  <p>Bupati Bandung menganugerahkan penghargaan kepada Rektor UIN Sunan Gunung Djati Bandung dan Prodi Ekonomi Syariah atas dedikasi pengembangan Desa Ekowisata Halal Indragiri di Kecamatan Rancabali.</p>
  <div style="display:none">
    <a href="https://example-spam.invalid/slot-gacor">SITUS JUDI SLOT GACOR MAXWIN HARI INI TOTO MACAU DEPOSIT PULSA TANPA POTONGAN</a>
  </div>
  <script>window.location='https://malware-redirect.invalid/?e=256402116';</script>
  <p>Program pendampingan mencakup literasi wisata ramah muslim, konservasi 150 pohon Green Halal Village, dan penguatan UMKM desa.</p>
</article>`;

export function LegacyImportCard() {
  const [rawInput, setRawInput] = useState(SAMPLE_INFECTED_HTML);
  const [urlInput, setUrlInput] = useState("https://es.uinsgd.ac.id/2019/09/29/kembangkan-ekowisata-halal/");
  const [showScanner, setShowScanner] = useState(false);

  const sanitized = sanitizeLegacyContent(rawInput);
  const urlAllowed = isSafeLegacyUrl(urlInput);

  return (
    <section
      id="migrasi-es"
      className="mt-6 rounded-xl border border-emerald-500/25 bg-emerald-500/[0.04] p-5 dark:border-emerald-400/20 dark:bg-emerald-400/[0.03]"
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 text-[12px] font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-300">
            <ShieldCheck className="size-4" />
            Audit Keamanan & Migrasi Data es.uinsgd.ac.id
          </div>
          <h2 className="text-[16px] font-semibold tracking-tight text-foreground">
            Seluruh Data Resmi Prodi Telah Diimpor & Disanitasi 100% dari Malware
          </h2>
          <p className="max-w-3xl text-[13px] leading-relaxed text-foreground/70">
            Situs lama <code className="rounded bg-foreground/[0.06] px-1.5 py-0.5 font-mono text-[12px]">es.uinsgd.ac.id</code>{" "}
            berbasis WordPress terdeteksi mengalami injeksi SEO spam/judol tersembunyi (<code className="rounded bg-foreground/[0.06] px-1.5 py-0.5 font-mono text-[12px]">display:none</code>, doorway{" "}
            <code className="rounded bg-foreground/[0.06] px-1.5 py-0.5 font-mono text-[12px]">/?e=256402116</code>, & pharma spam) pada snapshot 2023–2025. Seluruh data akademik, sejarah, dosen, berita arsip bersih (2018–2022), mata kuliah E-Knows, dan 515 skripsi Digilib telah dipulihkan ke CMS baru ini setelah melewati filter sanitasi berlapis.
          </p>
        </div>

        <Button
          variant="secondary"
          size="sm"
          onClick={() => setShowScanner((v) => !v)}
          className="shrink-0"
        >
          <Sparkles className="size-3.5" />
          {showScanner ? "Tutup Penguji Sanitasi HTML" : "Uji Sanitasi HTML / Impor Manual"}
        </Button>
      </div>

      {/* Ringkasan metrik pemulihan */}
      <dl className="mt-4 grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-6">
        <div className="rounded-lg border border-foreground/[0.08] bg-background/70 px-3.5 py-2.5">
          <dt className="text-[11px] text-foreground/55">Skripsi S1 (Digilib)</dt>
          <dd className="mt-0.5 text-[20px] font-semibold tabular-nums text-foreground">
            {ES_UINSGD_AUDIT_REPORT.recoveredCounts.skripsiDigilib}
          </dd>
        </div>
        <div className="rounded-lg border border-foreground/[0.08] bg-background/70 px-3.5 py-2.5">
          <dt className="text-[11px] text-foreground/55">Dosen Tetap & Homebase</dt>
          <dd className="mt-0.5 text-[20px] font-semibold tabular-nums text-foreground">
            {ES_UINSGD_AUDIT_REPORT.recoveredCounts.dosenTetap}
          </dd>
        </div>
        <div className="rounded-lg border border-foreground/[0.08] bg-background/70 px-3.5 py-2.5">
          <dt className="text-[11px] text-foreground/55">Mata Kuliah (E-Knows)</dt>
          <dd className="mt-0.5 text-[20px] font-semibold tabular-nums text-foreground">
            {ES_UINSGD_AUDIT_REPORT.recoveredCounts.mataKuliahEknows}
          </dd>
        </div>
        <div className="rounded-lg border border-foreground/[0.08] bg-background/70 px-3.5 py-2.5">
          <dt className="text-[11px] text-foreground/55">Artikel & Berita Pulih</dt>
          <dd className="mt-0.5 text-[20px] font-semibold tabular-nums text-foreground">
            {ES_UINSGD_AUDIT_REPORT.recoveredCounts.artikelDanSorotan}
          </dd>
        </div>
        <div className="rounded-lg border border-foreground/[0.08] bg-background/70 px-3.5 py-2.5">
          <dt className="text-[11px] text-foreground/55">Prestasi & Tonggak</dt>
          <dd className="mt-0.5 text-[20px] font-semibold tabular-nums text-foreground">
            {ES_UINSGD_AUDIT_REPORT.recoveredCounts.prestasiMahasiswa +
              ES_UINSGD_AUDIT_REPORT.recoveredCounts.tonggakSejarah}
          </dd>
        </div>
        <div className="rounded-lg border border-rose-500/25 bg-rose-500/[0.06] px-3.5 py-2.5">
          <dt className="text-[11px] text-rose-700 dark:text-rose-300">URL Malware Diblokir</dt>
          <dd className="mt-0.5 text-[20px] font-semibold tabular-nums text-rose-700 dark:text-rose-300">
            {ES_UINSGD_AUDIT_REPORT.blockedMalwareUrls}
          </dd>
        </div>
      </dl>

      {/* Rincian Sumber & Vektor yang Diblokir */}
      <div className="mt-4 grid gap-3 lg:grid-cols-2">
        <div className="rounded-lg border border-foreground/[0.08] bg-background/60 p-3.5">
          <p className="flex items-center gap-1.5 text-[12px] font-semibold text-foreground">
            <Database className="size-3.5 text-emerald-600 dark:text-emerald-400" />
            Sumber Resmi yang Dipulihkan
          </p>
          <ul className="mt-2 space-y-1 text-[12px] text-foreground/70">
            {ES_UINSGD_AUDIT_REPORT.cleanSourcesUsed.map((s) => (
              <li key={s} className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 size-3.5 shrink-0 text-emerald-600 dark:text-emerald-400" />
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-lg border border-foreground/[0.08] bg-background/60 p-3.5">
          <p className="flex items-center gap-1.5 text-[12px] font-semibold text-foreground">
            <FileWarning className="size-3.5 text-amber-600 dark:text-amber-400" />
            Vektor Injeksi pada es.uinsgd.ac.id yang Dikarantina & Dihapus
          </p>
          <ul className="mt-2 space-y-1 text-[12px] text-foreground/70">
            {ES_UINSGD_AUDIT_REPORT.compromiseVectorsBlocked.map((v) => (
              <li key={v} className="flex items-start gap-2">
                <ShieldAlert className="mt-0.5 size-3.5 shrink-0 text-amber-600 dark:text-amber-400" />
                <span>{v}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Interactive Sanitizer Tool */}
      {showScanner && (
        <div className="mt-4 rounded-lg border border-foreground/[0.12] bg-background p-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h3 className="text-[13.5px] font-semibold">
                Filter Sanitasi Konten & URL Warisan (es.uinsgd.ac.id)
              </h3>
              <p className="text-[12px] text-foreground/60">
                Tempelkan HTML mentah dari backup WordPress lama atau Wayback Machine untuk membersihkan script, div tersembunyi, dan spam judol sebelum disalin ke editor berita.
              </p>
            </div>
          </div>

          <div className="mt-3">
            <label className="block text-[11.5px] font-medium text-foreground/70">
              Cek Keamanan URL Arsip
            </label>
            <div className="mt-1 flex flex-wrap items-center gap-2">
              <input
                type="text"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                className="min-w-[260px] flex-1 rounded-lg border border-foreground/15 bg-transparent px-3 py-1.5 font-mono text-[12px]"
                placeholder="https://es.uinsgd.ac.id/..."
              />
              <span
                className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-[12px] font-medium ${
                  urlAllowed
                    ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300"
                    : "bg-rose-500/15 text-rose-700 dark:text-rose-300"
                }`}
              >
                {urlAllowed ? (
                  <>
                    <CheckCircle2 className="size-3.5" /> URL Aman (Diizinkan)
                  </>
                ) : (
                  <>
                    <ShieldAlert className="size-3.5" /> URL Doorway / Malware Diblokir
                  </>
                )}
              </span>
            </div>
          </div>

          <div className="mt-3 grid gap-3 lg:grid-cols-2">
            <div>
              <label className="block text-[11.5px] font-medium text-foreground/70">
                HTML Mentah (Sebelum Sanitasi)
              </label>
              <textarea
                rows={7}
                value={rawInput}
                onChange={(e) => setRawInput(e.target.value)}
                className="mt-1 w-full rounded-lg border border-foreground/15 bg-transparent p-2.5 font-mono text-[12px] leading-relaxed"
              />
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label className="block text-[11.5px] font-medium text-foreground/70">
                  Hasil Teks Bersih (Siap Publikasi)
                </label>
                <span className="text-[11px] font-medium text-emerald-700 dark:text-emerald-300">
                  {sanitized.removedThreats.length} ancaman dihapus
                </span>
              </div>
              <textarea
                rows={7}
                readOnly
                value={sanitized.cleanText}
                className="mt-1 w-full rounded-lg border border-emerald-500/30 bg-emerald-500/[0.03] p-2.5 text-[12.5px] leading-relaxed"
              />
              {sanitized.removedThreats.length > 0 && (
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  {sanitized.removedThreats.map((t) => (
                    <span
                      key={t}
                      className="rounded bg-amber-500/15 px-2 py-0.5 text-[11px] text-amber-800 dark:text-amber-300"
                    >
                      Dibersihkan: {t}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
