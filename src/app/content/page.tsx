import { listContents } from "@/lib/data/provider";
import { AppShell } from "@/components/layout/app-shell";
import { ContentBoard } from "@/components/content/content-board";

export const metadata = { title: "Konten" };

export default async function ContentPage() {
  const contents = await listContents();
  return (
    <AppShell width="wide">
      <header className="mb-6">
        <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-foreground/55">
          Editorial pipeline
        </p>
        <h1 className="mt-1 font-display text-[clamp(1.8rem,1.4rem+1.5vw,2.5rem)] font-semibold leading-tight tracking-tight">
          Konten
        </h1>
        <p className="mt-2 max-w-prose text-foreground/65">
          Pipeline ide → publish dengan approval matrix Humas Eksyar. AI menandai
          konten yang dihasilkan/dipoles otomatis.
        </p>
      </header>
      <ContentBoard contents={contents} />
    </AppShell>
  );
}
