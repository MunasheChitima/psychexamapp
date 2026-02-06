# Project Strategy & Planning Conversation

## Date: 2026-02-06

## Context
Full conversation between Munashe and Claude covering strategy, technical planning, and build approach for transforming the Psychology Exam App into a white-label exam prep platform. First target client: NSW OC & Selective exam prep (Upwork opportunity).

---

## The Opportunity

**Upwork Job Post Summary:**
- Build a website for Opportunity Class and Selective exam practice materials for NSW, Australia
- Client provides all practice questions and answers
- Practice exams should not be downloadable, questions not in image format (no right-click save)
- Subscription model: monthly, quarterly, half-yearly, yearly with different question access per tier
- Each tier has different sets of questions (monthly = least, yearly = full range)
- Practice exam with start/end time, option to extend or save progress, show pass/fail at end
- Free 7-day trial with limited questions

**NSW OC Test Structure:**
| Section | Questions | Time | Type |
|---------|-----------|------|------|
| Reading Comprehension | 40 | 30 min | Multiple-choice |
| Mathematical Reasoning | 35 | 40 min | Multiple-choice |
| Thinking Skills | 40 | 40 min | Multiple-choice |

**NSW Selective Test Structure:**
| Section | Questions | Time | Type |
|---------|-----------|------|------|
| Reading Test | 17 (3 have multiple parts) | 45 min | Multiple-choice |
| Mathematical Reasoning | 35 | 40 min | Multiple-choice |
| Thinking Skills | 40 | 40 min | Multiple-choice |

**Reference/Competitor Sites:**
- braintreecoaching.com.au
- notesedu.com.au
- oztests.com.au

---

## Why This Is a Strong Fit

- Kolb app and Psychology Exam app are proof-of-concept for exactly what this client needs
- Timed practice exams, progress tracking, subscription tiers, educational content delivery
- Tech stack (Next.js, TypeScript, Stripe, Prisma) transfers 1:1
- Can pitch both apps as portfolio pieces directly

## Key Considerations

**Core build includes:** User auth, subscription management (Stripe with 4 tiers + 7-day trial), question bank with tiered access, timed exam engine with pause/resume, results with pass/fail breakdown, content protection (no right-click/download)

**Content protection approach:** Render questions as styled HTML (not images), disable right-click context menus, prevent selection/copy, CSS to block printing. Not foolproof but standard for this space.

**Differentiators from competitors:**
1. Modern, fast UI (competitors are dated/templated)
2. Mobile-first design (students use tablets, competitors are desktop-oriented)
3. Parent analytics dashboard (parents are buyers, students are users)
4. Smooth exam experience (pause/resume, clean timer, question flagging)
5. Performance analytics (improvement tracking, weak area identification by section)

---

## White-Label Strategy

**Decision: Build once, license to multiple coaching businesses.**

The NSW exam prep market has dozens of coaching businesses. OC and Selective test prep is massive in Sydney. Most sites look like they were built in 2015.

**For this client:** Price at $3-4K as "first customer" rate. They're licensing a configured instance with their branding and content, not getting custom software.

**What you own:** The underlying platform — exam engine, subscription management, admin panel, timer system, content protection. All IP is yours.

**Replication model:** Every other coaching business becomes a prospect. VIC has selective entry. QLD has academic placement. Platform is identical — only questions and branding change.

**Subsequent customer pricing:**
- Setup fee: $2-5K (configuration and branding)
- Monthly SaaS fee: $200-500/month
- Or one-off white-label at $5-8K

---

## Pricing Options for This Client

### Option A: Fixed Fee — $4,500 AUD
| Milestone | Deliverable | Payment |
|-----------|-------------|---------|
| M1 | Auth, database, basic UI, deployment | $1,200 |
| M2 | Stripe integration, 4 tiers + trial | $1,000 |
| M3 | Timed exams, multi-section, pause/resume, results | $1,000 |
| M4 | Question management, content protection, polish | $800 |
| M5 | Mobile optimization, landing page, QA, go-live | $500 |

