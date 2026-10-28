import { cache } from "react";
import { getWebsiteContent } from "@/lib/data/provider";
import { defaultWebsiteConfig } from "./defaults";
import { websiteConfigSchema, type WebsiteConfig } from "./schema";

/**
 * Gabungkan konten tersimpan dengan data awal, per bagian: bagian yang
 * tidak valid, belum pernah disimpan, atau masih berupa array/teks kosong
 * dari penyimpanan awal memakai data awal (`defaultWebsiteConfig`), sehingga
 * data hasil migrasi `es.uinsgd.ac.id` langsung tampil meskipun database
 * sebelumnya menyimpan nilai kosong.
 */
export function mergeWebsiteConfig(stored: unknown): WebsiteConfig {
  const result = structuredClone(defaultWebsiteConfig) as Record<string, unknown>;
  if (!stored || typeof stored !== "object") return result as WebsiteConfig;

  const shape = websiteConfigSchema.shape as Record<
    string,
    { safeParse: (v: unknown) => { success: boolean; data?: unknown } }
  >;

  for (const [key, schema] of Object.entries(shape)) {
    const value = (stored as Record<string, unknown>)[key];
    if (value === undefined) continue;
    const parsed = schema.safeParse(value);
    if (!parsed.success) continue;

    const data = parsed.data;
    const defVal = (defaultWebsiteConfig as Record<string, unknown>)[key];

    // Jika database menyimpan array kosong sedangkan default memiliki data hasil impor, gunakan default.
    if (Array.isArray(data) && Array.isArray(defVal)) {
      if (data.length === 0 && defVal.length > 0) {
        result[key] = defVal;
        continue;
      }
      // Untuk daftar seperti sorotan, prestasi, jurnal, timeline: jika yang tersimpan jauh lebih sedikit dari hasil impor, gabungkan.
      if (
        ["sorotan", "prestasi", "jurnal", "publikasi", "timeline", "fasilitas", "dosen"].includes(key) &&
        data.length < defVal.length
      ) {
        const seen = new Set(
          data.map((item: Record<string, unknown>) =>
            String(item.name ?? item.title ?? item.judul ?? item.year ?? JSON.stringify(item)).toLowerCase(),
          ),
        );
        const merged = [...data];
        for (const dItem of defVal as Record<string, unknown>[]) {
          const idKey = String(
            dItem.name ?? dItem.title ?? dItem.judul ?? dItem.year ?? JSON.stringify(dItem),
          ).toLowerCase();
          if (!seen.has(idKey)) {
            merged.push(dItem);
            seen.add(idKey);
          }
        }
        result[key] = merged;
        continue;
      }
    }

    // Untuk objek profil: pastikan sejarah, visi, misi, atau akreditasi yang kosong di DB terisi dari default.
    if (key === "profil" && data && typeof data === "object" && defVal && typeof defVal === "object") {
      const pData = data as Record<string, unknown>;
      const pDef = defVal as Record<string, unknown>;
      result[key] = {
        ...pDef,
        ...pData,
        sejarah:
          Array.isArray(pData.sejarah) && pData.sejarah.length > 0
            ? pData.sejarah
            : pDef.sejarah,
        misi:
          Array.isArray(pData.misi) && pData.misi.length > 0
            ? pData.misi
            : pDef.misi,
        visi:
          typeof pData.visi === "string" && pData.visi.trim().length > 0
            ? pData.visi
            : pDef.visi,
        akreditasi:
          typeof pData.akreditasi === "string" && pData.akreditasi.trim().length > 0
            ? pData.akreditasi
            : pDef.akreditasi,
      };
      continue;
    }

    result[key] = data;
  }

  return result as WebsiteConfig;
}

/** Konten website untuk request ini (di-cache per render). */
export const getSite = cache(async (): Promise<WebsiteConfig> => {
  try {
    return mergeWebsiteConfig(await getWebsiteContent());
  } catch {
    return defaultWebsiteConfig;
  }
});
