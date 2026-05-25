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

// Mutations
export const createContent = impl.createContent;
export const updateContent = impl.updateContent;
export const deleteContent = impl.deleteContent;

export const createMember = impl.createMember;
export const updateMember = impl.updateMember;
export const deleteMember = impl.deleteMember;
export const findMemberByEmail = impl.findMemberByEmail;

export const listHolidays = impl.listHolidays;

export const getBioConfig = impl.getBioConfig;
export const setBioConfig = impl.setBioConfig;

export const getBrandingConfig = impl.getBrandingConfig;
export const setBrandingConfig = impl.setBrandingConfig;

export const listRubrics = impl.listRubrics;
export const getRubric = impl.getRubric;
export const createRubric = impl.createRubric;
export const updateRubric = impl.updateRubric;
export const deleteRubric = impl.deleteRubric;

export const listContentComments = impl.listContentComments;
export const createContentComment = impl.createContentComment;
export const updateContentComment = impl.updateContentComment;
export const deleteContentComment = impl.deleteContentComment;

export const getContentDraft = impl.getContentDraft;
export const saveContentDraft = impl.saveContentDraft;
export const clearContentDraft = impl.clearContentDraft;

export { HASHTAG_BLOCK };
