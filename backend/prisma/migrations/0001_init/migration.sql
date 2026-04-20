-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "public"."SourcePlatform" AS ENUM ('UNSTOP', 'DEVFOLIO', 'HACK2SKILL', 'DEVPOST', 'MLH', 'HACKEREARTH', 'EVENTBRITE', 'COLLEGE_PORTAL', 'INCUBATOR_PORTAL', 'INTERNAL');

-- CreateEnum
CREATE TYPE "public"."HackathonStatus" AS ENUM ('UPCOMING', 'OPEN', 'CLOSED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "public"."EventFormat" AS ENUM ('REMOTE', 'IRL', 'HYBRID', 'UNKNOWN');

-- CreateEnum
CREATE TYPE "public"."ScrapeRunStatus" AS ENUM ('RUNNING', 'SUCCESS', 'PARTIAL_SUCCESS', 'FAILED');

-- CreateEnum
CREATE TYPE "public"."AlertFrequency" AS ENUM ('REALTIME', 'DAILY', 'WEEKLY');

-- CreateTable
CREATE TABLE "public"."Hackathon" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "summary" TEXT,
    "description" TEXT,
    "host" TEXT,
    "sourcePlatform" "public"."SourcePlatform" NOT NULL,
    "sourceUrl" TEXT NOT NULL,
    "canonicalUrl" TEXT,
    "dedupeFingerprint" TEXT NOT NULL,
    "theme" TEXT,
    "format" "public"."EventFormat" NOT NULL DEFAULT 'UNKNOWN',
    "location" TEXT,
    "country" TEXT,
    "timezone" TEXT,
    "deadline" TIMESTAMP(3),
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "prizeLabel" TEXT,
    "teamSizeMin" INTEGER,
    "teamSizeMax" INTEGER,
    "status" "public"."HackathonStatus" NOT NULL DEFAULT 'OPEN',
    "isStudentFriendly" BOOLEAN NOT NULL DEFAULT false,
    "isBeginnerFriendly" BOOLEAN NOT NULL DEFAULT false,
    "techStack" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "rankingScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "trendingScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "lastScrapedAt" TIMESTAMP(3),
    "rawPayload" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Hackathon_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."SourceReference" (
    "id" TEXT NOT NULL,
    "sourcePlatform" "public"."SourcePlatform" NOT NULL,
    "sourceId" TEXT,
    "sourceUrl" TEXT NOT NULL,
    "canonicalUrl" TEXT,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "firstSeenAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastSeenAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "hackathonId" TEXT NOT NULL,

    CONSTRAINT "SourceReference_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ScrapeRun" (
    "id" TEXT NOT NULL,
    "sourcePlatform" "public"."SourcePlatform" NOT NULL,
    "status" "public"."ScrapeRunStatus" NOT NULL DEFAULT 'RUNNING',
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),
    "durationMs" INTEGER,
    "itemsScraped" INTEGER NOT NULL DEFAULT 0,
    "itemsStored" INTEGER NOT NULL DEFAULT 0,
    "errorMessage" TEXT,
    "metadata" JSONB,

    CONSTRAINT "ScrapeRun_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."AdminUser" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "lastLoginAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AdminUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."SavedHackathon" (
    "id" TEXT NOT NULL,
    "userExternalId" TEXT NOT NULL,
    "hackathonId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SavedHackathon_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."AlertSubscription" (
    "id" TEXT NOT NULL,
    "userExternalId" TEXT NOT NULL,
    "email" TEXT,
    "frequency" "public"."AlertFrequency" NOT NULL DEFAULT 'DAILY',
    "criteria" JSONB,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "hackathonId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AlertSubscription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Tag" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Tag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."HackathonTag" (
    "hackathonId" TEXT NOT NULL,
    "tagId" TEXT NOT NULL,

    CONSTRAINT "HackathonTag_pkey" PRIMARY KEY ("hackathonId","tagId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Hackathon_slug_key" ON "public"."Hackathon"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Hackathon_canonicalUrl_key" ON "public"."Hackathon"("canonicalUrl");

-- CreateIndex
CREATE UNIQUE INDEX "Hackathon_dedupeFingerprint_key" ON "public"."Hackathon"("dedupeFingerprint");

-- CreateIndex
CREATE INDEX "Hackathon_deadline_idx" ON "public"."Hackathon"("deadline");

-- CreateIndex
CREATE INDEX "Hackathon_sourcePlatform_idx" ON "public"."Hackathon"("sourcePlatform");

-- CreateIndex
CREATE INDEX "Hackathon_status_idx" ON "public"."Hackathon"("status");

-- CreateIndex
CREATE INDEX "Hackathon_format_idx" ON "public"."Hackathon"("format");

-- CreateIndex
CREATE INDEX "Hackathon_theme_idx" ON "public"."Hackathon"("theme");

-- CreateIndex
CREATE INDEX "Hackathon_rankingScore_idx" ON "public"."Hackathon"("rankingScore" DESC);

-- CreateIndex
CREATE INDEX "Hackathon_trendingScore_idx" ON "public"."Hackathon"("trendingScore" DESC);

-- CreateIndex
CREATE INDEX "Hackathon_createdAt_idx" ON "public"."Hackathon"("createdAt" DESC);

-- CreateIndex
CREATE INDEX "SourceReference_hackathonId_idx" ON "public"."SourceReference"("hackathonId");

-- CreateIndex
CREATE UNIQUE INDEX "SourceReference_sourcePlatform_sourceUrl_key" ON "public"."SourceReference"("sourcePlatform", "sourceUrl");

-- CreateIndex
CREATE INDEX "ScrapeRun_sourcePlatform_idx" ON "public"."ScrapeRun"("sourcePlatform");

-- CreateIndex
CREATE INDEX "ScrapeRun_status_idx" ON "public"."ScrapeRun"("status");

-- CreateIndex
CREATE INDEX "ScrapeRun_startedAt_idx" ON "public"."ScrapeRun"("startedAt" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "AdminUser_email_key" ON "public"."AdminUser"("email");

-- CreateIndex
CREATE INDEX "SavedHackathon_userExternalId_idx" ON "public"."SavedHackathon"("userExternalId");

-- CreateIndex
CREATE INDEX "SavedHackathon_hackathonId_idx" ON "public"."SavedHackathon"("hackathonId");

-- CreateIndex
CREATE UNIQUE INDEX "SavedHackathon_userExternalId_hackathonId_key" ON "public"."SavedHackathon"("userExternalId", "hackathonId");

-- CreateIndex
CREATE INDEX "AlertSubscription_userExternalId_idx" ON "public"."AlertSubscription"("userExternalId");

-- CreateIndex
CREATE INDEX "AlertSubscription_frequency_idx" ON "public"."AlertSubscription"("frequency");

-- CreateIndex
CREATE INDEX "AlertSubscription_isActive_idx" ON "public"."AlertSubscription"("isActive");

-- CreateIndex
CREATE UNIQUE INDEX "Tag_name_key" ON "public"."Tag"("name");

-- CreateIndex
CREATE INDEX "HackathonTag_tagId_idx" ON "public"."HackathonTag"("tagId");

-- AddForeignKey
ALTER TABLE "public"."SourceReference" ADD CONSTRAINT "SourceReference_hackathonId_fkey" FOREIGN KEY ("hackathonId") REFERENCES "public"."Hackathon"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SavedHackathon" ADD CONSTRAINT "SavedHackathon_hackathonId_fkey" FOREIGN KEY ("hackathonId") REFERENCES "public"."Hackathon"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AlertSubscription" ADD CONSTRAINT "AlertSubscription_hackathonId_fkey" FOREIGN KEY ("hackathonId") REFERENCES "public"."Hackathon"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."HackathonTag" ADD CONSTRAINT "HackathonTag_hackathonId_fkey" FOREIGN KEY ("hackathonId") REFERENCES "public"."Hackathon"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."HackathonTag" ADD CONSTRAINT "HackathonTag_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "public"."Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

