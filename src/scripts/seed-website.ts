/**
 * Isi database dengan konten awal website prodi (/prodi) — profil, dosen,
 * beasiswa, timeline, kegiatan, dll. — ke tabel `siteSettings` (key "website").
 *
 * Aman dijalankan berulang: data yang sudah diedit dari CMS TIDAK ditimpa,
 * kecuali memakai `--force`.
 *
 * Usage:
 *   pnpm db:seed:website          # isi jika belum ada
 *   pnpm db:seed:website --force  # timpa dengan data awal
 */

import "dotenv/config";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "../lib/db/schema";
import { defaultWebsiteConfig } from "../lib/site/defaults";
import { websiteConfigSchema } from "../lib/site/schema";

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    console.error("DATABASE_URL belum di-set — seed dibatalkan.");
    process.exit(1);
  }
  const parsed = websiteConfigSchema.safeParse(defaultWebsiteConfig);
  if (!parsed.success) {
    console.error("Data awal tidak valid:", parsed.error.issues.slice(0, 5));
    process.exit(1);
  }

  const db = drizzle(neon(url), { schema });
  const now = new Date().toISOString();
  const force = process.argv.includes("--force");
  const row = { key: "website", value: parsed.data, updatedAt: now };

  if (force) {
    await db
      .insert(schema.siteSettings)
      .values(row)
      .onConflictDoUpdate({ target: schema.siteSettings.key, set: { value: parsed.data, updatedAt: now } });
    console.log("✓ Konten website ditimpa dengan data awal.");
  } else {
    const res = await db.insert(schema.siteSettings).values(row).onConflictDoNothing().returning();
    console.log(res.length ? "✓ Konten website awal ditambahkan." : "• Konten website sudah ada — dilewati (pakai --force untuk menimpa).");
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
