import type { Metadata } from "next";
import { listDivisions, listCaptionTemplates } from "@/lib/data/provider";
import { AppShell } from "@/components/layout/app-shell";
import { SectionHeader } from "@/components/common/section-header";
import { CaptionPlayground } from "@/components/ai/caption-playground";

export const metadata: Metadata = {
  title: "AI Caption Generator",
  description:
    "Generate caption Instagram / Twitter / Facebook bergaya Eksyar — 7 gaya tone, multi-variant.",
};

export default async function CaptionsPlaygroundPage() {
  const [divisions, templates] = await Promise.all([
    listDivisions(),
    listCaptionTemplates(),
  ]);
  return (
    <AppShell width="wide">
      <SectionHeader
        eyebrow="AI · Gemini 2.0 Flash"
        title="Caption Generator"
        description="Tuangkan ide, pilih gaya tone, biarkan AI menjahit caption + hashtag tetap Eksyar. Atau pakai template sebagai starting point."
      />
      <CaptionPlayground divisions={divisions} templates={templates} />
    </AppShell>
  );
}
