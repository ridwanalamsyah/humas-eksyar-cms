import { AppHeader } from "@/components/layout/app-header";
import { isSuperAdminEmail } from "@/lib/auth/admins";
import { Sidebar } from "@/components/layout/sidebar";
import { getCurrentMember, listNotifications } from "@/lib/data/provider";
import { cn } from "@/lib/utils";
import { CmsPageTransition, PendingAccountView } from "@/components/layout/switch-account-button";
import { redirect } from "next/navigation";

interface AppShellProps {
  children: React.ReactNode;
  /** Smaller container — used on focused pages like editor */
  width?: "default" | "wide" | "narrow";
  /** Hide the bottom dock (e.g. for editor mobile) */
  hideDock?: boolean;
  /** Additional padding-top */
  topGap?: "default" | "tight";
}

export async function AppShell({
  children,
  width = "default",
  hideDock = false,
  topGap = "default",
}: AppShellProps) {
  let member = await getCurrentMember();

  // Tamu / pengguna yang belum login dilarang keras masuk CMS — wajib diarahkan ke halaman login
  if (member.id === "guest" || !member.email) {
    redirect("/login");
  }

  const emailLower = (member.email || "").toLowerCase();
  const isSuperAdmin = isSuperAdminEmail(emailLower);

  if (isSuperAdmin && (member.role === "pending" || member.id.startsWith("pending-"))) {
    member = {
      ...member,
      id: "mbr-ridwan",
      role: "admin",
      name: member.name && member.name !== "Pengguna baru" ? member.name : "Ridwan Alamsyah",
      position: "Admin Humas",
      divisionId: "div-redaksi",
    };
  }

  if (!isSuperAdmin && (member.id.startsWith("pending-") || member.role === "pending")) {
    return <PendingAccountView identifier={member.email || member.name} />;
  }

  const notifs = await listNotifications(member.id);
  const unread = notifs.filter((n) => !n.read).length;

  const widthClass = width === "wide" ? "max-w-7xl" : width === "narrow" ? "max-w-3xl" : "max-w-6xl";

  return (
    <div className="min-h-dvh bg-background text-foreground lg:pl-60">
      <Sidebar member={member} />
      <main
        className={cn(
          "mx-auto w-full px-4 pb-16 sm:px-8",
          topGap === "default" ? "pt-4 sm:pt-6" : "pt-3 sm:pt-4",
          widthClass,
        )}
      >
        <AppHeader member={member} unread={unread} />
        <div className="mt-6 sm:mt-8">
          <CmsPageTransition>{children}</CmsPageTransition>
        </div>
      </main>
    </div>
  );
}
