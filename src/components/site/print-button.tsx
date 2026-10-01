"use client";

import { Printer } from "lucide-react";

export function PrintButton({
  label = "Cetak / simpan PDF",
}: {
  label?: string;
}) {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="inline-flex items-center gap-2 rounded-full bg-mist px-5 py-2.5 text-[14px] font-semibold text-label hover:bg-hairline"
    >
      <Printer className="size-4" /> {label}
    </button>
  );
}
