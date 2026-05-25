CREATE TABLE IF NOT EXISTS "captionVersions" (
	"id" text PRIMARY KEY NOT NULL,
	"contentId" text NOT NULL,
	"caption" text NOT NULL,
	"hashtags" text DEFAULT '' NOT NULL,
	"captionStyle" text,
	"source" text DEFAULT 'manual' NOT NULL,
	"note" text DEFAULT '' NOT NULL,
	"authorId" text,
	"createdAt" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "holidays" (
	"id" text PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"name" text NOT NULL,
	"date" text NOT NULL,
	"kind" text NOT NULL,
	"description" text DEFAULT '' NOT NULL,
	"hijriahLabel" text,
	"emoji" text,
	CONSTRAINT "holidays_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "rubrics" (
	"id" text PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"label" text NOT NULL,
	"description" text DEFAULT '' NOT NULL,
	"emoji" text,
	"isActive" boolean DEFAULT true NOT NULL,
	"sortOrder" integer DEFAULT 0 NOT NULL,
	"createdAt" text NOT NULL,
	"updatedAt" text NOT NULL,
	CONSTRAINT "rubrics_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "siteSettings" (
	"key" text PRIMARY KEY NOT NULL,
	"value" jsonb NOT NULL,
	"updatedAt" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "members" ADD COLUMN IF NOT EXISTS "avatarUrl" text;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "captionVersions" ADD CONSTRAINT "captionVersions_contentId_contents_id_fk" FOREIGN KEY ("contentId") REFERENCES "public"."contents"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "captionVersions" ADD CONSTRAINT "captionVersions_authorId_members_id_fk" FOREIGN KEY ("authorId") REFERENCES "public"."members"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
