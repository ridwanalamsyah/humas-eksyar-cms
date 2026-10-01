import { listEvents } from "@/lib/data/provider";
import { PUBLIC_EVENT_CATEGORIES } from "./content";
import { getSite } from "./get-site";
import type { FormDef } from "./forms";

/** Pilihan dinamis formulir dari data website (dosen, ruang, lowongan, dll.). */
export async function resolveOptions(
  def: FormDef,
): Promise<Record<string, string[]>> {
  const needs = new Set(def.fields.map((f) => f.optionsFrom).filter(Boolean));
  if (!needs.size) return {};
  const site = await getSite();
  const out: Record<string, string[]> = {};
  if (needs.has("dosen"))
    out.dosen = [
      ...new Set([...site.pimpinan, ...site.dosen].map((d) => d.name)),
    ];
  if (needs.has("ruangAlat")) out.ruangAlat = site.ruangAlat.map((r) => r.name);
  if (needs.has("lowongan"))
    out.lowongan = site.lowongan.filter((l) => !l.url).map((l) => l.title);
  if (needs.has("prospekKarir"))
    out.prospekKarir = [...site.prospekKarir.map((p) => p.title), "Lainnya"];
  if (needs.has("acara")) {
    const events = await listEvents({ fromDate: new Date().toISOString() });
    out.acara = events
      .filter((e) =>
        (PUBLIC_EVENT_CATEGORIES as readonly string[]).includes(e.category),
      )
      .map((e) => e.title);
  }
  return out;
}
