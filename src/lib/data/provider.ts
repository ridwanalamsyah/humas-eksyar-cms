/**
 * Data provider dispatcher.
 *
 * - When `DATABASE_URL` is set, all reads/writes route to the Neon-backed
 *   provider in `./db-provider.ts`.
 * - Otherwise, the static fixtures provider in `./mock-provider.ts` is used
 *   so previews and local dev work without external services.
 *
 * Function signatures across both providers MUST stay in sync. New methods
 * added to one must be added to the other.
 */

import { isDbEnabled } from "@/lib/db";
import * as mock from "./mock-provider";
import * as dbq from "./db-provider";
import { HASHTAG_BLOCK } from "@/lib/fixtures/contents";

const impl = isDbEnabled ? dbq : mock;

export const listDivisions = impl.listDivisions;
export const getDivision = impl.getDivision;

export const listMembers = impl.listMembers;
export const getMember = impl.getMember;
export const getCurrentMember = impl.getCurrentMember;

export const listContents = impl.listContents;
export const getContent = impl.getContent;

export const listMedia = impl.listMedia;
export const getMedia = impl.getMedia;

export const listEvents = impl.listEvents;
export const getEvent = impl.getEvent;

export const listBadges = impl.listBadges;
export const getBadge = impl.getBadge;
export const listQuests = impl.listQuests;

export const listNotifications = impl.listNotifications;
export const getWeeklyDigest = impl.getWeeklyDigest;
export const listXPLogs = impl.listXPLogs;

export const listCaptionTemplates = impl.listCaptionTemplates;
export const listLeaderboard = impl.listLeaderboard;
export const listDivisionLeaderboard = impl.listDivisionLeaderboard;

export const listCaptionVersions = impl.listCaptionVersions;
export const createCaptionVersion = impl.createCaptionVersion;
export const restoreCaptionVersion = impl.restoreCaptionVersion;

export { HASHTAG_BLOCK };
