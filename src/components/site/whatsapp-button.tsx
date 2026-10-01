import { MessageCircle } from "lucide-react";

/** Tombol mengambang "Tanya prodi" ke WhatsApp resmi prodi. */
export function WhatsAppButton({ href }: { href: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      data-print-hide
      className="fixed bottom-5 right-5 z-40 flex items-center gap-2 rounded-full bg-accent px-4 py-3 text-[14px] font-semibold text-white shadow-[0_12px_32px_-12px_rgba(22,58,69,0.6)] transition hover:scale-[1.03] hover:bg-accent-strong"
    >
      <MessageCircle className="size-5" />
      <span className="hidden sm:inline">Tanya prodi</span>
    </a>
  );
}
