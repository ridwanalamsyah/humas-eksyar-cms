import { AppShell } from "@/components/layout/app-shell";
import { ContentEditor } from "@/components/content/content-editor";
import {
  listMedia,
  getCurrentMember,
  listRubrics,
  getBrandingConfig,
} from "@/lib/data/provider";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata = { title: "Konten Baru" };

export default async function NewContentPage() {
  const [media, member, rubrics, branding] = await Promise.all([
    listMedia(),
    getCurrentMember(),
    listRubrics(),
    getBrandingConfig(),
  ]);

  return (
    <AppShell width="wide">
      <Link href="/content" className="inline-flex items-center gap-1 text-sm text-foreground/55 hover:text-foreground">
        <ArrowLeft className="size-4" strokeWidth={1.75} /> Kembali
      </Link>
      <header className="mt-3">
        <p className="text-[12.5px] text-foreground/50">
          Editor
        </p>
        <h1 className="mt-1 text-[24px] font-semibold leading-tight tracking-tight sm:text-[28px]">
          Konten baru
        </h1>
        <p className="mt-2 max-w-prose text-foreground/65">
          Tulis isi, pilih foto, lalu kirim untuk diperiksa. Bantuan AI di
          sebelah kanan bisa merapikan tulisan.
        </p>
      </header>
      <ContentEditor
        media={media}
        author={member}
        rubrics={rubrics}
        defaultHashtags={branding.defaultHashtags}
      />
    </AppShell>
  );
}
