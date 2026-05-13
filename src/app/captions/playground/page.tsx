import type { Metadata } from "next";
import { listDivisions, listCaptionTemplates } from "@/lib/data/provider";
import { AppShell } from "@/components/layout/app-shell";
import { SectionHeader } from "@/components/common/section-header";
import { CaptionPlayground } from "@/components/ai/caption-playground";

export const metadata: Metadata = {
  title: "AI Caption Generator",
  description: "Generate caption untuk konten Humas Eksyar.",
};

export default async function CaptionsPlaygroundPage() {
  const [divisions, templates] = await Promise.all([
    listDivisions(),
    listCaptionTemplates(),
  ]);
  return (
    <AppShell width="wide">
      <SectionHeader
        eyebrow="AI"
        title="Caption Generator"
        description="Generate caption untuk Instagram, Twitter, dan Facebook."
      />
      <CaptionPlayground divisions={divisions} templates={templates} />
    </AppShell>
  );
}
