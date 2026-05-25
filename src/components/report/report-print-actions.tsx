"use client";

/**
 * "Save as PDF" + "Share via WhatsApp" buttons for /report.
 *
 * Print: triggers browser's native print dialog. User selects "Save as PDF"
 * in destination to get a clean PDF copy.
 * WhatsApp: builds a wa.me link with a text recap.
 */
import { useState } from "react";
import { Printer, Share2, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function ReportPrintActions() {
  const [copied, setCopied] = useState(false);

  const printPage = () => {
    if (typeof window !== "undefined") window.print();
  };

  const buildRecap = (): string => {
    if (typeof document === "undefined") return "";
    const title = document.querySelector("h1")?.textContent ?? "Laporan";
    const stats = Array.from(
      document.querySelectorAll<HTMLDivElement>(".report-root section:first-of-type div"),
    )
      .map((el) => {
        const label = el.querySelector("p:first-of-type")?.textContent ?? "";
        const val = el.querySelector("p:last-of-type")?.textContent ?? "";
        return `${label}: ${val}`;
      })
      .join("\n");
    return `${title}\n\n${stats}\n\n${window.location.href}`;
  };

  const copyRecap = async () => {
    const text = buildRecap();
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success("Disalin — siap di-paste ke WA grup");
      setTimeout(() => setCopied(false), 2500);
    } catch {
      toast.error("Gagal menyalin");
    }
  };

  const shareWa = () => {
    const text = buildRecap();
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank");
  };

  return (
    <div className="flex flex-wrap gap-2">
      <Button size="sm" variant="ghost" onClick={copyRecap}>
        {copied ? (
          <Check className="size-3.5" strokeWidth={2} />
        ) : (
          <Copy className="size-3.5" strokeWidth={1.75} />
        )}
        Salin recap
      </Button>
      <Button size="sm" variant="ghost" onClick={shareWa}>
        <Share2 className="size-3.5" strokeWidth={1.75} />
        WhatsApp
      </Button>
      <Button size="sm" onClick={printPage}>
        <Printer className="size-3.5" strokeWidth={1.75} />
        Save as PDF
      </Button>
    </div>
  );
}
