import type { Metadata } from "next";
import { AppShell } from "@/components/layout/app-shell";
import { SectionHeader } from "@/components/common/section-header";
import { SettingsPanels } from "@/components/settings/settings-panels";
import { getCurrentMember } from "@/lib/data/provider";

export const metadata: Metadata = {
  title: "Pengaturan",
  description: "Tema, notifikasi, sound, dan akun.",
};

export default async function SettingsPage() {
  const me = await getCurrentMember();
  return (
    <AppShell>
      <SectionHeader
        eyebrow="Akun"
        title="Pengaturan"
        description="Atur preferensi pribadi Anda — perubahan disimpan otomatis ke device ini."
      />
      <SettingsPanels member={me} />
    </AppShell>
  );
}
