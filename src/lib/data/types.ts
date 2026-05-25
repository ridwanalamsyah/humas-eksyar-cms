/**
 * Domain types for Humas Eksyar.
 *
 * Designed to map cleanly to Supabase tables (Phase 1+).
 * Every aggregate has stable string IDs (slug or uuid-like) so seed
 * data + future Postgres rows are interchangeable.
 */

export type ID = string;

export type ISODate = string; // YYYY-MM-DD
export type ISODateTime = string; // YYYY-MM-DDTHH:mm:ssZ

/**
 * Roles in the system:
 * - `monitoring`  : view-only oversight (dosen pembina). No submit/approve.
 * - `anggota`     : creator. Submit konten & ikut quest.
 * - `pengurus`    : senior member.
 * - `ketua_divisi`: koordinator divisi (reviewer tahap pertama).
 * - `sekjen`      : legacy stage (kept for backward compatibility — di
 *                   tim flat seperti Humas Eksyar boleh dikosongkan).
 * - `admin`       : full access (ubah pengaturan, manage roster).
 */
export type Role =
  | "monitoring"
  | "anggota"
  | "pengurus"
  | "ketua_divisi"
  | "sekjen"
  | "admin";

export type DivisionSlug = string;

export type ContentStatus =
  | "idea"
  | "draft"
  | "review_divisi"
  | "review_sekjen"
  | "scheduled"
  | "published"
  | "archived";

export type ContentChannel = "instagram" | "twitter" | "facebook" | "tiktok" | "linktree" | "internal";

export type ContentRubric =
  | "tausiyah_senin"
  | "eksyar_talks"
  | "bisnis_halal"
  | "eksphoria_update"
  | "selamat_sukses"
  | "kajian"
  | "pengumuman"
  | "dokumentasi"
  | "campaign";

export type CaptionStyle =
  | "formal_organisasi"
  | "gen_z_friendly"
  | "cinematic"
  | "profesional"
  | "persuasif"
  | "emotional_branding"
  | "campaign";

export interface Division {
  id: ID;
  slug: DivisionSlug;
  name: string;
  shortName: string;
  description: string;
  color: string; // hex
  /** SVG hue for chart segments */
  hue: number;
  leadId: ID;
  memberCount: number;
}

export interface Member {
  id: ID;
  name: string;
  initials: string;
  email: string;
  role: Role;
  divisionId: ID;
  /** Title in division, e.g. "Ketua", "Sekretaris", "Anggota" */
  position: string;
  joinedAt: ISODate;
  bio?: string;
  /** Total XP earned across all activities */
  xp: number;
  /** Current streak in days */
  streak: number;
  badges: ID[]; // BadgeId
  /** Year angkatan (e.g. 2022) */
  angkatan: number;
  /** NIM partial (last 4 digits only for privacy demo) */
  nimSuffix: string;
  /** Avatar emoji as placeholder until real photos */
  avatarEmoji: string;
  /** Soft "vibe" colors for personalization */
  accentHue: number;
  /** Uploaded profile photo URL (Vercel Blob). When set, supersedes emoji/initials. */
  avatarUrl?: string | null;
}

/**
 * Editorial rubric. Stored in DB so the team can add/rename/disable rubrics
 * via /settings/rubrics — no hardcoded program names.
 */
export interface Rubric {
  id: ID;
  slug: string;
  label: string;
  description: string;
  emoji: string | null;
  isActive: boolean;
  sortOrder: number;
  createdAt: ISODateTime;
  updatedAt: ISODateTime;
}

/**
 * Editable brand settings used by AI caption generator + content footer.
 * Lives in `siteSettings` table keyed by "branding".
 */
export interface BrandingConfig {
  /** Sign-off line appended to captions, e.g. "Atas nama Program Studi Ekonomi Syariah" */
  signature: string;
  /** Default hashtag block (space-separated, each starting with #) */
  defaultHashtags: string;
  /** Organization display name shown in dashboard footer and meta tags */
  orgName: string;
  /** Optional tagline */
  tagline: string;
}

export const defaultBrandingConfig: BrandingConfig = {
  signature: "Atas nama Program Studi Ekonomi Syariah",
  defaultHashtags: "#EkonomiSyariah #FEBIUINBandung #UINSunanGunungDjati",
  orgName: "Program Studi Ekonomi Syariah",
  tagline: "FEBI UIN Sunan Gunung Djati Bandung",
};

export interface ContentItem {
  id: ID;
  title: string;
  slug: string;
  rubric: ContentRubric;
  status: ContentStatus;
  divisionId: ID;
  authorId: ID;
  /** Markdown body */
  body: string;
  /** Caption that will be posted to channel */
  caption: string;
  /** Hashtag string concatenated with spaces */
  hashtags: string;
  channels: ContentChannel[];
  /** Media asset IDs */
  mediaIds: ID[];
  scheduledFor?: ISODateTime;
  publishedAt?: ISODateTime;
  /** Approval chain — list of member IDs that have approved */
  approvers: ID[];
  /** Member ID(s) the item is currently waiting on */
  waitingOn: ID[];
  /** Performance metrics, populated for status==published */
  metrics?: ContentMetrics;
  /** Caption style if AI-generated */
  captionStyle?: CaptionStyle;
  createdAt: ISODateTime;
  updatedAt: ISODateTime;
}

