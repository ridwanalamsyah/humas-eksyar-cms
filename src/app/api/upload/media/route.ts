/**
 * POST /api/upload/media
 *
 * Uploads a file (image/video) to Vercel Blob and creates a MediaAsset row.
 * Body: multipart with `file`, optional `alt`, optional `tags` (comma-separated).
 * The client should apply any watermark BEFORE uploading (browser Canvas).
 *
 * GET /api/upload/media — list current member's recent uploads (lightweight).
 */
import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { auth } from "@/auth";
import {
  findMemberByEmail,
  createMedia,
  listMedia,
} from "@/lib/data/provider";

const MAX_BYTES = 25 * 1024 * 1024; // 25MB — supports short clips
const ALLOWED = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "video/mp4",
  "video/webm",
]);

export const runtime = "nodejs";

export async function GET() {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const media = await listMedia();
  return NextResponse.json({ media });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const me = await findMemberByEmail(session.user.email);
  if (!me) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  if (me.role === "monitoring") {
    return NextResponse.json(
      { error: "Role monitoring tidak boleh upload media." },
      { status: 403 },
    );
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
  const type = file.type || "application/octet-stream";
  if (!ALLOWED.has(type)) {
    return NextResponse.json(
      { error: "Format tidak didukung. JPG/PNG/WEBP/GIF/MP4/WebM only." },
      { status: 400 },
    );
  }

  const width = Number(form.get("width") ?? 0);
  const height = Number(form.get("height") ?? 0);
  const alt = String(form.get("alt") ?? "");
  const tagsField = String(form.get("tags") ?? "");
  const tags = tagsField
    .split(",")
    .map((t) => t.trim().toLowerCase())
    .filter((t) => t.length > 0);

  const ext =
    type === "image/jpeg"
      ? "jpg"
      : type.split("/")[1] ?? "bin";
  const stamp = Date.now().toString(36);
  const pathname = `media/${me.id}-${stamp}.${ext}`;

  const blob = await put(pathname, file, {
    access: "public",
    addRandomSuffix: true,
    contentType: type,
  });

  const mediaType: "image" | "video" =
    type.startsWith("video/") ? "video" : "image";

  const asset = await createMedia({
    url: blob.url,
    width: width || 1080,
    height: height || 1080,
    type: mediaType,
    alt,
    tags,
    uploaderId: me.id,
  });

  return NextResponse.json({ media: asset, blob });
}
