/**
 * POST /api/upload/avatar
 *
 * Uploads the multipart `file` field to Vercel Blob and returns a public URL.
 * Caller stores that URL on the member via PATCH /api/members/:id.
 *
 * Requires `BLOB_READ_WRITE_TOKEN` env var (Vercel Blob integration). Returns
 * a structured error when missing so the UI can tell the user to set it up.
 */
import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { auth } from "@/auth";
import { findMemberByEmail } from "@/lib/data/provider";

const MAX_BYTES = 5 * 1024 * 1024; // 5MB
const ALLOWED = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const me = await findMemberByEmail(session.user.email);
  if (!me) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json(
      {
        error:
          "Vercel Blob belum di-setup. Tambahin BLOB_READ_WRITE_TOKEN di env (Vercel project → Storage → Connect Blob).",
      },
      { status: 503 },
    );
  }

  const form = await req.formData();
  const file = form.get("file");
  if (!(file instanceof Blob)) {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json(
      { error: `Ukuran maksimal ${Math.round(MAX_BYTES / 1024 / 1024)}MB.` },
      { status: 413 },
    );
  }
  const type = file.type || "image/jpeg";
  if (!ALLOWED.has(type)) {
    return NextResponse.json(
      { error: "Format harus JPG, PNG, WEBP, atau GIF." },
      { status: 400 },
    );
  }
  const ext = type.split("/")[1] ?? "jpg";
  const stamp = Date.now().toString(36);
  const pathname = `avatars/${me.id}-${stamp}.${ext}`;

  const blob = await put(pathname, file, {
    access: "public",
    addRandomSuffix: true,
    contentType: type,
  });

  return NextResponse.json({ url: blob.url, pathname: blob.pathname });
}
