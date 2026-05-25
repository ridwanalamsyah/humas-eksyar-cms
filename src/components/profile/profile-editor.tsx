"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Camera, Trash2, Save } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/common/avatar";
import type { Member } from "@/lib/data/types";

const EMOJI_OPTIONS = ["👤", "🌟", "🌙", "🌷", "🌸", "🌿", "🦊", "🐝", "🐬", "🦋", "📚", "✏️", "🎙️", "📸", "🎨"];

interface Props {
  member: Member;
}

export function ProfileEditor({ member }: Props) {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [pending, startTransition] = useTransition();
  const [uploading, setUploading] = useState(false);
  const [name, setName] = useState(member.name);
  const [bio, setBio] = useState(member.bio ?? "");
  const [position, setPosition] = useState(member.position);
  const [avatarEmoji, setAvatarEmoji] = useState(member.avatarEmoji);
  const [accentHue, setAccentHue] = useState(member.accentHue);
  const [avatarUrl, setAvatarUrl] = useState<string | null | undefined>(
    member.avatarUrl,
  );

  const preview: Member = {
    ...member,
    name,
    bio,
    position,
    avatarEmoji,
    accentHue,
    avatarUrl: avatarUrl ?? undefined,
  };

  async function onPickFile(file: File) {
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload/avatar", { method: "POST", body: fd });
      const json = (await res.json()) as { url?: string; error?: string };
      if (!res.ok || !json.url) {
        throw new Error(json.error ?? "Gagal upload");
      }
      setAvatarUrl(json.url);
      toast.success("Foto profil terupload. Klik Simpan untuk apply.");
    } catch (err) {
      console.error(err);
      toast.error(err instanceof Error ? err.message : "Gagal upload foto");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  function removePhoto() {
    setAvatarUrl(null);
  }

  function save() {
    startTransition(async () => {
      const res = await fetch(`/api/members/${member.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          bio,
          position,
          avatarEmoji,
          accentHue,
          avatarUrl,
        }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        toast.error(j.error ?? "Gagal menyimpan profil");
        return;
      }
      toast.success("Profil tersimpan");
      router.refresh();
    });
  }

  return (
    <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_1.4fr]">
      <GlassCard variant="thick" className="p-6">
        <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-foreground/55">
          Preview
        </p>
        <div className="mt-4 flex flex-col items-center gap-3 text-center">
          <Avatar member={preview} size={128} />
          <div>
            <p className="font-display text-lg font-semibold tracking-tight">
              {name || "Tanpa nama"}
            </p>
            <p className="text-[12px] text-foreground/65">{member.email}</p>
            <p className="mt-1 text-[12px] text-foreground/55">{position}</p>
          </div>
        </div>

        <div className="mt-5 flex flex-col gap-2">
          <input
            ref={fileRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) onPickFile(f);
            }}
          />
          <Button
            variant="secondary"
            size="sm"
            disabled={uploading}
            onClick={() => fileRef.current?.click()}
          >
            <Camera className="size-3.5" strokeWidth={1.75} />{" "}
            {uploading ? "Mengupload…" : avatarUrl ? "Ganti foto" : "Upload foto"}
          </Button>
          {avatarUrl && (
            <Button variant="ghost" size="sm" onClick={removePhoto}>
              <Trash2 className="size-3.5" strokeWidth={1.75} /> Hapus foto, pakai emoji
            </Button>
          )}
          <p className="text-[10px] text-foreground/50">
            JPG / PNG / WEBP, maks 5MB.
          </p>
        </div>
      </GlassCard>

      <GlassCard variant="thick" className="p-6">
        <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-foreground/55">
          Detail
        </p>
        <div className="mt-4 grid gap-4">
          <Field label="Nama lengkap">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-transparent text-[14px] outline-none"
            />
          </Field>
          <Field label="Posisi / jabatan">
            <input
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              className="w-full bg-transparent text-[14px] outline-none"
            />
          </Field>
          <Field label="Bio singkat">
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={3}
              className="w-full resize-y bg-transparent text-[14px] outline-none"
            />
          </Field>

          {!avatarUrl && (
            <div>
              <p className="mb-2 text-[11px] font-medium uppercase tracking-[0.18em] text-foreground/55">
                Emoji avatar (kalau tidak upload foto)
              </p>
              <div className="grid grid-cols-8 gap-1.5">
                {EMOJI_OPTIONS.map((e) => (
                  <button
                    key={e}
                    type="button"
                    onClick={() => setAvatarEmoji(e)}
                    className={`flex aspect-square items-center justify-center rounded-xl border text-2xl transition-colors ${
                      avatarEmoji === e
                        ? "border-brand-500/45 bg-brand-500/10"
                        : "border-foreground/10 bg-foreground/[0.03] hover:border-foreground/20 dark:border-white/10 dark:bg-white/5"
                    }`}
                  >
                    {e}
                  </button>
                ))}
              </div>
            </div>
          )}

          {!avatarUrl && (
            <div>
              <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-[0.18em] text-foreground/55">
                Accent warna · {accentHue}°
              </label>
              <input
                type="range"
                min={0}
                max={360}
                step={5}
                value={accentHue}
                onChange={(e) => setAccentHue(Number(e.target.value))}
                className="w-full"
              />
            </div>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <Button disabled={pending || uploading} onClick={save}>
              <Save className="size-3.5" strokeWidth={1.75} />{" "}
              {pending ? "Menyimpan…" : "Simpan"}
            </Button>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-[11px] font-medium uppercase tracking-[0.18em] text-foreground/55">
        {label}
      </span>
      <div className="rounded-2xl border border-foreground/10 bg-foreground/[0.03] px-3 py-2 dark:border-white/10 dark:bg-white/[0.03]">
        {children}
      </div>
    </label>
  );
}
