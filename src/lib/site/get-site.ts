import { cache } from "react";
import { getWebsiteContent } from "@/lib/data/provider";
import { defaultWebsiteConfig } from "./defaults";
import { websiteConfigSchema, type WebsiteConfig } from "./schema";

/**
 * Gabungkan konten tersimpan dengan data awal, per bagian: bagian yang
 * tidak valid atau belum pernah disimpan memakai data awal, sehingga website
 * tidak pernah rusak karena satu isian yang salah.
 */
export function mergeWebsiteConfig(stored: unknown): WebsiteConfig {
  const result = { ...defaultWebsiteConfig } as Record<string, unknown>;
  if (!stored || typeof stored !== "object") return defaultWebsiteConfig;
  const shape = websiteConfigSchema.shape as Record<string, { safeParse: (v: unknown) => { success: boolean; data?: unknown } }>;
  for (const [key, schema] of Object.entries(shape)) {
    const value = (stored as Record<string, unknown>)[key];
    if (value === undefined) continue;
    const parsed = schema.safeParse(value);
    if (parsed.success) result[key] = parsed.data;
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
