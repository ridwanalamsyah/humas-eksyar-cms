import { cache } from "react";
import { getWebsiteContent } from "@/lib/data/provider";
import { defaultWebsiteConfig } from "./defaults";
import { websiteConfigSchema, type WebsiteConfig } from "./schema";

function itemKey(item: unknown): string {
  if (!item || typeof item !== "object") return String(item).toLowerCase();
  const obj = item as Record<string, unknown>;
  const raw =
    obj.kode ??
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
    obj.url ??
    obj.image ??
    JSON.stringify(obj);
  return String(raw)
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

function isLegacyTemplateValue(v: unknown): boolean {
  if (typeof v !== "string") return false;
  return (
    v.includes("images.unsplash.com") ||
    v.includes("maps.google.com/?q=UIN+Sunan+Gunung+Djati+Bandung") ||
    v === "/prodi/skripsi/pojok"
  );
}

function backfillObject(
  storedItem: Record<string, unknown>,
  defaultItem: Record<string, unknown>,
): Record<string, unknown> {
  const out: Record<string, unknown> = { ...defaultItem, ...storedItem };
  for (const [k, defV] of Object.entries(defaultItem)) {
    const curV = storedItem[k];
    const isEmptyString = typeof curV === "string" && curV.trim() === "";
    const isEmptyArray = Array.isArray(curV) && curV.length === 0;
    if (
      curV === null ||
      curV === undefined ||
      isEmptyString ||
      isEmptyArray ||
      isLegacyTemplateValue(curV)
    ) {
      if (defV !== null && defV !== undefined && defV !== "") {
        out[k] = defV;
      }
    }
    if (
      typeof curV === "string" &&
      typeof defV === "string" &&
      curV.includes("mahasiswa semester enam")
    ) {
      out[k] = defV;
    }
  }
  return out;
}

/**
 * Gabungkan konten tersimpan dengan data awal (`defaultWebsiteConfig`):
 * - Jika bagian di DB kosong atau belum ada, gunakan nilai default.
 * - Untuk daftar (array): lengkapi field yang masih `null`/kosong (seperti `image`,
 *   `photo`, `pendidikan`, `sinta`, `scholar`, `konsultasi`) dari item default yang cocok,
 *   serta tambahkan entri baru dari default yang belum ada di DB.
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

    if (Array.isArray(data) && Array.isArray(defVal)) {
      if (data.length === 0 && defVal.length > 0) {
        result[key] = defVal;
        continue;
      }

      // Jika kegiatanMahasiswa di DB masih versi generik lama, gunakan versi resmi HMJ/FoSEI/GIS BEI.
      if (
        key === "kegiatanMahasiswa" &&
        data.some(
          (x) =>
            x &&
            typeof x === "object" &&
            (x as { title?: string }).title === "Kajian & Diskusi Ekonomi Islam",
        )
      ) {
        result[key] = defVal;
        continue;
      }

      // Jika galeri atau rps di DB masih memakai foto Unsplash / format lama, utamakan default resmi ditambah item baru non-Unsplash.
      if (key === "galeri") {
        const cleanStored = data.filter(
          (x) =>
            x &&
            typeof x === "object" &&
            !isLegacyTemplateValue((x as { image?: unknown }).image),
        );
        const seenCaptions = new Set(
          cleanStored.map((x) =>
            String((x as { caption?: unknown }).caption ?? "").toLowerCase(),
          ),
        );
        const combined = [...cleanStored];
        for (const dItem of defVal) {
          const cap = String(
            (dItem as { caption?: unknown }).caption ?? "",
          ).toLowerCase();
          if (!seenCaptions.has(cap)) {
            combined.push(dItem);
            seenCaptions.add(cap);
          }
        }
        result[key] = combined;
        continue;
      }

      if (key === "video") {
        const seenUrls = new Set<string>();
        const combined: unknown[] = [];
        for (const dItem of defVal) {
          const u = itemKey(dItem);
          if (!seenUrls.has(u)) {
            combined.push(dItem);
            seenUrls.add(u);
          }
        }
        for (const sItem of data) {
          const u = itemKey(sItem);
          if (!seenUrls.has(u)) {
            combined.push(sItem);
            seenUrls.add(u);
          }
        }
        result[key] = combined;
        continue;
      }

      if (
        key === "rps" &&
        data.some(
          (x) =>
            x &&
            typeof x === "object" &&
            String((x as { semester?: unknown }).semester ?? "").startsWith(
              "Semester",
            ),
        )
      ) {
        result[key] = defVal;
        continue;
      }

      const defMap = new Map<string, Record<string, unknown>>();
      for (const dItem of defVal) {
        if (dItem && typeof dItem === "object") {
          defMap.set(itemKey(dItem), dItem as Record<string, unknown>);
        }
      }

      const seen = new Set<string>();
      const merged = data.map((item) => {
        const k = itemKey(item);
        seen.add(k);
        if (item && typeof item === "object") {
          const match = defMap.get(k);
          if (match) {
            return backfillObject(item as Record<string, unknown>, match);
          }
        }
        return item;
      });

      for (const dItem of defVal) {
        const idKey = itemKey(dItem);
        if (!seen.has(idKey)) {
          merged.push(dItem);
          seen.add(idKey);
        }
      }

      result[key] = merged;
      continue;
    }

    // Untuk objek profil: pastikan sejarah, visi, misi, atau tujuan yang kosong di DB terisi dari default.
    if (
      key === "profil" &&
      data &&
      typeof data === "object" &&
      defVal &&
      typeof defVal === "object"
    ) {
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

    // Untuk objek identity, medsos, mutu, dan kontak: backfill field null/kosong dari default.
    if (
      ["identity", "medsos", "mutu", "kontak"].includes(key) &&
      data &&
      typeof data === "object" &&
      defVal &&
      typeof defVal === "object"
    ) {
      result[key] = backfillObject(
        data as Record<string, unknown>,
        defVal as Record<string, unknown>,
      );
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
