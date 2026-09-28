"use client";

import Link from "next/link";
import { useState } from "react";
import { Check, Copy, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type Jenis = { title: string; description: string };

const input =
  "w-full rounded-xl border border-hairline bg-canvas px-4 py-3 text-[16px] text-label outline-none transition-colors placeholder:text-label-3 focus:border-accent focus:ring-4 focus:ring-accent/10";

/** Formulir pengajuan layanan mahasiswa → kode tiket. */
export function LayananForm({ jenis }: { jenis: Jenis[] }) {
  const [type, setType] = useState(jenis[0]?.title ?? "");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [code, setCode] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    setError(null);
    const data = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>;
    try {
      const res = await fetch("/api/public/layanan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, type }),
      });
      const j = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(j.error ?? "Pengajuan gagal dikirim");
      setCode(j.code);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Pengajuan gagal dikirim");
    } finally {
      setPending(false);
    }
  }

  if (code) {
    return (
      <div className="rounded-[28px] border border-hairline bg-canvas p-8 text-center sm:p-12">
        <span className="mx-auto grid size-14 place-items-center rounded-full bg-accent text-white">
          <Check className="size-7" strokeWidth={2.5} />
        </span>
        <h3 className="mt-6 text-[26px] font-extrabold tracking-[-0.02em] text-label">Pengajuan terkirim.</h3>
        <p className="mt-2 text-[16px] text-label-2">Simpan kode tiket ini untuk mengecek status dengan NIM kamu.</p>
        <div className="mx-auto mt-6 inline-flex items-center gap-3 rounded-2xl bg-mist px-6 py-4">
          <span className="font-mono text-[28px] font-bold tracking-[0.08em] text-label">{code}</span>
          <button
            type="button"
            aria-label="Salin kode"
            onClick={async () => {
              await navigator.clipboard.writeText(code).catch(() => {});
              setCopied(true);
              setTimeout(() => setCopied(false), 2000);
            }}
            className="grid size-9 place-items-center rounded-full bg-canvas text-accent hover:bg-accent hover:text-white"
          >
            {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
          </button>
        </div>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
          <Link
            href={`/prodi/layanan/status?kode=${code}`}
            className="rounded-full bg-accent px-6 py-3 text-[15px] font-semibold text-white hover:bg-accent-strong"
          >
            Cek status
          </Link>
          <button type="button" onClick={() => setCode(null)} className="text-[15px] font-semibold text-accent hover:underline">
            Ajukan layanan lain
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="rounded-[28px] border border-hairline bg-canvas p-6 sm:p-10">
      <fieldset>
        <legend className="text-[15px] font-bold text-label">Jenis layanan</legend>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {jenis.map((j) => (
            <label
              key={j.title}
              className={cn(
                "cursor-pointer rounded-2xl border px-4 py-3 transition-colors",
                type === j.title ? "border-accent bg-accent-soft/50 ring-4 ring-accent/10" : "border-hairline hover:border-accent/40",
              )}
            >
              <input type="radio" name="type-choice" value={j.title} checked={type === j.title} onChange={() => setType(j.title)} className="sr-only" />
              <span className="block text-[15px] font-semibold text-label">{j.title}</span>
              <span className="mt-0.5 block text-[13px] leading-snug text-label-2">{j.description}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <Field label="Nama lengkap">
          <input name="name" required minLength={3} maxLength={120} autoComplete="name" className={input} />
        </Field>
        <Field label="NIM">
          <input name="nim" required pattern="[0-9A-Za-z]{5,20}" inputMode="numeric" className={input} />
        </Field>
        <Field label="Email">
          <input name="email" type="email" required autoComplete="email" className={input} />
        </Field>
        <Field label="Nomor WhatsApp">
          <input name="phone" type="tel" required placeholder="08xxxxxxxxxx" autoComplete="tel" className={input} />
        </Field>
        <Field label="Keperluan" wide>
          <input name="purpose" required maxLength={300} placeholder="Mis. syarat pendaftaran beasiswa" className={input} />
        </Field>
        <Field label="Keterangan tambahan (opsional)" wide>
          <textarea name="details" rows={4} maxLength={2000} className={cn(input, "resize-y")} />
        </Field>
        <Field label="Tautan lampiran (opsional)" wide hint="Mis. tautan Google Drive berisi KTM atau dokumen pendukung.">
          <input name="attachmentUrl" type="url" placeholder="https://" className={input} />
        </Field>
        {/* Honeypot anti-bot — disembunyikan dari pengguna */}
        <input name="website" tabIndex={-1} autoComplete="off" aria-hidden className="hidden" />
      </div>

      {error && (
        <p role="alert" className="mt-6 rounded-xl bg-red-50 px-4 py-3 text-[14px] font-medium text-red-700">
          {error}
        </p>
      )}

      <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
        <p className="text-[13px] text-label-2">Data hanya dipakai untuk memproses pengajuan ini.</p>
        <button
          type="submit"
          disabled={pending || !type}
          className="inline-flex items-center gap-2 rounded-full bg-accent px-7 py-3 text-[16px] font-semibold text-white transition-colors hover:bg-accent-strong disabled:opacity-60"
        >
          {pending && <Loader2 className="size-4 animate-spin" />}
          {pending ? "Mengirim…" : "Kirim pengajuan"}
        </button>
      </div>
    </form>
  );
}

function Field({ label, hint, wide, children }: { label: string; hint?: string; wide?: boolean; children: React.ReactNode }) {
  return (
    <label className={cn("block", wide && "sm:col-span-2")}>
      <span className="mb-1.5 block text-[14px] font-semibold text-label">{label}</span>
      {children}
      {hint && <span className="mt-1.5 block text-[13px] text-label-3">{hint}</span>}
    </label>
  );
}
