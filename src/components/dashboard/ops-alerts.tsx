import Link from "next/link";
import { AlertTriangle, Inbox } from "lucide-react";
import {
  getSiteSetting,
  listContents,
  listSubmissions,
} from "@/lib/data/provider";
import { getSite } from "@/lib/site/get-site";
import { kalenderMendatang, nowMs } from "@/lib/site/kalender";

type Alert = { text: string; href: string; tone: "warn" | "info" };

const DAY = 24 * 60 * 60 * 1000;

/**
 * Pengingat untuk admin: sinkron otomatis gagal, isian formulir yang belum
 * dibalas, berita yang lama tidak diperbarui, dan kalender yang kosong.
 */
export async function OpsAlerts() {
  const [skripsi, ig, akademik, baru, published, site] = await Promise.all([
    getSiteSetting("skripsi_sync").catch(() => null) as Promise<{
      sources?: { label: string; error?: string }[];
    } | null>,
    getSiteSetting("instagram_sync").catch(() => null) as Promise<{
      error?: string;
    } | null>,
    getSiteSetting("akademik_sync").catch(() => null) as Promise<{
      errors?: number;
    } | null>,
    listSubmissions({ status: "baru", limit: 1000 }).catch(() => []),
    listContents({ status: "published" }).catch(() => []),
    getSite(),
  ]);
  const now = nowMs();
  const alerts: Alert[] = [];
  // Pengaturan Vercel yang belum diisi: fitur terkait diam-diam tidak jalan.
  const env = (k: string) => Boolean(process.env[k]?.trim());
  if (process.env.VERCEL) {
    if (!env("BLOB_READ_WRITE_TOKEN"))
      alerts.push({ text: "Penyimpanan foto (Vercel Blob) belum tersambung: unggah foto di Media dan Instagram akan gagal.", href: "/media", tone: "warn" });
    if (!env("CRON_SECRET"))
      alerts.push({ text: "CRON_SECRET belum diisi di Vercel: sinkron skripsi, Instagram, kalender, dan cadangan otomatis tidak berjalan.", href: "/settings/skripsi", tone: "warn" });
    if (!env("CMS_LOGIN_PASSWORD"))
      alerts.push({ text: "CMS_LOGIN_PASSWORD belum diisi di Vercel: login email dimatikan, hanya login Google yang bisa dipakai.", href: "/settings/members", tone: "warn" });
  }
  const lastSync = (skripsi as { at?: string } | null)?.at;
  if (lastSync && now - new Date(lastSync).getTime() > 3 * DAY)
    alerts.push({
      text: `Direktori skripsi terakhir sinkron ${Math.floor((now - new Date(lastSync).getTime()) / DAY)} hari lalu.`,
      href: "/settings/skripsi",
      tone: "warn",
    });
  for (const s of skripsi?.sources ?? [])
    if (s.error)
      alerts.push({
        text: `Sinkron skripsi (${s.label}) bermasalah: ${s.error}`,
        href: "/settings/skripsi",
        tone: "warn",
      });
  if (ig?.error)
    alerts.push({
      text: `Impor Instagram gagal: ${ig.error}`,
      href: "/content/instagram",
      tone: "warn",
    });
  if (akademik?.errors)
    alerts.push({
      text: `${akademik.errors} halaman e-Knows gagal dibaca saat sinkron terakhir.`,
      href: "/settings/website",
      tone: "warn",
    });
  const lama = baru.filter(
    (b) => now - new Date(b.createdAt).getTime() > 3 * DAY,
  ).length;
  if (lama)
    alerts.push({
      text: `${lama} isian formulir belum dibalas lebih dari 3 hari.`,
      href: "/settings/formulir",
      tone: "warn",
    });
  if (baru.length > lama)
    alerts.push({
      text: `${baru.length - lama} isian formulir baru menunggu ditindaklanjuti.`,
      href: "/settings/formulir",
      tone: "info",
    });
  const terakhir = published
    .map((c) => new Date(c.publishedAt ?? c.updatedAt).getTime())
    .sort((a, b) => b - a)[0];
  if (terakhir && now - terakhir > 14 * DAY)
    alerts.push({
      text: `Belum ada berita baru selama ${Math.floor((now - terakhir) / DAY)} hari.`,
      href: "/content/new",
      tone: "info",
    });
  if (!kalenderMendatang(site.kalender, 1).length)
    alerts.push({
      text: "Kalender akademik belum berisi jadwal mendatang.",
      href: "/settings/website?bagian=akademik",
      tone: "info",
    });
  if (!alerts.length) return null;
  // Satu kotak "Perlu perhatian", bukan banner bertumpuk; yang mendesak di atas.
  alerts.sort((x, y) => (x.tone === y.tone ? 0 : x.tone === "warn" ? -1 : 1));
  return (
    <section
      aria-label="Perlu perhatian"
      className="mt-6 rounded-2xl border border-amber-500/30 bg-amber-500/[0.06] p-4 sm:p-5"
    >
      <h2 className="flex items-center gap-2 text-[15px] font-bold text-foreground">
        <AlertTriangle className="size-4 text-amber-600" /> Perlu perhatian
        <span className="rounded-full bg-amber-500/15 px-2 text-[13px] tabular-nums">{alerts.length}</span>
      </h2>
      <ul className="mt-2 divide-y divide-amber-500/15">
        {alerts.map((a) => (
          <li key={a.text}>
            <Link
              href={a.href}
              className="flex min-h-11 items-center gap-3 py-2 text-[14px] hover:text-accent"
            >
              {a.tone === "warn" ? (
                <AlertTriangle className="size-4 shrink-0 text-amber-600" />
              ) : (
                <Inbox className="size-4 shrink-0 text-blue-600" />
              )}
              <span className="min-w-0 flex-1 truncate">{a.text}</span>
              <span className="shrink-0 text-[13px] font-semibold text-accent">Buka</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
