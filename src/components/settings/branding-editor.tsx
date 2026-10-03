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

  function save() {
    startTransition(async () => {
      const res = await fetch("/api/branding", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ signature, defaultHashtags, orgName, tagline }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        toast.error(j.error ?? "Gagal menyimpan. Coba lagi.");
        return;
      }
      toast.success("Tersimpan. Konten berikutnya akan memakai pengaturan ini.");
      router.refresh();
    });
  }

  return (
    <div className="mt-6 grid gap-6 lg:grid-cols-[1.2fr_1fr]">
      <GlassCard variant="thick" className="p-6">
        <p className="text-[12.5px] text-foreground/50">
          Editor
        </p>
        <div className="mt-4 grid gap-4">
          <Field
            label="Penutup caption"
            hint="Baris yang ditambahkan otomatis di akhir setiap caption."
          >
            <input
              value={signature}
              onChange={(e) => setSignature(e.target.value)}
              placeholder="Atas nama Program Studi Ekonomi Syariah"
              className="w-full bg-transparent text-[14px] outline-none"
            />
          </Field>
          <Field
            label="Tagar bawaan"
            hint="Pisahkan dengan spasi. Ditambahkan otomatis ke setiap caption."
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
            hint="Ditampilkan di CMS dan dipakai AI saat menyusun tulisan."
          >
            <input
              value={orgName}
              onChange={(e) => setOrgName(e.target.value)}
              className="w-full bg-transparent text-[14px] outline-none"
            />
          </Field>
          <Field
            label="Tagline"
            hint="Slogan singkat organisasi."
          >
            <input
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              className="w-full bg-transparent text-[14px] outline-none"
            />
          </Field>

          <div className="flex justify-end gap-2 pt-2">
            <Button disabled={pending} onClick={save}>
              <Save className="size-3.5" strokeWidth={1.75} />{" "}
              {pending ? "Menyimpan…" : "Simpan"}
            </Button>
          </div>
        </div>
      </GlassCard>

      <GlassCard className="p-6">
        <p className="text-[12.5px] text-foreground/50">
          Contoh tampilan
        </p>
        <div className="mt-4 rounded-2xl border border-foreground/10 bg-background/40 p-4 text-[13px] leading-relaxed dark:border-white/10">
          <p className="font-medium">Contoh caption:</p>
          <p className="mt-3 whitespace-pre-line text-foreground/80">
            {`${orgName} hadir di acara perdana semester ini.\nMari hadir, simak, dan diskusi bersama.\n\n———\n${signature}`}
          </p>
          <div className="mt-3 text-[11px] text-foreground/55">{defaultHashtags}</div>
        </div>
        <p className="mt-4 text-[11px] text-foreground/55">
          Penutup ini dipakai di semua caption, baik yang ditulis sendiri
          maupun yang disusun AI. Perubahan langsung berlaku.
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
      <span className="mb-1 block text-[12.5px] text-foreground/50">
        {label}
      </span>
      <div className="rounded-2xl border border-foreground/10 bg-foreground/[0.03] px-3 py-2 dark:border-white/10 dark:bg-white/[0.03]">
        {children}
      </div>
      {hint && <span className="mt-1 block text-[11px] text-foreground/55">{hint}</span>}
    </label>
  );
}
