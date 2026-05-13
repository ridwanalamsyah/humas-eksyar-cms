CREATE TABLE "accounts" (
	"userId" text NOT NULL,
	"type" text NOT NULL,
	"provider" text NOT NULL,
	"providerAccountId" text NOT NULL,
	"refresh_token" text,
	"access_token" text,
	"expires_at" integer,
	"token_type" text,
	"scope" text,
	"id_token" text,
	"session_state" text,
	CONSTRAINT "accounts_provider_providerAccountId_pk" PRIMARY KEY("provider","providerAccountId")
);
--> statement-breakpoint
CREATE TABLE "badges" (
	"id" text PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"name" text NOT NULL,
	"description" text DEFAULT '' NOT NULL,
	"tier" text NOT NULL,
	"icon" text NOT NULL,
	"xpReward" integer DEFAULT 0 NOT NULL,
	"unlockedCount" integer DEFAULT 0 NOT NULL,
	"totalMembers" integer DEFAULT 0 NOT NULL,
	CONSTRAINT "badges_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "captionTemplates" (
	"id" text PRIMARY KEY NOT NULL,
	"rubric" text NOT NULL,
	"style" text NOT NULL,
	"example" text NOT NULL,
	"hashtags" text DEFAULT '' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "contents" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"slug" text NOT NULL,
	"rubric" text NOT NULL,
	"status" text DEFAULT 'draft' NOT NULL,
	"divisionId" text NOT NULL,
	"authorId" text NOT NULL,
	"body" text DEFAULT '' NOT NULL,
	"caption" text DEFAULT '' NOT NULL,
	"hashtags" text DEFAULT '' NOT NULL,
	"channels" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"mediaIds" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"scheduledFor" text,
	"publishedAt" text,
	"approvers" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"waitingOn" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"metrics" jsonb,
	"captionStyle" text,
	"createdAt" text NOT NULL,
	"updatedAt" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "divisions" (
	"id" text PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"name" text NOT NULL,
	"shortName" text NOT NULL,
	"description" text DEFAULT '' NOT NULL,
	"color" text NOT NULL,
	"hue" integer NOT NULL,
	"leadId" text,
	"memberCount" integer DEFAULT 0 NOT NULL,
	CONSTRAINT "divisions_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "events" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"slug" text NOT NULL,
	"description" text DEFAULT '' NOT NULL,
	"divisionId" text NOT NULL,
	"location" text NOT NULL,
	"isOnline" boolean DEFAULT false NOT NULL,
	"startsAt" text NOT NULL,
	"endsAt" text NOT NULL,
	"category" text NOT NULL,
	"capacity" integer,
	"rsvpIds" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"checkedInIds" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"coverMediaId" text,
	"coordinatorId" text NOT NULL,
	"contentIds" jsonb DEFAULT '[]'::jsonb NOT NULL
);
--> statement-breakpoint
CREATE TABLE "media" (
	"id" text PRIMARY KEY NOT NULL,
	"url" text NOT NULL,
	"width" integer NOT NULL,
	"height" integer NOT NULL,
	"type" text DEFAULT 'image' NOT NULL,
	"alt" text DEFAULT '' NOT NULL,
	"tags" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"usedIn" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"uploaderId" text NOT NULL,
	"uploadedAt" text NOT NULL,
	"aspect" text NOT NULL,
	"averageColor" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "members" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text,
	"name" text NOT NULL,
	"initials" text NOT NULL,
	"email" text NOT NULL,
	"role" text DEFAULT 'anggota' NOT NULL,
	"divisionId" text NOT NULL,
	"position" text DEFAULT 'Anggota' NOT NULL,
	"joinedAt" text NOT NULL,
	"bio" text,
	"xp" integer DEFAULT 0 NOT NULL,
	"streak" integer DEFAULT 0 NOT NULL,
	"badges" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"angkatan" integer NOT NULL,
	"nimSuffix" text NOT NULL,
	"avatarEmoji" text DEFAULT '👤' NOT NULL,
	"accentHue" integer DEFAULT 180 NOT NULL,
	CONSTRAINT "members_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "notifications" (
	"id" text PRIMARY KEY NOT NULL,
	"memberId" text NOT NULL,
	"title" text NOT NULL,
	"body" text DEFAULT '' NOT NULL,
	"kind" text NOT NULL,
	"href" text,
	"read" boolean DEFAULT false NOT NULL,
	"at" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "quests" (
	"id" text PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"title" text NOT NULL,
	"description" text DEFAULT '' NOT NULL,
	"xpReward" integer DEFAULT 0 NOT NULL,
	"difficulty" text DEFAULT 'easy' NOT NULL,
	"duration" text DEFAULT 'weekly' NOT NULL,
	"progress" real DEFAULT 0 NOT NULL,
	"target" integer DEFAULT 1 NOT NULL,
	"current" integer DEFAULT 0 NOT NULL,
	"deadline" text,
	"completed" boolean DEFAULT false NOT NULL,
	CONSTRAINT "quests_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"sessionToken" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"expires" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text,
	"email" text,
	"emailVerified" timestamp,
	"image" text,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "verificationTokens" (
	"identifier" text NOT NULL,
	"token" text NOT NULL,
	"expires" timestamp NOT NULL,
	CONSTRAINT "verificationTokens_identifier_token_pk" PRIMARY KEY("identifier","token")
);
--> statement-breakpoint
CREATE TABLE "weeklyDigests" (
	"id" text PRIMARY KEY NOT NULL,
	"isoWeek" text NOT NULL,
	"generatedAt" text NOT NULL,
	"highlights" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"recommendations" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"totalReach" integer DEFAULT 0 NOT NULL,
	"topContentId" text,
	CONSTRAINT "weeklyDigests_isoWeek_unique" UNIQUE("isoWeek")
);
--> statement-breakpoint
CREATE TABLE "xpLogs" (
	"id" text PRIMARY KEY NOT NULL,
	"memberId" text NOT NULL,
	"amount" integer NOT NULL,
	"reason" text NOT NULL,
	"source" text NOT NULL,
	"refId" text,
	"at" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "contents" ADD CONSTRAINT "contents_divisionId_divisions_id_fk" FOREIGN KEY ("divisionId") REFERENCES "public"."divisions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "contents" ADD CONSTRAINT "contents_authorId_members_id_fk" FOREIGN KEY ("authorId") REFERENCES "public"."members"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "members" ADD CONSTRAINT "members_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "members" ADD CONSTRAINT "members_divisionId_divisions_id_fk" FOREIGN KEY ("divisionId") REFERENCES "public"."divisions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_memberId_members_id_fk" FOREIGN KEY ("memberId") REFERENCES "public"."members"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "xpLogs" ADD CONSTRAINT "xpLogs_memberId_members_id_fk" FOREIGN KEY ("memberId") REFERENCES "public"."members"("id") ON DELETE cascade ON UPDATE no action;