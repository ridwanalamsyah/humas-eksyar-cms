import type { Event } from "@/lib/data/types";

/**
 * Seed events is intentionally empty. The CMS starts on a blank slate so the
 * tim can populate their own agenda through the calendar UI.
 */
export const events: Event[] = [];

export const findEvent = (id: string) => events.find((e) => e.id === id) ?? null;
