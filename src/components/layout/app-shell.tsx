import { BottomDock } from "@/components/navigation/bottom-dock";
import { AppHeader } from "@/components/layout/app-header";
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

  const widthClass =
    width === "wide"
      ? "max-w-7xl"
      : width === "narrow"
        ? "max-w-3xl"
        : "max-w-6xl";

  return (
    <main
      className={cn(
        "mx-auto w-full px-4 pb-32 sm:px-6 sm:pb-40",
        topGap === "default" ? "pt-6 sm:pt-10" : "pt-4 sm:pt-6",
        widthClass,
      )}
    >
      <AppHeader member={member} unread={unread} />
      <div className="mt-8">{children}</div>
      {!hideDock && <BottomDock />}
    </main>
  );
}
