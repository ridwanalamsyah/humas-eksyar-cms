import { revalidatePath } from "next/cache";
import { setSiteSetting } from "@/lib/data/provider";
import { AKADEMIK_KEY, akademikSchema, type AkademikSync } from "./akademik";
import { aggregate, fetchEknows } from "./eknows";

export async function syncAkademikFromEknows(): Promise<AkademikSync> {
  const report = await fetchEknows();
  if (report.courses.length === 0)
    throw new Error(
      `Tidak ada mata kuliah ditemukan (${report.pages} halaman dibaca).`,
    );
  const data = akademikSchema.parse({
    at: new Date().toISOString(),
    pages: report.pages,
    errors: report.errors,
    ...aggregate(report.courses),
  });
  await setSiteSetting(AKADEMIK_KEY, data);
  revalidatePath("/prodi/akademik");
  revalidatePath("/prodi/dosen");
  revalidatePath("/settings/website");
  return data;
}
