# Development Roadmap

## Architecture Decision

**Fork from Kolb app, not psych app.** The Kolb app has the backend infrastructure (Prisma, Stripe, API routes, UI components). The psych app has the exam engine logic. The Kolb app is the chassis; the exam engine gets rebuilt on top of it.

**Monorepo structure (Turborepo):** Shared packages for UI components, Kolb scoring, validation, rate limiting. Both the standalone Kolb app and exam platform import from shared. No fork divergence.

## Phase Overview

```
Phase 1: Monorepo + Foundation + Kolb Onboarding   [Week 1]
Phase 2: Payments & Subscriptions                    [Week 2]
Phase 3: Exam Engine + Style-Specific Feedback       [Week 3]
Phase 4: Admin Panel & Content Protection            [Week 4]
Phase 5: Polish & Launch                             [Week 5]
Phase 6: Buffer (client content delays, bugs)        [Week 6]
Phase 7: Post-Launch Enhancements                    [Ongoing]
```

---

## Phase 1: Monorepo + Foundation + Kolb Onboarding

**Goal:** Monorepo set up, Kolb app's backend infrastructure extended, magic link auth, Study Style Profile working, deployed to Railway.

### Tasks

- [ ] Set up Turborepo monorepo with /packages/shared, /packages/exam-platform, /packages/kolb-app
- [ ] Extract shared code from Kolb app: UI components, scoring engine, validation, rate limiting
- [ ] Set up PostgreSQL database on Railway
- [ ] Extend Kolb's Prisma schema with exam-specific models (Question, ExamAttempt, Answer, FlashcardState, StudySession, KolbProfile)
- [ ] Add to User model: role, parentId, displayName, examType, subscriptionTier
- [ ] Run initial migration
- [ ] Set up NextAuth.js v5 with Email provider (magic link via Resend — no passwords)
- [ ] Create magic link login page
- [ ] Create registration flow (parent email → magic link → add child profile)
- [ ] Set up tenant configuration (env-driven branding, timezone: Australia/Sydney)
- [ ] Create `src/lib/timezone.ts` utility (toDisplayTime, isToday — all UTC internally)
- [ ] Select 12 Kolb questions (3 per dimension), rewrite for ages 9-12 reading level
- [ ] Build Study Style Profile flow: 12-question assessment → results → "Start Practicing" CTA
- [ ] Store KolbProfile on user model after assessment
- [ ] Build app shell: navigation, layout, responsive sidebar (merge Kolb + psych patterns)
- [ ] Create landing page (public, unauthenticated)
- [ ] Create student dashboard (authenticated, shows study style)
- [ ] Set up Railway deployment with environment variables
- [ ] Send CSV question template to client

### Existing Code Reuse
- Kolb app: AssessmentForm.tsx (adapt for 12 questions), kolb-scoring.ts (use as-is), UI components (use as-is), Prisma schema (extend), API route patterns (reuse), rate limiting (use as-is), validation (use as-is)
- Psych app: Dashboard.tsx layout concepts, Navigation.tsx multi-page pattern

### Definition of Done
- Parent can register via magic link, add child
- Child can take 12-question Study Style Profile
- Learning style stored and displayed on dashboard
- Deployed to Railway with working database

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

## Phase 3: Exam Engine + Style-Specific Feedback

**Goal:** Full timed exam experience with multi-section support, pause/resume, results with personalised feedback based on Study Style Profile.

### Tasks

- [ ] Build exam selection page (choose OC or Selective, section or full)
- [ ] Build exam API routes:
  - [ ] `POST /api/exams` — start new attempt
  - [ ] `GET /api/exams/[attemptId]` — get attempt state
  - [ ] `PATCH /api/exams/[attemptId]` — save answer, pause, submit
  - [ ] `GET /api/exams/[attemptId]/questions` — get questions one at a time (content protection)
- [ ] Implement multi-section exam flow:
  - [ ] Section instructions screen
  - [ ] Per-section timer (independent timers, compare Date.now() on every tick — no drift)
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
  - [ ] Mobile Safari fix: timer self-corrects using Date.now() when tab regains focus
- [ ] Implement pause/save:
  - [ ] Save current state to database (answers, time remaining, current question)
  - [ ] Resume from saved state
  - [ ] Server-side time validation (prevent clock manipulation)
