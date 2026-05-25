-- 0002 — content discussion threads + autosave drafts (Tier 2)
CREATE TABLE IF NOT EXISTS "contentComments" (
  "id" text PRIMARY KEY NOT NULL,
  "contentId" text NOT NULL,
  "authorId" text NOT NULL,
  "body" text NOT NULL,
  "resolvedAt" text,
  "createdAt" text NOT NULL
);

CREATE TABLE IF NOT EXISTS "contentDrafts" (
  "contentId" text PRIMARY KEY NOT NULL,
  "body" text DEFAULT '' NOT NULL,
  "caption" text DEFAULT '' NOT NULL,
  "hashtags" text DEFAULT '' NOT NULL,
  "authorId" text,
  "savedAt" text NOT NULL
);

DO $$ BEGIN
  ALTER TABLE "contentComments"
    ADD CONSTRAINT "contentComments_contentId_contents_id_fk"
    FOREIGN KEY ("contentId") REFERENCES "contents"("id") ON DELETE cascade;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE "contentComments"
    ADD CONSTRAINT "contentComments_authorId_members_id_fk"
    FOREIGN KEY ("authorId") REFERENCES "members"("id") ON DELETE cascade;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE "contentDrafts"
    ADD CONSTRAINT "contentDrafts_contentId_contents_id_fk"
    FOREIGN KEY ("contentId") REFERENCES "contents"("id") ON DELETE cascade;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE "contentDrafts"
    ADD CONSTRAINT "contentDrafts_authorId_members_id_fk"
    FOREIGN KEY ("authorId") REFERENCES "members"("id") ON DELETE set null;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
