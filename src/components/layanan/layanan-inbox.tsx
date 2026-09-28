"use client";

import { useMemo, useRef, useState, useTransition } from "react";
import { toast } from "sonner";
import { ExternalLink, FileUp, Inbox, Mail, MessageCircle, Search } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { SegmentedTabs } from "@/components/common/tabs";
import type { ServiceRequest, ServiceRequestStatus } from "@/lib/data/types";
import { formatDateTime } from "@/lib/format/dates";
import { cn } from "@/lib/utils";

const STATUS: { value: ServiceRequestStatus; label: string; cls: string }[] = [
  { value: "diajukan", label: "Diajukan", cls: "bg-amber-500/15 text-amber-700 dark:text-amber-300" },
  { value: "diproses", label: "Diproses", cls: "bg-sky-500/15 text-sky-700 dark:text-sky-300" },
  { value: "selesai", label: "Selesai", cls: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300" },
  { value: "ditolak", label: "Ditolak", cls: "bg-red-500/15 text-red-700 dark:text-red-300" },
];
const statusOf = (s: ServiceRequestStatus) => STATUS.find((x) => x.value === s)!;

type Filter = "semua" | ServiceRequestStatus;

export function LayananInbox({ initial, canEdit }: { initial: ServiceRequest[]; canEdit: boolean }) {
  const [items, setItems] = useState(initial);
  const [filter, setFilter] = useState<Filter>("diajukan");
  const [q, setQ] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(initial[0]?.id ?? null);

  const counts = useMemo(() => {
    const c: Record<string, number> = { semua: items.length };
    for (const s of STATUS) c[s.value] = items.filter((i) => i.status === s.value).length;
    return c;
  }, [items]);

  const visible = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return items.filter(
      (i) =>
        (filter === "semua" || i.status === filter) &&
        (!needle || [i.code, i.name, i.nim, i.type].some((v) => v.toLowerCase().includes(needle))),
    );
  }, [items, filter, q]);

  const selected = items.find((i) => i.id === selectedId) ?? null;

  return (
    <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_1.2fr]">
      <GlassCard variant="thick" className="p-4">
        <div className="max-w-full overflow-x-auto">
          <SegmentedTabs<Filter>
            size="sm"
            value={filter}
            onChange={setFilter}
            options={[
              { value: "semua", label: `Semua ${counts.semua}` },
              ...STATUS.map((s) => ({ value: s.value as Filter, label: `${s.label} ${counts[s.value]}` })),
            ]}
          />
        </div>
        <label className="mt-3 flex items-center gap-2 rounded-2xl border border-foreground/10 px-3 py-2 dark:border-white/10">
          <Search className="size-4 text-foreground/45" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Cari kode, nama, NIM, jenis…"
            className="w-full bg-transparent text-[14px] outline-none"
          />
        </label>

        <ul className="mt-3 grid gap-1.5">
          {visible.length === 0 && (
            <li className="flex flex-col items-center gap-2 py-12 text-center text-[13px] text-foreground/55">
              <Inbox className="size-6" strokeWidth={1.5} /> Tidak ada pengajuan.
            </li>
          )}
          {visible.map((r) => (
            <li key={r.id}>
              <button
                type="button"
                onClick={() => setSelectedId(r.id)}
                className={cn(
                  "w-full rounded-2xl px-3 py-2.5 text-left transition-colors",
                  r.id === selectedId ? "bg-brand-500/10 ring-1 ring-brand-500/30" : "hover:bg-foreground/5",
                )}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="truncate text-[14px] font-medium">{r.type}</span>
                  <span className={cn("shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold", statusOf(r.status).cls)}>
                    {statusOf(r.status).label}
                  </span>
                </div>
                <div className="mt-0.5 flex items-center justify-between gap-2 text-[12px] text-foreground/55">
                  <span className="truncate">
                    {r.name} · {r.nim}
                  </span>
                  <span className="shrink-0 font-mono">{r.code}</span>
                </div>
              </button>
            </li>
          ))}
        </ul>
      </GlassCard>

      {selected ? (
        <RequestDetail
          key={selected.id}
          request={selected}
          canEdit={canEdit}
          onSaved={(u) => setItems((list) => list.map((x) => (x.id === u.id ? u : x)))}
        />
      ) : (
        <GlassCard className="grid place-items-center p-10 text-[13px] text-foreground/55">Pilih pengajuan.</GlassCard>
      )}
    </div>
  );
}

