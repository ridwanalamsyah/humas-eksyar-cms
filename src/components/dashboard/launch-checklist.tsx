import Link from "next/link";
import { CheckCircle2, Circle, ShieldCheck } from "lucide-react";
import { getSiteSetting, listContents } from "@/lib/data/provider";
import { getSite } from "@/lib/site/get-site";
import { ES_UINSGD_AUDIT_REPORT } from "@/lib/site/import-sanitizer";

type Item = { label: string; done: boolean; href: string; note?: string };

/**
 * Daftar periksa kesiapan website & status migrasi data es.uinsgd.ac.id.
 */
export async function LaunchChecklist() {
  const [site, contents, igToken] = await Promise.all([
    getSite(),
    listContents({ status: "published" }).catch(() => []),
    getSiteSetting("instagram_token").catch(() => null),
  ]);
  const fotoDosen = site.dosen.filter((x) => x.photo).length;
  const items: Item[] = [
    {
      label: "Migrasi & sanitasi malware es.uinsgd.ac.id",
      done: true,
      note: `${ES_UINSGD_AUDIT_REPORT.recoveredCounts.skripsiDigilib} skripsi · ${ES_UINSGD_AUDIT_REPORT.blockedMalwareUrls} URL spam diblokir`,
      href: "/settings/website#migrasi-es",
    },
    {
      label: "Sejarah, visi, misi & akreditasi prodi",
      done: site.profil.sejarah.length >= 2 && !!site.profil.visi,
      href: "/settings/website?bagian=profil",
    },
    {
      label: "Data dosen tetap & homebase FEBI",
      done: site.dosen.length >= 20,
      note: `${site.dosen.length} dosen (${fotoDosen} berfoto)`,
      href: "/settings/website?bagian=profil",
    },
    {
      label: "Sorotan berita, prestasi & jurnal ilmiah",
      done: site.sorotan.length >= 6 && site.jurnal.length >= 4,
      note: `${site.sorotan.length} sorotan · ${site.jurnal.length} jurnal`,
      href: "/settings/website?bagian=beranda",
    },
    {
      label: "Foto utama & galeri kegiatan",
      done: !!site.identity.heroImage || site.galeri.length >= 4,
      note: `${site.galeri.length} foto`,
      href: "/settings/website?bagian=kegiatan",
    },
    {
      label: "Arsip berita & pengumuman terbit",
      done: contents.length > 0,
      note: `${contents.length} terbit`,
      href: "/content",
    },
    {
      label: "Instagram resmi tersambung otomatis",
      done: !!igToken || !!process.env.INSTAGRAM_ACCESS_TOKEN,
      note: "Opsional (token API)",
      href: "/content/instagram",
    },
  ];
  const doneCount = items.filter((i) => i.done).length;

  return (
    <section className="glass-regular mt-6 rounded-xl">
      <header className="flex flex-wrap items-center justify-between gap-2 border-b border-foreground/[0.07] px-5 py-3.5 dark:border-white/[0.07]">
        <div className="flex items-center gap-2">
          <ShieldCheck className="size-4 text-emerald-600 dark:text-emerald-400" />
          <h2 className="text-[14px] font-semibold">
            Status Migrasi es.uinsgd.ac.id & Kesiapan Website
          </h2>
        </div>
        <Link
          href="/settings/website#migrasi-es"
          className="text-[12px] font-medium text-emerald-700 hover:underline dark:text-emerald-300"
        >
          {doneCount}/{items.length} selesai · Lihat Audit Sanitasi ›
        </Link>
      </header>
      <ul className="grid sm:grid-cols-2">
        {items.map((i) => (
          <li key={i.label}>
            <Link
              href={i.href}
              className="flex items-center gap-3 px-5 py-2.5 text-[13.5px] hover:bg-foreground/[0.025]"
            >
              {i.done ? (
                <CheckCircle2 className="size-4 shrink-0 text-emerald-600" />
              ) : (
                <Circle className="size-4 shrink-0 text-foreground/30" />
              )}
              <span className="flex-1">{i.label}</span>
              {i.note && (
                <span className="text-[12px] tabular-nums text-foreground/55">
                  {i.note}
                </span>
              )}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
