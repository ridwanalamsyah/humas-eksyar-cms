/**
 * Personal task list endpoints.
 *
 *   GET  /api/tasks?status=...    — list mine
 *   POST /api/tasks               — create
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import {
  findMemberByEmail,
  listMemberTasks,
  createMemberTask,
} from "@/lib/data/provider";
import type { TaskStatus } from "@/lib/data/types";

const VALID_STATUSES: TaskStatus[] = [
  "pending",
  "in_progress",
  "done",
  "cancelled",
];

export async function GET(req: NextRequest): Promise<NextResponse> {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const me = await findMemberByEmail(session.user.email);
  if (!me) return NextResponse.json({ tasks: [] });

  const statusParam = req.nextUrl.searchParams.get("status");
  const status: TaskStatus[] | undefined = statusParam
    ? (statusParam
        .split(",")
        .map((s) => s.trim())
        .filter((s): s is TaskStatus =>
          (VALID_STATUSES as string[]).includes(s),
        ) as TaskStatus[])
    : undefined;

  const tasks = await listMemberTasks({ memberId: me.id, status });
  return NextResponse.json({ tasks });
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const me = await findMemberByEmail(session.user.email);
  if (!me) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await req.json().catch(() => ({}));
  const title =
    typeof body.title === "string" ? body.title.trim() : "";
  if (!title) {
    return NextResponse.json({ error: "Title wajib diisi" }, { status: 400 });
  }

  const task = await createMemberTask({
    memberId: me.id,
    title,
    description:
      typeof body.description === "string" ? body.description.trim() : "",
    contentId: body.contentId ?? null,
    eventId: body.eventId ?? null,
    holidayId: body.holidayId ?? null,
    dueDate: typeof body.dueDate === "string" ? body.dueDate : null,
  });
  return NextResponse.json({ task }, { status: 201 });
}
