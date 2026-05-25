"use client";

import { useState, useTransition, useMemo } from "react";
import {
  CheckCircle2,
  Circle,
  CircleDotDashed,
  Trash2,
  Plus,
  Loader2,
  Calendar as CalendarIcon,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Pill } from "@/components/common/pill";
import type {
  ContentItem,
  Event,
  MemberTask,
  TaskStatus,
} from "@/lib/data/types";
import type { Holiday } from "@/lib/fixtures/holidays";

interface Props {
  initialTasks: MemberTask[];
  holidays: Holiday[];
  events: Event[];
  contents: ContentItem[];
}

const STATUS_LABEL: Record<TaskStatus, string> = {
  pending: "Belum mulai",
  in_progress: "Berjalan",
  done: "Selesai",
  cancelled: "Batal",
};

const STATUS_TONE: Record<TaskStatus, "neutral" | "info" | "success" | "danger"> = {
  pending: "neutral",
  in_progress: "info",
  done: "success",
  cancelled: "danger",
};

function daysUntil(iso: string | null): number | null {
  if (!iso) return null;
  const target = new Date(iso + "T00:00:00Z").getTime();
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const diff = target - now.getTime();
  return Math.round(diff / (24 * 60 * 60 * 1000));
}

function dueLabel(iso: string | null): string {
  if (!iso) return "Tanpa deadline";
  const d = daysUntil(iso);
  if (d === null) return "Tanpa deadline";
  if (d < 0) return `Lewat ${Math.abs(d)} hari`;
  if (d === 0) return "Hari ini";
  if (d === 1) return "Besok";
  if (d <= 7) return `${d} hari lagi`;
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
  });
}

