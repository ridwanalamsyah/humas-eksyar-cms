import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { getCurrentMember } from "@/lib/data/provider";
import { ProfileEditor } from "@/components/profile/profile-editor";

export const metadata = { title: "Edit Profil" };

export default async function ProfileEditPage() {
  const member = await getCurrentMember();
  if (!member) {
    redirect("/login");
  }
  return (
    <AppShell>
      <Link
        href="/settings"
        className="inline-flex items-center gap-1 text-sm text-foreground/55 hover:text-foreground"
      >
        <ArrowLeft className="size-4" strokeWidth={1.75} /> Settings
      </Link>
      <header className="mt-3">
        <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-foreground/55">
          Profil
        </p>
        <h1 className="mt-1 font-display text-[clamp(1.6rem,1.3rem+1.2vw,2.1rem)] font-semibold leading-tight tracking-tight">
          Edit profil
        </h1>
        <p className="mt-2 max-w-prose text-[13px] text-foreground/65">
          Foto, nama, bio, dan accent warna profile. Foto disimpan di Vercel
          Blob.
        </p>
      </header>
      <ProfileEditor member={member} />
    </AppShell>
  );
}