### Option B: Reduced Fee + Revenue Share — $3,000 + 8% monthly gross revenue
- Revenue share capped at $12,000 total (max total cost = $15,000)
- Calculated monthly on subscription revenue only
- Reporting via shared Stripe dashboard
- Pauses if platform offline >48hrs due to developer fault

### Option C: Monthly SaaS License — $2,500 setup + $350/month
- Setup covers branding, configuration, initial deployment
- Monthly covers hosting, maintenance, updates, support
- Client can cancel monthly with 30 days notice
- Includes up to 4 hours/month of platform modifications

---

## Current Codebase Assessment

### Tech Stack
- Next.js 15.4.5, TypeScript, Tailwind CSS 4, React 19
- Client-side only, localStorage persistence
- No database, no auth, no payments

### What Exists
- Working exam engine: timer, scoring, timed mode, practice mode with immediate feedback
- Flashcard system: 35 cards, spaced repetition, bookmarks, search, filtering
- Progress tracking: analytics, study streak, achievements
- Study materials: 20 items across 5 sections, expandable, searchable
- Onboarding flow: 5-step wizard for new users
- 12 practice questions, all psychology-focused

### Reusability for White-Label
| Component | Reuse Level | Adaptation Needed |
|-----------|-------------|-------------------|
| PracticeQuestions.tsx | ~70% | Multi-section, server-side timer, save progress |
| Flashcards.tsx | ~80% | Connect to DB instead of localStorage |
| Progress.tsx | ~60% | Pull from DB, per-section analytics |
| StudyMaterials.tsx | ~70% | Connect to DB, tier gating |
| Navigation.tsx | ~50% | Auth state, subscription badge |
| Onboarding.tsx | ~30% | Replace with auth flow + subscription |
| Dashboard.tsx | ~60% | Live data, parent view |

---

## White-Label Gap Analysis (13 Gaps)

### Gap 1: Single-Page SPA with Fake Routing
Everything runs in one `page.tsx` with a `switch` statement on `currentPage`. No real URLs, no back button, no deep links. Need to convert to real Next.js App Router routes.

### Gap 2: All Content Hardcoded in Components
12 questions in PracticeQuestions.tsx, 35 flashcards in Flashcards.tsx, 20 materials in StudyMaterials.tsx. Psychology domains hardcoded. NSW needs READING, MATHEMATICAL_REASONING, THINKING_SKILLS. Must extract all content, make configurable.

### Gap 3: No Data Layer — localStorage Scattered Everywhere
Direct localStorage calls in page.tsx, Flashcards.tsx, Onboarding.tsx. No abstraction. Need a service layer that initially wraps localStorage, then swaps to API calls.

### Gap 4: Exam Engine is Single-Section Only
One timer, one question list, one answer array. NSW needs multi-section with independent timers, section transitions, question navigator grid.

### Gap 5: No Pause/Resume with Persistence
Timer is `setInterval` in React state only. Tab close = everything lost. Need save-to-database, resume from saved state, server-side time validation.

### Gap 6: No Authentication
No users, no sessions, no roles. Need NextAuth v5 with magic link (no passwords).

### Gap 7: No Database
Zero backend dependencies. Need Prisma + PostgreSQL.

### Gap 8: No Subscription/Payment System
No Stripe, no tiers, no paywall. Need Checkout, webhooks, tier gating, free trial.

### Gap 9: No Content Protection
All content in client bundle as JavaScript source. Need server-side question delivery, anti-copy CSS/JS, rate limiting.

### Gap 10: No Admin Panel
No way for client to upload/manage questions without editing code. Need question CRUD, CSV import, user management, analytics.

### Gap 11: No Tenant/Branding Configuration
App title still says "Create Next App". Colors hardcoded. No logo. Need env-driven tenant config with swappable branding.

### Gap 12: No API Routes
Zero files under `src/app/api/`. Need 10+ API route files for auth, Stripe, exams, questions, progress, admin.

