/**
 * GET /api/holidays
 *
 * Query parameters:
 *   - from      ISO date (yyyy-mm-dd). Default: today.
 *   - to        ISO date. Optional upper bound.
 *   - kind      Comma-separated list of {nasional,hijriah,internasional,cuti_bersama}.
 *   - upcoming  If "true", only return future-dated entries (overrides `from`).
 *
 * Publicly readable — used by `/calendar`, the dashboard hero, and the
 * `eksyar.bio` public page.
 */

import { NextRequest, NextResponse } from "next/server";
import { listHolidays } from "@/lib/data/provider";
import type { Holiday } from "@/lib/fixtures/holidays";

const VALID_KINDS: Holiday["kind"][] = [
  "nasional",
  "hijriah",
  "internasional",
  "cuti_bersama",
];

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const fromParam = url.searchParams.get("from");
  const toParam = url.searchParams.get("to");
  const kindParam = url.searchParams.get("kind");
  const upcoming = url.searchParams.get("upcoming") === "true";

  let from: Date | undefined;
  if (upcoming) from = new Date();
  else if (fromParam) from = new Date(fromParam);

  const to = toParam ? new Date(toParam) : undefined;

  let kind: Holiday["kind"][] | undefined;
  if (kindParam) {
    kind = kindParam
      .split(",")
      .map((s) => s.trim())
      .filter((k): k is Holiday["kind"] =>
        VALID_KINDS.includes(k as Holiday["kind"]),
      );
    if (kind.length === 0) kind = undefined;
  }

  const holidays = await listHolidays({ from, to, kind });
  return NextResponse.json({ holidays });
}
