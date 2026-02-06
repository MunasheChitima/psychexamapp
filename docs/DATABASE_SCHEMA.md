# Database Schema Design

## Overview

PostgreSQL database managed via Prisma ORM. Designed for single-tenant deployment (one database per client) with the option to add `tenant_id` columns for future multi-tenant migration.

## Entity Relationship Diagram

```
┌──────────┐     ┌──────────────┐     ┌──────────────┐
│  User    │────▶│ Subscription │     │   Question   │
│          │     │              │     │              │
└────┬─────┘     └──────────────┘     └──────┬───────┘
     │                                        │
     │           ┌──────────────┐             │
     │           │  ExamAttempt │             │
     ├──────────▶│              │◀────────────┤
     │           └──────┬───────┘             │
     │                  │                     │
     │           ┌──────▼───────┐             │
     │           │   Answer     │─────────────┘
     │           └──────────────┘
     │
     │           ┌──────────────┐
     ├──────────▶│FlashcardState│
     │           └──────────────┘
     │
     │           ┌──────────────┐
     └──────────▶│  StudySession│
                 └──────────────┘
```

## Schema Definition (Prisma)

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ─── Users & Auth ───────────────────────────────────────

enum UserRole {
  STUDENT
  PARENT
  ADMIN
}

model User {
  id              String    @id @default(cuid())
  email           String    @unique
  name            String?
  passwordHash    String?
  role            UserRole  @default(STUDENT)
  parentId        String?
  parent          User?     @relation("ParentChildren", fields: [parentId], references: [id])
  children        User[]    @relation("ParentChildren")
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt

  // Relations
  subscription    Subscription?
  examAttempts    ExamAttempt[]
  flashcardStates FlashcardState[]
  studySessions   StudySession[]
  accounts        Account[]

  @@index([email])
  @@index([parentId])
}

model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String?
  access_token      String?
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String?
  session_state     String?

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
}

// ─── Subscriptions ──────────────────────────────────────

enum SubscriptionTier {
  FREE_TRIAL
  MONTHLY
  QUARTERLY
  HALF_YEARLY
  YEARLY
}

enum SubscriptionStatus {
  ACTIVE
  PAST_DUE
  CANCELED
  EXPIRED
  TRIALING
}

model Subscription {
  id                   String             @id @default(cuid())
  userId               String             @unique
  user                 User               @relation(fields: [userId], references: [id], onDelete: Cascade)
  tier                 SubscriptionTier   @default(FREE_TRIAL)
  status               SubscriptionStatus @default(TRIALING)
  stripeCustomerId     String?            @unique
  stripeSubscriptionId String?            @unique
  stripePriceId        String?
  trialStartDate       DateTime           @default(now())
  trialEndDate         DateTime?
  currentPeriodStart   DateTime?
  currentPeriodEnd     DateTime?
  canceledAt           DateTime?
  createdAt            DateTime           @default(now())
  updatedAt            DateTime           @updatedAt

  @@index([stripeCustomerId])
  @@index([stripeSubscriptionId])
  @@index([status])
}

// ─── Questions & Content ────────────────────────────────

enum ExamType {
  OC
  SELECTIVE
}

enum Section {
  READING
  MATHEMATICAL_REASONING
  THINKING_SKILLS
}

enum Difficulty {
  EASY
  MEDIUM
  HARD
}

model Question {
  id            String     @id @default(cuid())
  examType      ExamType
  section       Section
  difficulty    Difficulty @default(MEDIUM)
  accessTier    Int        @default(1)  // 1=free/monthly, 2=quarterly, 3=half-yearly, 4=yearly
  questionText  String     @db.Text
  questionHtml  String?    @db.Text     // Rich formatted version
  options       Json                     // String array of options
  correctAnswer Int                      // Index of correct option (0-based)
  explanation   String?    @db.Text
  caseStudy     String?    @db.Text     // Context passage for reading questions
  hasMultiPart  Boolean    @default(false)
  subQuestions  Json?                    // For multi-part questions
  mathNotation  String?    @db.Text     // LaTeX for math rendering
  tags          String[]                 // Flexible tagging
  isActive      Boolean    @default(true)
  sortOrder     Int        @default(0)
  createdAt     DateTime   @default(now())
  updatedAt     DateTime   @updatedAt

  // Relations
  answers       Answer[]

  @@index([examType, section])
  @@index([accessTier])
  @@index([isActive])
}

// ─── Exams & Attempts ───────────────────────────────────

enum AttemptStatus {
  IN_PROGRESS
  PAUSED
  COMPLETED
  TIMED_OUT
}

