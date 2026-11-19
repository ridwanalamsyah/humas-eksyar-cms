"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, Search, X } from "lucide-react";
import { dosen, kurikulum, navGroups } from "@/lib/site/prodi";
import { dosenSlug } from "@/lib/site/names";
import { kamusAwal } from "@/lib/site/kamus-data";

type PaletteItem = {
  id: string;
  category: "Halaman" | "Dosen" | "Mata kuliah" | "Kamus";
  title: string;
  subtitle: string;
  href: string;
  keywords: string;
};

const STATIC_ITEMS: PaletteItem[] = [
  ...navGroups.flatMap((g) => [
    {
      id: `nav-${g.href}`,
      category: "Halaman" as const,
      title: g.label,
      subtitle: `Halaman utama ${g.label}`,
      href: g.href,
      keywords: `${g.label} beranda menu`,
    },
    ...(g.items ?? []).map((it) => ({
      id: `sub-${it.href}`,
      category: "Halaman" as const,
      title: it.label,
      subtitle: it.description ?? g.label,
      href: it.href,
      keywords: `${it.label} ${it.description ?? ""} ${g.label}`,
    })),
  ]),
  ...dosen.map((d) => ({
    id: `dosen-${d.name}`,
    category: "Dosen" as const,
    title: d.name,
    subtitle: `${d.role} · ${(d.expertise ?? []).join(", ")}`,
    href: `/prodi/dosen/${dosenSlug(d.name)}`,
    keywords: `${d.name} ${d.role} ${(d.expertise ?? []).join(" ")}`,
  })),
  ...kurikulum.flatMap((yr) =>
    yr.semesters.flatMap((sem) =>
      sem.courses.map((c) => ({
        id: `mk-${sem.name}-${c}`,
        category: "Mata kuliah" as const,
        title: c,
        subtitle: `${sem.name} · ${yr.label} Kurikulum S1 Ekonomi Syariah`,
        href: "/prodi/akademik#kurikulum",
        keywords: `${c} ${sem.name} mata kuliah kurikulum sks`,
      })),
    ),
  ),
  ...kamusAwal.slice(0, 30).map((k) => ({
    id: `kamus-${k.istilah}`,
    category: "Kamus" as const,
    title: k.istilah,
    subtitle: k.arti,
    href: `/prodi/alat?q=${encodeURIComponent(k.istilah)}#kamus`,
    keywords: `${k.istilah} ${k.arti} ${k.kategori ?? ""}`,
  })),
];

/** Ditampilkan saat kolom masih kosong. */
const POPULAR: PaletteItem[] = [
  ["/prodi/skripsi", "Direktori skripsi"],
  ["/prodi/akademik", "Kurikulum & RPS"],
  ["/prodi/dosen", "Dosen & staf"],
  ["/prodi/beasiswa", "Beasiswa"],
  ["/prodi/kalender", "Kalender akademik"],
  ["/prodi/berita", "Berita & Buletin"],
].map(([href, title]) => ({ id: `pop-${href}`, category: "Halaman", title, subtitle: "", href, keywords: title }));

export function ProdiCommandPalette({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 60);
  }, [open]);

  // Teks dikosongkan saat ditutup, supaya dibuka lagi mulai dari awal.
  const close = () => {
    setQuery("");
    onClose();
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return POPULAR;
    const tokens = q.split(/\s+/).filter(Boolean);
    return STATIC_ITEMS.filter((item) => {
      const hay = `${item.title} ${item.subtitle} ${item.keywords}`.toLowerCase();
      return tokens.every((t) => hay.includes(t));
    }).slice(0, 20);
  }, [query]);

  const go = (href: string) => {
    close();
    router.push(href);
  };

  const q = query.trim();
  const search = () => go(`/prodi/cari?q=${encodeURIComponent(q)}`);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 z-[80] flex items-start justify-center bg-navy/40 backdrop-blur-xs sm:px-4 sm:pt-24"
          onClick={close}
        >
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-label="Cari di website"
            className="flex h-dvh w-full flex-col overflow-hidden bg-canvas sm:h-auto sm:max-h-[70vh] sm:max-w-xl sm:rounded-[20px] sm:shadow-[0_24px_64px_rgba(12,35,64,0.25)]"
          >
            {/* Kolom cari */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (q) search();
                else if (filtered[0]) go(filtered[0].href);
              }}
              className="flex shrink-0 items-center gap-3 border-b border-hairline px-4 py-2 sm:px-5"
            >
              <Search className="size-5 shrink-0 text-label-3" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Cari di website"
                enterKeyHint="search"
                className="search-input h-12 min-w-0 flex-1 bg-transparent text-[16px] text-label outline-none placeholder:text-label-3"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="grid size-9 place-items-center rounded-full text-label-3 hover:bg-mist hover:text-label"
                  aria-label="Hapus teks"
                >
                  <X className="size-4" />
                </button>
              )}
              <button
                type="button"
                onClick={close}
                className="min-h-11 shrink-0 text-[15px] font-semibold text-accent sm:hidden"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={close}
                aria-label="Tutup"
                className="hidden size-9 place-items-center rounded-full text-label-3 hover:bg-mist hover:text-label sm:grid"
              >
                <X className="size-5" />
              </button>
            </form>

            {/* Hasil */}
            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 pb-6 sm:px-5 sm:pb-4">
              {q && (
                <button
                  type="button"
                  onClick={search}
                  className="flex w-full items-center justify-between gap-3 border-b border-hairline py-3.5 text-left"
                >
                  <span className="min-w-0 truncate text-[15px] text-label">
                    Cari &ldquo;<span className="font-semibold">{q}</span>&rdquo; di semua halaman
                  </span>
                  <ArrowRight className="size-4 shrink-0 text-accent" />
                </button>
              )}

              {!q && <p className="pb-1 pt-4 text-[13px] font-semibold text-label-3">Sering dicari</p>}

              {filtered.length > 0 ? (
                <ul className="divide-y divide-hairline">
                  {filtered.map((item) => (
                    <li key={item.id}>
                      <button
                        type="button"
                        onClick={() => go(item.href)}
                        className="group flex w-full items-baseline justify-between gap-4 py-3 text-left"
                      >
                        <span className="min-w-0 truncate text-[15px] font-medium text-label group-hover:text-accent">
                          {item.title}
                        </span>
                        {q && <span className="shrink-0 text-[13px] text-label-3">{item.category}</span>}
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="py-10 text-center text-[15px] text-label-2">
                  Tidak ada halaman yang cocok. Tekan Enter untuk mencari di semua isi website.
                </p>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
