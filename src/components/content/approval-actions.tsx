"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { toast } from "sonner";
import { Check, X, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  contentId: string;
}

export function ApprovalActions({ contentId }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [note, setNote] = useState("");
  const [pending, startTransition] = useTransition();

  function act(decision: "approved" | "rejected" | "changes_requested") {
    startTransition(() => {
      toast.success(
        decision === "approved"
          ? "Konten disetujui — naik ke stage berikutnya."
          : decision === "rejected"
            ? "Konten ditolak."
            : "Permintaan revisi dikirim.",
      );
      setOpen(false);
      router.refresh();
    });
    void contentId;
  }

  return (
    <div className="flex flex-col items-stretch gap-2 sm:items-end">
      <div className="flex gap-2">
        <Button size="sm" onClick={() => act("approved")} disabled={pending}>
          <Check className="size-3.5" strokeWidth={2} /> Approve
        </Button>
        <Button
          size="sm"
          variant="secondary"
          onClick={() => setOpen((v) => !v)}
        >
          <MessageSquare className="size-3.5" strokeWidth={1.75} /> Revisi
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => act("rejected")}
          disabled={pending}
        >
          <X className="size-3.5" strokeWidth={1.75} />
        </Button>
      </div>

      {open && (
        <motion.div
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-foreground/10 bg-foreground/[0.04] p-3 dark:border-white/10 dark:bg-white/5"
        >
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Catatan revisi…"
            rows={2}
            className="w-full resize-y bg-transparent text-[12px] outline-none placeholder:text-foreground/45"
          />
          <Button
            size="sm"
            onClick={() => act("changes_requested")}
            disabled={pending || !note.trim()}
            className="mt-2 w-full"
          >
            Kirim catatan
          </Button>
        </motion.div>
      )}
    </div>
  );
}