export interface ContentMetrics {
  views: number;
  likes: number;
  comments: number;
  shares: number;
  saves: number;
  reach: number;
  /** Engagement rate (0..1) */
  engagementRate: number;
  /** Sentiment score (-1..1) from comment analysis */
  sentiment: number;
}

export interface MediaAsset {
  id: ID;
  /** Source URL — for fixtures we use Unsplash with stable seeds */
  url: string;
  /** Width × height in px */
  width: number;
  height: number;
  type: "image" | "video" | "doc";
  /** Alt text */
  alt: string;
  /** Tags */
  tags: string[];
  /** Linked content item IDs */
  usedIn: ID[];
  uploaderId: ID;
  uploadedAt: ISODateTime;
  /** Aspect ratio bucket for grid layout */
  aspect: "square" | "portrait" | "landscape" | "wide";
  /** Average color hex (used for blur-up placeholder) */
  averageColor: string;
}

export interface Event {
  id: ID;
  title: string;
  slug: string;
  description: string;
  divisionId: ID;
  /** Event location (offline) or link (online) */
  location: string;
  isOnline: boolean;
  startsAt: ISODateTime;
  endsAt: ISODateTime;
  /** ICS-style category */
  category:
    | "kajian"
    | "rapat"
    | "kegiatan_publik"
    | "kompetisi"
    | "pelatihan"
    | "agenda_internal"
    | "perayaan";
  capacity?: number;
  /** Member IDs that have RSVP'd */
  rsvpIds: ID[];
  /** Member IDs that checked in */
  checkedInIds: ID[];
  coverMediaId?: ID;
  coordinatorId: ID;
  /** Linked content items (e.g. teaser, recap) */
  contentIds: ID[];
}

export interface Badge {
  id: ID;
  /** Slug e.g. "first-post", "100-day-streak" */
  slug: string;
  name: string;
  description: string;
  /** Tier — visual style + xp threshold */
  tier: "bronze" | "silver" | "gold" | "platinum" | "legendary";
  /** Icon component name from lucide */
  icon: string;
  /** XP awarded for unlocking */
  xpReward: number;
  /** Global unlock count */
  unlockedCount: number;
  /** Total members */
  totalMembers: number;
}

export interface Quest {
  id: ID;
  slug: string;
  title: string;
  description: string;
  /** XP reward */
  xpReward: number;
  /** Difficulty tier */
  difficulty: "easy" | "medium" | "hard";
  /** Quest length: weekly | event | seasonal */
  duration: "weekly" | "event" | "seasonal";
  /** Progress out of target (0..1) */
  progress: number;
  /** Numeric target (e.g. 5 posts) */
  target: number;
  /** Numeric current value */
  current: number;
  /** Completion deadline */
  deadline?: ISODate;
  /** Completed boolean — derived from progress >= 1 */
  completed?: boolean;
}

export interface XPLog {
  id: ID;
  memberId: ID;
  amount: number;
  reason: string;
  /** Source kind */
  source: "content" | "event" | "quest" | "badge" | "streak" | "approval" | "manual";
  /** Foreign key based on source */
  refId?: ID;
  at: ISODateTime;
}

export interface ApprovalRequest {
  id: ID;
  contentId: ID;
  /** Stage in chain */
  stage: "review_divisi" | "review_sekjen";
  requestedAt: ISODateTime;
  /** Member assigned to review */
  reviewerId: ID;
  /** Note from reviewer */
  note?: string;
  /** Decision */
  decision?: "approved" | "rejected" | "changes_requested";
  decidedAt?: ISODateTime;
}

export interface NotificationItem {
  id: ID;
  /** Member who receives this */
  memberId: ID;
  /** Title shown in dock */
  title: string;
  /** Detail body */
  body: string;
  /** Soft category — drives icon + accent color */
  kind: "approval" | "badge" | "mention" | "event" | "ai" | "system";
  href?: string;
  read: boolean;
  at: ISODateTime;
}

export interface CaptionTemplate {
  id: ID;
  rubric: ContentRubric;
  style: CaptionStyle;
  /** Example caption that demonstrates the tone */
  example: string;
  /** Hashtag block to append */
  hashtags: string;
}

/** Snapshot of a content's caption at a point in time. */
export type CaptionVersionSource = "manual" | "ai" | "imported" | "restore";

export interface CaptionVersion {
  id: ID;
  contentId: ID;
  caption: string;
  hashtags: string;
  captionStyle?: CaptionStyle | null;
  source: CaptionVersionSource;
  /** Optional note (e.g. "Polished by Aditya", "AI v1") */
  note: string;
  /** Member who created this snapshot (null if system) */
  authorId: ID | null;
  createdAt: ISODateTime;
}

/**
 * Internal feedback comment on a content draft (reviewer ↔ author thread).
 */
export interface ContentComment {
  id: ID;
  contentId: ID;
  authorId: ID;
  body: string;
  resolvedAt: ISODateTime | null;
  createdAt: ISODateTime;
}

/**
 * In-progress unsaved keystrokes for a content. One row per content. Updated
 * frequently while the editor is open, then deleted on hard save / publish.
 */
export interface ContentDraft {
  contentId: ID;
  body: string;
  caption: string;
  hashtags: string;
  authorId: ID | null;
  savedAt: ISODateTime;
}

/** Persisted weekly digest (AI summary) */
export interface WeeklyDigest {
  id: ID;
  isoWeek: string; // e.g. 2025-W19
  generatedAt: ISODateTime;
  highlights: string[];
  recommendations: string[];
  totalReach: number;
  topContentId?: ID;
}
