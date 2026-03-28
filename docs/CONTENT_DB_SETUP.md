# Content Database Setup

Questions, flashcards, and study materials can now be served from the database. The app falls back to static imports when the DB is empty or unavailable.

## Setup

**Important:** Run the migration first. The seed will fail if the tables do not exist.

### 1. Apply the migration

```bash
cd APRAcademy
npx prisma migrate deploy
```

Or for development (creates migration and applies):

```bash
npx prisma migrate dev --name add_content_tables
```

If the migration file already exists, `prisma migrate deploy` will apply it.

### 2. Seed the content

```bash
npm run db:seed
```

This migrates all questions, flashcards, and study materials from the TypeScript files into the database. Run **after** the migration succeeds.

### 3. Verify

- Start the app: `npm run dev`
- Navigate to Practice Questions — data loads from the API
- If the DB is empty, the API falls back to static content automatically

## API Endpoints

- `GET /api/content/questions?productLine=psychology` — Practice questions
- `GET /api/content/flashcards?productLine=psychology` — Flashcards
- `GET /api/content/study-materials?productLine=psychology` — Study materials

Product lines: `psychology`, `nursing` (VCE English lives in the separate **vce-english-app** repository).

## Scripts

- `npm run db:push` — Push schema changes without migrations
- `npm run db:seed` — Seed content from TS files
- `npm run db:migrate` — Run migrations (dev)

## Architecture

- **contentDb.ts** — Fetches from DB, falls back to static
- **useContent hooks** — Client-side hooks that fetch from the API
- **PracticeQuestions, ExamSimulation, DailyChallenge, etc.** — Use `usePracticeQuestions` hook
- **Live sessions** — Still use in-memory pool (unchanged)
