import type { Metadata } from "next";
import { listMedia } from "@/lib/data/provider";
import { AppShell } from "@/components/layout/app-shell";
import { SectionHeader } from "@/components/common/section-header";
import { MediaLibrary } from "@/components/media/media-library";

export const metadata: Metadata = {
  title: "Media Library",
  description: "Pusat aset visual — foto, video, dokumen — yang dipakai konten.",
};

export default async function MediaPage() {
  const media = await listMedia();
  return (
    <AppShell width="wide">
      <SectionHeader
        eyebrow="Aset Visual"
        title="Media Library"
        description={`${media.length} aset siap dipakai. Drag-drop untuk upload (mock di phase ini).`}
      />
      <MediaLibrary media={media} />
    </AppShell>
  );
}
