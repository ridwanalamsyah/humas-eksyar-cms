import type { Metadata } from "next";
import { listMedia } from "@/lib/data/provider";
import { AppShell } from "@/components/layout/app-shell";
import { SectionHeader } from "@/components/common/section-header";
import { MediaLibrary } from "@/components/media/media-library";

export const metadata: Metadata = {
  title: "Media",
  description: "Pustaka foto untuk konten dan website.",
};

export default async function MediaPage() {
  const media = await listMedia();
  return (
    <AppShell width="wide">
      <SectionHeader
        eyebrow="Pustaka foto"
        title="Media"
        description={`${media.length} foto tersimpan.`}
      />
      <MediaLibrary media={media} />
    </AppShell>
  );
}
