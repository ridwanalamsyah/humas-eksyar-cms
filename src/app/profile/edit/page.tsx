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
        <p className="text-[12.5px] text-foreground/50">
          Profil
        </p>
        <h1 className="mt-1 text-[24px] font-semibold leading-tight tracking-tight sm:text-[28px]">
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
