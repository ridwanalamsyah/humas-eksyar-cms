"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Download, Mail, Trash2, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Submission } from "@/lib/data/types";
import type { FormDef } from "@/lib/site/forms";
import { cn } from "@/lib/utils";

const STATUS: Submission["status"][] = [
  "baru",
  "diproses",
  "selesai",
  "ditolak",
];
const STATUS_CLS: Record<string, string> = {
  baru: "bg-blue-500/10 text-blue-600",
  diproses: "bg-amber-500/10 text-amber-700",
  selesai: "bg-emerald-500/10 text-emerald-700",
  ditolak: "bg-foreground/[0.06] text-foreground/60",
};
/** Jenis isian yang bisa ditampilkan di website. */
const PUBLISHABLE: Record<string, string> = {
  tanya: "Tampilkan di Tanya Jawab (isi jawaban di bawah)",
  konsultasi:
    "Tampilkan tanpa nama di Tanya Jawab (hanya jika diizinkan pengirim)",
  komentar: "Tampilkan komentar di berita",
  alumni: "Tampilkan di direktori/testimoni alumni (sesuai izin)",
};
const APPLY: Record<string, string> = {
  prestasi: "Tambahkan ke Prestasi website",
  "profil-dosen": "Terapkan ke data dosen",
  acara: "Buat sertifikat kehadiran",
};

