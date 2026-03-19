-- Persist anonymous study progress for guest cloud sync.
CREATE TABLE "GuestStudyData" (
  "id" TEXT NOT NULL,
  "tokenHash" TEXT NOT NULL,
  "examDate" TEXT,
  "examSittingId" TEXT,
  "studyGoal" TEXT NOT NULL DEFAULT 'moderate',
  "selectedDomains" JSONB NOT NULL DEFAULT '["ethics","assessment","interventions","communication"]',
  "studyStats" JSONB NOT NULL DEFAULT '{"totalHours":0,"questionsAnswered":0,"correctAnswers":0,"studyStreak":0,"estimatedReadiness":0}',
  "studySessions" JSONB NOT NULL DEFAULT '[]',
  "flashcardProgress" JSONB NOT NULL DEFAULT '{}',
  "practiceResults" JSONB NOT NULL DEFAULT '[]',
  "materialBookmarks" JSONB NOT NULL DEFAULT '{}',
  "materialCompleted" JSONB NOT NULL DEFAULT '{}',
  "engagementData" JSONB NOT NULL DEFAULT '{}',
  "hasCompletedOnboarding" BOOLEAN NOT NULL DEFAULT false,
  "lastSyncedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "expiresAt" TIMESTAMP(3) NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "GuestStudyData_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "GuestStudyData_tokenHash_key" ON "GuestStudyData"("tokenHash");
CREATE INDEX "GuestStudyData_expiresAt_idx" ON "GuestStudyData"("expiresAt");
