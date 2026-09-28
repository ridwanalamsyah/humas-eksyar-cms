import { BottomDock } from "@/components/navigation/bottom-dock";
import { AppHeader } from "@/components/layout/app-header";
import { Sidebar } from "@/components/layout/sidebar";
import { getCurrentMember, listNotifications } from "@/lib/data/provider";
import { cn } from "@/lib/utils";

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
  const member = await getCurrentMember();
  const notifs = await listNotifications(member.id);
  const unread = notifs.filter((n) => !n.read).length;

  const widthClass = width === "wide" ? "max-w-7xl" : width === "narrow" ? "max-w-3xl" : "max-w-6xl";

  return (
    <div className="min-h-dvh lg:pl-60">
      <Sidebar member={member} />
      <main
        className={cn(
          "mx-auto w-full px-4 pb-28 sm:px-8 lg:pb-16",
          topGap === "default" ? "pt-4 sm:pt-6" : "pt-3 sm:pt-4",
          widthClass,
        )}
      >
        <AppHeader member={member} unread={unread} />
        <div className="mt-6 sm:mt-8">{children}</div>
      </main>
      {!hideDock && <BottomDock />}
    </div>
  );
}