export function TasksClient({ initialTasks, holidays, events, contents }: Props) {
  const router = useRouter();
  const [tasks, setTasks] = useState<MemberTask[]>(initialTasks);
  const [filter, setFilter] = useState<TaskStatus | "all">("all");
  const [showForm, setShowForm] = useState(false);
  const [isPending, startTransition] = useTransition();

  const filtered = useMemo(() => {
    if (filter === "all") return tasks;
    return tasks.filter((t) => t.status === filter);
  }, [tasks, filter]);

  const counts = useMemo(() => {
    const c = { pending: 0, in_progress: 0, done: 0, cancelled: 0 };
    for (const t of tasks) c[t.status]++;
    return c;
  }, [tasks]);

  const refresh = async () => {
    const res = await fetch("/api/tasks");
    if (res.ok) {
      const data = await res.json();
      setTasks(data.tasks ?? []);
    }
  };

  const updateStatus = (id: string, status: TaskStatus) => {
    startTransition(async () => {
      const res = await fetch(`/api/tasks/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.ok) refresh();
    });
  };

  const remove = (id: string) => {
    if (!confirm("Hapus task ini?")) return;
    startTransition(async () => {
      const res = await fetch(`/api/tasks/${id}`, { method: "DELETE" });
      if (res.ok) refresh();
    });
  };

  return (
    <div className="grid gap-4">
      <GlassCard variant="regular" className="p-4">
        <div className="flex flex-wrap items-center gap-2">
          <FilterPill
            active={filter === "all"}
            onClick={() => setFilter("all")}
          >
            Semua ({tasks.length})
          </FilterPill>
          <FilterPill
            active={filter === "pending"}
            onClick={() => setFilter("pending")}
          >
            Belum mulai ({counts.pending})
          </FilterPill>
          <FilterPill
            active={filter === "in_progress"}
            onClick={() => setFilter("in_progress")}
          >
            Berjalan ({counts.in_progress})
          </FilterPill>
          <FilterPill
            active={filter === "done"}
            onClick={() => setFilter("done")}
          >
            Selesai ({counts.done})
          </FilterPill>
          <Button
            size="sm"
            className="ml-auto"
            onClick={() => setShowForm((s) => !s)}
          >
            <Plus className="size-3.5" strokeWidth={1.75} />
            Task baru
          </Button>
        </div>
      </GlassCard>

      {showForm && (
        <NewTaskForm
          holidays={holidays}
          events={events}
          contents={contents}
          onCreated={() => {
            setShowForm(false);
            refresh();
            router.refresh();
          }}
          onCancel={() => setShowForm(false)}
        />
      )}

      {filtered.length === 0 ? (
        <GlassCard variant="thin" className="p-8 text-center text-sm text-foreground/55">
          Belum ada task di filter ini.
        </GlassCard>
      ) : (
        <ul className="grid gap-2">
          {filtered.map((t) => {
            const d = daysUntil(t.dueDate);
            const overdue = d !== null && d < 0 && t.status !== "done";
            return (
              <li key={t.id}>
                <GlassCard
                  variant="regular"
                  className={`flex flex-wrap items-start gap-3 p-4 ${
                    overdue ? "ring-1 ring-rose-500/30" : ""
                  }`}
                >
                  <button
                    type="button"
                    onClick={() =>
                      updateStatus(t.id, t.status === "done" ? "pending" : "done")
                    }
                    className="mt-0.5 text-foreground/55 hover:text-foreground"
                    disabled={isPending}
                    aria-label="Toggle selesai"
                  >
                    {t.status === "done" ? (
                      <CheckCircle2 className="size-5 text-emerald-500" strokeWidth={1.75} />
                    ) : t.status === "in_progress" ? (
                      <CircleDotDashed className="size-5 text-sky-500" strokeWidth={1.75} />
                    ) : (
                      <Circle className="size-5" strokeWidth={1.75} />
                    )}
                  </button>

                  <div className="min-w-0 flex-1">
                    <p
                      className={`text-[14.5px] font-medium ${
                        t.status === "done" ? "text-foreground/50 line-through" : ""
                      }`}
                    >
                      {t.title}
                    </p>
                    {t.description && (
                      <p className="mt-0.5 text-[12.5px] text-foreground/65">
                        {t.description}
                      </p>
                    )}
                    <div className="mt-2 flex flex-wrap items-center gap-1.5 text-[11px]">
                      <Pill tone={STATUS_TONE[t.status]}>{STATUS_LABEL[t.status]}</Pill>
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 ${
                          overdue
                            ? "bg-rose-500/10 text-rose-600 dark:text-rose-300"
                            : "bg-foreground/[0.04] text-foreground/65"
                        }`}
                      >
                        <CalendarIcon className="size-3" strokeWidth={1.75} />
                        {dueLabel(t.dueDate)}
                      </span>
                      {t.contentId && (
                        <a
                          href={`/content/${t.contentId}`}
                          className="rounded-full bg-brand-500/10 px-2 py-0.5 text-brand-700 hover:bg-brand-500/15 dark:text-brand-300"
                        >
                          → konten
                        </a>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <select
                      value={t.status}
                      onChange={(e) =>
                        updateStatus(t.id, e.target.value as TaskStatus)
                      }
                      className="rounded-lg border border-foreground/10 bg-background px-2 py-1 text-[11px] focus:border-brand-500 focus:outline-none"
                      disabled={isPending}
                    >
                      {(Object.keys(STATUS_LABEL) as TaskStatus[]).map((s) => (
                        <option key={s} value={s}>
                          {STATUS_LABEL[s]}
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={() => remove(t.id)}
                      className="rounded-lg p-1 text-foreground/55 hover:bg-rose-500/10 hover:text-rose-500"
                      disabled={isPending}
                      aria-label="Hapus"
                    >
                      <Trash2 className="size-3.5" strokeWidth={1.75} />
                    </button>
                  </div>
                </GlassCard>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

function FilterPill({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-3 py-1 text-[12px] transition-colors ${
        active
          ? "bg-brand-500 text-white"
          : "bg-foreground/[0.05] text-foreground/65 hover:bg-foreground/[0.1]"
      }`}
    >
      {children}
    </button>
  );
}

function NewTaskForm({
  holidays,
  events,
  contents,
  onCreated,
  onCancel,
}: {
  holidays: Holiday[];
  events: Event[];
  contents: ContentItem[];
  onCreated: () => void;
  onCancel: () => void;
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [link, setLink] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const submit = async () => {
    if (!title.trim()) return setError("Judul wajib diisi");
    setError(null);
    setSubmitting(true);

    const payload: Record<string, unknown> = {
      title: title.trim(),
      description: description.trim(),
      dueDate: dueDate || null,
    };
    if (link.startsWith("content:"))
      payload.contentId = link.slice("content:".length);
    if (link.startsWith("event:")) payload.eventId = link.slice("event:".length);
    if (link.startsWith("holiday:")) {
      const slug = link.slice("holiday:".length);
      const h = holidays.find((x) => x.slug === slug);
      if (h) {
        payload.holidayId = h.id;
        if (!payload.dueDate) payload.dueDate = h.date;
        if (!payload.title) payload.title = `Bikin konten untuk ${h.name}`;
      }
    }

    const res = await fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    setSubmitting(false);
    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      setError(j.error ?? `Gagal (${res.status})`);
      return;
    }
    setTitle("");
    setDescription("");
    setDueDate("");
    setLink("");
    onCreated();
  };

  return (
    <GlassCard variant="thick" className="p-5">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-sm font-semibold uppercase tracking-[0.16em] text-foreground/55">
          Task baru
        </h3>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-full p-1 text-foreground/55 hover:bg-foreground/5 hover:text-foreground"
        >
          <X className="size-4" strokeWidth={1.75} />
        </button>
      </div>

      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <label className="sm:col-span-2 block">
          <span className="mb-1 block text-[11px] font-medium uppercase tracking-[0.16em] text-foreground/55">
            Judul
          </span>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-xl border border-foreground/10 bg-background px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
            placeholder="Bikin caption Maulid"
          />
        </label>

        <label className="block sm:col-span-2">
          <span className="mb-1 block text-[11px] font-medium uppercase tracking-[0.16em] text-foreground/55">
            Catatan (opsional)
          </span>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            className="w-full rounded-xl border border-foreground/10 bg-background px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
          />
        </label>

        <label className="block">
          <span className="mb-1 block text-[11px] font-medium uppercase tracking-[0.16em] text-foreground/55">
            Deadline
          </span>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="w-full rounded-xl border border-foreground/10 bg-background px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
          />
        </label>

        <label className="block">
          <span className="mb-1 block text-[11px] font-medium uppercase tracking-[0.16em] text-foreground/55">
            Link ke (opsional)
          </span>
          <select
            value={link}
            onChange={(e) => setLink(e.target.value)}
            className="w-full rounded-xl border border-foreground/10 bg-background px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
          >
            <option value="">— Tidak ada —</option>
            {holidays.length > 0 && (
              <optgroup label="Hari besar / libur">
                {holidays.map((h) => (
                  <option key={`h-${h.id}`} value={`holiday:${h.slug}`}>
                    {h.emoji ?? "•"} {h.name} ({h.date})
                  </option>
                ))}
              </optgroup>
            )}
            {events.length > 0 && (
              <optgroup label="Event">
                {events.map((ev) => (
                  <option key={`e-${ev.id}`} value={`event:${ev.id}`}>
                    {ev.title}
                  </option>
                ))}
              </optgroup>
            )}
            {contents.length > 0 && (
              <optgroup label="Konten draft Anda">
                {contents.map((c) => (
                  <option key={`c-${c.id}`} value={`content:${c.id}`}>
                    {c.title}
                  </option>
                ))}
              </optgroup>
            )}
          </select>
        </label>
      </div>

      {error && <p className="mt-2 text-[12px] text-rose-500">{error}</p>}

      <div className="mt-4 flex justify-end gap-2">
        <Button variant="ghost" onClick={onCancel} disabled={submitting}>
          Batal
        </Button>
        <Button onClick={submit} disabled={submitting}>
          {submitting && <Loader2 className="size-3.5 animate-spin" />}
          Simpan task
        </Button>
      </div>
    </GlassCard>
  );
}
