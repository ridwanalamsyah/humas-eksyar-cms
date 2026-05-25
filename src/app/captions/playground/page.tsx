import type { Metadata } from "next";
import { listCaptionTemplates, listRubrics } from "@/lib/data/provider";
import { AppShell } from "@/components/layout/app-shell";
import { SectionHeader } from "@/components/common/section-header";
import { CaptionPlayground } from "@/components/ai/caption-playground";

export const metadata: Metadata = {
  title: "AI Caption Generator",
  description: "Generate caption untuk konten Humas Eksyar.",
};

export default async function CaptionsPlaygroundPage() {
  const [templates, rubrics] = await Promise.all([
    listCaptionTemplates(),
    listRubrics(),
  ]);
  return (
    <AppShell width="wide">
      <SectionHeader
        eyebrow="AI"
        title="Caption Generator"
        description="Generate caption untuk Instagram, Twitter, dan Facebook."
      />
      <CaptionPlayground templates={templates} rubrics={rubrics} />
    </AppShell>
  );
}
