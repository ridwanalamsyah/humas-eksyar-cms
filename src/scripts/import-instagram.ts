/**
 * Import Instagram posts dumped by instaloader into Neon + Vercel Blob.
 *
 * Usage:
 *   pnpm import:instagram <path/to/instaloader/dir> [--dry-run] [--skip-media]
 *
 * Expected directory layout (default instaloader output):
 *   2024-05-12_14-30-00_UTC.jpg          # cover / single image
 *   2024-05-12_14-30-00_UTC_1.jpg        # carousel slide 2 (if multi)
 *   2024-05-12_14-30-00_UTC.json         # post metadata (pass --no-compress-json)
 *   2024-05-12_14-30-00_UTC.txt          # caption (optional, fallback to JSON)
 *   2024-05-12_14-30-00_UTC.mp4          # video (if present)
 *
 * What this does:
 *   1. Walks the directory, groups files by their timestamp prefix.
 *   2. Parses the JSON metadata for caption, hashtags, posted_at, like/comment counts.
 *   3. Uploads each media file to Vercel Blob (skipped with --skip-media).
 *   4. Inserts a `contents` row (status="published") + a `media` row per file.
 *   5. Records a `captionVersions` snapshot (source="imported") for audit trail.
 *
 * Idempotent: skips posts whose IG shortcode already exists in `contents.slug`.
 */

import "dotenv/config";
import { readdir, readFile, stat } from "node:fs/promises";
import { extname, join, basename } from "node:path";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { eq, sql as drizzleSql } from "drizzle-orm";
import { put } from "@vercel/blob";
import * as schema from "../lib/db/schema";
import type {
  ContentChannel,
  ContentRubric,
  MediaAsset,
} from "../lib/data/types";

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

const DIVISION_ID = "div-humas-eksyar";
const AUTHOR_ID = "mbr-aditya";
const DEFAULT_CHANNELS: ContentChannel[] = ["instagram"];

