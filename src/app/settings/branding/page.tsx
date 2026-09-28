import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { getCurrentMember, getBrandingConfig } from "@/lib/data/provider";
import { BrandingEditor } from "@/components/settings/branding-editor";

export const metadata = { title: "Branding · Settings" };

export default async function BrandingSettingsPage() {
  const member = await getCurrentMember();
  if (!member) redirect("/login");
  if (member.role !== "admin") {
    redirect("/settings");
  }
  const branding = await getBrandingConfig();
  return (
    <AppShell>
      <Link
        href="/settings"
        className="inline-flex items-center gap-1 text-sm text-foreground/55 hover:text-foreground"
      >
        <ArrowLeft className="size-4" strokeWidth={1.75} /> Settings
      </Link>
      <header className="mt-3">
        <p className="text-[12.5px] text-foreground/50">
          Branding
        </p>
        <h1 className="mt-1 text-[24px] font-semibold leading-tight tracking-tight sm:text-[28px]">
          Identitas resmi
        </h1>
        <p className="mt-2 max-w-prose text-[13px] text-foreground/65">
          Footer caption, hashtag default, dan nama organisasi yang dipakai di
          seluruh konten dan AI caption generator.
        </p>
      </header>
      <BrandingEditor initial={branding} />
    </AppShell>
  );
}
