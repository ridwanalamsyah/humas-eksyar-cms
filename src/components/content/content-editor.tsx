"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { toast } from "sonner";
import { Sparkles, Save, Send, ImageIcon, X, ChevronDown, Wand2, Hash, Calendar, CheckCircle2 } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Pill } from "@/components/common/pill";
import { STYLE_LIST } from "@/lib/ai/captions";
import type { MediaAsset, Member, ContentChannel, CaptionStyle, ContentRubric, Rubric } from "@/lib/data/types";
import { HASHTAG_BLOCK } from "@/lib/fixtures/contents";

interface Props {
  media: MediaAsset[];
  author: Member;
  rubrics: Rubric[];
  defaultHashtags?: string;
}

const CHANNELS: { value: ContentChannel; label: string }[] = [
  { value: "instagram", label: "Instagram" },
  { value: "twitter", label: "Twitter / X" },
  { value: "facebook", label: "Facebook" },
  { value: "tiktok", label: "TikTok" },
  { value: "linktree", label: "Linktree" },
];

export function ContentEditor({ media, author, rubrics, defaultHashtags }: Props) {
  void author;
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [generating, setGenerating] = useState(false);

  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");
  const [caption, setCaption] = useState("");
  const [hashtags, setHashtags] = useState(defaultHashtags ?? HASHTAG_BLOCK);
  const initialRubric = (rubrics[0]?.slug ?? "dokumentasi") as ContentRubric;
  const [rubric, setRubric] = useState<ContentRubric>(initialRubric);
  const [style, setStyle] = useState<CaptionStyle>("formal_organisasi");
  const [selectedMedia, setSelectedMedia] = useState<string[]>([]);
  const [channels, setChannels] = useState<ContentChannel[]>(["instagram"]);
  const [scheduledFor, setScheduledFor] = useState("");

  async function generate() {
    if (!title.trim()) {
      toast.error("Masukkan judul / topik dulu sebelum generate.");
      return;
    }
    setGenerating(true);
    try {
      const res = await fetch("/api/captions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          details,
          rubric,
          style,
          variants: 2,
          includeHook: false,
        }),
      });
      const json = await res.json();
      if (!json.caption) throw new Error("AI gagal membalas");
      setCaption(json.caption);
      setHashtags(json.hashtags);
      toast.success(json.provider === "gemini" ? "Caption AI siap" : "Caption tersusun (mock)");
    } catch (e) {
      console.error(e);
      toast.error("Gagal generate caption — coba lagi.");
    } finally {
      setGenerating(false);
    }
  }

  function submit(action: "draft" | "review" | "publish") {
    if (!title.trim()) {
      toast.error("Judul artikel wajib diisi.");
      return;
    }
    startTransition(async () => {
      try {
        const targetStatus = action === "publish" ? "published" : action === "review" ? "review_divisi" : "draft";
        const res = await fetch("/api/contents", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: title.trim(),
            rubric,
            status: targetStatus,
            caption,
            hashtags,
            channels,
            mediaIds: selectedMedia,
            scheduledFor: scheduledFor ? new Date(scheduledFor).toISOString() : null,
          }),
        });
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err.error || "Gagal menyimpan konten");
        }
        const msg =
          action === "publish"
            ? "Artikel berhasil diterbitkan ke website!"
            : action === "review"
              ? "Artikel dikirim untuk ditinjau."
              : "Draf berhasil disimpan.";
        toast.success(msg);
        router.push("/content");
        router.refresh();
      } catch (err: unknown) {
        toast.error((err as Error).message || "Kendala saat menyimpan artikel.");
      }
    });
  }

  const titleWords = title.trim() ? title.trim().split(/\s+/).length : 0;

  return (
    <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
      <GlassCard variant="thick" className="p-6">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Judul yang menyebut acaranya…"
          aria-describedby="judul-panduan"
          className="w-full bg-transparent text-[24px] font-semibold leading-tight tracking-tight sm:text-[28px] outline-none placeholder:text-foreground/60"
        />
        {/* Aturan menulis tim (docs/panduan-humas.md): judul maksimal 8 kata. */}
        <p
          id="judul-panduan"
          className={`mt-1 text-[13px] ${titleWords > 8 ? "text-amber-600" : "text-foreground/60"}`}
        >
          {titleWords} kata · judul maksimal 8 kata
        </p>

        <div className="mt-3 flex flex-wrap items-center gap-2 text-[13px]">
          <SelectField label="Rubrik">
            <select
              value={rubric}
              onChange={(e) => setRubric(e.target.value as ContentRubric)}
              className="bg-transparent text-[13px] outline-none"
            >
              {rubrics.map((r) => (
                <option key={r.id} value={r.slug}>
                  {r.label}
                </option>
              ))}
            </select>
          </SelectField>
          <SelectField label="Gaya">
            <select
              value={style}
              onChange={(e) => setStyle(e.target.value as CaptionStyle)}
              className="bg-transparent text-[13px] outline-none"
            >
              {STYLE_LIST.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </SelectField>
        </div>

        <div className="mt-5">
          <label className="text-[13px] text-foreground/60">
            Ceritakan acaranya
          </label>
          <textarea
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            placeholder="Apa, kapan, di mana, narasumber, poin penting…"
            className="mt-2 h-24 w-full resize-y rounded-2xl border border-foreground/10 bg-foreground/5 p-3 text-[14px] outline-none focus:border-brand-500/40 dark:border-white/10 dark:bg-white/5"
          />
        </div>

        <div className="mt-4 flex items-center justify-between">
          <label className="text-[13px] text-foreground/60">
            Caption
          </label>
          <Button
            type="button"
            size="sm"
            onClick={generate}
            disabled={generating}
            className="bg-gradient-to-b from-gold-400 to-gold-500 text-ink-soft"
          >
            {generating ? (
              <>
                <span className="size-3 animate-pulse rounded-full bg-ink-soft/60" />
                Menyusun…
              </>
            ) : (
              <>
                <Wand2 className="size-3.5" strokeWidth={1.75} />
                Susun dengan AI
              </>
            )}
          </Button>
        </div>
        <textarea
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          placeholder="Tulis isi konten di sini, atau biarkan AI yang menyusun."
          className="mt-2 h-72 w-full resize-y rounded-2xl border border-foreground/10 bg-foreground/5 p-4 font-mono text-[13.5px] leading-[1.7] outline-none focus:border-brand-500/40 dark:border-white/10 dark:bg-white/5"
        />

        <div className="mt-4">
          <label className="flex items-center gap-1.5 text-[13px] text-foreground/60">
            <Hash className="size-3" strokeWidth={1.75} /> Tagar
          </label>
          <textarea
            value={hashtags}
            onChange={(e) => setHashtags(e.target.value)}
            className="mt-2 h-16 w-full resize-y rounded-2xl border border-foreground/10 bg-foreground/5 p-3 font-mono text-[13px] outline-none focus:border-brand-500/40 dark:border-white/10 dark:bg-white/5"
          />
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <Button
            onClick={() => submit("publish")}
            disabled={pending}
            className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-xs dark:bg-emerald-500"
          >
            <CheckCircle2 className="size-4" strokeWidth={2} /> Terbitkan Sekarang
          </Button>
          <Button onClick={() => submit("draft")} variant="secondary" disabled={pending} className="gap-2">
            <Save className="size-4" strokeWidth={1.75} /> Simpan Draf
          </Button>
          <Button onClick={() => submit("review")} variant="ghost" disabled={pending} className="gap-2">
            <Send className="size-4" strokeWidth={1.75} /> Kirim Review
          </Button>
        </div>
      </GlassCard>

      <aside className="flex flex-col gap-4">
        <GlassCard variant="regular" className="p-5">
          <h3 className="text-[13px] text-foreground/60">Channel</h3>
          <div className="mt-3 grid grid-cols-2 gap-1.5">
            {CHANNELS.map((c) => {
              const active = channels.includes(c.value);
              return (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => setChannels((cur) => (active ? cur.filter((x) => x !== c.value) : [...cur, c.value]))}
                  className={`rounded-xl px-3 py-2 text-left text-[13px] font-medium transition-colors ${
                    active
                      ? "bg-brand-500/15 text-brand-700 ring-1 ring-brand-500/40 dark:text-brand-200"
                      : "bg-foreground/5 text-foreground/65 hover:text-foreground dark:bg-white/5"
                  }`}
                >
                  {c.label}
                </button>
              );
            })}
          </div>
        </GlassCard>

        <GlassCard variant="regular" className="p-5">
          <h3 className="flex items-center gap-1.5 text-[13px] text-foreground/60">
            <ImageIcon className="size-3" strokeWidth={1.75} /> Media
          </h3>
          <div className="mt-3 grid grid-cols-3 gap-1.5">
            {media.slice(0, 9).map((m) => {
              const picked = selectedMedia.includes(m.id);
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() =>
                    setSelectedMedia((cur) => (picked ? cur.filter((x) => x !== m.id) : [...cur, m.id]))
                  }
                  className={`relative aspect-square overflow-hidden rounded-xl ring-2 transition-all ${
                    picked ? "ring-brand-500" : "ring-transparent hover:ring-foreground/20"
                  }`}
                  aria-pressed={picked}
                >
                  <img src={m.url} alt={m.alt} className="size-full object-cover" />
                  {picked && (
                    <span className="absolute right-1 top-1 grid grid-cols-1 size-5 place-items-center rounded-full bg-brand-500 text-white shadow-[0_2px_6px_rgba(0,0,0,0.3)]">
                      <X className="size-3" strokeWidth={2.5} />
                    </span>
                  )}
                </button>
              );
            })}
          </div>
          {selectedMedia.length > 0 && (
            <p className="mt-2 text-[13px] text-foreground/60">{selectedMedia.length} aset dipilih</p>
          )}
        </GlassCard>

        <GlassCard variant="regular" className="p-5">
          <h3 className="flex items-center gap-1.5 text-[13px] text-foreground/60">
            <Calendar className="size-3" strokeWidth={1.75} /> Penjadwalan
          </h3>
          <input
            type="datetime-local"
            value={scheduledFor}
            onChange={(e) => setScheduledFor(e.target.value)}
            className="mt-3 w-full rounded-xl border border-foreground/10 bg-foreground/5 px-3 py-2 text-[13px] outline-none focus:border-brand-500/40 dark:border-white/10 dark:bg-white/5"
          />
          <p className="mt-2 text-[13px] text-foreground/60">
            Posting otomatis ke channel terpilih saat tanggal jatuh tempo.
          </p>
        </GlassCard>

        <GlassCard variant="thin" className="p-5">
          <h3 className="text-[13px] text-foreground/60">Setelah dikirim</h3>
          <div className="mt-3 flex flex-wrap gap-2">
            <Pill tone="brand">{rubric.replace(/_/g, " ")}</Pill>
            <Pill tone="gold">
              <Sparkles className="size-3" strokeWidth={2} /> {style.replace(/_/g, " ")}
            </Pill>
          </div>
          <p className="mt-3 text-[13px] text-foreground/65">
            {scheduledFor ? "Konten akan terbit sesuai jadwal." : "Konten akan diperiksa koordinator sebelum terbit."}
          </p>
        </GlassCard>
      </aside>
    </div>
  );
}

function SelectField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <motion.label
      whileHover={{ y: -1 }}
      className="inline-flex items-center gap-2 rounded-full border border-foreground/10 bg-foreground/5 px-3 py-1.5 text-foreground/85 dark:border-white/10 dark:bg-white/5"
    >
      <span className="text-[13px] uppercase tracking-wider text-foreground/60">{label}</span>
      {children}
      <ChevronDown className="size-3 text-foreground/60" strokeWidth={1.75} />
    </motion.label>
  );
}
