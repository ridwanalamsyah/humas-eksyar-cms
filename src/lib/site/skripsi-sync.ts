import { revalidatePath } from "next/cache";
import { setSiteSetting } from "@/lib/data/provider";
import {
  enrichItems,
  fetchDigilibSkripsi,
  mergeSkripsi,
  type DigilibItem,
} from "./digilib";
import {
  SKRIPSI_KEY,
  SKRIPSI_SYNC_KEY,
  detailKey,
  getSkripsi,
  getSkripsiDetailBucket,
  skripsiDetailSchema,
  skripsiItemSchema,
  type SkripsiDetail,
  type SkripsiItem,
  type SkripsiSync,
} from "./skripsi";

/**
 * Ambil skripsi dari Digilib (judul, penulis, pembimbing, abstrak, berkas),
 * gabungkan dengan data lama, lalu simpan. Detail yang sudah pernah diambil
 * tidak diambil ulang; sisanya dilengkapi bertahap tiap kali sinkron.
 */
export async function syncSkripsiFromDigilib(): Promise<SkripsiSync> {
  const [report, existing] = await Promise.all([
    fetchDigilibSkripsi(),
    getSkripsi(),
  ]);
  const hadError = report.sources.some((s) => s.error);
  if (report.items.length === 0) {
    throw new Error(
      `Tidak ada judul yang berhasil diambil. ${report.sources.map((s) => `${s.label}: ${s.error ?? "0 item"}`).join("; ")}`,
    );
  }

  // Detail lama per tahun → pasang ke item agar tidak diambil ulang.
  const years = [...new Set(report.items.map((i) => i.tahun))];
  const buckets = new Map<number, Record<string, SkripsiDetail>>(
    await Promise.all(
      years.map(async (y) => [y, await getSkripsiDetailBucket(y)] as const),
    ),
  );
  for (const it of report.items) {
    const old = buckets.get(it.tahun)?.[it.id];
    if (!it.detail && old) it.detail = old;
  }
  await enrichItems(report.items).catch(() => 0);

  // Simpan detail per tahun.
  const changed = new Set<number>();
  for (const it of report.items as DigilibItem[]) {
    if (!it.detail) continue;
    const parsed = skripsiDetailSchema.safeParse(it.detail);
    if (!parsed.success) continue;
    const bucket = buckets.get(it.tahun) ?? {};
    bucket[it.id] = parsed.data;
    buckets.set(it.tahun, bucket);
    changed.add(it.tahun);
  }
  for (const y of changed) await setSiteSetting(detailKey(y), buckets.get(y));

  const fetched = report.items
    .map((i) =>
      skripsiItemSchema.safeParse({
        id: i.id,
        judul: i.judul,
        nama: i.nama,
        tahun: i.tahun,
        url: i.url,
        pembimbing: i.pembimbing.slice(0, 6),
      }),
    )
    .flatMap((r) => (r.success ? [r.data] : []));
  const known = new Set(existing.map((e) => e.judul.toLowerCase()));
  const merged: SkripsiItem[] = mergeSkripsi(existing, fetched, {
    keepLinked: hadError,
  }).sort((a, b) => b.tahun - a.tahun || a.judul.localeCompare(b.judul, "id"));
  const detailed = report.items.filter((i) => i.detail).length;
  const info: SkripsiSync = {
    at: new Date().toISOString(),
    total: merged.length,
    added: merged.filter((m) => !known.has(m.judul.toLowerCase())).length,
    detailed,
    pendingDetail: report.items.length - detailed,
    sources: report.sources,
  };
  await setSiteSetting(SKRIPSI_KEY, merged);
  await setSiteSetting(SKRIPSI_SYNC_KEY, info);
  revalidatePath("/prodi/skripsi", "layout");
  revalidatePath("/prodi/dosen");
  revalidatePath("/settings/skripsi");
  return info;
}
