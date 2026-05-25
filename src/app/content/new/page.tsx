import { AppShell } from "@/components/layout/app-shell";
import { ContentEditor } from "@/components/content/content-editor";
import { listMedia, getCurrentMember } from "@/lib/data/provider";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata = { title: "Konten Baru" };

export default async function NewContentPage() {
  const [media, member] = await Promise.all([
    listMedia(),
    getCurrentMember(),
  ]);

  return (
    <AppShell width="wide">
      <Link href="/content" className="inline-flex items-center gap-1 text-sm text-foreground/55 hover:text-foreground">
        <ArrowLeft className="size-4" strokeWidth={1.75} /> Kembali
      </Link>
      <header className="mt-3">
        <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-foreground/55">
          Editor
        </p>
        <h1 className="mt-1 font-display text-[clamp(1.8rem,1.4rem+1.5vw,2.4rem)] font-semibold leading-tight tracking-tight">
          Konten baru
        </h1>
        <p className="mt-2 max-w-prose text-foreground/65">
          Tulis caption, pilih media, dan kirim ke approval. AI sidebar di kanan
          siap bantu polish.
        </p>
      </header>
      <ContentEditor media={media} author={member} />
    </AppShell>
  );
}
