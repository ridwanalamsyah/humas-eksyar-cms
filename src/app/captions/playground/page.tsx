import type { Metadata } from "next";
import { listCaptionTemplates, listRubrics } from "@/lib/data/provider";
import { AppShell } from "@/components/layout/app-shell";
import { SectionHeader } from "@/components/common/section-header";
import { CaptionPlayground } from "@/components/ai/caption-playground";

export const metadata: Metadata = {
  title: "Pembuat caption",
  description: "Buat caption untuk konten Humas Eksyar.",
};

export default async function CaptionsPlaygroundPage() {
  const [templates, rubrics] = await Promise.all([
    listCaptionTemplates(),
    listRubrics(),
  ]);
  return (
    <AppShell width="wide">
      <SectionHeader
        title="Pembuat caption"
        description="Caption untuk Instagram, X, dan Facebook."
      />
      <CaptionPlayground templates={templates} rubrics={rubrics} />
    </AppShell>
  );
}
