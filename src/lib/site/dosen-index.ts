import type { AkademikSync } from "./akademik";
import { normName } from "./names";
import type { Person } from "./schema";
import type { SkripsiItem } from "./skripsi";

export type DosenEntry = {
  nama: string;
  jabatan?: string;
  keahlian: string[];
  mataKuliah: string[];
  bimbingan: number;
  /** Nama persis seperti di Digilib, untuk filter skripsi bimbingan. */
  namaPembimbing?: string;
  /** Tercatat di CMS (pimpinan/dosen prodi). */
  fromCms: boolean;
};

/**
 * Gabungkan dosen dari CMS, pengampu dari e-Knows, dan pembimbing dari
 * Digilib. Nama dicocokkan tanpa gelar. Pembimbing yang tidak tercatat di
 * CMS/e-Knows baru ditampilkan bila membimbing minimal 2 skripsi.
 */
export function buildDosenIndex(
  cms: Person[],
  akademik: AkademikSync | null,
  skripsi: SkripsiItem[],
): DosenEntry[] {
  const map = new Map<string, DosenEntry>();
  const upsert = (name: string) => {
    const key = normName(name);
    if (!key) return null;
    let e = map.get(key);
    if (!e) {
      e = {
        nama: name,
        keahlian: [],
        mataKuliah: [],
        bimbingan: 0,
        fromCms: false,
      };
      map.set(key, e);
    }
    return e;
  };

  for (const p of cms) {
    const e = upsert(p.name);
    if (!e) continue;
    e.nama = p.name;
    e.jabatan = p.role;
    e.keahlian = p.expertise ?? [];
    e.fromCms = true;
  }
  for (const d of akademik?.dosen ?? []) {
    const e = upsert(d.nama);
    if (e) e.mataKuliah = [...new Set([...e.mataKuliah, ...d.mataKuliah])];
  }
  const counts = new Map<string, { n: number; name: string }>();
  for (const s of skripsi)
    for (const p of s.pembimbing ?? []) {
      const k = normName(p);
      const c = counts.get(k) ?? { n: 0, name: p };
      c.n++;
      counts.set(k, c);
    }
  for (const [k, c] of counts) {
    const e = map.get(k) ?? (c.n >= 2 ? upsert(c.name) : null);
    if (!e) continue;
    e.bimbingan = c.n;
    e.namaPembimbing = c.name;
  }

  return [...map.values()].sort(
    (a, b) =>
      Number(b.fromCms) - Number(a.fromCms) ||
      b.mataKuliah.length + b.bimbingan - (a.mataKuliah.length + a.bimbingan) ||
      a.nama.localeCompare(b.nama, "id"),
  );
}