### Gap 13: Type System Doesn't Match Target Domain
Types built around psychology domains. Need examType, section, accessTier, multi-part questions, subscription types.

### Build Order
1. Routing → 2. Tenant config + types → 3. Data layer → 4. Content extraction → 5. Database → 6. Auth → 7. API routes → 8. Subscriptions → 9. Exam engine → 10. Content protection → 11. Admin panel

---

## Maintenance: What $350/month Covers

### Weekly (30-60 min)
- Dependency updates (Next.js, Prisma, Stripe SDK, NextAuth)
- Stripe webhook monitoring for failed deliveries
- Database health checks (query performance, table sizes)

### Monthly (2-4 hours)
- Stripe pricing/plan changes per client requests
- Content upload support (CSV issues, LaTeX rendering, bulk operations)
- SSL/domain renewal reminders
- Vercel/Railway deployment monitoring

### Quarterly (4-8 hours)
- Next.js major version upgrades
- Security audit (npm audit, auth config review, admin route protection)
- Performance review (Lighthouse, Core Web Vitals)
- Database maintenance (VACUUM ANALYZE, archive old data)

### Seasonal (June-October exam season)
- Load testing before peak
- Uptime monitoring during peak
- Increased support volume (2-3 tickets/week)

### As-Needed
- Stripe API version deprecations (~annual)
- NextAuth breaking changes
- Browser compatibility fixes
- Client feature request scoping

### What's Maintenance vs Feature Request
**Included:** Dependency updates, security patches, bug fixes, uptime monitoring, webhook failures, DB maintenance, content upload support, browser compatibility
**Separate quote:** New features, new tiers, design changes, new exam types, mobile app, email automation, new analytics

---

## Hosting Decision

### Recommendation: Railway for first client, Coolify on Hetzner at 3+ clients

**Railway wins because:**
- Persistent Node.js process (no cold starts killing Stripe webhooks)
- Built-in PostgreSQL (same dashboard)
- $10-20/month total
- No serverless function timeouts (CSV import can take 30 seconds)
- Persistent searchable logs

**Vercel is fine but fights you:**
- Serverless cold starts break webhook handlers
- Vercel Postgres is Neon with a markup
- $20/month per deployment per client
- 10-second function timeout (60 on Pro)
- Data residency concerns (default Washington DC, not Sydney)

**Coolify on Hetzner ($6-12/month) when scaling:**
- Sydney datacenter (Australian data residency)
- All clients on one server
- No per-project fees
- You're the sysadmin though

---

## Security & Liability

### Children's Data
- Users are children aged 9-12. Heightened privacy obligations under Australian Privacy Act.
- Need privacy policy addressing children's data collection
- Need parental consent mechanism
- Need data retention policy and deletion capability

### Authentication: Magic Link (No Passwords)
- Eliminates password storage, brute force, credential stuffing, forgot-password flow entirely
- NextAuth v5 Email provider + Resend mail service
- "Remember this device" with 30-day session cookie eliminates friction for returning users

### Data Minimisation Strategy
1. Don't collect child's real name (use display nickname)
2. Don't collect child's email (parent email is the account)
3. Don't collect date of birth (exam type implies age range)
4. After this: database holds parent email, nickname, exam preference, performance data. Breach exposes almost nothing identifiable.

### Ephemeral Exam Details
- Keep detailed question-answer mapping for 90 days (student can review)
- After 90 days, collapse to aggregates (score, section breakdown, time, difficulty distribution)
- Delete individual Answer rows
- Full feedback available when it matters, reduced exposure long-term

