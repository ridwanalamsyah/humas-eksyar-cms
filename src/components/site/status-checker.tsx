"use client";

import { useState } from "react";
import { Check, Download, Loader2, X } from "lucide-react";
import { formatLongDate } from "@/lib/format/dates";
import { cn } from "@/lib/utils";

type Status = "diajukan" | "diproses" | "selesai" | "ditolak";
type Result = {
  code: string;
  type: string;
  status: Status;
  adminNote: string;
  resultUrl: string | null;
  history: { status: Status; at: string; note?: string }[];
  createdAt: string;
  updatedAt: string;
};

const STEPS: { key: Status; label: string }[] = [
  { key: "diajukan", label: "Diajukan" },
  { key: "diproses", label: "Diproses" },
  { key: "selesai", label: "Selesai" },
];

const input =
  "w-full rounded-xl border border-hairline bg-canvas px-4 py-3 text-[16px] text-label outline-none transition-colors placeholder:text-label-3 focus:border-accent focus:ring-4 focus:ring-accent/10";

export function StatusChecker({ initialCode }: { initialCode: string }) {
  const [code, setCode] = useState(initialCode);
  const [nim, setNim] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<Result | null>(null);

  async function check(e: React.FormEvent) {
    e.preventDefault();
    setPending(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch("/api/public/layanan/status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, nim }),
      });
      const j = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(j.error ?? "Gagal mengecek status");
      setResult(j.request);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal mengecek status");
    } finally {
      setPending(false);
    }
  }

  const rejected = result?.status === "ditolak";
  const reached = result ? STEPS.findIndex((s) => s.key === result.status) : -1;

  return (
    <div className="grid gap-5">
      <form onSubmit={check} className="grid gap-4 rounded-[28px] border border-hairline bg-canvas p-6 sm:grid-cols-[1fr_1fr_auto] sm:items-end sm:p-8">
        <label className="block">
          <span className="mb-1.5 block text-[14px] font-semibold text-label">Kode tiket</span>
          <input value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} required placeholder="ES-XXXXXX" className={cn(input, "font-mono tracking-[0.06em]")} />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-[14px] font-semibold text-label">NIM</span>
          <input value={nim} onChange={(e) => setNim(e.target.value)} required inputMode="numeric" className={input} />
        </label>
        <button
          type="submit"
          disabled={pending}
          className="inline-flex h-[50px] items-center justify-center gap-2 rounded-full bg-accent px-7 text-[16px] font-semibold text-white hover:bg-accent-strong disabled:opacity-60"
        >
          {pending && <Loader2 className="size-4 animate-spin" />} Cek status
        </button>
      </form>

      {error && (
        <p role="alert" className="rounded-2xl bg-red-50 px-5 py-4 text-[15px] font-medium text-red-700">
          {error}
        </p>
      )}

      {result && (
        <div className="rounded-[28px] border border-hairline bg-canvas p-6 sm:p-10" aria-live="polite">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="font-mono text-[14px] font-bold tracking-[0.06em] text-label-2">{result.code}</p>
              <h3 className="mt-1 text-[24px] font-extrabold tracking-[-0.02em] text-label">{result.type}</h3>
              <p className="mt-1 text-[14px] text-label-3">Diajukan {formatLongDate(result.createdAt)}</p>
            </div>
            <span
              className={cn(
                "rounded-full px-4 py-1.5 text-[14px] font-bold",
                rejected ? "bg-red-50 text-red-700" : result.status === "selesai" ? "bg-accent text-white" : "bg-sand text-label",
              )}
            >
              {rejected ? "Ditolak" : STEPS[reached]?.label}
            </span>
          </div>

          {/* Stepper progres */}
          <ol className="mt-10 grid grid-cols-3">
            {STEPS.map((s, i) => {
              const done = !rejected && i <= reached;
              const at = result.history.find((h) => h.status === s.key)?.at;
              return (
                <li key={s.key} className="relative text-center">
                  {i > 0 && (
                    <span
                      aria-hidden
                      className={cn("absolute right-1/2 top-[18px] h-[3px] w-full -translate-y-1/2", done ? "bg-accent" : "bg-hairline")}
                    />
                  )}
                  <span
                    className={cn(
                      "relative mx-auto grid size-9 place-items-center rounded-full text-[14px] font-bold",
                      done ? "bg-accent text-white" : "border-2 border-hairline bg-canvas text-label-3",
                    )}
                  >
                    {done ? <Check className="size-4" strokeWidth={3} /> : i + 1}
                  </span>
                  <p className={cn("mt-2 text-[14px] font-semibold", done ? "text-label" : "text-label-3")}>{s.label}</p>
                  {at && done && <p className="text-[12px] text-label-3">{formatLongDate(at)}</p>}
                </li>
              );
            })}
          </ol>

          {rejected && (
            <p className="mt-8 flex items-center gap-2 text-[15px] font-semibold text-red-700">
              <X className="size-4" /> Pengajuan tidak dapat diproses.
            </p>
          )}
          {result.adminNote && (
            <div className="mt-8 rounded-2xl bg-mist p-5">
              <p className="text-[13px] font-bold uppercase tracking-[0.06em] text-label-2">Catatan dari prodi</p>
              <p className="mt-1 whitespace-pre-line text-[16px] text-label">{result.adminNote}</p>
            </div>
          )}
          {result.resultUrl && (
            <a
              href={result.resultUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-[15px] font-semibold text-white hover:bg-accent-strong"
            >
              <Download className="size-4" /> Unduh dokumen
            </a>
          )}
        </div>
      )}
    </div>
  );
}
