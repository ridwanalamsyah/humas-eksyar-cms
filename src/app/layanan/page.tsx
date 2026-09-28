import { redirect } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { LayananInbox } from "@/components/layanan/layanan-inbox";
import { getCurrentMember, listServiceRequests } from "@/lib/data/provider";
import { PROCESSOR_ROLES, VIEWER_ROLES } from "@/lib/site/layanan";

export const metadata = { title: "Layanan Mahasiswa" };

// Pengajuan masuk terus-menerus — selalu render dengan data terbaru.
export const dynamic = "force-dynamic";

export default async function LayananInboxPage() {
  const member = await getCurrentMember();
  if (!member) redirect("/login");
  if (!VIEWER_ROLES.includes(member.role)) redirect("/");

  const requests = await listServiceRequests();

  return (
    <AppShell>
      <header>
        <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-foreground/55">Website Prodi</p>
        <h1 className="mt-1 font-display text-[clamp(1.6rem,1.3rem+1.2vw,2.1rem)] font-semibold leading-tight tracking-tight">
          Layanan mahasiswa
        </h1>
        <p className="mt-2 max-w-prose text-[13px] text-foreground/65">
          Pengajuan surat & layanan dari halaman <span className="font-medium">/prodi/layanan</span>. Ubah status untuk
          mengabari pemohon lewat email; unggah surat jadi agar bisa diunduh dari halaman cek status.
        </p>
      </header>
      <LayananInbox initial={requests} canEdit={PROCESSOR_ROLES.includes(member.role)} />
    </AppShell>
  );
}