export function InboxView({
  forms,
  items,
}: {
  forms: FormDef[];
  items: Submission[];
}) {
  const router = useRouter();
  const [type, setType] = useState(forms[0]?.slug ?? "");
  const [status, setStatus] = useState<string>("");
  const [selected, setSelected] = useState<string | null>(null);
  const [pending, start] = useTransition();

  const counts = useMemo(() => {
    const m: Record<string, { all: number; baru: number }> = {};
    for (const s of items) {
      m[s.type] ??= { all: 0, baru: 0 };
      m[s.type].all++;
      if (s.status === "baru") m[s.type].baru++;
    }
    return m;
  }, [items]);

  const def = forms.find((f) => f.slug === type)!;
  const list = items.filter(
    (s) => s.type === type && (!status || s.status === status),
  );
  const current = items.find((s) => s.id === selected) ?? null;

  // Rata-rata nilai untuk formulir survei.
  const ratings = def?.fields.filter((f) => f.type === "rating") ?? [];
  const avg = ratings.map((f) => {
    const vals = list.map((s) => Number(s.data[f.name])).filter((n) => n > 0);
    return {
      label: f.label,
      scale: f.scale ?? 5,
      value: vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : 0,
      n: vals.length,
    };
  });

  function call(
    method: "PATCH" | "DELETE" | "POST",
    id: string,
    body?: unknown,
    ok?: string,
  ) {
    start(async () => {
      const res = await fetch(`/api/formulir-admin/${id}`, {
        method,
        headers: body ? { "Content-Type": "application/json" } : undefined,
        body: body ? JSON.stringify(body) : undefined,
      });
      const j = await res.json().catch(() => ({}));
      if (!res.ok) {
        toast.error(j.error ?? "Gagal");
        return;
      }
      toast.success(j.message ?? ok ?? "Tersimpan");
      if (method === "DELETE") setSelected(null);
      router.refresh();
    });
  }

  return (
    <div className="mt-6 grid gap-5 lg:grid-cols-[220px_1fr]">
      <nav className="flex gap-1 overflow-x-auto lg:flex-col">
        {forms.map((f) => (
          <button
            key={f.slug}
            type="button"
            onClick={() => {
              setType(f.slug);
              setSelected(null);
            }}
            className={cn(
              "flex shrink-0 items-center justify-between gap-3 rounded-lg px-3 py-2 text-left text-[13.5px]",
              type === f.slug
                ? "bg-foreground/[0.07] font-semibold"
                : "text-foreground/70 hover:bg-foreground/[0.04]",
            )}
          >
            {f.title}
            {counts[f.slug]?.baru ? (
              <span className="rounded-full bg-blue-500 px-1.5 text-[11px] font-semibold text-white">
                {counts[f.slug].baru}
              </span>
            ) : (
              <span className="text-[11px] text-foreground/40">
                {counts[f.slug]?.all ?? 0}
              </span>
            )}
          </button>
        ))}
      </nav>

      <div className="min-w-0">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex gap-1">
            {["", ...STATUS].map((s) => (
              <button
                key={s || "semua"}
                type="button"
                onClick={() => setStatus(s)}
                className={cn(
                  "rounded-full px-3 py-1 text-[12.5px]",
                  status === s
                    ? "bg-foreground text-background"
                    : "bg-foreground/[0.05]",
                )}
              >
                {s || "Semua"}
              </button>
            ))}
          </div>
          <Button size="sm" variant="secondary" asChild>
            <a href={`/api/formulir-admin/export?type=${type}`}>
              <Download className="size-3.5" /> Unduh Excel (CSV)
            </a>
          </Button>
        </div>

        {avg.length > 0 && list.length > 0 && (
          <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
            {avg.map((a) => (
              <div key={a.label} className="glass-regular rounded-xl px-4 py-3">
                <p className="text-[12px] text-foreground/55">{a.label}</p>
                <p className="text-[20px] font-semibold tabular-nums">
                  {a.value.toFixed(2)}{" "}
                  <span className="text-[12px] font-normal text-foreground/50">
                    / {a.scale} · {a.n} responden
                  </span>
                </p>
              </div>
            ))}
          </div>
        )}

        <div className="mt-4 grid gap-4 xl:grid-cols-[1fr_1.1fr]">
          <ul className="glass-regular max-h-[640px] divide-y divide-foreground/[0.06] overflow-y-auto rounded-xl">
            {list.length === 0 && (
              <li className="px-4 py-10 text-center text-[13px] text-foreground/55">
                Belum ada isian.
              </li>
            )}
            {list.map((s) => (
              <li key={s.id}>
                <button
                  type="button"
                  onClick={() => setSelected(s.id)}
                  className={cn(
                    "block w-full px-4 py-3 text-left hover:bg-foreground/[0.03]",
                    selected === s.id && "bg-foreground/[0.05]",
                  )}
                >
                  <span className="flex items-center justify-between gap-2">
                    <span className="truncate text-[13.5px] font-medium">
                      {String(
                        s.data[def.titleField] ??
                          s.data.nama ??
                          "(tanpa judul)",
                      )}
                    </span>
                    <span
                      className={cn(
                        "shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium",
                        STATUS_CLS[s.status],
                      )}
                    >
                      {s.status}
                    </span>
                  </span>
                  <span className="mt-0.5 block text-[11.5px] text-foreground/50">
                    {new Date(s.createdAt).toLocaleString("id-ID")}
                    {s.data.nama ? ` · ${s.data.nama}` : ""}
                    {s.published ? " · tampil" : ""}
                  </span>
                </button>
              </li>
            ))}
          </ul>

          {current ? (
            <Detail
              key={current.id}
              sub={current}
              def={def}
              pending={pending}
              call={call}
            />
          ) : (
            <div className="glass-regular grid place-items-center rounded-xl p-10 text-[13px] text-foreground/55">
              Pilih isian untuk melihat detail.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Detail({
  sub,
  def,
  pending,
  call,
}: {
  sub: Submission;
  def: FormDef;
  pending: boolean;
  call: (
    m: "PATCH" | "DELETE" | "POST",
    id: string,
    body?: unknown,
    ok?: string,
  ) => void;
}) {
  const [note, setNote] = useState(sub.note);
  const email = typeof sub.data.email === "string" ? sub.data.email : "";
  const answerLabel =
    sub.type === "tanya" || sub.type === "konsultasi"
      ? "Jawaban (tampil di website bila dipublikasikan)"
      : "Catatan internal";
  const consentBlocked =
    sub.type === "konsultasi" && sub.data.boleh_tampil !== true;

  return (
    <div className="glass-regular rounded-xl p-5">
      <dl className="grid gap-3 text-[13.5px]">
        {def.fields.map((f) =>
          sub.data[f.name] === undefined ? null : (
            <div key={f.name}>
              <dt className="text-[11.5px] text-foreground/50">{f.label}</dt>
              <dd className="whitespace-pre-line break-words">
                {f.type === "url" ? (
                  <a
                    href={String(sub.data[f.name])}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {String(sub.data[f.name])}
                  </a>
                ) : typeof sub.data[f.name] === "boolean" ? (
                  sub.data[f.name] ? (
                    "Ya"
                  ) : (
                    "Tidak"
                  )
                ) : f.type === "rating" ? (
                  `${sub.data[f.name]} / ${f.scale ?? 5}`
                ) : (
                  String(sub.data[f.name])
                )}
              </dd>
            </div>
          ),
        )}
        {sub.refId && (
          <div>
            <dt className="text-[11.5px] text-foreground/50">Rujukan</dt>
            <dd>{sub.refId}</dd>
          </div>
        )}
      </dl>

      <label className="mt-5 block text-[12px] font-medium text-foreground/60">
        {answerLabel}
      </label>
      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        rows={4}
        className="mt-1 w-full rounded-lg border border-foreground/10 bg-transparent p-3 text-[13.5px] outline-none focus:border-foreground/30"
      />

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <select
          defaultValue={sub.status}
          onChange={(e) => call("PATCH", sub.id, { status: e.target.value })}
          className="rounded-lg border border-foreground/10 bg-transparent px-2 py-1.5 text-[13px]"
          aria-label="Status"
        >
          {STATUS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <Button
          size="sm"
          disabled={pending}
          onClick={() => call("PATCH", sub.id, { note }, "Catatan tersimpan")}
        >
          Simpan
        </Button>
        {email && (
          <Button size="sm" variant="secondary" asChild>
            <a
              href={`mailto:${email}?subject=${encodeURIComponent(`Re: ${def.title} — Prodi Ekonomi Syariah`)}&body=${encodeURIComponent(note)}`}
            >
              <Mail className="size-3.5" /> Balas email
            </a>
          </Button>
        )}
        {APPLY[sub.type] && (
          <Button
            size="sm"
            variant="secondary"
            disabled={pending}
            onClick={() => call("POST", sub.id)}
          >
            <Wand2 className="size-3.5" /> {APPLY[sub.type]}
          </Button>
        )}
        <button
          type="button"
          aria-label="Hapus"
          onClick={() => confirm("Hapus isian ini?") && call("DELETE", sub.id)}
          className="ml-auto rounded-lg p-2 text-foreground/45 hover:text-red-500"
        >
          <Trash2 className="size-4" />
        </button>
      </div>

      {PUBLISHABLE[sub.type] && (
        <label
          className={cn(
            "mt-4 flex items-center gap-2 text-[13px]",
            consentBlocked && "opacity-50",
          )}
        >
          <input
            type="checkbox"
            checked={sub.published}
            disabled={pending || consentBlocked}
            onChange={(e) =>
              call(
                "PATCH",
                sub.id,
                { published: e.target.checked, note },
                e.target.checked ? "Ditampilkan" : "Disembunyikan",
              )
            }
          />
          {PUBLISHABLE[sub.type]}
          {consentBlocked && " — pengirim tidak mengizinkan"}
        </label>
      )}
    </div>
  );
}
