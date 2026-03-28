-- CreateTable
CREATE TABLE "PracticeQuestionContent" (
    "id" TEXT NOT NULL,
    "productLine" TEXT NOT NULL,
    "externalId" TEXT NOT NULL,
    "domain" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "difficulty" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "options" JSONB NOT NULL,
    "correctAnswer" INTEGER NOT NULL,
    "caseStudy" TEXT,
    "distractorRationale" JSONB,
    "explanation" TEXT NOT NULL,
    "references" JSONB,
    "clinicalPearls" TEXT,
    "questionType" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PracticeQuestionContent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FlashcardContent" (
    "id" TEXT NOT NULL,
    "productLine" TEXT NOT NULL,
    "externalId" TEXT NOT NULL,
    "domain" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "options" JSONB,
    "correctOption" INTEGER,
    "category" TEXT NOT NULL,
    "difficulty" TEXT NOT NULL,
    "explanation" TEXT,
    "references" JSONB,
    "clinicalPearls" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FlashcardContent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StudyMaterialContent" (
    "id" TEXT NOT NULL,
    "productLine" TEXT NOT NULL,
    "externalId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "domain" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "lastUpdated" TEXT NOT NULL,
    "keyPoints" JSONB NOT NULL,
    "commonMistakes" JSONB NOT NULL,
    "examTips" JSONB NOT NULL,
    "references" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StudyMaterialContent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PracticeQuestionContent_productLine_externalId_key" ON "PracticeQuestionContent"("productLine", "externalId");

-- CreateIndex
CREATE INDEX "PracticeQuestionContent_productLine_domain_idx" ON "PracticeQuestionContent"("productLine", "domain");

-- CreateIndex
CREATE UNIQUE INDEX "FlashcardContent_productLine_externalId_key" ON "FlashcardContent"("productLine", "externalId");

-- CreateIndex
CREATE INDEX "FlashcardContent_productLine_domain_idx" ON "FlashcardContent"("productLine", "domain");

-- CreateIndex
CREATE UNIQUE INDEX "StudyMaterialContent_productLine_externalId_key" ON "StudyMaterialContent"("productLine", "externalId");

-- CreateIndex
CREATE INDEX "StudyMaterialContent_productLine_domain_idx" ON "StudyMaterialContent"("productLine", "domain");
