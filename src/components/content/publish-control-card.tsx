"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import {
  Globe,
  CheckCircle2,
  RotateCcw,
  ExternalLink,
  Loader2,
  Clock,
  FileText,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusPill } from "@/components/common/pill";
import { formatLongDate, relativeFromNow } from "@/lib/format/dates";
import type { ContentItem, ContentStatus } from "@/lib/data/types";

interface Props {
  content: ContentItem;
  canEdit: boolean;
}

export function PublishControlCard({ content, canEdit }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<ContentStatus>(content.status);
  const isPublished = status === "published";

  const handleUpdateStatus = (newStatus: ContentStatus) => {
    startTransition(async () => {
      try {
        const payload: Record<string, unknown> = { status: newStatus };
        if (newStatus === "published" && !content.publishedAt) {
          payload.publishedAt = new Date().toISOString();
        }
        const res = await fetch(`/api/contents/${content.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error("Gagal memperbarui status");
        setStatus(newStatus);
        toast.success(
          newStatus === "published"
            ? "Artikel berhasil diterbitkan ke website!"
            : newStatus === "draft"
              ? "Artikel dikembalikan ke draf."
              : "Status artikel berhasil diperbarui.",
        );
        router.refresh();
      } catch {
        toast.error("Kendala saat memperbarui status konten.");
      }
    });
  };

  return (
    <div className="rounded-2xl border border-hairline bg-canvas p-5 shadow-2xs">
      <div className="flex items-center justify-between border-b border-hairline pb-3">
        <h3 className="text-[13px] font-semibold text-label">
          Status &amp; Publikasi
        </h3>
        <StatusPill status={status} size="sm" />
      </div>

      <div className="mt-4 space-y-3">
        {/* Status Info */}
        {isPublished ? (
          <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-3 text-emerald-800 dark:text-emerald-300">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="size-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
              <p className="text-[13px] font-semibold">Tayang di Website Prodi</p>
            </div>
            <p className="mt-1 text-[12px] opacity-80">
              Artikel ini aktif dan dapat dibaca oleh seluruh civitas akademika &amp; publik.
            </p>
            {content.publishedAt && (
              <p className="mt-1.5 text-[11px] font-mono opacity-70">
                Terbit: {formatLongDate(content.publishedAt)}
              </p>
            )}
          </div>
        ) : (
          <div className="rounded-xl border border-hairline bg-mist p-3 text-label-2">
            <div className="flex items-center gap-2">
              <FileText className="size-4 shrink-0 text-label-3" />
              <p className="text-[13px] font-semibold text-label">
                {status === "review_divisi" || status === "review_sekjen"
                  ? "Menunggu Persetujuan"
                  : "Draf (Belum Tayang)"}
              </p>
            </div>
            <p className="mt-1 text-[12px] text-label-3">
              {status === "review_divisi" || status === "review_sekjen"
                ? "Artikel siap ditinjau. Anda dapat langsung menerbitkannya ke website."
                : "Artikel masih dalam bentuk draf dan belum tampil di website publik."}
            </p>
          </div>
        )}

        {/* Tombol Aksi 1-Klik */}
        {canEdit && (
          <div className="space-y-2 pt-1">
            {!isPublished ? (
              <button
                type="button"
                disabled={isPending}
                onClick={() => handleUpdateStatus("published")}
                className="flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 text-[13px] font-semibold text-white shadow-xs transition-all hover:bg-emerald-700 disabled:opacity-50 dark:bg-emerald-500"
              >
                {isPending ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <CheckCircle2 className="size-4" />
                )}
                <span>Terbitkan Sekarang ke Website</span>
              </button>
            ) : (
              <button
                type="button"
                disabled={isPending}
                onClick={() => handleUpdateStatus("draft")}
                className="flex h-10 w-full items-center justify-center gap-2 rounded-xl border border-hairline bg-canvas text-[13px] font-medium text-label-2 shadow-2xs transition-all hover:bg-mist hover:text-label disabled:opacity-50"
              >
                {isPending ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <RotateCcw className="size-4" />
                )}
                <span>Tarik Kembali ke Draf</span>
              </button>
            )}

            {/* Link Preview Website Publik */}
            {isPublished && (
              <Link
                href={`/prodi/berita/${content.slug || content.id}`}
                target="_blank"
                className="flex h-9 w-full items-center justify-center gap-1.5 rounded-xl border border-hairline bg-mist/60 text-[12.5px] font-medium text-label-2 transition-colors hover:bg-mist hover:text-accent"
              >
                <Globe className="size-3.5" />
                <span>Buka di Website Publik</span>
                <ExternalLink className="size-3 opacity-60" />
              </Link>
            )}
          </div>
        )}

        {/* Pemilih Status Manual */}
        {canEdit && (
          <div className="border-t border-hairline pt-3">
            <label className="block text-[11.5px] font-medium text-label-3">
              Ubah Status Alur Kerja
            </label>
            <select
              value={status}
              disabled={isPending}
              onChange={(e) => handleUpdateStatus(e.target.value as ContentStatus)}
              className="mt-1.5 h-9 w-full rounded-xl border border-hairline bg-canvas px-3 text-[12.5px] text-label outline-none focus:border-accent"
            >
              <option value="draft">Draf</option>
              <option value="review_divisi">Menunggu Review</option>
              <option value="published">Terbit (Tayang di Web)</option>
              <option value="archived">Arsip</option>
            </select>
          </div>
        )}
      </div>
    </div>
  );
}
