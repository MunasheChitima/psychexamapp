-- Stripe webhook idempotency (serverless-safe)
CREATE TABLE "StripeProcessedEvent" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "StripeProcessedEvent_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "StripeProcessedEvent_createdAt_idx" ON "StripeProcessedEvent"("createdAt");

-- Organic / attribution events persistence
CREATE TABLE "OrganicAnalyticsEvent" (
    "id" TEXT NOT NULL,
    "eventName" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "OrganicAnalyticsEvent_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "OrganicAnalyticsEvent_eventName_createdAt_idx" ON "OrganicAnalyticsEvent"("eventName", "createdAt");

-- Query performance
CREATE INDEX "ExamResult_examSittingId_idx" ON "ExamResult"("examSittingId");
CREATE INDEX "Subscription_userId_status_idx" ON "Subscription"("userId", "status");
CREATE INDEX "Challenge_status_idx" ON "Challenge"("status");
CREATE INDEX "Challenge_endsAt_idx" ON "Challenge"("endsAt");
CREATE INDEX "LiveSession_status_idx" ON "LiveSession"("status");
