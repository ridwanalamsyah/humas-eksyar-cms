"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";
import {
  Sparkles,
  Copy,
  RefreshCcw,
  Wand2,
  Hash,
  Quote,
  ChevronDown,
  Lightbulb,
} from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Pill } from "@/components/common/pill";
import { STYLE_LIST, RUBRIC_LIST } from "@/lib/ai/captions";
import type {
  CaptionStyle,
  ContentRubric,
  CaptionTemplate,
} from "@/lib/data/types";
import { HASHTAG_BLOCK } from "@/lib/fixtures/contents";

interface Props {
  templates: CaptionTemplate[];
}

interface AiResult {
  caption: string;
  alternatives: string[];
  hashtags: string;
  hook?: string;
  cta?: string;
  provider: "gemini" | "mock";
  generatedAt: string;
}

export function CaptionPlayground({ templates }: Props) {
  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");
  const [style, setStyle] = useState<CaptionStyle>("formal_organisasi");
  const [rubric, setRubric] = useState<ContentRubric>("dokumentasi");
  const [includeHook, setIncludeHook] = useState(false);
  const [result, setResult] = useState<AiResult | null>(null);
  const [loading, setLoading] = useState(false);

  async function generate() {
    if (!title.trim()) {
      toast.error("Masukkan judul / topik dulu.");
      return;
    }
    setLoading(true);
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
          includeHook,
        }),
      });
      const json = (await res.json()) as AiResult;
      setResult(json);
      toast.success(
        json.provider === "gemini"
          ? "Generated dengan Gemini 2.0 Flash."
          : "Generated (mock fallback — set GEMINI_API_KEY untuk hasil real-time).",
      );
    } catch {
      toast.error("AI tidak merespon. Coba lagi.");
    } finally {
      setLoading(false);
    }
  }

  function applyTemplate(t: CaptionTemplate) {
    setRubric(t.rubric);
    setStyle(t.style);
    setDetails(t.example);
    toast.success("Template diterapkan ke field 'detail'.");
  }

  function copy(text: string, label = "Caption") {
    navigator.clipboard.writeText(text);
    toast.success(`${label} disalin.`);
  }

  return (
    <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_1.15fr]">
      <GlassCard variant="thick" className="p-6">
        <h3 className="font-display text-lg font-semibold tracking-tight">
          Brief Konten
        </h3>
        <p className="mt-1 text-[13px] text-foreground/65">
          Makin spesifik detailnya, makin spesifik hasilnya.
        </p>

        <div className="mt-5 grid gap-4">
          <Field label="Judul / topik" hint="Inti pesannya apa?">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Contoh: Refleksi pekanan — Etika Bermuamalah"
              className="w-full bg-transparent text-[14px] outline-none placeholder:text-foreground/40"
            />
          </Field>

          <Field
            label="Detail acara / konteks"
            hint="Tanggal, narasumber, lokasi, atau hal-hal yang harus muncul."
          >
            <textarea
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="Acara hari Senin, 14 Mei 2026 jam 07.30 di Masjid kampus, narasumber Ustadz X..."
              rows={4}
              className="w-full resize-y bg-transparent text-[14px] outline-none placeholder:text-foreground/40"
            />
          </Field>

          <Field label="Rubrik">
            <select
              value={rubric}
              onChange={(e) => setRubric(e.target.value as ContentRubric)}
              className="w-full bg-transparent text-[14px] outline-none"
            >
              {RUBRIC_LIST.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.emoji} {r.label}
                </option>
              ))}
            </select>
          </Field>

          <div>
            <p className="mb-2 text-[11px] font-medium uppercase tracking-[0.18em] text-foreground/55">
              Gaya tone
            </p>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {STYLE_LIST.map((s) => {
                const active = style === s.value;
                return (
                  <button
                    key={s.value}
                    type="button"
                    onClick={() => setStyle(s.value)}
                    className={`relative flex flex-col items-start gap-1 rounded-2xl border px-3 py-2.5 text-left text-[12px] transition-colors ${
                      active
                        ? "border-brand-500/45 bg-brand-500/10"
                        : "border-foreground/10 bg-foreground/[0.04] hover:border-foreground/20 dark:border-white/10 dark:bg-white/[0.04]"
                    }`}
                  >
                    <span className="text-base">{s.emoji}</span>
                    <span className="font-medium text-foreground">{s.label}</span>
                    <span className="text-foreground/55">{s.hint}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <label className="inline-flex items-center gap-2 text-[13px] text-foreground/75">
            <input
              type="checkbox"
              checked={includeHook}
              onChange={(e) => setIncludeHook(e.target.checked)}
              className="size-4 accent-brand-500"
            />
            Tambahkan <em className="font-medium">hook reel 3 detik</em>
          </label>

          <div className="flex flex-wrap items-center gap-2 pt-2">
            <Button onClick={generate} disabled={loading}>
              <Wand2 className="size-4" strokeWidth={1.75} />
              {loading ? "Menulis…" : "Generate Caption"}
            </Button>
            <Button
              variant="ghost"
              onClick={() => {
                setTitle("");
                setDetails("");
                setResult(null);
              }}
            >
              <RefreshCcw className="size-4" strokeWidth={1.75} /> Reset
            </Button>
          </div>
        </div>

        <details className="group mt-6 rounded-2xl border border-foreground/10 bg-foreground/[0.02] dark:border-white/10">
          <summary className="flex cursor-pointer items-center justify-between gap-2 px-4 py-3 text-[13px] font-medium">
            <span className="inline-flex items-center gap-2">
              <Lightbulb className="size-4 text-gold-500" strokeWidth={1.75} />
              Template Bank — {templates.length} preset
            </span>
            <ChevronDown
              className="size-4 transition-transform group-open:rotate-180"
              strokeWidth={1.75}
            />
          </summary>
          <div className="grid gap-2 px-4 pb-4">
            {templates.slice(0, 6).map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => applyTemplate(t)}
                className="rounded-xl border border-foreground/10 bg-background/30 p-3 text-left transition-colors hover:bg-foreground/[0.05] dark:border-white/10 dark:hover:bg-white/5"
              >
                <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.16em] text-foreground/55">
                  <Pill tone="brand">{t.rubric.replace("_", " ")}</Pill>
                  <Pill>{t.style.replace("_", " ")}</Pill>
                </div>
                <p className="mt-2 line-clamp-2 text-[13px] text-foreground/80">
                  {t.example}
                </p>
              </button>
            ))}
          </div>
        </details>
      </GlassCard>

      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {result ? (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ type: "spring", stiffness: 280, damping: 26 }}
              className="space-y-4"
            >
              <GlassCard variant="thick" className="p-6">
                <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-foreground/55">
                  <Sparkles className="size-3.5 text-gold-500" strokeWidth={2} />
                  Caption Utama · {result.provider === "gemini" ? "Gemini" : "Mock"}
                </div>
                <pre className="mt-3 whitespace-pre-wrap font-sans text-[14px] leading-relaxed text-foreground/90">
                  {result.caption}
                </pre>
                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <Button size="sm" onClick={() => copy(result.caption, "Caption")}>
                    <Copy className="size-3.5" strokeWidth={1.75} /> Salin caption
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() =>
                      copy(`${result.caption}\n\n${result.hashtags}`, "Caption + hashtags")
                    }
                  >
                    Salin lengkap dengan hashtag
                  </Button>
                </div>
              </GlassCard>

              {result.alternatives.length > 0 && (
                <GlassCard className="p-5">
                  <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-foreground/55">
                    <Quote className="size-3.5" strokeWidth={2} /> Alternatif
                  </div>
                  <div className="mt-3 grid gap-3">
                    {result.alternatives.map((alt, i) => (
                      <div
                        key={i}
                        className="rounded-2xl border border-foreground/10 bg-background/30 p-4 dark:border-white/10"
                      >
                        <p className="whitespace-pre-wrap text-[13px] leading-relaxed text-foreground/85">
                          {alt}
                        </p>
                        <button
                          type="button"
                          onClick={() => copy(alt, `Alternatif #${i + 1}`)}
                          className="mt-2 inline-flex items-center gap-1 text-[12px] font-medium text-brand-700 dark:text-brand-300"
                        >
                          <Copy className="size-3" strokeWidth={1.75} /> Salin
                        </button>
                      </div>
                    ))}
                  </div>
                </GlassCard>
              )}

              <GlassCard className="p-5">
                <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-foreground/55">
                  <Hash className="size-3.5" strokeWidth={2} /> Hashtag Tetap
                </div>
                <p className="mt-2 font-mono text-[12px] leading-relaxed text-foreground/75">
                  {result.hashtags}
                </p>
                <button
                  type="button"
                  onClick={() => copy(result.hashtags, "Hashtag")}
                  className="mt-2 inline-flex items-center gap-1 text-[12px] font-medium text-brand-700 dark:text-brand-300"
                >
                  <Copy className="size-3" strokeWidth={1.75} /> Salin hashtag
                </button>
              </GlassCard>

              {result.hook && (
                <GlassCard variant="thin" className="border-gold-400/40 p-4">
                  <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-gold-600 dark:text-gold-300">
                    Hook 3-detik
                  </p>
                  <p className="mt-1 text-[14px] font-medium">{result.hook}</p>
                </GlassCard>
              )}

              {result.cta && (
                <GlassCard variant="thin" className="p-4">
                  <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-foreground/55">
                    Call to Action
                  </p>
                  <p className="mt-1 text-[14px]">{result.cta}</p>
                </GlassCard>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <GlassCard variant="thin" className="p-8 text-center">
                <div className="mx-auto grid size-14 place-items-center rounded-2xl bg-gradient-to-br from-brand-500/20 to-gold-400/15">
                  <Sparkles className="size-6 text-brand-600 dark:text-brand-300" />
                </div>
                <h4 className="mt-3 font-display text-lg font-semibold">
                  Tunggu hasilnya muncul di sini
                </h4>
                <p className="mx-auto mt-1 max-w-prose text-sm text-foreground/65">
                  Isi brief sebelah kiri, pilih gaya tone, dan tekan{" "}
                  <em>Generate Caption</em>. AI akan menulis caption + alternatif +
                  hashtag siap-tempel.
                </p>
                <div className="mx-auto mt-4 inline-flex flex-wrap items-center justify-center gap-2 text-[11px] text-foreground/60">
                  <Pill tone="brand">Multimodal (foto + teks)</Pill>
                  <Pill tone="gold">Free 1500/hari</Pill>
                  <Pill>Hashtag tetap auto-append</Pill>
                </div>
                <code className="mx-auto mt-5 block max-w-md break-words rounded-xl border border-foreground/10 bg-foreground/[0.05] px-3 py-2 font-mono text-[11px] text-foreground/65 dark:border-white/10 dark:bg-white/5">
                  {HASHTAG_BLOCK}
                </code>
              </GlassCard>
            </motion.div>
          )}
        </AnimatePresence>
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
    <label className="block rounded-2xl border border-foreground/10 bg-foreground/[0.03] px-3 py-2.5 transition-colors focus-within:border-brand-500/45 focus-within:bg-foreground/[0.05] dark:border-white/10 dark:bg-white/[0.03]">
      <span className="text-[10px] font-medium uppercase tracking-[0.16em] text-foreground/55">
        {label}
      </span>
      <div className="mt-1">{children}</div>
      {hint && (
        <p className="mt-1 text-[11px] text-foreground/45">{hint}</p>
      )}
    </label>
  );
}
