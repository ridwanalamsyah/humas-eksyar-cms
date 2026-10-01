import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { InstagramImporter } from "@/components/instagram/instagram-importer";
import { getCurrentMember } from "@/lib/data/provider";
import { getInstagramSync } from "@/lib/instagram/import";

export const metadata = { title: "Instagram → Artikel" };
export const dynamic = "force-dynamic";

export default async function InstagramPage() {
  const member = await getCurrentMember();
  if (!member) redirect("/login");
  if (member.role === "monitoring") redirect("/content");
  const lastSync = await getInstagramSync();

  return (
    <AppShell>
      <Link
        href="/content"
        className="inline-flex items-center gap-1 text-sm text-foreground/55 hover:text-foreground"
      >
        <ArrowLeft className="size-4" strokeWidth={1.75} /> Konten
      </Link>
      <header className="mt-3">
        <p className="text-[12.5px] text-foreground/50">Konten</p>
        <h1 className="mt-1 text-[24px] font-semibold leading-tight tracking-tight sm:text-[28px]">
          Instagram → Artikel berita
        </h1>
        <p className="mt-2 max-w-prose text-[13px] text-foreground/65">
          Ubah postingan Instagram menjadi artikel berita website. AI menyusun
          judul dan isi hanya dari caption (tanpa menambah fakta), foto disimpan
          permanen, dan hasilnya masuk ke Konten sebagai <em>draft</em> untuk
          direview sebelum terbit.
        </p>
      </header>
      <InstagramImporter
        isAdmin={member.role === "admin"}
        lastSync={lastSync}
      />
    </AppShell>
  );
}
