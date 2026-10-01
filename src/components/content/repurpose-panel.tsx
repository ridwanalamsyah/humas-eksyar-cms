"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Copy, Loader2, Repeat } from "lucide-react";
import { Button } from "@/components/ui/button";

type Out = {
  instagram: string;
  whatsapp: string;
  ringkas: string;
  ai: boolean;
};

/** Satu tulisan → caption IG, pesan WhatsApp, dan ringkasan, siap disalin. */
export function RepurposePanel({ contentId }: { contentId: string }) {
  const [out, setOut] = useState<Out | null>(null);
  const [loading, setLoading] = useState(false);
  async function run() {
    setLoading(true);
    try {
      const res = await fetch("/api/ai/repurpose", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contentId }),
      });
      const j = await res.json();
      if (!res.ok) toast.error(j.error ?? "Gagal");
      else setOut(j);
    } finally {
      setLoading(false);
    }
  }
  const items: [keyof Omit<Out, "ai">, string][] = [
    ["instagram", "Caption Instagram"],
    ["whatsapp", "Pesan WhatsApp"],
    ["ringkas", "Ringkasan (pita pengumuman)"],
  ];
  return (
    <div className="mt-4">
      <Button size="sm" variant="secondary" onClick={run} disabled={loading}>
        {loading ? (
          <Loader2 className="size-3.5 animate-spin" />
        ) : (
          <Repeat className="size-3.5" />
        )}{" "}
        Buat versi IG, WhatsApp & ringkasan
      </Button>
      {out && (
        <div className="mt-3 grid gap-3 md:grid-cols-3">
          {items.map(([k, label]) => (
            <div key={k} className="glass-regular rounded-xl p-3">
              <div className="flex items-center justify-between">
                <p className="text-[12px] font-semibold text-foreground/60">
                  {label}
                </p>
                <button
                  type="button"
                  aria-label={`Salin ${label}`}
                  onClick={async () => {
                    await navigator.clipboard.writeText(out[k]);
                    toast.success("Disalin");
                  }}
                  className="text-foreground/50 hover:text-foreground"
                >
                  <Copy className="size-3.5" />
                </button>
              </div>
              <p className="mt-2 whitespace-pre-line text-[12.5px] leading-relaxed">
                {out[k]}
              </p>
            </div>
          ))}
          {!out.ai && (
            <p className="text-[12px] text-foreground/55 md:col-span-3">
              Dibuat tanpa AI (GEMINI_API_KEY belum diatur).
            </p>
          )}
        </div>
      )}
    </div>
  );
}
