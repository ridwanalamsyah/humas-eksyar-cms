import { revalidatePath } from "next/cache";
import { setSiteSetting } from "@/lib/data/provider";
import { fetchDigilibSkripsi, mergeSkripsi } from "./digilib";
import {
  SKRIPSI_KEY,
  SKRIPSI_SYNC_KEY,
  getSkripsi,
  skripsiItemSchema,
  type SkripsiItem,
  type SkripsiSync,
} from "./skripsi";

/** Ambil skripsi dari Digilib, gabungkan dengan data lama, lalu simpan. */
export async function syncSkripsiFromDigilib(): Promise<SkripsiSync> {
  const [report, existing] = await Promise.all([
    fetchDigilibSkripsi(),
    getSkripsi(),
  ]);
  const fetched = report.items
    .map((i) => skripsiItemSchema.safeParse(i))
    .flatMap((r) => (r.success ? [r.data] : []));
  const hadError = report.sources.some((s) => s.error);

  if (fetched.length === 0) {
    throw new Error(
      `Tidak ada judul yang berhasil diambil. ${report.sources.map((s) => `${s.label}: ${s.error ?? "0 item"}`).join("; ")}`,
    );
  }

  const known = new Set(existing.map((e) => e.judul.toLowerCase()));
  const merged: SkripsiItem[] = mergeSkripsi(existing, fetched, {
    keepLinked: hadError,
  }).sort((a, b) => b.tahun - a.tahun || a.judul.localeCompare(b.judul, "id"));
  const info: SkripsiSync = {
    at: new Date().toISOString(),
    total: merged.length,
    added: merged.filter((m) => !known.has(m.judul.toLowerCase())).length,
    sources: report.sources,
  };
  await setSiteSetting(SKRIPSI_KEY, merged);
  await setSiteSetting(SKRIPSI_SYNC_KEY, info);
  revalidatePath("/prodi/skripsi");
  revalidatePath("/settings/skripsi");
  return info;
}