function RequestDetail({
  request,
  canEdit,
  onSaved,
}: {
  request: ServiceRequest;
  canEdit: boolean;
  onSaved: (r: ServiceRequest) => void;
}) {
  const [status, setStatus] = useState(request.status);
  const [note, setNote] = useState(request.adminNote);
  const [resultUrl, setResultUrl] = useState(request.resultUrl ?? "");
  const [pending, startTransition] = useTransition();
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const wa = request.phone.replace(/[^\d]/g, "").replace(/^0/, "62");

  function save() {
    startTransition(async () => {
      const res = await fetch(`/api/layanan/${request.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, adminNote: note, resultUrl }),
      });
      const j = await res.json().catch(() => ({}));
      if (!res.ok) {
        toast.error(j.error ?? "Gagal menyimpan");
        return;
      }
      onSaved(j.request);
      toast.success(status !== request.status ? "Status diperbarui & pemohon dikabari." : "Tersimpan.");
    });
  }

  async function upload(file: File) {
    setUploading(true);
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await fetch("/api/upload/file", { method: "POST", body: form });
      const j = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(j.error ?? "Upload gagal");
      setResultUrl(j.url);
      toast.success("Dokumen terunggah. Klik Simpan.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload gagal");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  return (
    <GlassCard variant="thick" className="p-5 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="font-mono text-[12px] text-foreground/55">{request.code}</p>
          <h2 className="font-display text-[20px] font-semibold tracking-tight">{request.type}</h2>
          <p className="text-[12px] text-foreground/55">Masuk {formatDateTime(request.createdAt)}</p>
        </div>
        <span className={cn("rounded-full px-2.5 py-1 text-[12px] font-semibold", statusOf(request.status).cls)}>
          {statusOf(request.status).label}
        </span>
      </div>

      <dl className="mt-5 grid gap-3 text-[14px] sm:grid-cols-2">
        <Info label="Nama" value={request.name} />
        <Info label="NIM" value={request.nim} />
        <Info label="Email" value={request.email} />
        <Info label="WhatsApp" value={request.phone} />
        <Info label="Keperluan" value={request.purpose} wide />
        {request.details && <Info label="Keterangan" value={request.details} wide />}
      </dl>

      <div className="mt-4 flex flex-wrap gap-2">
        <Button variant="secondary" size="sm" asChild>
          <a href={`mailto:${request.email}?subject=${encodeURIComponent(`[${request.code}] ${request.type}`)}`}>
            <Mail className="size-3.5" /> Email
          </a>
        </Button>
        {wa && (
          <Button variant="secondary" size="sm" asChild>
            <a href={`https://wa.me/${wa}`} target="_blank" rel="noopener noreferrer">
              <MessageCircle className="size-3.5" /> WhatsApp
            </a>
          </Button>
        )}
        {request.attachmentUrl && (
          <Button variant="secondary" size="sm" asChild>
            <a href={request.attachmentUrl} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="size-3.5" /> Lampiran
            </a>
          </Button>
        )}
      </div>

      <div className="mt-6 border-t border-foreground/10 pt-5 dark:border-white/10">
        <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-foreground/55">Proses</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {STATUS.map((s) => (
            <button
              key={s.value}
              type="button"
              disabled={!canEdit}
              onClick={() => setStatus(s.value)}
              className={cn(
                "rounded-full px-3 py-1.5 text-[13px] font-medium transition-colors disabled:opacity-60",
                status === s.value ? s.cls + " ring-1 ring-current" : "bg-foreground/5 text-foreground/65 hover:bg-foreground/10",
              )}
            >
              {s.label}
            </button>
          ))}
        </div>
        <label className="mt-4 block">
          <span className="mb-1 block text-[12px] text-foreground/60">Catatan untuk pemohon (tampil di halaman cek status)</span>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            disabled={!canEdit}
            rows={3}
            className="w-full resize-y rounded-2xl border border-foreground/10 bg-foreground/[0.03] px-3 py-2 text-[14px] outline-none dark:border-white/10"
          />
        </label>
        <label className="mt-3 block">
          <span className="mb-1 block text-[12px] text-foreground/60">Dokumen hasil (bisa diunduh pemohon)</span>
          <div className="flex items-center gap-2 rounded-2xl border border-foreground/10 bg-foreground/[0.03] px-3 py-1.5 dark:border-white/10">
            <input
              value={resultUrl}
              onChange={(e) => setResultUrl(e.target.value)}
              disabled={!canEdit}
              placeholder="https://…"
              className="min-w-0 flex-1 bg-transparent py-1 text-[14px] outline-none"
            />
            <input ref={fileRef} type="file" hidden accept=".pdf,.docx,.xlsx,image/*" onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])} />
            {canEdit && (
              <Button type="button" variant="ghost" size="sm" disabled={uploading} onClick={() => fileRef.current?.click()}>
                <FileUp className="size-3.5" /> {uploading ? "Mengunggah…" : "Unggah"}
              </Button>
            )}
          </div>
        </label>
        {canEdit && (
          <div className="mt-4 flex justify-end">
            <Button disabled={pending} onClick={save}>
              {pending ? "Menyimpan…" : "Simpan"}
            </Button>
          </div>
        )}
      </div>

      {request.history.length > 0 && (
        <ol className="mt-6 grid gap-2 border-t border-foreground/10 pt-5 text-[12px] text-foreground/60 dark:border-white/10">
          {request.history.map((h, i) => (
            <li key={i}>
              <span className="font-medium text-foreground/80">{statusOf(h.status).label}</span> · {formatDateTime(h.at)}
              {h.note ? ` — ${h.note}` : ""}
            </li>
          ))}
        </ol>
      )}
    </GlassCard>
  );
}

function Info({ label, value, wide }: { label: string; value: string; wide?: boolean }) {
  return (
    <div className={cn(wide && "sm:col-span-2")}>
      <dt className="text-[11px] uppercase tracking-[0.14em] text-foreground/50">{label}</dt>
      <dd className="mt-0.5 whitespace-pre-line break-words">{value}</dd>
    </div>
  );
}
