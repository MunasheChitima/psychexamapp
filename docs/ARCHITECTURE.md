# ExamPrep Platform - White-Label Architecture

## Overview

This document describes the architecture for building a white-label, multi-tenant exam preparation platform. The platform merges two existing codebases — the Kolb Learning Styles Assessment (backend infrastructure, Stripe, Prisma, UI components) and the Psychology Exam App (exam engine, flashcards, progress tracking) — into a unified product.

## Two Source Codebases

### Kolb Learning Styles Assessment (The Chassis)
- Next.js 16, TypeScript, Tailwind CSS 3, React 18
- Prisma + PostgreSQL, Stripe payments, API routes
- Rate limiting, Zod validation, user tracking
- UI component library (Button, Card, Badge, Dialog, ProgressRing, Toast, Tooltip)
- PDF generation (@react-pdf/renderer), email (Resend)
- AI integration (Claude + Gemini) for personalised reports
- 24-question learning style assessment with scoring algorithm

### Psychology Exam App (The Engine)
- Next.js 15, TypeScript, Tailwind CSS 4, React 19
- Client-side only (localStorage persistence)
- Working exam engine: timer, scoring, timed mode, practice mode
- Flashcard system with spaced repetition
- Progress tracking with analytics and achievements
- 35 flashcards, 12 practice questions, 20 study materials

### Architecture Decision: Fork from Kolb, Drop in Exam Engine

The Kolb app has the backend infrastructure the platform needs. The psych app has the exam engine UI. The Kolb app is the starting point — extend its database, reuse its Stripe/API/UI patterns, and rebuild the exam engine components to work with server-side data.

## Monorepo Structure (Turborepo)

```
/packages
  /shared        — UI components, Kolb scoring, validation, rate limiting, timezone utils
  /exam-platform — the white-label exam app (imports from shared)
  /kolb-app      — the standalone Kolb assessment (imports from shared)
```

Both apps import from shared packages. Bug fixes in shared code propagate to both. No fork divergence.

## Target Architecture

```
┌─────────────────────────────────────────────────────┐
│                    Client Browser                     │
│  ┌─────────────┐  ┌──────────┐  ┌────────────────┐  │
│  │  Next.js App │  │ Theme/   │  │ Content Layer  │  │
│  │  (App Router)│  │ Branding │  │ (Dynamic)      │  │
│  └──────┬───────┘  └────┬─────┘  └───────┬────────┘  │
└─────────┼───────────────┼────────────────┼───────────┘
          │               │                │
          ▼               ▼                ▼
┌─────────────────────────────────────────────────────┐
│                   API Layer (Next.js)                 │
│  ┌──────────┐  ┌───────────┐  ┌──────────────────┐  │
│  │ Auth API │  │ Exam API  │  │ Subscription API │  │
│  │(NextAuth)│  │(Questions,│  │   (Stripe)       │  │
│  │          │  │ Results)  │  │                  │  │
│  └────┬─────┘  └─────┬─────┘  └────────┬─────────┘  │
└───────┼──────────────┼─────────────────┼────────────┘
        │              │                 │
        ▼              ▼                 ▼
┌─────────────────────────────────────────────────────┐
│                  Database (PostgreSQL)                │
│  ┌────────┐ ┌──────────┐ ┌───────┐ ┌────────────┐  │
│  │ Users  │ │Questions │ │Exams  │ │Subscriptions│  │
│  │& Auth  │ │& Content │ │& Attempts│            │  │
│  └────────┘ └──────────┘ └───────┘ └────────────┘  │
└─────────────────────────────────────────────────────┘
```

## Multi-Tenant Strategy

### Option A: Configuration-Based (Recommended for MVP)

Each client gets a separate deployment with environment-variable-driven configuration:

```
TENANT_ID=nsw-oc-prep
TENANT_NAME="NSW OC & Selective Exam Prep"
TENANT_LOGO_URL=/branding/logo.svg
TENANT_PRIMARY_COLOR=#2563eb
TENANT_DOMAIN=nswocprep.com.au
STRIPE_PRICE_MONTHLY=price_xxx
STRIPE_PRICE_QUARTERLY=price_xxx
STRIPE_PRICE_HALF_YEARLY=price_xxx
STRIPE_PRICE_YEARLY=price_xxx
```

**Pros:** Simple, isolated data, easy to reason about, each client can be on different infrastructure.
**Cons:** Separate deployments to manage, can't share infrastructure costs easily.

### Option B: Database Multi-Tenancy (Future Scale)

Single deployment with tenant isolation at the database level. Every table has a `tenant_id` column, all queries scoped by tenant. Suitable when managing 10+ clients.

