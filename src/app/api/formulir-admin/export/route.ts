/** GET /api/formulir-admin/export?type=saran (admin) — unduh isian sebagai CSV (Excel). */
import { NextRequest, NextResponse } from "next/server";
import { listSubmissions } from "@/lib/data/provider";
import { requireAdmin } from "@/lib/site/admin-guard";
import { findForm } from "@/lib/site/forms";

const cell = (v: unknown) => {
  const s =
    v === undefined || v === null
      ? ""
      : typeof v === "boolean"
        ? v
          ? "Ya"
          : "Tidak"
        : String(v);
  // Cegah formula injection di Excel.
  const safe = /^[=+\-@]/.test(s) ? `'${s}` : s;
  return `"${safe.replace(/"/g, '""')}"`;
};

export async function GET(req: NextRequest) {
  if (!(await requireAdmin()))
    return NextResponse.json(
      { error: "Anda tidak punya akses untuk tindakan ini." },
      { status: 403 },
    );
  const type = req.nextUrl.searchParams.get("type") ?? "";
  const def = findForm(type);
  if (!def)
    return NextResponse.json(
      { error: "Jenis formulir tidak dikenal" },
      { status: 400 },
    );
  const rows = await listSubmissions({ type, limit: 10000 });
  const head = [
    "Waktu",
    "Status",
    ...def.fields.map((f) => f.label),
    "Rujukan",
    "Catatan/jawaban",
    "Tampil di website",
  ];
  const lines = rows.map((r) =>
    [
      new Date(r.createdAt).toLocaleString("id-ID"),
      r.status,
      ...def.fields.map((f) => r.data[f.name]),
      r.refId ?? "",
      r.note,
      r.published,
    ]
      .map(cell)
      .join(","),
  );
  const csv = "﻿" + [head.map(cell).join(","), ...lines].join("\r\n");
  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="formulir-${type}-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}
