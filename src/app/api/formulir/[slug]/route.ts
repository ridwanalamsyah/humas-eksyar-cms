/**
 * POST /api/formulir/[slug] — kirim isian formulir publik.
 * Perlindungan spam: kolom jebakan (honeypot), batas 6 kiriman/menit per IP,
 * waktu isi minimal 3 detik, dan validasi ketat per kolom.
 */
import { NextRequest, NextResponse } from "next/server";
import { createSubmission, getEvent } from "@/lib/data/provider";
import { findPublishedNews } from "@/lib/site/content";
import { findActiveForm, formSchema } from "@/lib/site/forms";
import { resolveOptions } from "@/lib/site/form-options";

const hits = new Map<string, number[]>();
function limited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < 60_000);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > 6;
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const def = findActiveForm((await params).slug);
  if (!def)
    return NextResponse.json(
      { error: "Formulir tidak ditemukan" },
      { status: 404 },
    );

  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  if (limited(ip))
    return NextResponse.json(
      { error: "Terlalu banyak kiriman. Coba lagi sebentar." },
      { status: 429 },
    );

  const body = (await req.json().catch(() => null)) as Record<
    string,
    unknown
  > | null;
  if (!body || typeof body !== "object")
    return NextResponse.json({ error: "Data tidak valid" }, { status: 400 });
  // Bot biasanya mengisi kolom tersembunyi atau mengirim terlalu cepat: pura-pura berhasil.
  if (body._hp || (typeof body._t === "number" && Date.now() - body._t < 3000))
    return NextResponse.json({ ok: true });
  if (def.consent && body._consent !== true)
    return NextResponse.json(
      { error: "Mohon centang persetujuan publikasi." },
      { status: 400 },
    );

  const parsed = formSchema(def, await resolveOptions(def)).safeParse(
    body.data ?? {},
  );
  if (!parsed.success)
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Isian tidak valid" },
      { status: 400 },
    );

  // Isian tersemat harus merujuk ke berita/acara yang ada.
  let refId: string | null = null;
  if (def.slug === "komentar" || def.slug === "acara") {
    refId = typeof body.refId === "string" ? body.refId.slice(0, 200) : null;
    const exists =
      refId &&
      (def.slug === "komentar"
        ? await findPublishedNews(refId)
        : await getEvent(refId));
    if (!exists)
      return NextResponse.json(
        { error: "Rujukan tidak ditemukan" },
        { status: 400 },
      );
  }

  const data = Object.fromEntries(
    Object.entries(parsed.data).filter(([, v]) => v !== undefined && v !== ""),
  );
  if (def.consent) data._persetujuan = true;
  await createSubmission({ type: def.slug, data, refId });
  return NextResponse.json({ ok: true, message: def.success });
}
