# Development Roadmap

## Phase Overview

```
Phase 1: Platform Foundation          [Week 1]
Phase 2: Payments & Subscriptions     [Week 2]
Phase 3: Exam Engine                  [Week 3]
Phase 4: Admin & Content Protection   [Week 4]
Phase 5: Polish & Launch              [Week 5]
Phase 6: Post-Launch Enhancements     [Ongoing]
```

---

## Phase 1: Platform Foundation

**Goal:** Authentication, database, and UI shell deployed to Vercel.

### Tasks

- [ ] Set up PostgreSQL database (Vercel Postgres or Supabase)
- [ ] Configure Prisma ORM with schema from DATABASE_SCHEMA.md
- [ ] Run initial migration
- [ ] Set up NextAuth.js v5 with email/password provider
- [ ] Create registration page
- [ ] Create login page
- [ ] Create password reset flow
- [ ] Set up tenant configuration (env-driven branding)
- [ ] Build app shell: navigation, layout, responsive sidebar
- [ ] Create landing page (public, unauthenticated)
- [ ] Create student dashboard (authenticated)
- [ ] Set up Vercel deployment with environment variables
- [ ] Configure custom domain (client provides)

### Existing Code Reuse
- Navigation.tsx → adapt for auth state
- Dashboard.tsx → adapt for server data
- Layout structure → keep App Router pattern

### Definition of Done
- User can register, log in, log out
- Authenticated users see dashboard
- Unauthenticated users see landing page
- Deployed to Vercel with working database

---

## Phase 2: Payments & Subscriptions

**Goal:** Stripe integration with 4 tiers, free trial, and tier-gated content access.

### Tasks

- [ ] Create Stripe products and prices (4 tiers)
- [ ] Implement Stripe Checkout session creation
- [ ] Build pricing page with tier comparison
- [ ] Build subscription management page (current plan, upgrade/downgrade)
- [ ] Implement Stripe webhooks:
  - [ ] `checkout.session.completed` → activate subscription
  - [ ] `invoice.paid` → extend subscription period
  - [ ] `invoice.payment_failed` → mark as past due
  - [ ] `customer.subscription.updated` → handle tier changes
  - [ ] `customer.subscription.deleted` → handle cancellation
- [ ] Implement 7-day free trial (auto-created on registration)
- [ ] Build tier-gating middleware (check subscription before serving questions)
- [ ] Integrate Stripe Customer Portal for self-service billing
- [ ] Add subscription status badge to navigation/dashboard
- [ ] Handle trial expiration (block access, show upgrade prompt)

### Definition of Done
- User can subscribe to any tier via Stripe Checkout
- Free trial works for 7 days
- Content is properly gated by tier
- Subscription status reflected in UI
- All webhook events handled correctly

---

## Phase 3: Exam Engine

**Goal:** Full timed exam experience with multi-section support, pause/resume, and results.

### Tasks

- [ ] Adapt PracticeQuestions.tsx for server-side data
- [ ] Build exam selection page (choose OC or Selective, section or full)
- [ ] Implement multi-section exam flow:
  - [ ] Section instructions screen
  - [ ] Per-section timer (independent timers)
  - [ ] Section completion → next section transition
- [ ] Implement question navigation:
  - [ ] Question list sidebar/grid
  - [ ] Flag for review
  - [ ] Jump to question
  - [ ] Unanswered indicator
- [ ] Implement timer features:
  - [ ] Countdown display (MM:SS)
  - [ ] Warning at 5 minutes remaining
  - [ ] Auto-submit on expiry
  - [ ] Time extension option (admin-configurable)
- [ ] Implement pause/save:
  - [ ] Save current state to database (answers, time remaining, current question)
  - [ ] Resume from saved state
  - [ ] Server-side time validation
- [ ] Build results page:
  - [ ] Score by section
  - [ ] Pass/fail per question
  - [ ] Show correct answer and explanation
  - [ ] Time taken per section
- [ ] Build exam history page:
  - [ ] List all attempts
  - [ ] Score comparison over time
  - [ ] Filter by exam type/section

### Existing Code Reuse
- PracticeQuestions.tsx timer logic → ~70% reusable
- Scoring calculation → directly reusable
- Results display UI → adapt for per-section breakdown
- Progress.tsx analytics → adapt for exam-specific data

### Definition of Done
- Student can take a full OC or Selective exam with proper timers
- Pause/resume works across browser sessions
- Results show detailed per-question breakdown
- Exam history shows all past attempts

---

## Phase 4: Admin Panel & Content Protection

**Goal:** Client can upload and manage questions. Question content is protected from copying.

