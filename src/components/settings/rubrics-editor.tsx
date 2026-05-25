"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Plus, Trash2, Save, Eye, EyeOff } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import type { Rubric } from "@/lib/data/types";

interface Props {
  initial: Rubric[];
}

export function RubricsEditor({ initial }: Props) {
  const [rubrics, setRubrics] = useState<Rubric[]>(initial);
  const [pending, startTransition] = useTransition();

  // New rubric form
  const [nLabel, setNLabel] = useState("");
  const [nSlug, setNSlug] = useState("");
  const [nDesc, setNDesc] = useState("");
  const [nEmoji, setNEmoji] = useState("");

  function reload() {
    startTransition(async () => {
      const res = await fetch("/api/rubrics?includeInactive=1");
      const j = await res.json();
      setRubrics(j.rubrics ?? []);
    });
  }

  async function add() {
    if (!nLabel.trim()) {
      toast.error("Label wajib diisi");
      return;
    }
    const slug = (nSlug || nLabel)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "_")
      .replace(/^_+|_+$/g, "");
    const res = await fetch("/api/rubrics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        label: nLabel,
        slug,
        description: nDesc,
        emoji: nEmoji || null,
      }),
    });
    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      toast.error(j.error ?? "Gagal menambahkan rubrik");
      return;
    }
    toast.success("Rubrik baru ditambahkan");
    setNLabel("");
    setNSlug("");
    setNDesc("");
    setNEmoji("");
    reload();
  }

  async function update(id: string, patch: Partial<Rubric>) {
    const res = await fetch(`/api/rubrics/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
    });
    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      toast.error(j.error ?? "Gagal update");
      return;
    }
    toast.success("Tersimpan");
    reload();
  }

  async function remove(id: string, label: string) {
    if (!confirm(`Hapus rubrik "${label}"? Konten yang sudah pakai rubrik ini tetap aman, tapi rubrik gak akan muncul di dropdown lagi.`)) {
      return;
    }
    const res = await fetch(`/api/rubrics/${id}`, { method: "DELETE" });
    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      toast.error(j.error ?? "Gagal hapus");
      return;
    }
    toast.success("Rubrik dihapus");
    reload();
  }

  return (
    <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_1.3fr]">
      <GlassCard variant="thick" className="p-6">
        <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-foreground/55">
          Rubrik baru
        </p>
        <div className="mt-4 grid gap-3">
          <Field label="Emoji">
            <input
              value={nEmoji}
              onChange={(e) => setNEmoji(e.target.value)}
              maxLength={4}
              placeholder="🌅"
              className="w-full bg-transparent text-[14px] outline-none"
            />
          </Field>
          <Field label="Label">
            <input
              value={nLabel}
              onChange={(e) => setNLabel(e.target.value)}
              placeholder="Beasiswa bulanan"
              className="w-full bg-transparent text-[14px] outline-none"
            />
          </Field>
          <Field
            label="Slug"
            hint="ID internal. Lowercase, pakai underscore. Auto-generate dari label kalau dikosongin."
          >
            <input
              value={nSlug}
              onChange={(e) => setNSlug(e.target.value)}
              placeholder="beasiswa_bulanan"
              className="w-full bg-transparent text-[14px] outline-none"
            />
          </Field>
          <Field label="Deskripsi">
            <textarea
              value={nDesc}
              onChange={(e) => setNDesc(e.target.value)}
              rows={2}
              placeholder="Update beasiswa per bulan"
              className="w-full resize-y bg-transparent text-[14px] outline-none"
            />
          </Field>
          <div className="flex justify-end">
            <Button disabled={pending} onClick={add}>
              <Plus className="size-3.5" strokeWidth={1.75} /> Tambah
            </Button>
          </div>
        </div>
      </GlassCard>

      <GlassCard variant="thick" className="p-6">
        <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-foreground/55">
          Daftar rubrik ({rubrics.length})
        </p>
        <div className="mt-4 space-y-3">
          {rubrics.map((r) => (
            <RubricRow
              key={r.id}
              rubric={r}
              onSave={(patch) => update(r.id, patch)}
              onToggle={() => update(r.id, { isActive: !r.isActive })}
              onDelete={() => remove(r.id, r.label)}
            />
          ))}
          {rubrics.length === 0 && (
            <p className="rounded-2xl border border-dashed border-foreground/15 p-6 text-center text-[12px] text-foreground/55">
              Belum ada rubrik. Tambah satu di kiri.
            </p>
          )}
        </div>
      </GlassCard>
    </div>
  );
}

function RubricRow({
  rubric,
  onSave,
  onToggle,
  onDelete,
}: {
  rubric: Rubric;
  onSave: (patch: Partial<Rubric>) => void;
  onToggle: () => void;
  onDelete: () => void;
}) {
  const [label, setLabel] = useState(rubric.label);
  const [emoji, setEmoji] = useState(rubric.emoji ?? "");
  const [description, setDescription] = useState(rubric.description);
  const dirty =
    label !== rubric.label ||
    emoji !== (rubric.emoji ?? "") ||
    description !== rubric.description;

  return (
    <div
      className={`rounded-2xl border p-3 transition-colors ${
        rubric.isActive
          ? "border-foreground/10 bg-foreground/[0.03] dark:border-white/10 dark:bg-white/[0.03]"
          : "border-dashed border-foreground/15 bg-transparent opacity-70"
      }`}
    >
      <div className="flex flex-wrap items-center gap-2">
        <input
          value={emoji}
          onChange={(e) => setEmoji(e.target.value)}
          maxLength={4}
          className="w-12 rounded-lg border border-foreground/10 bg-background/60 px-2 py-1 text-center text-base outline-none dark:border-white/10"
        />
        <input
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          className="min-w-0 flex-1 rounded-lg border border-foreground/10 bg-background/60 px-2 py-1 text-[14px] outline-none dark:border-white/10"
        />
        <code className="rounded-md bg-foreground/5 px-1.5 py-0.5 text-[10px] text-foreground/55">
          {rubric.slug}
        </code>
      </div>
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows={1}
        placeholder="Deskripsi singkat…"
        className="mt-2 w-full resize-y rounded-lg border border-foreground/10 bg-background/60 px-2 py-1 text-[12px] outline-none dark:border-white/10"
      />
      <div className="mt-2 flex items-center justify-end gap-2">
        <Button variant="ghost" size="sm" onClick={onToggle}>
          {rubric.isActive ? (
            <>
              <EyeOff className="size-3.5" strokeWidth={1.75} /> Nonaktifkan
            </>
          ) : (
            <>
              <Eye className="size-3.5" strokeWidth={1.75} /> Aktifkan
            </>
          )}
        </Button>
        <Button variant="ghost" size="sm" onClick={onDelete}>
          <Trash2 className="size-3.5" strokeWidth={1.75} /> Hapus
        </Button>
        <Button
          size="sm"
          disabled={!dirty}
          onClick={() =>
            onSave({ label, emoji: emoji || null, description })
          }
        >
          <Save className="size-3.5" strokeWidth={1.75} /> Simpan
        </Button>
      </div>
    </div>
  );
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-[11px] font-medium uppercase tracking-[0.18em] text-foreground/55">
        {label}
      </span>
      <div className="rounded-2xl border border-foreground/10 bg-foreground/[0.03] px-3 py-2 dark:border-white/10 dark:bg-white/[0.03]">
        {children}
      </div>
      {hint && <span className="mt-1 block text-[11px] text-foreground/55">{hint}</span>}
    </label>
  );
}
