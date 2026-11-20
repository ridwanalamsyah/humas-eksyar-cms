"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import type { Event } from "@/lib/data/types";

const CATEGORIES: { value: Event["category"]; label: string }[] = [
  { value: "kegiatan_publik", label: "Kegiatan publik" },
  { value: "kajian", label: "Kajian" },
  { value: "pelatihan", label: "Pelatihan" },
  { value: "kompetisi", label: "Kompetisi" },
  { value: "perayaan", label: "Perayaan" },
  { value: "rapat", label: "Rapat (internal)" },
  { value: "agenda_internal", label: "Agenda internal" },
];
const INTERNAL = new Set<Event["category"]>(["rapat", "agenda_internal"]);

/** Tanggal & jam dalam WIB untuk isian formulir. */
function wib(iso: string | undefined) {
  if (!iso) return { date: "", time: "" };
  const d = new Date(new Date(iso).getTime() + 7 * 3600_000).toISOString();
  return { date: d.slice(0, 10), time: d.slice(11, 16) };
}

const field =
  "h-11 w-full rounded-xl border border-foreground/10 bg-white px-3 text-[14px] outline-none focus:border-brand-500/50";

/**
 * Formulir jadwal kegiatan. Tanpa `event` = tambah baru; dengan `event` =
 * ubah (dan tombol hapus). Kategori internal tidak tampil di website.
 */
export function EventForm({ event, onDone }: { event?: Event; onDone?: () => void }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const s = wib(event?.startsAt);
  const e = wib(event?.endsAt);
  const [f, setF] = useState({
    title: event?.title ?? "",
    category: event?.category ?? ("kegiatan_publik" as Event["category"]),
    date: s.date,
    start: s.time || "09:00",
    end: e.time || "11:00",
    location: event?.location ?? "",
    isOnline: event?.isOnline ?? false,
    description: event?.description ?? "",
  });
  const set = <K extends keyof typeof f>(k: K, v: (typeof f)[K]) => setF((p) => ({ ...p, [k]: v }));

  function save(ev: React.FormEvent) {
    ev.preventDefault();
    start(async () => {
      const body = {
        title: f.title,
        category: f.category,
        location: f.location,
        isOnline: f.isOnline,
        description: f.description,
        startsAt: `${f.date}T${f.start}:00+07:00`,
        endsAt: `${f.date}T${f.end}:00+07:00`,
      };
      const res = await fetch(event ? `/api/events/${event.id}` : "/api/events", {
        method: event ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const j = await res.json().catch(() => ({}));
      if (!res.ok) {
        toast.error(j.error ?? "Gagal menyimpan jadwal.");
        return;
      }
      toast.success(event ? "Jadwal diperbarui." : "Jadwal ditambahkan.");
      if (!event) setF((p) => ({ ...p, title: "", location: "", description: "" }));
      onDone?.();
      router.refresh();
    });
  }

  function remove() {
    if (!event || !confirm(`Hapus jadwal "${event.title}"?`)) return;
    start(async () => {
      const res = await fetch(`/api/events/${event.id}`, { method: "DELETE" });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        toast.error(j.error ?? "Gagal menghapus jadwal.");
        return;
      }
      toast.success("Jadwal dihapus.");
      router.push("/events");
      router.refresh();
    });
  }

  return (
    <form onSubmit={save} className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      <label className="grid gap-1 text-[13px] font-medium text-foreground/70 sm:col-span-2">
        Nama kegiatan
        <input required value={f.title} maxLength={160} onChange={(x) => set("title", x.target.value)} className={field} />
      </label>
      <label className="grid gap-1 text-[13px] font-medium text-foreground/70">
        Jenis
        <select value={f.category} onChange={(x) => set("category", x.target.value as Event["category"])} className={field}>
          {CATEGORIES.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>
      </label>
      <label className="grid gap-1 text-[13px] font-medium text-foreground/70">
        Tanggal
        <input required type="date" value={f.date} onChange={(x) => set("date", x.target.value)} className={field} />
      </label>
      <label className="grid gap-1 text-[13px] font-medium text-foreground/70">
        Mulai (WIB)
        <input required type="time" value={f.start} onChange={(x) => set("start", x.target.value)} className={field} />
      </label>
      <label className="grid gap-1 text-[13px] font-medium text-foreground/70">
        Selesai (WIB)
        <input required type="time" value={f.end} onChange={(x) => set("end", x.target.value)} className={field} />
      </label>
      <label className="grid gap-1 text-[13px] font-medium text-foreground/70 sm:col-span-2">
        {f.isOnline ? "Tautan (Zoom/Meet)" : "Tempat"}
        <input required value={f.location} maxLength={200} onChange={(x) => set("location", x.target.value)} className={field} />
      </label>
      <label className="flex min-h-11 items-center gap-2 text-[14px] text-foreground/80 sm:col-span-2">
        <input type="checkbox" checked={f.isOnline} onChange={(x) => set("isOnline", x.target.checked)} className="size-4" />
        Kegiatan daring
      </label>
      <label className="grid gap-1 text-[13px] font-medium text-foreground/70 sm:col-span-2">
        Keterangan (opsional)
        <textarea
          rows={3}
          value={f.description}
          maxLength={2000}
          onChange={(x) => set("description", x.target.value)}
          className="w-full rounded-xl border border-foreground/10 bg-white p-3 text-[14px] outline-none focus:border-brand-500/50"
        />
      </label>
      <p className="text-[13px] text-foreground/60 sm:col-span-2">
        {INTERNAL.has(f.category) ? "Jenis ini hanya terlihat di panel Humas." : "Tampil di Agenda beranda dan Kalender website."}
      </p>
      <div className="flex flex-wrap items-center gap-2 sm:col-span-2">
        <Button type="submit" disabled={pending} className="h-11">
          {pending ? <Loader2 className="size-4 animate-spin" /> : event ? null : <Plus className="size-4" />}
          {event ? "Simpan perubahan" : "Tambah jadwal"}
        </Button>
        {event && (
          <Button type="button" variant="ghost" onClick={remove} disabled={pending} className="h-11 text-red-600 hover:text-red-700">
            <Trash2 className="size-4" /> Hapus
          </Button>
        )}
      </div>
    </form>
  );
}