### Tasks

#### Admin Panel
- [ ] Create admin layout (separate navigation, admin-only routes)
- [ ] Build question list page (search, filter by exam type/section/difficulty/tier)
- [ ] Build question editor:
  - [ ] Rich text for question and explanation
  - [ ] LaTeX input for math notation (with preview)
  - [ ] Case study / reading passage field
  - [ ] Multi-part question support
  - [ ] Difficulty and access tier selection
- [ ] Build bulk import:
  - [ ] CSV template download
  - [ ] CSV upload with validation
  - [ ] Preview before confirm
  - [ ] Error reporting for malformed rows
- [ ] Build user management page (view users, subscriptions, exam attempts)
- [ ] Build basic analytics dashboard (total users, active subscriptions, popular exams)

#### Content Protection
- [ ] Disable right-click on exam pages (`onContextMenu`)
- [ ] Disable text selection on question content (`user-select: none`)
- [ ] Print stylesheet hides exam content (`@media print`)
- [ ] Questions fetched per-page from API (not bulk loaded to client)
- [ ] Rate limiting on question API endpoints
- [ ] Content Security Policy headers

### Definition of Done
- Admin can create, edit, delete, and bulk-import questions
- Questions are accessible only to users with appropriate subscription tier
- Content protection measures are in place
- Admin can view user and subscription metrics

---

## Phase 5: Polish & Launch

**Goal:** Production-ready, mobile-optimized, and deployed.

### Tasks

- [ ] Mobile optimization pass:
  - [ ] Test all pages on iPhone, Android, iPad
  - [ ] Fix touch interactions on exam interface
  - [ ] Ensure timer is visible while scrolling
- [ ] Landing page:
  - [ ] Hero section with value proposition
  - [ ] Feature showcase
  - [ ] Pricing table
  - [ ] Sample question preview (free)
  - [ ] Testimonials section (client provides content)
  - [ ] FAQ section
- [ ] SEO:
  - [ ] Meta tags, Open Graph
  - [ ] Sitemap
  - [ ] Schema.org structured data for educational content
- [ ] Performance:
  - [ ] Lighthouse audit (target 90+ scores)
  - [ ] Image optimization
  - [ ] Code splitting
- [ ] Testing:
  - [ ] Manual QA across browsers
  - [ ] Stripe test mode end-to-end
  - [ ] Subscription lifecycle testing (trial → subscribe → cancel → re-subscribe)
- [ ] Legal:
  - [ ] Privacy policy page (client provides content or uses template)
  - [ ] Terms of service page
  - [ ] Cookie consent banner
- [ ] Deployment:
  - [ ] Production environment variables
  - [ ] Stripe live mode configuration
  - [ ] Custom domain and SSL
  - [ ] Monitoring/alerting setup

### Definition of Done
- All features working on mobile and desktop
- Lighthouse scores 90+ across all metrics
- Stripe in live mode and tested
- Client has admin access and can manage content
- Site is live on custom domain

---

## Phase 6: Post-Launch Enhancements (Future)

These are potential features for future development, either as add-ons for this client or as platform features for all white-label clients.

### Near-Term (Months 1-3)
- [ ] Parent dashboard (view child progress, manage subscription)
- [ ] Email notifications (study reminders, subscription renewal)
- [ ] Flashcard mode (reuse existing spaced repetition engine)
- [ ] Performance trends and weak area analysis
- [ ] Leaderboard (optional, anonymized)

### Medium-Term (Months 3-6)
- [ ] Mathematical notation rendering (KaTeX integration)
- [ ] Passage-based reading comprehension with highlighted text
- [ ] Adaptive difficulty (serve harder questions as student improves)
- [ ] Study plan generator (recommended daily practice)
- [ ] Bulk email to subscribers (admin feature)

### Long-Term (Months 6+)
- [ ] Mobile app (React Native or PWA)
- [ ] Video lesson integration
- [ ] AI-powered question explanations
- [ ] Group/classroom accounts for coaching centers
- [ ] Multi-language support
- [ ] White-label marketplace (self-service onboarding for new clients)

---

## Build Order Rationale

The phases are ordered by dependency and value delivery:

1. **Foundation first** — Can't build anything without auth and database
2. **Payments second** — Client needs revenue; tier gating informs all content delivery
3. **Exam engine third** — The core product; depends on auth (who is taking the exam) and subscriptions (which questions they can access)
4. **Admin fourth** — Client needs to upload content; depends on question schema being finalized in Phase 3
5. **Polish last** — Only optimize what's already working

Each phase is independently deployable. The client can see progress at every stage.
