import type { MediaAsset } from "@/lib/data/types";

/**
 * Seed media is intentionally empty. The CMS starts on a blank slate so the
 * tim can upload their own assets via the media library once Vercel Blob
 * upload UI is added.
 */
export const media: MediaAsset[] = [];

export const findMedia = (id: string) => media.find((m) => m.id === id) ?? null;
