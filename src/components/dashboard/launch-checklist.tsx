import Link from "next/link";
import { CheckCircle2, Circle } from "lucide-react";
import { getSiteSetting, listContents } from "@/lib/data/provider";
import { defaultWebsiteConfig } from "@/lib/site/defaults";
import { getSite } from "@/lib/site/get-site";

type Item = { label: string; done: boolean; href: string; note?: string };

const same = (a: unknown, b: unknown) =>
  JSON.stringify(a) === JSON.stringify(b);

/**
 * Daftar periksa sebelum website diluncurkan: bagian yang masih berisi data
 * contoh atau belum diisi. Hilang sendiri setelah semuanya beres.
 */
export async function LaunchChecklist() {
  const [site, contents, igToken] = await Promise.all([
    getSite(),
    listContents({ status: "published" }).catch(() => []),
    getSiteSetting("instagram_token").catch(() => null),
  ]);
  const d = defaultWebsiteConfig;
  const fotoDosen = site.dosen.filter((x) => x.photo).length;
  const items: Item[] = [
    {
      label: "Foto utama beranda",
      done: !!site.identity.heroImage || site.galeri.length > 0,
      href: "/settings/website?bagian=beranda",
    },
    {
      label: "Sejarah, visi & misi dari Kaprodi",
      done: !same(site.profil, d.profil),
      href: "/settings/website?bagian=profil",
    },
    {
      label: "Foto dosen",
      done: site.dosen.length > 0 && fotoDosen === site.dosen.length,
      note: `${fotoDosen}/${site.dosen.length}`,
      href: "/settings/website?bagian=profil",
    },
    {
      label: "Angka sorotan beranda",
      done: !same(site.sorotan, d.sorotan),
      href: "/settings/website?bagian=beranda",
    },
    {
      label: "Foto kegiatan di galeri",
      done: site.galeri.length >= 6,
      note: `${site.galeri.length}/6`,
      href: "/settings/website?bagian=kegiatan",
    },
    {
      label: "Instagram tersambung",
      done: !!igToken || !!process.env.INSTAGRAM_ACCESS_TOKEN,
      href: "/content/instagram",
    },
    {
      label: "Berita pertama terbit",
      done: contents.length > 0,
      href: "/content/new",
    },
  ];
  const left = items.filter((i) => !i.done).length;
  if (!left) return null;

  return (
    <section className="glass-regular mt-6 rounded-xl">
      <header className="flex items-center justify-between border-b border-foreground/[0.07] px-5 py-3.5 dark:border-white/[0.07]">
        <h2 className="text-[14px] font-semibold">Siapkan website</h2>
        <span className="text-[12px] text-foreground/55">
          {items.length - left}/{items.length} selesai
        </span>
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
              <span
                className={
                  i.done ? "flex-1 text-foreground/45 line-through" : "flex-1"
                }
              >
                {i.label}
              </span>
              {i.note && !i.done && (
                <span className="text-[12px] tabular-nums text-foreground/45">
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
