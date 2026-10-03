import { z } from "@/lib/zod";
import { getSiteSetting } from "@/lib/data/provider";

/** Hasil sinkron mata kuliah & dosen pengampu dari e-Knows. */
export const AKADEMIK_KEY = "akademik_sync";

export const akademikSchema = z.object({
  at: z.string(),
  pages: z.number(),
  errors: z.number(),
  mataKuliah: z
    .array(
      z.object({
        nama: z.string().max(200),
        dosen: z.array(z.string().max(160)).max(40),
        kelas: z.number(),
        kategori: z.array(z.string().max(200)).max(40),
      }),
    )
    .max(3000),
  dosen: z
    .array(
      z.object({
        nama: z.string().max(160),
        mataKuliah: z.array(z.string().max(200)).max(200),
      }),
    )
    .max(1000),
});
export type AkademikSync = z.infer<typeof akademikSchema>;

export async function getAkademik(): Promise<AkademikSync | null> {
  const parsed = akademikSchema.safeParse(
    await getSiteSetting(AKADEMIK_KEY).catch(() => null),
  );
  return parsed.success ? parsed.data : null;
}
