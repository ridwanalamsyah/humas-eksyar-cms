import Link from "next/link";
import { AlertTriangle, Inbox } from "lucide-react";
import { getSiteSetting, listSubmissions } from "@/lib/data/provider";

type Alert = { text: string; href: string; tone: "warn" | "info" };

/** Hal yang perlu perhatian admin: sinkron otomatis gagal & isian formulir baru. */
export async function OpsAlerts() {
  const [skripsi, ig, akademik, baru] = await Promise.all([
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
  ]);
  const alerts: Alert[] = [];
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
  if (baru.length)
    alerts.push({
      text: `${baru.length} isian formulir baru menunggu ditindaklanjuti.`,
      href: "/settings/formulir",
      tone: "info",
    });
  if (!alerts.length) return null;
  return (
    <ul className="mt-6 grid gap-2">
      {alerts.map((a) => (
        <li key={a.text}>
          <Link
            href={a.href}
            className={
              a.tone === "warn"
                ? "flex items-center gap-3 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-[13.5px] hover:bg-amber-500/15"
                : "flex items-center gap-3 rounded-xl border border-blue-500/25 bg-blue-500/10 px-4 py-3 text-[13.5px] hover:bg-blue-500/15"
            }
          >
            {a.tone === "warn" ? (
              <AlertTriangle className="size-4 shrink-0 text-amber-600" />
            ) : (
              <Inbox className="size-4 shrink-0 text-blue-600" />
            )}
            <span className="min-w-0 flex-1 truncate">{a.text}</span>
            <span className="text-foreground/55">Buka ›</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
