import { cn } from "@/lib/utils";

/** Status ruang/layanan prodi hari ini (diisi cepat dari CMS). */
export function StatusLayanan({
  status,
  pesan,
}: {
  status: string;
  pesan: string;
}) {
  if (!status && !pesan) return null;
  const s = status.toLowerCase();
  const tone = s.includes("tutup")
    ? "bg-red-500"
    : s.includes("terbatas")
      ? "bg-amber-500"
      : "bg-emerald-500";
  return (
    <div className="mx-auto mb-10 flex max-w-[1024px] items-center gap-3 rounded-[18px] border border-hairline bg-canvas px-5 py-3.5">
      <span className="relative flex size-3 shrink-0">
        <span
          className={cn(
            "absolute inline-flex size-full animate-ping rounded-full opacity-50",
            tone,
          )}
        />
        <span
          className={cn("relative inline-flex size-3 rounded-full", tone)}
        />
      </span>
      <p className="text-[14.5px] text-label">
        <span className="font-bold">
          Layanan prodi hari ini: {status || "Info"}
        </span>
        {pesan && <span className="text-label-2"> · {pesan}</span>}
      </p>
    </div>
  );
}
