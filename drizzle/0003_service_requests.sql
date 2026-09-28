-- 0003 — layanan mahasiswa dari website prodi (/prodi/layanan)
CREATE TABLE IF NOT EXISTS "serviceRequests" (
  "id" text PRIMARY KEY NOT NULL,
  "code" text NOT NULL,
  "type" text NOT NULL,
  "name" text NOT NULL,
  "nim" text NOT NULL,
  "email" text NOT NULL,
  "phone" text DEFAULT '' NOT NULL,
  "purpose" text DEFAULT '' NOT NULL,
  "details" text DEFAULT '' NOT NULL,
  "attachmentUrl" text,
  "status" text DEFAULT 'diajukan' NOT NULL,
  "adminNote" text DEFAULT '' NOT NULL,
  "resultUrl" text,
  "handledBy" text,
  "history" jsonb DEFAULT '[]'::jsonb NOT NULL,
  "createdAt" text NOT NULL,
  "updatedAt" text NOT NULL,
  CONSTRAINT "serviceRequests_code_unique" UNIQUE("code")
);
