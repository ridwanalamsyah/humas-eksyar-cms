/**
 * Single task endpoints.
 *
 *   PATCH  /api/tasks/:id   (update fields or status)
 *   DELETE /api/tasks/:id
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import {
  findMemberByEmail,
  getMemberTask,
  updateMemberTask,
  deleteMemberTask,
} from "@/lib/data/provider";
import type { TaskStatus } from "@/lib/data/types";

interface Params {
  params: Promise<{ id: string }>;
}

const VALID_STATUSES: TaskStatus[] = [
  "pending",
  "in_progress",
  "done",
  "cancelled",
];

async function ensureOwner(
  id: string,
  email: string,
): Promise<{ ok: true } | { ok: false; status: number; error: string }> {
  const me = await findMemberByEmail(email);
  if (!me) return { ok: false, status: 403, error: "Forbidden" };
  const task = await getMemberTask(id);
  if (!task) return { ok: false, status: 404, error: "Not found" };
  if (task.memberId !== me.id) {
    return { ok: false, status: 403, error: "Bukan task Anda" };
  }
  return { ok: true };
}

export async function PATCH(req: NextRequest, { params }: Params) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const own = await ensureOwner(id, session.user.email);
  if (!own.ok) {
    return NextResponse.json({ error: own.error }, { status: own.status });
  }
  const body = await req.json().catch(() => ({}));
  const patch: {
    title?: string;
    description?: string;
    dueDate?: string | null;
    status?: TaskStatus;
  } = {};
  if (typeof body.title === "string") patch.title = body.title.trim();
  if (typeof body.description === "string")
    patch.description = body.description.trim();
  if (body.dueDate === null || typeof body.dueDate === "string")
    patch.dueDate = body.dueDate;
  if (
    typeof body.status === "string" &&
    (VALID_STATUSES as string[]).includes(body.status)
  ) {
    patch.status = body.status as TaskStatus;
  }
  const task = await updateMemberTask(id, patch);
  if (!task) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ task });
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const own = await ensureOwner(id, session.user.email);
  if (!own.ok) {
    return NextResponse.json({ error: own.error }, { status: own.status });
  }
  const ok = await deleteMemberTask(id);
  return NextResponse.json({ ok });
}
