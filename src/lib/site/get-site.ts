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
      // Untuk semua daftar utama: jika yang tersimpan di DB lebih sedikit dari hasil impor default, gabungkan tanpa duplikat.
      if (data.length < defVal.length) {
        const getKey = (item: unknown) => {
          if (!item || typeof item !== "object") return String(item).toLowerCase();
          const obj = item as Record<string, unknown>;
          return String(
            obj.kode ??
              obj.url ??
              obj.image ??
              obj.name ??
              obj.nama ??
              obj.title ??
              obj.judul ??
              obj.topik ??
              obj.mk ??
              obj.kegiatan ??
              obj.year ??
              obj.tahun ??
              obj.q ??
              JSON.stringify(obj),
          ).toLowerCase();
        };
        const seen = new Set(data.map(getKey));
        const merged = [...data];
        for (const dItem of defVal) {
          const idKey = getKey(dItem);
          if (!seen.has(idKey)) {
            merged.push(dItem);
            seen.add(idKey);
          }
        }
        result[key] = merged;
        continue;
      }
    }

    // Untuk objek profil: pastikan sejarah, visi, misi, atau tujuan yang kosong di DB terisi dari default.
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
        tujuan:
          Array.isArray(pData.tujuan) && pData.tujuan.length > 0
            ? pData.tujuan
            : pDef.tujuan,
        visi:
          typeof pData.visi === "string" && pData.visi.trim().length > 0
            ? pData.visi
            : pDef.visi,
      };
      continue;
    }

    // Untuk objek medsos, mutu, dan kontak: jika field string di DB kosong (""), gunakan nilai default.
    if (
      ["medsos", "mutu", "kontak"].includes(key) &&
      data &&
      typeof data === "object" &&
      defVal &&
      typeof defVal === "object"
    ) {
      const oData = data as Record<string, unknown>;
      const oDef = defVal as Record<string, unknown>;
      const mergedObj: Record<string, unknown> = { ...oDef, ...oData };
      for (const [k, v] of Object.entries(oDef)) {
        const cur = oData[k];
        if (typeof cur === "string" && cur.trim() === "" && typeof v === "string" && v.trim() !== "") {
          mergedObj[k] = v;
        }
      }
      result[key] = mergedObj;
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