### Recommendation

Start with Option A. It's the fastest to ship, easiest to debug, and matches the current scale (1-5 clients). Migrate to Option B only when operational overhead of managing separate deployments exceeds the complexity of multi-tenant queries.

## Core Modules

### 0. Onboarding Module — Study Style Profile (Kolb)

**Tech:** Kolb scoring engine from existing Kolb app

The student's first action after account creation is a 12-question Study Style Profile (based on Kolb's learning dimensions but never branded as "Kolb" in the UI — called "Study Style Profile" or "Learning Preference Quiz").

- 12 questions (3 per dimension: CE, RO, AC, AE), reworded for ages 9-12
- Multi-select answers with weighted scoring (existing algorithm handles variable question counts)
- Results stored on `KolbProfile` model: learningStyle, secondaryStyle, dimension scores
- Every downstream feature reads `user.kolbProfile.learningStyle` to personalise output
- Post-exam feedback, flashcard presentation, study tips all adapt per style
- Optional retake after 30 days to track learning preference shifts

**Three-tier feedback model (prevents filter bubble):**
- Tier 1 (60%): Primary recommendations matching dominant style
- Tier 2 (25%): Stretch activities from weakest dimension ("Challenge yourself")
- Tier 3 (15%): Meta-learning context ("The best learners use all four approaches")

### 1. Authentication Module

**Tech:** NextAuth.js v5 (Auth.js) — Magic Link Only (No Passwords)

- Magic link authentication via email (Resend)
- No passwords stored, no password hashing, no brute force risk, no forgot-password flow
- "Remember this device" with 30-day session cookie
- Session management with JWT (httpOnly, secure, sameSite: strict)
- Role-based access: `student`, `parent`, `admin`
- Parent accounts can link to student accounts for monitoring
- Rate limiting: 5 magic link requests per email per 15 minutes

### 2. Subscription Module

**Tech:** Stripe Checkout + Webhooks

- 4 tiers: Monthly, Quarterly, Half-Yearly, Yearly
- 7-day free trial with limited question access
- Tiered content access (more questions at higher tiers)
- Stripe Customer Portal for self-service management
- Webhook handlers for: `checkout.session.completed`, `invoice.paid`, `invoice.payment_failed`, `customer.subscription.updated`, `customer.subscription.deleted`

**Tier Access Model:**

| Tier | Questions Available | Price Point (Client Sets) |
|------|-------------------|--------------------------|
| Free Trial (7 days) | 20% of question bank |  Free |
| Monthly | 40% of question bank | $ |
| Quarterly | 60% of question bank | $$ |
| Half-Yearly | 80% of question bank | $$$ |
| Yearly | 100% of question bank | $$$$ |

Questions are tagged with an `access_tier` field (1-4). Free trial users see tier-1 only. Monthly sees tier 1-2. Yearly sees all.

### 3. Exam Engine Module (Existing - Needs Adaptation)

**Current:** Works well for single-section timed exams.

**Needed for NSW:**
- Multi-section exams (Reading, Math, Thinking Skills) with independent timers
- Section-level navigation (complete one section, move to next)
- Pause/resume with server-side time tracking (prevent cheating)
- Time extension option
- Save progress mid-exam
- Results breakdown per section with pass/fail per question
- Historical attempt comparison

### 4. Content Management Module (New)

**Admin Panel Features:**
- CRUD for questions (create, edit, delete, bulk import via CSV)
- Tag questions by: exam type, section, difficulty, access tier
- Preview questions as students see them
- Bulk operations (import/export)
- Content analytics (which questions are most missed, etc.)

### 5. Content Protection Module (New)

- Render questions as styled HTML (never images)
- Disable right-click context menu on exam pages
- CSS `user-select: none` on question content
- Disable print via CSS `@media print { .exam-content { display: none; } }`
- No download/export of question content
- Server-side rendering of questions (not exposed in client bundle)
- Rate limiting on question API endpoints

**Note:** No content protection is truly bulletproof. These measures deter casual copying, which is what the client needs.

### 6. Branding/Theme Module (New)

- CSS custom properties driven by tenant config
- Swappable logo, favicon, colors, fonts
- Configurable landing page content
- Tenant-specific metadata (SEO, Open Graph)

## Tech Stack