- [ ] Build reading comprehension split-pane view:
  - [ ] Desktop/tablet: passage pinned left, questions scroll right
  - [ ] Mobile: sticky "View Passage" button, slide-up panel
- [ ] Support image-based questions (questionImageUrl, optionImageUrls rendering)
- [ ] Build style-specific feedback engine:
  - [ ] Create `src/lib/style-feedback.ts` — maps (section × learningStyle × performanceBand) → recommendations
  - [ ] 36 entries: 3 sections × 4 styles × 3 bands (weak/average/strong)
  - [ ] Three-tier output: primary style advice (60%), stretch activities (25%), meta-learning (15%)
- [ ] Build results page:
  - [ ] Score by section
  - [ ] Pass/fail per question
  - [ ] Show correct answer and explanation
  - [ ] Time taken per section
  - [ ] Style-specific study recommendations for weak areas
- [ ] Build exam history page:
  - [ ] List all attempts
  - [ ] Score comparison over time
  - [ ] Filter by exam type/section

### Existing Code Reuse
- Psych app: Timer logic from PracticeQuestions.tsx (algorithm reused, rebuilt with server-side data)
- Psych app: Scoring calculation (correct/total percentage — directly reusable)
- Psych app: Results display UI patterns (adapt for per-section breakdown + style feedback)
- Kolb app: kolb-scoring.ts provides the learning style data that feeds the feedback engine

### Definition of Done
- Student can take a full OC or Selective exam with proper timers
- Reading comprehension works well on mobile (split-pane/slide-up)
- Pause/resume works across browser sessions
- Results show detailed per-question breakdown with style-specific recommendations
- Exam history shows all past attempts

---

## Phase 4: Admin Panel & Content Protection

**Goal:** Client can upload and manage questions. Question content is protected from copying.

### Tasks

#### Admin Panel
- [ ] Create admin layout (separate navigation, admin-only routes, role check)
- [ ] Build question list page (search, filter by exam type/section/difficulty/tier)
- [ ] Build question editor:
  - [ ] Rich text for question and explanation
  - [ ] Math template toolbar (fraction, exponent, sqrt buttons — no LaTeX knowledge required)
  - [ ] Image upload for question body and individual options (geometry/diagram questions)
  - [ ] Case study / reading passage field
  - [ ] Multi-part question support (Selective reading)
  - [ ] Difficulty and access tier selection
- [ ] Build bulk import:
  - [ ] CSV template download (with example rows)
  - [ ] CSV + ZIP upload (CSV rows map to image filenames in ZIP)
  - [ ] "I confirm these questions are original content" checkbox (required, timestamped)
  - [ ] Validation with preview before confirm
  - [ ] Error reporting for malformed rows
- [ ] Build user management page (view users, subscriptions, exam attempts)
- [ ] Build basic analytics dashboard (total users, active subscriptions, trial-to-paid conversion, most-missed questions)

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

1. **Monorepo + Foundation + Kolb first** — Can't build anything without infrastructure. Kolb onboarding is the differentiator and needs to be in place before the exam engine so results can personalise.
2. **Payments second** — Client needs revenue; tier gating informs all content delivery.
3. **Exam engine + feedback third** — The core product. Depends on auth (who), subscriptions (which questions), and Kolb profile (how to give feedback). Reading comprehension mobile UX built here, not deferred.
4. **Admin fourth** — Client needs to upload content. Math template toolbar + image upload + CSV import with copyright checkbox.
5. **Polish fifth** — Only optimize what's already working.
6. **Buffer sixth** — Client content delays, integration bugs, exam season prep.

Each phase is independently deployable. The client can see progress at every stage.

## White-Label Configurability Boundary

### Configurable Per Tenant (env vars / admin settings)
- Tenant name, logo, colours, domain
- Number of exam sections (1-6)
- Section names (any string)
- Timer duration per section (any number of minutes)
- Number of options per question (4 or 5)
- Subscription tier names and prices
- Free trial duration (in days)
- Pass threshold percentage

### Fixed in v1 (not configurable)
- Multiple choice only (no essay, short answer, drag-and-drop)
- Single correct answer per question (no multi-select answers)
- Questions are text or text+image (no interactive/animated)
- No student-to-student communication
- No live tutoring or video integration
- No custom report templates
- No API access for third-party integrations