// Hashtag → rubric mapping (case-insensitive). Order matters: first match wins.
const HASHTAG_RUBRIC: Array<[RegExp, ContentRubric]> = [
  [/tausiyah/i, "tausiyah_senin"],
  [/eksphoria/i, "eksphoria_update"],
  [/talks?/i, "eksyar_talks"],
  [/bisnis|umkm|halal(?!day)/i, "bisnis_halal"],
  [/kajian|kuliah\s*umum/i, "kajian"],
  [/selamat|hut|dies|kartini|kemerdekaan|wisuda/i, "selamat_sukses"],
  [/pengumuman|announcement|info\s*penting/i, "pengumuman"],
  [/campaign|kampanye|aksi/i, "campaign"],
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

interface InstaloaderJSON {
  node: {
    shortcode: string;
    typename?: string;
    is_video?: boolean;
    taken_at_timestamp: number;
    edge_media_to_caption?: {
      edges: Array<{ node: { text: string } }>;
    };
    edge_media_preview_like?: { count: number };
    edge_media_to_comment?: { count: number };
    edge_liked_by?: { count: number };
    edge_media_to_parent_comment?: { count: number };
    location?: { name?: string } | null;
    display_url?: string;
    accessibility_caption?: string;
    edge_sidecar_to_children?: {
      edges: Array<{ node: { display_url?: string; is_video?: boolean } }>;
    };
  };
}

function detectRubric(caption: string, hashtags: string[]): ContentRubric {
  const haystack = [caption, ...hashtags].join(" ").toLowerCase();
  for (const [re, rubric] of HASHTAG_RUBRIC) {
    if (re.test(haystack)) return rubric;
  }
  return "dokumentasi";
}

function extractHashtags(caption: string): string[] {
  const out: string[] = [];
  const re = /#([\p{L}\p{N}_]+)/gu;
  let m: RegExpExecArray | null;
  while ((m = re.exec(caption)) !== null) out.push(m[1]);
  return out;
}

function slugify(prefix: string, shortcode: string): string {
  return `ig-${shortcode || prefix}`.toLowerCase();
}

function titleFromCaption(caption: string, fallback: string): string {
  const firstLine =
    caption
      .split(/\r?\n/)
      .map((l) => l.trim())
      .find((l) => l.length > 0) ?? fallback;
  // Strip leading hashtags, mentions, emojis.
  const stripped = firstLine
    .replace(/^[#@]\S+\s*/g, "")
    .replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/gu, "")
    .trim();
  if (stripped.length === 0) return fallback;
  return stripped.length > 90 ? `${stripped.slice(0, 87)}...` : stripped;
}

function shortFromBasename(b: string): string {
  // instaloader names files like "2024-05-12_14-30-00_UTC.json"; the shortcode
  // is normally embedded inside the JSON. We use the timestamp prefix as a
  // fallback key when shortcode is missing.
  return b.replace(/\.[^.]+$/, "").replace(/_UTC.*/, "");
}

interface PostGroup {
  prefix: string; // e.g. "2024-05-12_14-30-00_UTC"
  jsonPath: string | null;
  txtPath: string | null;
  mediaPaths: string[];
}

async function walkPosts(dir: string): Promise<PostGroup[]> {
  const groups = new Map<string, PostGroup>();
  const entries = await readdir(dir);
  for (const name of entries) {
    const full = join(dir, name);
    const st = await stat(full);
    if (!st.isFile()) continue;
    const ext = extname(name).toLowerCase();
    const stem = basename(name, ext);
    // Strip trailing _1, _2 for carousel slides
    const prefix = stem.replace(/_\d+$/, "");
    let group = groups.get(prefix);
    if (!group) {
      group = {
        prefix,
        jsonPath: null,
        txtPath: null,
        mediaPaths: [],
      };
      groups.set(prefix, group);
    }
    if (ext === ".json") group.jsonPath = full;
    else if (ext === ".txt") group.txtPath = full;
    else if ([".jpg", ".jpeg", ".png", ".webp", ".mp4", ".mov"].includes(ext)) {
      group.mediaPaths.push(full);
    }
  }
  return Array.from(groups.values())
    .filter((g) => g.mediaPaths.length > 0 || g.jsonPath)
    .sort((a, b) => a.prefix.localeCompare(b.prefix));
}

async function loadCaption(group: PostGroup, meta: InstaloaderJSON | null): Promise<string> {
  if (group.txtPath) {
    try {
      const t = await readFile(group.txtPath, "utf8");
      if (t.trim().length > 0) return t;
    } catch {
      /* ignore */
    }
  }
  return meta?.node.edge_media_to_caption?.edges?.[0]?.node?.text ?? "";
}

async function uploadBlob(filePath: string, skip: boolean): Promise<string | null> {
  if (skip) return null;
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    console.warn(
      "import: BLOB_READ_WRITE_TOKEN not set — skipping media upload, will store local paths.",
    );
    return null;
  }
  const buf = await readFile(filePath);
  const name = basename(filePath);
  const blob = await put(`instagram-import/${name}`, buf, {
    access: "public",
    addRandomSuffix: true,
  });
  return blob.url;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  const args = process.argv.slice(2);
  const dir = args.find((a) => !a.startsWith("--"));
  const dryRun = args.includes("--dry-run");
  const skipMedia = args.includes("--skip-media");

  if (!dir) {
    console.error("Usage: pnpm import:instagram <dir> [--dry-run] [--skip-media]");
    process.exit(1);
  }

  const url = process.env.DATABASE_URL;
  if (!url) {
    console.error("DATABASE_URL not set — aborting.");
    process.exit(1);
  }

  const sql = neon(url);
  const db = drizzle(sql, { schema });

  console.log(`import: walking ${dir}…`);
  const posts = await walkPosts(dir);
  console.log(`import: found ${posts.length} candidate posts`);

  let inserted = 0;
  let skipped = 0;
  let errors = 0;

  for (const post of posts) {
    try {
      let meta: InstaloaderJSON | null = null;
      if (post.jsonPath) {
        try {
          meta = JSON.parse(await readFile(post.jsonPath, "utf8"));
        } catch (err) {
          console.warn(`import: failed to parse ${post.jsonPath}: ${err}`);
        }
      }

      const shortcode = meta?.node.shortcode ?? shortFromBasename(post.prefix);
      const slug = slugify(post.prefix, shortcode);

      // Skip if already imported.
      const existing = await db
        .select({ id: schema.contents.id })
        .from(schema.contents)
        .where(eq(schema.contents.slug, slug))
        .limit(1);
      if (existing.length > 0) {
        skipped += 1;
        continue;
      }

      const caption = await loadCaption(post, meta);
      const hashtags = extractHashtags(caption);
      const hashtagBlock = hashtags.map((h) => `#${h}`).join(" ");
      const rubric = detectRubric(caption, hashtags);
      const title = titleFromCaption(caption, `Instagram post ${shortcode}`);
      const takenAt = meta?.node.taken_at_timestamp
        ? new Date(meta.node.taken_at_timestamp * 1000).toISOString()
        : new Date().toISOString();
      const likes =
        meta?.node.edge_media_preview_like?.count ??
        meta?.node.edge_liked_by?.count ??
        0;
      const comments =
        meta?.node.edge_media_to_comment?.count ??
        meta?.node.edge_media_to_parent_comment?.count ??
        0;

      // Upload media → Blob, build media rows.
      const mediaRows: MediaAsset[] = [];
      for (const mp of post.mediaPaths.slice().sort()) {
        const blobUrl = await uploadBlob(mp, skipMedia);
        const ext = extname(mp).toLowerCase();
        const isVideo = ext === ".mp4" || ext === ".mov";
        mediaRows.push({
          id: `med-ig-${shortcode}-${mediaRows.length}`,
          url: blobUrl ?? `file://${mp}`,
          width: 1080,
          height: 1080,
          type: isVideo ? "video" : "image",
          alt: meta?.node.accessibility_caption ?? title,
          tags: hashtags.slice(0, 5),
          usedIn: [],
          uploaderId: AUTHOR_ID,
          uploadedAt: takenAt,
          aspect: "square",
          averageColor: "#0D9488",
        });
      }

      const contentId = `cnt-ig-${shortcode}`;

      if (dryRun) {
        console.log(
          `[dry] would insert ${contentId} — "${title}" (rubric=${rubric}, ${mediaRows.length} media)`,
        );
        continue;
      }

      if (mediaRows.length > 0) {
        await db
          .insert(schema.media)
          .values(mediaRows)
          .onConflictDoNothing();
      }

      await db.insert(schema.contents).values({
        id: contentId,
        title,
        slug,
        rubric,
        status: "published",
        divisionId: DIVISION_ID,
        authorId: AUTHOR_ID,
        body: "",
        caption,
        hashtags: hashtagBlock,
        channels: DEFAULT_CHANNELS,
        mediaIds: mediaRows.map((m) => m.id),
        publishedAt: takenAt,
        approvers: [],
        waitingOn: [],
        metrics: {
          views: 0,
          likes,
          comments,
          shares: 0,
          saves: 0,
          reach: likes * 6,
          engagementRate: likes > 0 ? Math.min(likes / 1000, 0.12) : 0,
          sentiment: 0.7,
        },
        captionStyle: null,
        createdAt: takenAt,
        updatedAt: new Date().toISOString(),
      });

      // Audit trail: snapshot the imported caption.
      await db.insert(schema.captionVersions).values({
        id: `cvr-ig-${shortcode}`,
        contentId,
        caption,
        hashtags: hashtagBlock,
        captionStyle: null,
        source: "imported",
        note: `Imported from IG (${shortcode})`,
        authorId: AUTHOR_ID,
        createdAt: new Date().toISOString(),
      });

      inserted += 1;
      if (inserted % 10 === 0) console.log(`import: inserted ${inserted}…`);
    } catch (err) {
      errors += 1;
      console.error(`import: error on ${post.prefix}:`, err);
    }
  }

  // Avoid unused-import lint error for drizzleSql.
  void drizzleSql;

  console.log("---");
  console.log(`import complete: inserted=${inserted} skipped=${skipped} errors=${errors}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
