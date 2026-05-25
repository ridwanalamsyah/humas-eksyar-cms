import type { Metadata } from "next";
import {
  listMedia,
  getBrandingConfig,
  findMemberByEmail,
} from "@/lib/data/provider";
import { auth } from "@/auth";
import { AppShell } from "@/components/layout/app-shell";
import { SectionHeader } from "@/components/common/section-header";
import { MediaLibrary } from "@/components/media/media-library";

export const metadata: Metadata = {
  title: "Media Library",
  description: "Pusat aset visual — foto, video, dokumen — yang dipakai konten.",
};

export default async function MediaPage() {
  const [media, branding, session] = await Promise.all([
    listMedia(),
    getBrandingConfig(),
    auth(),
  ]);
  const me = session?.user?.email
    ? await findMemberByEmail(session.user.email)
    : null;
  return (
    <AppShell width="wide">
      <SectionHeader
        eyebrow="Aset Visual"
        title="Media Library"
        description={`${media.length} aset tersedia.`}
      />
      <MediaLibrary
        media={media}
        branding={branding}
        currentMemberId={me?.id ?? null}
        currentMemberRole={me?.role ?? null}
      />
    </AppShell>
  );
}
