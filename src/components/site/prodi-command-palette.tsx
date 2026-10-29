"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowRight,
  BookOpen,
  FileCheck2,
  GraduationCap,
  Search,
  Sparkles,
  UserRound,
  X,
} from "lucide-react";
import { dosen, kurikulum, navGroups } from "@/lib/site/prodi";
import { dosenSlug } from "@/lib/site/names";
import { kamusAwal } from "@/lib/site/kamus-data";

type PaletteItem = {
  id: string;
  category: "Halaman & Layanan" | "Dosen & Pimpinan" | "Mata Kuliah" | "Kamus Ekonomi Syariah";
  title: string;
  subtitle: string;
  href: string;
  keywords: string;
};

const STATIC_ITEMS: PaletteItem[] = [
  ...navGroups.flatMap((g) => [
    {
      id: `nav-${g.href}`,
      category: "Halaman & Layanan" as const,
      title: g.label,
      subtitle: `Halaman utama ${g.label}`,
      href: g.href,
      keywords: `${g.label} beranda menu`,
    },
    ...(g.items ?? []).map((it) => ({
      id: `sub-${it.href}`,
      category: "Halaman & Layanan" as const,
      title: it.label,
      subtitle: it.description ?? g.label,
      href: it.href,
      keywords: `${it.label} ${it.description ?? ""} ${g.label}`,
    })),
  ]),
  {
    id: "form-pinjam",
    category: "Halaman & Layanan",
    title: "Formulir Peminjaman Ruang & Alat",
    subtitle: "Pinjam Aula FEBI, GIS BEI, Lab Mini Banking, atau Ruang Sidang",
    href: "/prodi/formulir/pinjam",
    keywords: "pinjam ruang alat aula lab",
  },
  {
    id: "form-saran",
    category: "Halaman & Layanan",
    title: "Kotak Saran & Masukan Layanan Prodi",
    subtitle: "Sampaikan aspirasi, evaluasi mutu, atau saran akademik",
    href: "/prodi/formulir/saran",
    keywords: "saran masukan keluhan survei mutu",
  },
  ...dosen.map((d) => ({
    id: `dosen-${d.name}`,
    category: "Dosen & Pimpinan" as const,
    title: d.name,
    subtitle: `${d.role} · ${(d.expertise ?? []).join(", ")}`,
    href: `/prodi/dosen/${dosenSlug(d.name)}`,
    keywords: `${d.name} ${d.role} ${(d.expertise ?? []).join(" ")}`,
  })),
  ...kurikulum.flatMap((yr) =>
    yr.semesters.flatMap((sem) =>
      sem.courses.map((c) => ({
        id: `mk-${sem.name}-${c}`,
        category: "Mata Kuliah" as const,
        title: c,
        subtitle: `${sem.name} · ${yr.label} Kurikulum S1 Ekonomi Syariah`,
        href: "/prodi/akademik#kurikulum",
        keywords: `${c} ${sem.name} mata kuliah kurikulum sks`,
      })),
    ),
  ),
  ...kamusAwal.slice(0, 30).map((k) => ({
    id: `kamus-${k.istilah}`,
    category: "Kamus Ekonomi Syariah" as const,
    title: k.istilah,
    subtitle: k.arti,
    href: `/prodi/alat?q=${encodeURIComponent(k.istilah)}#kamus`,
    keywords: `${k.istilah} ${k.arti} ${k.kategori ?? ""}`,
  })),
];

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
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 40);
    }
  }, [open]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) {
      return STATIC_ITEMS.slice(0, 12);
    }
    const tokens = q.split(/\s+/).filter(Boolean);
    return STATIC_ITEMS.filter((it) => {
      const hay = `${it.title} ${it.subtitle} ${it.keywords}`.toLowerCase();
      return tokens.every((t) => hay.includes(t));
    }).slice(0, 16);
  }, [query]);

  const go = (href: string) => {
    onClose();
    setQuery("");
    router.push(href);
  };

  const iconFor = (cat: PaletteItem["category"]) => {
    switch (cat) {
      case "Dosen & Pimpinan":
        return UserRound;
      case "Mata Kuliah":
        return GraduationCap;
      case "Kamus Ekonomi Syariah":
        return Sparkles;
      default:
        return BookOpen;
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label="Pencarian cepat website Ekonomi Syariah"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.16 }}
          className="fixed inset-0 z-[80] flex items-start justify-center bg-navy/45 px-4 pt-16 backdrop-blur-xs sm:pt-24"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: -8 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-2xl overflow-hidden rounded-[24px] border border-hairline bg-canvas shadow-[0_24px_64px_rgba(12,35,64,0.28)]"
          >
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (query.trim()) {
                  go(`/prodi/cari?q=${encodeURIComponent(query.trim())}`);
                } else if (filtered[0]) {
                  go(filtered[0].href);
                }
              }}
              className="flex items-center gap-3 border-b border-hairline px-4 py-3.5 sm:px-5"
            >
              <Search className="size-5 shrink-0 text-accent" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Cari dosen, skripsi, mata kuliah, beasiswa, atau istilah syariah…"
                className="min-w-0 flex-1 bg-transparent text-[15px] text-label outline-none placeholder:text-label-3"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="rounded-full p-1 text-label-3 hover:bg-mist hover:text-label"
                  aria-label="Bersihkan pencarian"
                >
                  <X className="size-4" />
                </button>
              )}
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg border border-hairline bg-mist px-2 py-1 text-[11px] font-semibold text-label-2 hover:text-label"
              >
                ESC
              </button>
            </form>

            <div className="max-h-[62vh] overflow-y-auto p-2 sm:p-3">
              {query.trim().length > 0 && (
                <button
                  type="button"
                  onClick={() =>
                    go(`/prodi/cari?q=${encodeURIComponent(query.trim())}`)
                  }
                  className="mb-2 flex w-full items-center justify-between gap-3 rounded-2xl border border-accent/25 bg-accent-soft/60 px-4 py-3 text-left transition-colors hover:bg-accent-soft"
                >
                  <span className="flex items-center gap-2.5 min-w-0">
                    <FileCheck2 className="size-4 shrink-0 text-accent" />
                    <span className="truncate text-[14px] font-semibold text-label">
                      Telusuri &ldquo;{query.trim()}&rdquo; di 515+ Skripsi, Berita & Dokumen
                    </span>
                  </span>
                  <ArrowRight className="size-4 shrink-0 text-accent" />
                </button>
              )}

              {filtered.length > 0 ? (
                <ul className="space-y-1">
                  {filtered.map((item) => {
                    const Icon = iconFor(item.category);
                    return (
                      <li key={item.id}>
                        <button
                          type="button"
                          onClick={() => go(item.href)}
                          className="group flex w-full items-center justify-between gap-3 rounded-xl px-3.5 py-2.5 text-left transition-colors hover:bg-mist"
                        >
                          <span className="flex min-w-0 items-center gap-3">
                            <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-mist text-accent group-hover:bg-canvas">
                              <Icon className="size-4" />
                            </span>
                            <span className="min-w-0">
                              <span className="block truncate text-[14px] font-semibold text-label group-hover:text-accent">
                                {item.title}
                              </span>
                              <span className="block truncate text-[12px] text-label-2">
                                {item.category} · {item.subtitle}
                              </span>
                            </span>
                          </span>
                          <ArrowRight className="size-3.5 shrink-0 text-label-3 transition-transform group-hover:translate-x-0.5 group-hover:text-accent" />
                        </button>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <div className="py-8 text-center text-[14px] text-label-2">
                  Tekan <strong>Enter</strong> untuk mencari &ldquo;{query}&rdquo; di Direktori Skripsi & Berita.
                </div>
              )}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 border-t border-hairline bg-mist/50 px-4 py-2.5 text-[11.5px] text-label-2">
              <span>
                Pintasan: <kbd className="rounded border border-hairline bg-canvas px-1.5 py-0.5 font-mono text-[10.5px]">⌘K</kbd> atau <kbd className="rounded border border-hairline bg-canvas px-1.5 py-0.5 font-mono text-[10.5px]">Ctrl+K</kbd>
              </span>
              <button
                type="button"
                onClick={() => go("/prodi/cari")}
                className="font-semibold text-accent hover:underline"
              >
                Buka Halaman Pencarian Lengkap ›
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
