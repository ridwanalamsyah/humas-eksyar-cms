import { listContents } from "@/lib/data/provider";
import { AppShell } from "@/components/layout/app-shell";
import { ContentBoard } from "@/components/content/content-board";

export const metadata = { title: "Artikel & Berita" };
export const dynamic = "force-dynamic";

export default async function ContentPage() {
  const contents = await listContents();
  return (
    <AppShell width="wide">
      <header className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[13px] text-foreground/60">
            Publikasi &amp; Artikel
          </p>
          <h1 className="mt-1 text-[24px] font-semibold leading-tight tracking-tight sm:text-[28px]">
            Artikel &amp; Berita
          </h1>
          <p className="mt-1 max-w-prose text-foreground/65 text-[14px]">
            Kelola draf tulisan, tinjauan redaksi, dan artikel yang tayang di website prodi.
          </p>
        </div>
      </header>
      <ContentBoard contents={contents} />
    </AppShell>
  );
}
