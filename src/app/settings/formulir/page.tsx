import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { InboxView } from "@/components/settings/inbox-view";
import { getCurrentMember, listSubmissions } from "@/lib/data/provider";
import { FORMS } from "@/lib/site/forms";

export const metadata = { title: "Kotak masuk formulir" };
export const dynamic = "force-dynamic";

export default async function FormulirInboxPage() {
  const member = await getCurrentMember();
  if (!member) redirect("/login");
  if (member.role !== "admin") redirect("/settings");
  const items = await listSubmissions({ limit: 5000 });

  return (
    <AppShell>
      <Link
        href="/settings"
        className="inline-flex items-center gap-1 text-sm text-foreground/55 hover:text-foreground"
      >
        <ArrowLeft className="size-4" strokeWidth={1.75} /> Pengaturan
      </Link>
      <header className="mt-3">
        <p className="text-[12.5px] text-foreground/50">Website Prodi</p>
        <h1 className="mt-1 text-[24px] font-semibold leading-tight tracking-tight sm:text-[28px]">
          Kotak masuk formulir
        </h1>
        <p className="mt-2 max-w-prose text-[13px] text-foreground/65">
          Kiriman dari formulir website: kritik & saran, survei, lapor prestasi,
          kerja sama, pertanyaan, pendaftaran acara, dan lainnya. Ubah status,
          tulis catatan, atau unduh sebagai Excel.
        </p>
      </header>
      <InboxView forms={FORMS} items={items} />
    </AppShell>
  );
}
