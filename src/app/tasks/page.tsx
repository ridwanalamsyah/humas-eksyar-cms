import { redirect } from "next/navigation";
import { auth } from "@/auth";
import {
  findMemberByEmail,
  listMemberTasks,
  listHolidays,
  listEvents,
  listContents,
} from "@/lib/data/provider";
import { AppShell } from "@/components/layout/app-shell";
import { TasksClient } from "@/components/tasks/tasks-client";

export const dynamic = "force-dynamic";

export default async function TasksPage() {
  const session = await auth();
  if (!session?.user?.email) {
    redirect("/login");
  }
  const me = await findMemberByEmail(session.user.email);
  if (!me) {
    redirect("/");
  }

  const today = new Date();
  const horizon = new Date(today);
  horizon.setDate(horizon.getDate() + 30);

  const [tasks, holidays, events, contents] = await Promise.all([
    listMemberTasks({ memberId: me.id }),
    listHolidays({ from: today, to: horizon }),
    listEvents({ fromDate: today.toISOString().slice(0, 10) }),
    listContents(),
  ]);

  const myContents = contents.filter(
    (c) => c.authorId === me.id && c.status !== "published" && c.status !== "archived",
  );

  return (
    <AppShell width="wide">
      <header className="mb-6">
        <h1 className="font-display text-[clamp(1.6rem,1.2rem+1.5vw,2.2rem)] font-semibold tracking-tight">
          Task List
        </h1>
        <p className="mt-1 text-sm text-foreground/65">
          Daftar pribadi {me.name}. Bikin to-do dan link ke konten, event, atau hari besar.
        </p>
      </header>

      <TasksClient
        initialTasks={tasks}
        holidays={holidays}
        events={events.slice(0, 30)}
        contents={myContents.slice(0, 30)}
      />
    </AppShell>
  );
}