model ExamAttempt {
  id             String        @id @default(cuid())
  userId         String
  user           User          @relation(fields: [userId], references: [id], onDelete: Cascade)
  examType       ExamType
  section        Section?      // null = full exam (all sections)
  status         AttemptStatus @default(IN_PROGRESS)
  score          Float?        // Percentage, set on completion
  totalQuestions  Int
  correctAnswers Int           @default(0)
  timeAllotted   Int           // Seconds
  timeRemaining  Int           // Seconds, updated on pause/save
  timeExtended   Int           @default(0) // Additional seconds granted
  startedAt      DateTime      @default(now())
  pausedAt       DateTime?
  completedAt    DateTime?
  createdAt      DateTime      @default(now())
  updatedAt      DateTime      @updatedAt

  // Relations
  answers        Answer[]

  @@index([userId, examType])
  @@index([userId, status])
  @@index([completedAt])
}

model Answer {
  id            String      @id @default(cuid())
  attemptId     String
  attempt       ExamAttempt @relation(fields: [attemptId], references: [id], onDelete: Cascade)
  questionId    String
  question      Question    @relation(fields: [questionId], references: [id])
  selectedAnswer Int?       // null = unanswered
  isCorrect     Boolean?    // null = not yet graded
  isFlagged     Boolean     @default(false)
  timeSpent     Int?        // Seconds spent on this question
  answeredAt    DateTime?
  createdAt     DateTime    @default(now())

  @@unique([attemptId, questionId])
  @@index([attemptId])
  @@index([questionId])
}

// ─── Flashcards ─────────────────────────────────────────

model FlashcardState {
  id            String    @id @default(cuid())
  userId        String
  user          User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  questionId    String    // References a Question used as flashcard
  masteryLevel  Int       @default(0) // 0-5
  reviewCount   Int       @default(0)
  lastReviewed  DateTime?
  nextReview    DateTime?
  isBookmarked  Boolean   @default(false)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  @@unique([userId, questionId])
  @@index([userId, nextReview])
}

// ─── Study Sessions & Analytics ─────────────────────────

model StudySession {
  id          String   @id @default(cuid())
  userId      String
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  activity    String   // 'exam', 'flashcard', 'material'
  section     Section?
  examType    ExamType?
  duration    Int      // Minutes
  questionsAnswered Int @default(0)
  correctAnswers    Int @default(0)
  startedAt   DateTime @default(now())
  endedAt     DateTime?

  @@index([userId, startedAt])
}
```

## Access Tier Mapping

Questions are gated by `accessTier` field. The mapping from subscription tier to accessible question tiers:

```typescript
const TIER_ACCESS: Record<SubscriptionTier, number[]> = {
  FREE_TRIAL:  [1],
  MONTHLY:     [1, 2],
  QUARTERLY:   [1, 2, 3],
  HALF_YEARLY: [1, 2, 3],
  YEARLY:      [1, 2, 3, 4],
};
```

When querying questions for a user:

```sql
SELECT * FROM "Question"
WHERE "accessTier" = ANY($1)  -- $1 = allowed tiers based on subscription
  AND "examType" = $2
  AND "section" = $3
  AND "isActive" = true
ORDER BY "sortOrder", "difficulty";
```

## Subscription Tier Question Distribution

When the client uploads questions, they assign access tiers. Recommended distribution:

| Access Tier | % of Bank | Available To |
|-------------|-----------|-------------|
| Tier 1 | 25% | All users (including free trial) |
| Tier 2 | 25% | Monthly and above |
| Tier 3 | 25% | Quarterly and above |
| Tier 4 | 25% | Yearly only |

This means:
- Free trial: ~25% of questions
- Monthly: ~50% of questions
- Quarterly: ~75% of questions
- Yearly: 100% of questions

## Key Design Decisions

### 1. Questions serve double duty as flashcards
Rather than a separate `Flashcard` table, flashcard state is tracked via `FlashcardState` linked to `Question`. Any question can be studied as a flashcard.

### 2. Multi-part questions stored as JSON
Selective reading questions have sub-parts. Rather than a complex relational model, `subQuestions` stores them as JSON:

```json
{
  "parts": [
    {
      "partLabel": "a",
      "questionText": "What is the main idea of paragraph 2?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": 2
    },
    {
      "partLabel": "b",
      "questionText": "Which word best describes the author's tone?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": 0
    }
  ]
}
```

### 3. Time tracking is server-authoritative
`ExamAttempt.timeRemaining` is updated on every pause/save. The client shows a countdown, but the server calculates actual elapsed time between `startedAt` and current time to prevent clock manipulation.

### 4. Parent-child relationship
Parents and students are both `User` records. A parent has `role = PARENT` and their children reference them via `parentId`. This keeps auth simple while enabling the parent dashboard.

## Indexes

All indexes are defined inline in the schema above. Key query patterns optimized:

- User lookup by email (login)
- Questions by exam type + section (exam generation)
- Questions by access tier (subscription gating)
- Exam attempts by user + status (resume in-progress)
- Flashcard states by user + next review date (spaced repetition scheduling)
- Study sessions by user + date (analytics)

## Migration Strategy

From current localStorage to database:

1. Deploy database schema via `prisma migrate`
2. Seed with initial question content from client
3. Existing localStorage data in the psychology app is psychology-specific and won't migrate — this is a fresh platform for NSW exam content
4. The exam engine components are reused, but all data starts fresh in the database
