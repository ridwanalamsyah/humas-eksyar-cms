/** PATCH / DELETE /api/events/:id — ubah atau hapus jadwal (pengurus ke atas). */
import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { deleteEvent, updateEvent } from "@/lib/data/provider";
import { parseEventBody, requireScheduler } from "@/lib/events-api";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(req: NextRequest, { params }: Params) {
  const gate = await requireScheduler();
  if ("error" in gate) return gate.error;
  const parsed = parseEventBody(await req.json().catch(() => ({})), true);
  if ("error" in parsed) return NextResponse.json({ error: parsed.error }, { status: 400 });
  const event = await updateEvent((await params).id, parsed.data);
  if (!event) return NextResponse.json({ error: "Jadwal tidak ditemukan." }, { status: 404 });
  revalidatePath("/", "layout");
  return NextResponse.json({ event });
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const gate = await requireScheduler();
  if ("error" in gate) return gate.error;
  await deleteEvent((await params).id);
  revalidatePath("/", "layout");
  return NextResponse.json({ ok: true });
}
