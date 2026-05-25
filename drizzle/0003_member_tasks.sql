-- 0003 — personal task list (Tier 3 #11)
CREATE TABLE IF NOT EXISTS "memberTasks" (
  "id" text PRIMARY KEY NOT NULL,
  "memberId" text NOT NULL,
  "title" text NOT NULL,
  "description" text DEFAULT '' NOT NULL,
  "contentId" text,
  "eventId" text,
  "holidayId" text,
  "dueDate" text,
  "status" text DEFAULT 'pending' NOT NULL,
  "createdAt" text NOT NULL,
  "completedAt" text
);

DO $$ BEGIN
  ALTER TABLE "memberTasks"
    ADD CONSTRAINT "memberTasks_memberId_members_id_fk"
    FOREIGN KEY ("memberId") REFERENCES "members"("id") ON DELETE cascade;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE INDEX IF NOT EXISTS "memberTasks_memberId_idx" ON "memberTasks" ("memberId");
CREATE INDEX IF NOT EXISTS "memberTasks_dueDate_idx" ON "memberTasks" ("dueDate");
