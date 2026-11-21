import { AppShell } from "@/components/layout/app-shell";
import { ContentEditor } from "@/components/content/content-editor";
import {
  listMedia,
  getCurrentMember,
  listRubrics,
  getBrandingConfig,
} from "@/lib/data/provider";
import Link from "next/link";
import { BULETIN_HMJ_RUBRIC } from "@/lib/site/content";
import { ArrowLeft } from "lucide-react";

export const metadata = { title: "Konten Baru" };
export const dynamic = "force-dynamic";

export default async function NewContentPage() {
  const [media, member, rubrics, branding] = await Promise.all([
    listMedia(),
    getCurrentMember(),
    listRubrics(),
    getBrandingConfig(),
  ]);

  // Akun HMJ (peran "anggota") hanya menulis Buletin Artikel HMJ.
  const allowedRubrics =
    member?.role === "anggota"
      ? rubrics.filter((r) => r.slug === BULETIN_HMJ_RUBRIC)
      : rubrics;

  return (
    <AppShell width="wide">
      <Link href="/content" className="inline-flex items-center gap-1 text-sm text-foreground/60 hover:text-foreground">
        <ArrowLeft className="size-4" strokeWidth={1.75} /> Kembali
      </Link>
      <header className="mt-3">
        <p className="text-[13px] text-foreground/60">
          Editor
        </p>
        <h1 className="mt-1 text-[24px] font-semibold leading-tight tracking-tight sm:text-[28px]">
          Tulis konten
        </h1>
        <p className="mt-2 max-w-prose text-foreground/65">
          Beri foto dan konteks, lalu tekan &ldquo;Tulis dengan AI&rdquo;. Periksa hasilnya, lalu terbitkan.
        </p>
      </header>
      <ContentEditor
        media={media}
        author={member}
        rubrics={allowedRubrics}
        defaultHashtags={branding.defaultHashtags}
      />
    </AppShell>
  );
}
