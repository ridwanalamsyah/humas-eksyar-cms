"use client";

import { useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Search,
  LayoutGrid,
  List as ListIcon,
  Plus,
  Pencil,
  ExternalLink,
  FileText,
  Trash2,
  CheckCircle2,
  RotateCcw,
  Filter,
} from "lucide-react";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/common/avatar";
import { StatusPill } from "@/components/common/pill";
import { ContentCard } from "@/components/content/content-card";
import { findMember } from "@/lib/fixtures/members";
import { findMedia } from "@/lib/fixtures/media";
import { rubricLabel } from "@/lib/site/content";
import { relativeFromNow, formatShortDate } from "@/lib/format/dates";
import { cn } from "@/lib/utils";
import type { ContentItem } from "@/lib/data/types";

type View = "list" | "grid";
type StatusFilter = "all" | "published" | "draft" | "review" | "archived";

interface Props {
  contents: ContentItem[];
}

export function ContentBoard({ contents }: Props) {
  const router = useRouter();
  const [view, setView] = useState<View>("list");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [rubricFilter, setRubricFilter] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  // Hitung jumlah tiap kategori status
  const counts = useMemo(() => {
    return {
      all: contents.length,
      published: contents.filter((c) => c.status === "published").length,
      draft: contents.filter((c) => c.status === "draft" || c.status === "idea").length,
      review: contents.filter((c) => c.status === "review_divisi" || c.status === "review_sekjen").length,
      archived: contents.filter((c) => c.status === "archived").length,
    };
  }, [contents]);

  // Daftar rubrik unik
  const rubrics = useMemo(() => {
    const set = new Set(contents.map((c) => c.rubric).filter(Boolean));
    return Array.from(set);
  }, [contents]);

  // Filter konten
  const filtered = useMemo(() => {
    return contents.filter((c) => {
      // Filter status
      if (statusFilter === "published" && c.status !== "published") return false;
      if (statusFilter === "draft" && c.status !== "draft" && c.status !== "idea") return false;
      if (statusFilter === "review" && c.status !== "review_divisi" && c.status !== "review_sekjen") return false;
      if (statusFilter === "archived" && c.status !== "archived") return false;

      // Filter rubrik
      if (rubricFilter !== "all" && c.rubric !== rubricFilter) return false;

      // Filter pencarian
      if (search.trim()) {
        const q = search.toLowerCase();
        const inTitle = c.title.toLowerCase().includes(q);
        const inCaption = (c.caption || "").toLowerCase().includes(q);
        const inBody = (c.body || "").toLowerCase().includes(q);
        if (!inTitle && !inCaption && !inBody) return false;
      }

      return true;
    });
  }, [contents, statusFilter, rubricFilter, search]);

  // Aksi Cepat 1-Klik: Terbitkan Langsung ke Website
  const handleQuickPublish = (c: ContentItem) => {
    setPendingId(c.id);
    startTransition(async () => {
      try {
        const res = await fetch(`/api/contents/${c.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            status: "published",
            publishedAt: new Date().toISOString(),
          }),
        });
        if (!res.ok) throw new Error("Gagal menerbitkan");
        toast.success(`"${c.title.slice(0, 32)}…" berhasil diterbitkan ke website!`);
        router.refresh();
      } catch {
        toast.error("Kendala saat menerbitkan konten.");
      } finally {
        setPendingId(null);
      }
    });
  };

  // Aksi Cepat 1-Klik: Kembalikan ke Draf
  const handleQuickDraft = (c: ContentItem) => {
    setPendingId(c.id);
    startTransition(async () => {
      try {
        const res = await fetch(`/api/contents/${c.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: "draft" }),
        });
        if (!res.ok) throw new Error("Gagal mengubah status");
        toast.success("Konten ditarik kembali menjadi draf.");
        router.refresh();
      } catch {
        toast.error("Kendala saat mengubah status draf.");
      } finally {
        setPendingId(null);
      }
    });
  };

  // Hapus Konten
  const handleDelete = (c: ContentItem) => {
    if (!confirm(`Hapus artikel "${c.title}"? Tindakan ini tidak dapat dibatalkan.`)) return;
    setPendingId(c.id);
    startTransition(async () => {
      try {
        const res = await fetch(`/api/contents/${c.id}`, { method: "DELETE" });
        if (!res.ok) throw new Error("Gagal menghapus");
        toast.success("Artikel berhasil dihapus.");
        router.refresh();
      } catch {
        toast.error("Gagal menghapus artikel.");
      } finally {
        setPendingId(null);
      }
    });
  };

  return (
    <div className="space-y-4">
      {/* 1. Filter Tab Status Sederhana (Tidak Perlu Geser Kanban) */}
      <div className="flex flex-wrap items-center gap-1.5 border-b border-hairline pb-3">
        {(
          [
            { id: "all", label: "Semua", count: counts.all },
            { id: "published", label: "Terbit di Web", count: counts.published },
            { id: "draft", label: "Draf & Ide", count: counts.draft },
            { id: "review", label: "Menunggu Review", count: counts.review },
            { id: "archived", label: "Arsip", count: counts.archived },
          ] as const
        ).map((tab) => {
          const active = statusFilter === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setStatusFilter(tab.id)}
              className={cn(
                "relative inline-flex items-center gap-2 rounded-xl px-3.5 py-1.5 text-[13px] font-medium transition-colors",
                active
                  ? "text-white"
                  : "bg-canvas text-label-2 hover:bg-mist hover:text-label",
              )}
            >
              {active && (
                <motion.span
                  layoutId="content-status-pill"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  className="absolute inset-0 rounded-xl bg-accent shadow-xs"
                />
              )}
              <span className="relative z-10">{tab.label}</span>
              <span
                className={cn(
                  "relative z-10 rounded-full px-1.5 py-0.2 text-[13px] tabular-nums transition-colors",
                  active
                    ? "bg-white/20 text-white"
                    : "bg-foreground/8 text-foreground/60 dark:bg-white/10",
                )}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* 2. Bilah Kontrol: Cari, Filter Rubrik, Toggle Tampilan, dan Tombol Buat Konten */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 flex-wrap items-center gap-2">
          {/* Kotak Pencarian */}
          <div className="flex flex-1 min-w-[220px] items-center gap-2 rounded-xl border border-hairline bg-canvas px-3 py-1.5 shadow-2xs">
            <Search className="size-4 shrink-0 text-label-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari judul atau isi artikel…"
              className="w-full bg-transparent text-[13.5px] text-label outline-none placeholder:text-label-3"
            />
          </div>

          {/* Filter Rubrik */}
          {rubrics.length > 0 && (
            <div className="flex items-center gap-1.5 rounded-xl border border-hairline bg-canvas px-2.5 py-1.5 shadow-2xs">
              <Filter className="size-3.5 text-label-3" />
              <select
                value={rubricFilter}
                onChange={(e) => setRubricFilter(e.target.value)}
                className="bg-transparent text-[13px] font-medium text-label outline-none"
              >
                <option value="all">Semua Rubrik</option>
                {rubrics.map((r) => (
                  <option key={r} value={r}>
                    {rubricLabel(r)}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Switch View & Tombol Konten Baru */}
        <div className="flex items-center gap-2">
          <div className="flex items-center rounded-xl border border-hairline bg-canvas p-0.5 shadow-2xs">
            <button
              type="button"
              onClick={() => setView("list")}
              className={cn(
                "flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[13px] font-medium transition-colors",
                view === "list"
                  ? "bg-foreground/10 text-label font-semibold dark:bg-white/15"
                  : "text-label-3 hover:text-label",
              )}
            >
              <ListIcon className="size-3.5" />
              <span>Tabel</span>
            </button>
            <button
              type="button"
              onClick={() => setView("grid")}
              className={cn(
                "flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[13px] font-medium transition-colors",
                view === "grid"
                  ? "bg-foreground/10 text-label font-semibold dark:bg-white/15"
                  : "text-label-3 hover:text-label",
              )}
            >
              <LayoutGrid className="size-3.5" />
              <span>Grid</span>
            </button>
          </div>

          <Button asChild size="sm" className="gap-1.5 shadow-xs">
            <Link href="/content/new">
              <Plus className="size-4" /> Tulis Konten Baru
            </Link>
          </Button>
        </div>
      </div>

      {/* 3. Tampilan Daftar Utama (Tabel / List) */}
      {filtered.length === 0 ? (
        <EmptyState search={search} onReset={() => { setSearch(""); setStatusFilter("all"); setRubricFilter("all"); }} />
      ) : view === "list" ? (
        <div className="overflow-hidden rounded-2xl border border-hairline bg-canvas shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-hairline bg-mist/60 text-[13px] font-semibold uppercase tracking-wider text-label-3">
                  <th className="px-4 py-3 sm:px-6">Judul Artikel</th>
                  <th className="px-3 py-3 hidden md:table-cell">Rubrik</th>
                  <th className="px-3 py-3 hidden sm:table-cell">Penulis</th>
                  <th className="px-3 py-3">Status</th>
                  <th className="px-3 py-3 hidden lg:table-cell">Diperbarui</th>
                  <th className="px-4 py-3 text-right sm:px-6">Aksi Cepat</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-hairline text-[13.5px]">
                {filtered.map((c) => {
                  const author = findMember(c.authorId);
                  const isBusy = pendingId === c.id && isPending;
                  const isPublished = c.status === "published";

                  return (
                    <tr
                      key={c.id}
                      className="group transition-colors hover:bg-mist/40"
                    >
                      {/* Judul & Cuplikan */}
                      <td className="px-4 py-3.5 sm:px-6">
                        <div className="min-w-0 max-w-md">
                          <Link
                            href={`/content/${c.id}`}
                            className="font-medium text-label hover:text-accent transition-colors line-clamp-1 leading-snug"
                          >
                            {c.title}
                          </Link>
                          <p className="mt-0.5 line-clamp-1 text-[13px] text-label-3">
                            {(c.caption || c.body || "").replace(/[#\n]+/g, " ").trim() || "Tidak ada keterangan tambahan."}
                          </p>
                        </div>
                      </td>

                      {/* Rubrik */}
                      <td className="px-3 py-3.5 hidden md:table-cell">
                        <span className="inline-flex items-center rounded-md bg-mist px-2 py-0.5 text-[13px] font-medium text-label-2">
                          {rubricLabel(c.rubric)}
                        </span>
                      </td>

                      {/* Penulis */}
                      <td className="px-3 py-3.5 hidden sm:table-cell">
                        {author ? (
                          <div className="flex items-center gap-2">
                            <Avatar member={author} size={22} ring={false} />
                            <span className="text-[13px] text-label-2 truncate max-w-[120px]">
                              {author.name.split(" ")[0]}
                            </span>
                          </div>
                        ) : (
                          <span className="text-[13px] text-label-3">—</span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="px-3 py-3.5 whitespace-nowrap">
                        <StatusPill status={c.status} size="xs" />
                      </td>

                      {/* Tanggal */}
                      <td className="px-3 py-3.5 hidden lg:table-cell whitespace-nowrap text-[13px] text-label-3 font-mono">
                        {c.publishedAt ? formatShortDate(c.publishedAt) : relativeFromNow(c.updatedAt)}
                      </td>

                      {/* Aksi Cepat (1-Klik) */}
                      <td className="px-4 py-3.5 text-right sm:px-6 whitespace-nowrap">
                        <div className="inline-flex items-center justify-end gap-1.5">
                          {/* Tombol Terbitkan / Draf Langsung */}
                          {isPublished ? (
                            <button
                              type="button"
                              disabled={isBusy}
                              onClick={() => handleQuickDraft(c)}
                              title="Tarik kembali ke draf"
                              className="inline-flex items-center gap-1 rounded-lg border border-hairline bg-canvas px-2.5 py-1 text-[13px] font-medium text-label-2 hover:bg-mist hover:text-label transition-colors disabled:opacity-50"
                            >
                              <RotateCcw className="size-3" />
                              <span className="hidden sm:inline">Draf</span>
                            </button>
                          ) : (
                            <button
                              type="button"
                              disabled={isBusy}
                              onClick={() => handleQuickPublish(c)}
                              title="Terbitkan langsung ke website prodi"
                              className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-2.5 py-1 text-[13px] font-semibold text-white hover:bg-emerald-700 shadow-2xs transition-colors disabled:opacity-50 dark:bg-emerald-500"
                            >
                              <CheckCircle2 className="size-3" />
                              <span className="hidden sm:inline">Terbitkan</span>
                            </button>
                          )}

                          {/* Tombol Lihat di Web (Jika Terbit) */}
                          {isPublished && (
                            <Link
                              href={`/prodi/berita/${c.slug || c.id}`}
                              target="_blank"
                              title="Lihat di website publik"
                              className="inline-flex size-7 items-center justify-center rounded-lg border border-hairline bg-canvas text-label-3 hover:bg-mist hover:text-accent transition-colors"
                            >
                              <ExternalLink className="size-3.5" />
                            </Link>
                          )}

                          {/* Tombol Edit */}
                          <Link
                            href={`/content/${c.id}`}
                            title="Edit konten"
                            className="inline-flex size-7 items-center justify-center rounded-lg border border-hairline bg-canvas text-label-3 hover:bg-mist hover:text-label transition-colors"
                          >
                            <Pencil className="size-3.5" />
                          </Link>

                          {/* Tombol Hapus */}
                          <button
                            type="button"
                            disabled={isBusy}
                            onClick={() => handleDelete(c)}
                            title="Hapus artikel"
                            className="inline-flex size-7 items-center justify-center rounded-lg border border-hairline bg-canvas text-label-3 hover:bg-red-500/10 hover:text-red-600 transition-colors disabled:opacity-50"
                          >
                            <Trash2 className="size-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* 4. Tampilan Grid Kartu */
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((c) => {
            const author = findMember(c.authorId);
            const cover = c.mediaIds[0] ? findMedia(c.mediaIds[0]) : null;
            if (!author) return null;
            return <ContentCard key={c.id} content={c} author={author} cover={cover} />;
          })}
        </div>
      )}
    </div>
  );
}

function EmptyState({ search, onReset }: { search: string; onReset: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-hairline bg-canvas p-12 text-center">
      <div className="flex size-12 items-center justify-center rounded-full bg-mist text-label-3">
        <FileText className="size-6" />
      </div>
      <h3 className="mt-3 text-[15px] font-semibold text-label">Tidak ada konten ditemukan</h3>
      <p className="mt-1 max-w-sm text-[13px] text-label-2">
        {search
          ? `Tidak ada artikel yang cocok dengan kata kunci "${search}".`
          : "Belum ada artikel pada kategori ini."}
      </p>
      <div className="mt-4 flex gap-2">
        {search && (
          <Button variant="secondary" size="sm" onClick={onReset}>
            Reset Filter
          </Button>
        )}
        <Button asChild size="sm">
          <Link href="/content/new">
            <Plus className="size-4" /> Tulis Konten Baru
          </Link>
        </Button>
      </div>
    </div>
  );
}
