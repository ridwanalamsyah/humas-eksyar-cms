/** POST /api/skripsi/sync (admin) — tarik judul skripsi terbaru dari Digilib. */
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { findMemberByEmail } from "@/lib/data/provider";
import { syncSkripsiFromDigilib } from "@/lib/site/skripsi-sync";

export const maxDuration = 60;

export async function POST() {
  const session = await auth();
  if (!session?.user?.email)
    return NextResponse.json(
      { error: "Silakan masuk terlebih dahulu." },
      { status: 401 },
    );
  const me = await findMemberByEmail(session.user.email);
  if (!me || me.role !== "admin")
    return NextResponse.json(
      { error: "Anda tidak punya akses untuk tindakan ini." },
      { status: 403 },
    );
  try {
    return NextResponse.json(await syncSkripsiFromDigilib());
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Sinkronisasi gagal" },
      { status: 502 },
    );
  }
}
