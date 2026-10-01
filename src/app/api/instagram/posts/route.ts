/** GET /api/instagram/posts — postingan terbaru akun IG + status sudah/belum jadi artikel. */
import { NextResponse } from "next/server";
import {
  InstagramNotConfiguredError,
  listInstagramPosts,
} from "@/lib/instagram/graph";
import { getImported } from "@/lib/instagram/import";
import { requireEditor } from "@/lib/instagram/auth";

export async function GET() {
  if (!(await requireEditor()))
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  try {
    const [posts, imported] = await Promise.all([
      listInstagramPosts(24),
      getImported(),
    ]);
    return NextResponse.json({
      configured: true,
      posts: posts.map((p) => ({
        ...p,
        imported: imported[p.shortcode] ?? null,
      })),
    });
  } catch (err) {
    const configured = !(err instanceof InstagramNotConfiguredError);
    return NextResponse.json(
      {
        configured,
        error: err instanceof Error ? err.message : "Gagal memuat",
      },
      { status: configured ? 502 : 200 },
    );
  }
}
