"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { History } from "lucide-react";

/** Riwayat versi isi website + pulihkan. */
export function WebsiteHistory({
  items,
}: {
  items: { at: string; by: string }[];
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [pending, start] = useTransition();
  if (!items.length) return null;
  return (
    <div className="mt-3 rounded-xl border border-foreground/10 px-4 py-3 dark:border-white/10">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 text-[13.5px] font-semibold"
      >
        <History className="size-4" /> Riwayat perubahan ({items.length} versi)
      </button>
      {open && (
        <ul className="mt-3 grid gap-1.5 text-[13px]">
          {items.map((h) => (
            <li key={h.at} className="flex items-center justify-between gap-3">
              <span>
                {new Date(h.at).toLocaleString("id-ID")}{" "}
                <span className="text-foreground/55">
                  · sebelum diubah oleh {h.by}
                </span>
              </span>
              <button
                type="button"
                disabled={pending}
                onClick={() =>
                  confirm(
                    "Pulihkan isi website ke versi ini? Isi saat ini tetap tersimpan di riwayat.",
                  ) &&
                  start(async () => {
                    const res = await fetch("/api/website/history", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ at: h.at }),
                    });
                    if (!res.ok) toast.error("Gagal memulihkan");
                    else {
                      toast.success("Versi dipulihkan");
                      router.refresh();
                      setTimeout(() => window.location.reload(), 400);
                    }
                  })
                }
                className="rounded-lg bg-foreground/[0.06] px-2.5 py-1 font-medium hover:bg-foreground/[0.1]"
              >
                Pulihkan
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
