/** POST /api/events — tambah jadwal kegiatan (pengurus ke atas). */
import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { createEvent } from "@/lib/data/provider";
import { parseEventBody, requireScheduler } from "@/lib/events-api";

export async function POST(req: NextRequest) {
  const gate = await requireScheduler();
  if ("error" in gate) return gate.error;
  const parsed = parseEventBody(await req.json().catch(() => ({})));
  if ("error" in parsed) return NextResponse.json({ error: parsed.error }, { status: 400 });
  const d = parsed.data as Required<typeof parsed.data>;
  const event = await createEvent(d, gate.me.id, gate.me.divisionId);
  revalidatePath("/", "layout");
  return NextResponse.json({ event }, { status: 201 });
}
