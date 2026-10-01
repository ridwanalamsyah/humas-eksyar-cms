import {
  getSiteSetting,
  getWebsiteContent,
  listContents,
  listEvents,
  listSubmissions,
} from "@/lib/data/provider";
import { SKRIPSI_KEY, detailKey } from "./skripsi";

/** Kumpulkan seluruh data website & CMS yang penting dalam satu JSON. */
export async function buildBackup() {
  const skripsi =
    ((await getSiteSetting(SKRIPSI_KEY).catch(() => null)) as
      | { tahun: number }[]
      | null) ?? [];
  const years = [...new Set(skripsi.map((s) => s.tahun))];
  const details = Object.fromEntries(
    await Promise.all(
      years.map(
        async (y) =>
          [y, await getSiteSetting(detailKey(y)).catch(() => null)] as const,
      ),
    ),
  );
  const keys = [
    "akademik_sync",
    "skripsi_sync",
    "instagram_imported",
    "website_history",
  ];
  const settings = Object.fromEntries(
    await Promise.all(
      keys.map(
        async (k) => [k, await getSiteSetting(k).catch(() => null)] as const,
      ),
    ),
  );
  return {
    versi: 1,
    dibuat: new Date().toISOString(),
    website: await getWebsiteContent().catch(() => null),
    skripsi,
    skripsiDetail: details,
    settings,
    konten: await listContents().catch(() => []),
    agenda: await listEvents({ fromDate: "2000-01-01T00:00:00.000Z" }).catch(
      () => [],
    ),
    formulir: await listSubmissions({ limit: 100000 }).catch(() => []),
  };
}
