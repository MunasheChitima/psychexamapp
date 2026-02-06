# ExamPrep Platform - White-Label Architecture

## Overview

This document describes the architecture for transforming the Psychology Exam App into a white-label, multi-tenant exam preparation platform. The platform is designed to be deployed once and configured per-client, with each client getting their own branding, content, and subscription tiers.

## Current State

The existing app is a single-page Next.js application with:
- Client-side only (localStorage persistence)
- Hardcoded psychology exam content (35 flashcards, 12 practice questions, 20 study materials)
- No authentication, no database, no payments
- Working exam engine with timer, pause/resume, scoring
- Flashcard system with spaced repetition
- Progress tracking with analytics and achievements

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

### 1. Authentication Module

**Tech:** NextAuth.js v5 (Auth.js)

- Email/password registration and login
- Optional social login (Google) for parent convenience
- Session management with JWT
- Role-based access: `student`, `parent`, `admin`
- Parent accounts can link to student accounts for monitoring

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
| Hosting | Vercel | Zero-config Next.js deployment |
| File Storage | Vercel Blob or S3 | For admin-uploaded assets |
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

## Security Considerations

- All question content served via authenticated API routes
- Rate limiting on question endpoints (prevent bulk scraping)
- Server-side subscription validation (never trust client tier claims)
- Input sanitization on all admin content uploads
- CSRF protection via NextAuth
- Environment variables for all secrets (never committed)
- Content Security Policy headers to prevent embedding
