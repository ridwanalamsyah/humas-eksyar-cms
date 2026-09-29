import { listContents } from "@/lib/data/provider";
import { AppShell } from "@/components/layout/app-shell";
import { ContentBoard } from "@/components/content/content-board";

export const metadata = { title: "Konten" };

export default async function ContentPage() {
  const contents = await listContents();
  return (
    <AppShell width="wide">
      <header className="mb-6">
        <p className="text-[12.5px] text-foreground/50">
          Editorial pipeline
        </p>
        <h1 className="mt-1 text-[24px] font-semibold leading-tight tracking-tight sm:text-[28px]">
          Konten
        </h1>
        <p className="mt-2 max-w-prose text-foreground/65">
          Pipeline editorial: ide, draft, review, publish.
        </p>
      </header>
      <ContentBoard contents={contents} />
    </AppShell>
  );
}