### Australian Data Retention
- No general data retention law for SaaS platforms (telco metadata law doesn't apply)
- APP 11.2 requires you to DESTROY data you no longer need — hoarding is the violation
- 90-day detail retention + 12-month inactive account deletion is compliant
- Build "legal hold" flag for accounts exempted from auto-purge (subpoena scenario)
- State retention periods explicitly in privacy policy

### Automatic Data Expiry (Daily Cron)
- Delete accounts inactive 12 months
- Purge detailed exam answers older than 90 days (keep aggregates)
- Remove expired free trial accounts after 30 days inactivity
- Clear expired session tokens

### Content Protection Reality
- All client-side measures (user-select, right-click, print CSS) are bypassed in 10 seconds via DevTools
- Real defense: rate limiting + pagination (one question at a time, not bulk)
- Contract must state "reasonable measures, not bulletproof DRM"
- Client needs terms of service prohibiting redistribution (legal, not technical protection)

### Contract Must Include
1. You're a technology provider, not education provider (content accuracy is client's problem)
2. Reasonable security measures, not a guarantee
3. Content protection is best-effort
4. Uptime SLA with credit remedy (not refund)
5. Data processing agreement (you process on client's behalf only)
6. Client indemnifies you for content they upload
7. Liability cap at 12 months of fees paid

### Things You Haven't Thought About
- **Exam season DDoS:** 5-10x traffic spike June-October. Need auto-scaling plan.
- **Client wants analytics you haven't built:** Trial-to-paid conversion, question difficulty stats — build basic admin analytics in MVP.
- **Mobile Safari timer bug:** Screen lock suspends JavaScript. Timer drifts. Compare Date.now() on every tick, don't just decrement.
- **Parents will email you directly:** Contract must specify all support through client.
- **Question IP ownership:** Contract must state client owns all content, you own platform code.
- **GST:** If revenue exceeds $75K/year, must register and charge 10%. Talk to accountant.
- **Competitor clone problem:** Non-compete clause scope matters. Per-suburb? Per-state? Per-exam-type? Narrower = better for you.
- **Account sharing:** Parents share logins. One yearly sub serves five families. Concurrent session limiting is a post-launch enhancement, not MVP.

---

## AI Token Cost Estimate

**Total to build: $350-$800 in Claude API tokens**

Breakdown by gap: ~220-320 agent turns across routing, config, data layer, database, auth, API routes, Stripe, exam engine, content protection, admin panel, landing page, and polish.

Multiply by 1.5x for debugging loops and context window resets.

Biggest cost isn't tokens — it's your time reviewing and testing. Tokens are a rounding error compared to hours invested.

---

## Build Timeline

**5 weeks active build, 6 weeks client-facing timeline**

| Week | Focus |
|------|-------|
| 1 | Routing, tenant config, database, auth |
| 2 | Data layer, API routes, content extraction |
| 3 | Stripe subscriptions + exam engine rebuild (highest risk) |
| 4 | Admin panel + content protection |
| 5 | Landing page, branding, polish, mobile QA |
| 6 | Buffer for bugs, content delays, integration issues |

---

## Build Workflow

**Claude Code writes PRDs → Cursor agent builds to PRDs → Claude Code reviews against PRDs**

PRDs must be hyper-specific for AI agents: file paths, function names, data flow, which existing code to import. The more concrete, the less Cursor improvises.

Claude Code is reliable for: syntax errors, type mismatches, security vulnerabilities, logic consistency, code-vs-docs verification.

Claude Code can mislead on: third-party API behaviour (Stripe webhook shapes, NextAuth v5 specifics), subtle logic bugs (off-by-one, timezone, race conditions). Verify against official docs for critical integrations.

**Manual testing you can't skip:**
- Stripe full lifecycle (subscribe, cancel, resubscribe, payment failure, upgrade, downgrade)
- Full practice exam on a phone (background the app, check timer)
- Try to copy question text (right-click, Ctrl+A/C, print)
- Access yearly-tier questions as free trial user via direct URL

---

---

## Kolb Integration: Onboarding, Not Post-Test

### Decision: Kolb is the entry point, not a bolt-on

The Study Style Profile (Kolb-based, never branded as "Kolb") is the first thing a child does after account creation. 12 questions, 2-3 minutes. Every feature downstream reads from the stored learning style.

### Flow
1. Parent signs up, adds child profile
2. Child takes 12-question Study Style Profile
3. Platform knows the child's learning preference
4. All feedback, study tips, flashcard presentation, and weak area remediation adapt to their style

### Why 12 Questions (Not 4 or 24)
- 4 is too few for reliable classification
- 24 is too long for a 9-year-old's attention span
- 12 (3 per dimension) gives enough signal while keeping it under 3 minutes
- Kolb scoring algorithm already handles variable question counts

### Three-Tier Feedback (Prevents Filter Bubble)
- Tier 1 (60%): Primary recommendations matching dominant style
- Tier 2 (25%): Stretch activities from weakest dimension
- Tier 3 (15%): Meta-learning context + retake prompt after 30 days

---

## Architecture Decision: Fork from Kolb, Not Psych

The Kolb app has the backend infrastructure (Prisma, Stripe, API routes, UI components). The psych app has the exam engine logic. The Kolb app is the chassis; the exam engine gets rebuilt on top of it.

### Monorepo (Turborepo)
```
/packages/shared        — UI components, Kolb scoring, validation, rate limiting
/packages/exam-platform — the white-label exam app
/packages/kolb-app      — standalone Kolb assessment
```
Shared code changes propagate to both apps. No fork divergence.

### What Transfers from Where
| Piece | Source | Work |
|---|---|---|
| Database + ORM | Kolb | Extend schema |
| Auth (magic link) | New | Build on Kolb's User model |
| Stripe subscriptions | Kolb (adapt) | One-time to recurring |
| UI components | Kolb | Use as-is |
| Rate limiting, validation | Kolb | Use as-is |
| Email (Resend) | Kolb | Use as-is |
| Kolb assessment (12 Qs) | Kolb (trim) | Select 12 from 24, rewrite for kids |
| Style-specific feedback | New | Build 36-entry mapping |
| Exam engine | Psych (rewrite) | Rebuild with server-side data |
| Flashcard spaced repetition | Psych (rewrite) | Same algorithm, Prisma |
| Admin panel | New | Build using Kolb UI components |

---

## Risk Analysis: 13 Risks + Prevention

1. **Kolb on children** — Never brand as "Kolb." Call it "Study Style Profile." Rewrite for age group.
2. **Client has no questions ready** — CSV template in M1. M3 blocked until 100 questions delivered. Contract shifts timeline.
3. **Math notation admin nightmare** — Math template toolbar (buttons, not LaTeX). Complex expressions in setup fee.
4. **Image-based questions** — `questionImageUrl` + `optionImageUrls` in schema from day one. Image upload in admin.
5. **Mobile reading comprehension** — Split-pane desktop, slide-up panel mobile. Built in M3, not deferred.
6. **Free trial gaming** — Device fingerprinting. Trial limited to Easy/Tier 1 only.
7. **Timezone issues** — All UTC server-side. `timezone.ts` utility. Trial expiry in tenant timezone.
8. **Parent blames platform after real exam failure** — Three-layer disclaimers (results page, ToS, contract).
9. **Copyright on questions** — Client warrants originality, indemnifies developer. Timestamped checkbox on import.
10. **Second client wants un-abstracted features** — Configurability boundary defined. v1 scope fixed.
11. **Kolb filter bubble** — Three-tier feedback: 60% primary, 25% stretch, 15% meta-learning.
12. **Exam season cost spike** — Fixed $350/month absorbs variance. Auto-scaling pre-configured.
13. **Two codebases diverge** — Monorepo (Turborepo). Shared packages.

---

## Maintenance Approach

Key mitigations to reduce ongoing burden:
- Magic link auth eliminates password-related support entirely
- Admin panel with math template toolbar makes client self-sufficient for content
- Automatic data expiry (daily cron) eliminates manual database maintenance
- Dependabot/Renovate for automated dependency PRs
- UptimeRobot (free) for monitoring
- Sentry for error tracking
- Contract clearly defines maintenance vs feature requests (4 hrs/month cap on Option C)

---

## Next Steps

1. All docs updated to reflect Kolb-first architecture (done)
2. Show client MVP demo based on current psych app
3. Set up monorepo with shared packages from both apps
4. Write specific PRDs for each phase when ready to build
