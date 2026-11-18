import { cache } from "react";
import { getWebsiteContent } from "@/lib/data/provider";
import { defaultWebsiteConfig } from "./defaults";
import { isInactivePerson } from "./names";
import { websiteConfigSchema, type WebsiteConfig } from "./schema";

const MISMATCHED_PERSON_EVENT_PHOTOS = new Set([
  "https://uinsgd.ac.id/wp-content/uploads/2026/06/IMG-20260603-WA0014-scaled.jpg",
  "https://uinsgd.ac.id/wp-content/uploads/2026/06/IMG-20260611-WA00131-scaled.jpg",
  "https://uinsgd.ac.id/wp-content/uploads/2026/04/IMG-20260416-WA0025-scaled.jpg",
  "https://uinsgd.ac.id/wp-content/uploads/2026/04/IMG-20260416-WA0027.jpg",
  "https://uinsgd.ac.id/wp-content/uploads/2026/06/IMG-20260608-WA0010.jpg",
  "https://uinsgd.ac.id/wp-content/uploads/2026/04/IMG_20260416_203512.jpg",
  "https://uinsgd.ac.id/wp-content/uploads/2026/04/IMG_20260416_202659-scaled.jpg",
  "https://uinsgd.ac.id/wp-content/uploads/2023/12/IMG-20231212-WA0017.jpg",
  "https://uinsgd.ac.id/wp-content/uploads/2026/08/IMG-20260805-WA0022.jpg",
]);

const SUPERSEDED_LEGACY_KEYS = new Set([
  "tim mahasiswa ekonomi syariah uin bandung",
  "delegasi mahasiswa eksyar uin sgd",
  "literasi digitalisasi keuangan syariah & pengelolaan aset masjid",
  "seminar karir & kerja sama muamalat institute 2026",
  "opini & analisis pasar keuangan syariah di islamic finance news (ifn)",
  "hakiki ramadhan",
]);

function hasInactivePersonInObject(key: string, item: unknown): boolean {
  if (!item || typeof item !== "object") return false;
  // Publikasi dan topikSkripsi tetap dipertahankan sebagai rekam jejak karya ilmiah beliau
  if (key === "publikasi" || key === "topikSkripsi") return false;
  const obj = item as Record<string, unknown>;
  return (
    isInactivePerson(obj.name) ||
    isInactivePerson(obj.nama) ||
    isInactivePerson(obj.pembuat)
  );
}

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
    v.includes("-6.939268,107.704824") ||
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
        const seenImages = new Set<string>();
        const combined: unknown[] = [];
        for (const dItem of defVal) {
          const img = String((dItem as { image?: unknown }).image ?? "").toLowerCase();
          if (img && !seenImages.has(img)) {
            combined.push(dItem);
            seenImages.add(img);
          }
        }
        for (const sItem of cleanStored) {
          const img = String((sItem as { image?: unknown }).image ?? "").toLowerCase();
          if (img && !seenImages.has(img)) {
            combined.push(sItem);
            seenImages.add(img);
          }
        }
        result[key] = combined;
        continue;
      }

      if (
        [
          "video",
          "prestasi",
          "apresiasi",
          "karya",
          "publikasi",
          "kegiatan",
          "testimoni",
        ].includes(key)
      ) {
        const seenKeys = new Set<string>();
        const combined: unknown[] = [];
        for (const dItem of defVal) {
          if (hasInactivePersonInObject(key, dItem)) continue;
          const u = itemKey(dItem);
          if (!seenKeys.has(u)) {
            combined.push(dItem);
            seenKeys.add(u);
          }
        }
        for (const sItem of data) {
          if (hasInactivePersonInObject(key, sItem)) continue;
          if (!sItem || typeof sItem !== "object") continue;
          const obj = { ...(sItem as Record<string, unknown>) };
          if (
            key === "prestasi" &&
            typeof obj.name === "string" &&
            obj.name.trim().toLowerCase() === "evita farcha"
          ) {
            obj.name = "Evita Farcha Kamila";
          }
          if (
            (key === "prestasi" || key === "apresiasi") &&
            typeof obj.photo === "string" &&
            MISMATCHED_PERSON_EVENT_PHOTOS.has(obj.photo)
          ) {
            obj.photo = null;
          }
          if (
            key === "karya" &&
            typeof obj.image === "string" &&
            MISMATCHED_PERSON_EVENT_PHOTOS.has(obj.image)
          ) {
            obj.image = null;
          }
          const u = itemKey(obj);
          if (SUPERSEDED_LEGACY_KEYS.has(u)) continue;
          if (!seenKeys.has(u)) {
            combined.push(obj);
            seenKeys.add(u);
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

      if (
        key === "testimoni" &&
        data.some(
          (x) =>
            x &&
            typeof x === "object" &&
            /evi\s+sopiah|muhammad\s+hasanuddin/i.test(
              String((x as { name?: unknown }).name ?? ""),
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
      const filteredData = data.filter((item) => !hasInactivePersonInObject(key, item));
      const merged = filteredData.map((item) => {
        if (item && typeof item === "object") {
          const obj = { ...(item as Record<string, unknown>) };
          if (
            key === "prestasi" &&
            typeof obj.name === "string" &&
            obj.name.trim().toLowerCase() === "evita farcha"
          ) {
            obj.name = "Evita Farcha Kamila";
          }
          if (
            (key === "prestasi" || key === "apresiasi") &&
            typeof obj.photo === "string" &&
            MISMATCHED_PERSON_EVENT_PHOTOS.has(obj.photo)
          ) {
            obj.photo = null;
          }
          if (
            key === "karya" &&
            typeof obj.image === "string" &&
            MISMATCHED_PERSON_EVENT_PHOTOS.has(obj.image)
          ) {
            obj.image = null;
          }
          if (
            key === "prestasi" &&
            obj.group === "Eksyar Appreciation"
          ) {
            obj.group = "Mahasiswa & Alumni";
          }
          const k = itemKey(obj);
          seen.add(k);
          const match = defMap.get(k);
          if (match) {
            return backfillObject(obj, match);
          }
          return obj;
        }
        const k = itemKey(item);
        seen.add(k);
        return item;
      });

      for (const dItem of defVal) {
        if (hasInactivePersonInObject(key, dItem)) continue;
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
/**
 * Foto orang yang aslinya digabung dengan tangkapan layar karyanya: di kartu
 * orang (field `photo`) dipakai versi yang dipotong hanya orangnya.
 */
const PERSON_PHOTO_CROPS: Record<string, string> = {
  "https://uinsgd.ac.id/wp-content/uploads/2026/06/eksyar.jpeg": "/prodi/prestasi/hakiki-ramadhan.jpg",
  "https://uinsgd.ac.id/wp-content/uploads/2026/06/eksyar1.jpeg": "/prodi/prestasi/sabila-syifa.jpg",
};

function cropPersonPhotos<T>(value: T): T {
  if (Array.isArray(value)) return value.map(cropPersonPhotos) as T;
  if (!value || typeof value !== "object") return value;
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(value)) {
    out[k] = k === "photo" && typeof v === "string" && PERSON_PHOTO_CROPS[v] ? PERSON_PHOTO_CROPS[v] : cropPersonPhotos(v);
  }
  return out as T;
}

export const getSite = cache(async (): Promise<WebsiteConfig> => {
  try {
    return cropPersonPhotos(mergeWebsiteConfig(await getWebsiteContent()));
  } catch {
    return defaultWebsiteConfig;
  }
});