| Layer | Technology | Rationale |
|-------|-----------|-----------|
| Framework | Next.js 15 (App Router) | Already using, SSR for content protection |
| Language | TypeScript | Already using, type safety |
| Styling | Tailwind CSS 4 | Already using, rapid UI development |
| Database | PostgreSQL | Relational data, Vercel Postgres or Supabase |
| ORM | Prisma | Type-safe queries, migrations, schema management |
| Auth | NextAuth.js v5 | Industry standard for Next.js |
| Payments | Stripe | Standard for SaaS subscriptions |
| Hosting | Railway (MVP) / Coolify+Hetzner (scale) | No cold starts, built-in PostgreSQL |
| File Storage | Vercel Blob or S3 | For admin-uploaded question images |
| Math Rendering | KaTeX | Mathematical notation in questions |
| Monorepo | Turborepo | Shared packages across Kolb + exam apps |
| Email | Resend | Transactional emails (welcome, receipt, reminders) |

## Directory Structure (Target)

```
src/
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   ├── register/page.tsx
│   │   └── layout.tsx
│   ├── (dashboard)/
│   │   ├── page.tsx                 # Student dashboard
│   │   ├── exams/
│   │   │   ├── page.tsx             # Exam list
│   │   │   ├── [examId]/page.tsx    # Take exam
│   │   │   └── [examId]/results/page.tsx
│   │   ├── flashcards/page.tsx
│   │   ├── progress/page.tsx
│   │   ├── materials/page.tsx
│   │   └── subscription/page.tsx    # Manage subscription
│   ├── (admin)/
│   │   ├── dashboard/page.tsx       # Admin overview
│   │   ├── questions/page.tsx       # Question management
│   │   ├── users/page.tsx           # User management
│   │   └── analytics/page.tsx       # Platform analytics
│   ├── api/
│   │   ├── auth/[...nextauth]/route.ts
│   │   ├── stripe/webhook/route.ts
│   │   ├── exams/route.ts
│   │   ├── questions/route.ts
│   │   └── progress/route.ts
│   ├── layout.tsx
│   └── page.tsx                     # Landing page (public)
├── components/
│   ├── ui/                          # Shared UI primitives
│   ├── exam/                        # Exam engine components
│   ├── flashcard/                   # Flashcard components
│   ├── admin/                       # Admin panel components
│   └── layout/                      # Navigation, footer, etc.
├── lib/
│   ├── auth.ts                      # NextAuth config
│   ├── stripe.ts                    # Stripe helpers
│   ├── db.ts                        # Prisma client
│   └── content-protection.ts        # Anti-copy utilities
├── config/
│   └── tenant.ts                    # Tenant configuration
├── types/
│   └── index.ts                     # Shared TypeScript types
└── prisma/
    ├── schema.prisma
    └── seed.ts                      # Seed data
```

## What Transfers from Current Codebase

| Current Component | Reuse Level | Adaptation Needed |
|-------------------|-------------|-------------------|
| PracticeQuestions.tsx | ~70% | Add multi-section, server-side timer, save progress |
| Flashcards.tsx | ~80% | Connect to DB instead of localStorage |
| Progress.tsx | ~60% | Pull from DB, add per-section analytics |
| StudyMaterials.tsx | ~70% | Connect to DB, add tier gating |
| Navigation.tsx | ~50% | Add auth state, subscription badge |
| Onboarding.tsx | ~30% | Replace with auth flow + subscription |
| Dashboard.tsx | ~60% | Pull live data, add parent view |
| Type definitions | ~80% | Extend for multi-tenant fields |

## Data Minimisation Strategy

- No child real names — display nicknames only
- No child email addresses — parent email is the account
- No date of birth — exam type implies age range
- Billing identity (parent) separated from learning identity (student) via FamilyGroup UUID
- Detailed exam answers auto-purge after 90 days (aggregate scores retained)
- Inactive accounts auto-deleted after 12 months
- "Legal hold" flag exempts accounts from auto-purge if subpoena received

## Security Considerations

- Magic link auth eliminates password storage entirely
- All question content served via authenticated API routes, one at a time
- Rate limiting on question endpoints (prevent bulk scraping) — reuse Kolb app's rate limiter
- Server-side subscription validation (never trust client tier claims)
- Input sanitization on all admin content uploads (DOMPurify for HTML, KaTeX trust:false)
- CSRF protection via NextAuth
- Environment variables for all secrets (never committed)
- Content Security Policy headers to prevent embedding
- Device fingerprinting for free trial abuse prevention
- Concurrent session limiting (1 active session per account)
- All timestamps stored UTC, displayed in tenant timezone (Australia/Sydney)

## Content Protection (Best-Effort, Not DRM)

- Questions served one at a time from authenticated API (never bulk loaded)
- `onContextMenu` disabled on exam pages
- `user-select: none` on question content
- `@media print { .exam-content { display: none; } }`
- Rate limiting on question API endpoints
- Contract explicitly states: "reasonable measures, not bulletproof DRM"
- Client's terms of service provide legal (not technical) protection against redistribution
