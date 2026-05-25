"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Save } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import type { BrandingConfig } from "@/lib/data/types";

interface Props {
  initial: BrandingConfig;
}

export function BrandingEditor({ initial }: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [signature, setSignature] = useState(initial.signature);
  const [defaultHashtags, setDefaultHashtags] = useState(initial.defaultHashtags);
  const [orgName, setOrgName] = useState(initial.orgName);
  const [tagline, setTagline] = useState(initial.tagline);
  const [watermarkUrl, setWatermarkUrl] = useState(initial.watermarkUrl ?? "");
  const [watermarkEnabled, setWatermarkEnabled] = useState(
    initial.watermarkEnabled ?? false,
  );
  const [watermarkPosition, setWatermarkPosition] = useState<
    "br" | "bl" | "tr" | "tl"
  >(initial.watermarkPosition ?? "br");
  const [uploadingMark, setUploadingMark] = useState(false);

  async function uploadMark(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingMark(true);
    try {
      const fd = new FormData();
      fd.set("file", file);
      const res = await fetch("/api/upload/avatar", { method: "POST", body: fd });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        toast.error(j.error ?? "Upload gagal");
        return;
      }
      const data = await res.json();
      setWatermarkUrl(data.url);
      toast.success("Watermark di-upload. Klik Simpan untuk aktifkan.");
    } finally {
      setUploadingMark(false);
    }
  }

  function save() {
    startTransition(async () => {
      const res = await fetch("/api/branding", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          signature,
          defaultHashtags,
          orgName,
          tagline,
          watermarkUrl,
          watermarkEnabled,
          watermarkPosition,
        }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        toast.error(j.error ?? "Gagal menyimpan branding");
        return;
      }
      toast.success("Branding tersimpan. AI caption generator akan pakai ini.");
      router.refresh();
    });
  }

  return (
    <div className="mt-6 grid gap-6 lg:grid-cols-[1.2fr_1fr]">
      <GlassCard variant="thick" className="p-6">
        <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-foreground/55">
          Editor
        </p>
        <div className="mt-4 grid gap-4">
          <Field
            label="Tanda tangan caption (signature)"
            hint="Baris yang dipasang otomatis di bawah setiap caption AI."
          >
            <input
              value={signature}
              onChange={(e) => setSignature(e.target.value)}
              placeholder="Atas nama Program Studi Ekonomi Syariah"
              className="w-full bg-transparent text-[14px] outline-none"
            />
          </Field>
          <Field
            label="Hashtag default"
            hint="Dipisah spasi. Ditambahkan otomatis ke setiap caption."
          >
            <textarea
              value={defaultHashtags}
              onChange={(e) => setDefaultHashtags(e.target.value)}
              rows={2}
              className="w-full resize-y bg-transparent text-[14px] outline-none"
            />
          </Field>
          <Field
            label="Nama organisasi"
            hint="Dipakai di footer dashboard, meta tags, dan prompt AI."
          >
            <input
              value={orgName}
              onChange={(e) => setOrgName(e.target.value)}
              className="w-full bg-transparent text-[14px] outline-none"
            />
          </Field>
          <Field
            label="Tagline"
            hint="Subtitle di footer dashboard."
          >
            <input
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              className="w-full bg-transparent text-[14px] outline-none"
            />
          </Field>

          <div className="rounded-2xl border border-foreground/10 bg-foreground/[0.03] p-4 dark:border-white/10 dark:bg-white/[0.03]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-foreground/55">
                  Watermark media
                </p>
                <p className="mt-1 text-[12px] text-foreground/65">
                  Logo prodi otomatis ditempel di pojok foto saat upload.
                </p>
              </div>
              <label className="inline-flex cursor-pointer items-center gap-2 text-[12px]">
                <input
                  type="checkbox"
                  checked={watermarkEnabled}
                  onChange={(e) => setWatermarkEnabled(e.target.checked)}
                />
                Aktifkan
              </label>
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-3">
              {watermarkUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={watermarkUrl}
                  alt="Watermark"
                  className="h-14 w-14 rounded-xl border border-foreground/10 bg-background/40 object-contain p-1 dark:border-white/10"
                />
              ) : (
                <div className="grid h-14 w-14 place-items-center rounded-xl border border-dashed border-foreground/20 text-[10px] text-foreground/55">
                  Belum ada
                </div>
              )}
              <label className="inline-flex cursor-pointer items-center rounded-xl border border-foreground/15 px-3 py-1.5 text-[12px] hover:bg-foreground/[0.05]">
                <input
                  type="file"
                  accept="image/png,image/webp"
                  className="hidden"
                  onChange={uploadMark}
                />
                {uploadingMark ? "Mengupload…" : "Upload PNG"}
              </label>
              <select
                value={watermarkPosition}
                onChange={(e) =>
                  setWatermarkPosition(
                    e.target.value as "br" | "bl" | "tr" | "tl",
                  )
                }
                className="h-9 rounded-xl border border-foreground/10 bg-background px-2 text-[12px]"
              >
                <option value="br">Pojok kanan bawah</option>
                <option value="bl">Pojok kiri bawah</option>
                <option value="tr">Pojok kanan atas</option>
                <option value="tl">Pojok kiri atas</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button disabled={pending} onClick={save}>
              <Save className="size-3.5" strokeWidth={1.75} />{" "}
              {pending ? "Menyimpan…" : "Simpan branding"}
            </Button>
          </div>
        </div>
      </GlassCard>

      <GlassCard className="p-6">
        <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-foreground/55">
          Preview caption
        </p>
        <div className="mt-4 rounded-2xl border border-foreground/10 bg-background/40 p-4 text-[13px] leading-relaxed dark:border-white/10">
          <p className="font-medium">Contoh caption yang dihasilkan AI:</p>
          <p className="mt-3 whitespace-pre-line text-foreground/80">
            {`${orgName} hadir di acara perdana semester ini.\nMari hadir, simak, dan diskusi bersama.\n\n———\n${signature}`}
          </p>
          <div className="mt-3 text-[11px] text-foreground/55">{defaultHashtags}</div>
        </div>
        <p className="mt-4 text-[11px] text-foreground/55">
          Footer ini diterapkan di semua caption AI dan template manual.
          Berubah otomatis di seluruh sistem tanpa perlu deploy ulang.
        </p>
      </GlassCard>
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
