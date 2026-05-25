/**
 *   GET  /api/branding
 *   PUT  /api/branding   (admin only)
 *
 * Branding config = signature/footer line, default hashtag block, org name,
 * tagline. Used by AI caption generator + dashboard footer + meta tags.
 */
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import {
  findMemberByEmail,
  getBrandingConfig,
  setBrandingConfig,
} from "@/lib/data/provider";
import { defaultBrandingConfig, type BrandingConfig } from "@/lib/data/types";

export async function GET() {
  const cfg = await getBrandingConfig();
  return NextResponse.json({ branding: cfg });
}

export async function PUT(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const me = await findMemberByEmail(session.user.email);
  if (!me || me.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const body = (await req.json().catch(() => ({}))) as Partial<BrandingConfig>;
  const current = await getBrandingConfig();
  const next: BrandingConfig = {
    signature: typeof body.signature === "string" && body.signature.trim()
      ? body.signature
      : current.signature || defaultBrandingConfig.signature,
    defaultHashtags:
      typeof body.defaultHashtags === "string"
        ? body.defaultHashtags
        : current.defaultHashtags,
    orgName:
      typeof body.orgName === "string" && body.orgName.trim()
        ? body.orgName
        : current.orgName,
    tagline: typeof body.tagline === "string" ? body.tagline : current.tagline,
    watermarkUrl:
      typeof body.watermarkUrl === "string"
        ? body.watermarkUrl
        : current.watermarkUrl ?? "",
    watermarkEnabled:
      typeof body.watermarkEnabled === "boolean"
        ? body.watermarkEnabled
        : current.watermarkEnabled ?? false,
    watermarkPosition:
      body.watermarkPosition === "br" ||
      body.watermarkPosition === "bl" ||
      body.watermarkPosition === "tr" ||
      body.watermarkPosition === "tl"
        ? body.watermarkPosition
        : current.watermarkPosition ?? "br",
  };
  const saved = await setBrandingConfig(next);
  return NextResponse.json({ branding: saved });
}
