# Client Proposal: NSW OC & Selective Exam Prep Platform

## Project Summary

Build a modern, mobile-first web platform for NSW Opportunity Class and Selective High School exam practice. The platform includes timed practice exams, subscription-based access with tiered content, an admin panel for question management, and content protection measures.

## Positioning: White-Label License, Not Custom Development

This platform is built on a proven exam preparation engine (already in production for psychology exam prep). The client is licensing a configured and branded instance of the platform, not commissioning custom software from scratch.

**What this means for the client:**
- Lower cost than custom development
- Faster delivery (core engine already built and tested)
- Ongoing platform improvements benefit all licensees
- Battle-tested exam engine (timer, scoring, progress tracking)

**What the developer retains:**
- Ownership of the underlying platform IP
- Right to license the platform to other clients (non-competing markets)
- The client owns their branding assets and question content

## Pricing Options

### Option A: Fixed Fee (Simple)

**Total: $4,500 AUD**

| Milestone | Deliverable | Payment |
|-----------|-------------|---------|
| M1: Foundation | Auth, database, basic UI, deployment | $1,200 |
| M2: Subscriptions | Stripe integration, 4 tiers + trial | $1,000 |
| M3: Exam Engine | Timed exams, multi-section, pause/resume, results | $1,000 |
| M4: Admin + Protection | Question management, content protection, polish | $800 |
| M5: Launch | Mobile optimization, landing page, QA, go-live | $500 |

**Payment terms:** 50% of each milestone on start, 50% on delivery and approval.

### Option B: Reduced Fee + Revenue Share

**Upfront: $3,000 AUD + 8% of monthly gross revenue**

- Revenue share capped at $12,000 total (so max total cost = $15,000)
- Revenue share calculated monthly on subscription revenue only
- Reporting via shared Stripe dashboard
- Revenue share pauses if platform is offline for >48hrs due to developer fault

**Why this works for the client:** Lower upfront commitment while bootstrapping. Aligns developer incentive with platform success.

### Option C: Monthly SaaS License (White-Label)

**Setup: $2,500 AUD + $350/month ongoing**

- Setup covers branding, configuration, initial deployment
- Monthly fee covers hosting, maintenance, updates, support
- Client can cancel monthly with 30 days notice
- Includes up to 4 hours/month of platform modifications

**Why this works:** Lowest upfront cost. Predictable ongoing expense. Developer handles all technical operations.

## Scope of Work

### Included

- User registration and authentication (email + optional Google)
- 4 subscription tiers (Monthly, Quarterly, Half-Yearly, Yearly) with Stripe
- 7-day free trial with limited question access
- Timed practice exam engine with:
  - Multi-section support (Reading, Math, Thinking Skills)
  - Per-section timers
  - Pause/resume/save progress
  - Time extension option
  - Results with pass/fail per question and explanations
- Admin panel for question upload and management
- Bulk question import (CSV)
- Content protection (no right-click, no copy, no print, no download)
- Mobile-responsive design
- Student dashboard with progress analytics
- Landing page with pricing and features
- Deployment to production (Vercel)
- Domain configuration

### Not Included (Can Be Added)

| Feature | Estimated Additional Cost |
|---------|--------------------------|
| Parent dashboard with child monitoring | $800 |
| Custom mobile app (React Native) | $5,000-8,000 |
| Video lesson integration | $600 |
| Live chat / forum | $1,200 |
| Email marketing automation | $500 |
| Custom analytics dashboard | $800 |
| Multi-language support | $1,500 |

### Client Responsibilities

- Provide all question content in structured format (CSV template provided)
- Provide branding assets (logo, color preferences)
- Set subscription pricing
- Review and approve each milestone within 5 business days
- Delays in content delivery or approval do not affect payment schedule

## Timeline

| Week | Milestone |
|------|-----------|
| 1 | M1: Foundation (auth, database, UI shell) |
| 2 | M2: Stripe subscriptions + tiered access |
| 3 | M3: Exam engine with all features |
| 4 | M4: Admin panel + content protection |
| 5 | M5: Polish, mobile QA, launch |

**Total: 5 weeks from contract signing and first payment**

Assumes content (questions) is provided by end of Week 2 for integration.

## Technical Specifications

| Component | Technology |
|-----------|-----------|
| Frontend | Next.js 15 (React), TypeScript, Tailwind CSS |
| Backend | Next.js API Routes |
| Database | PostgreSQL (Vercel Postgres) |
| Auth | NextAuth.js v5 |
| Payments | Stripe |
| Hosting | Vercel (Australia region) |
| ORM | Prisma |

### Ongoing Costs (Client Pays)

| Service | Estimated Monthly Cost |
|---------|----------------------|
| Vercel Hosting (Pro) | ~$20 USD |
| Vercel Postgres | ~$10-25 USD |
| Stripe fees | 1.7% + $0.30 per transaction (Australian cards) |
| Domain | ~$15 AUD/year |
| Email (Resend) | Free tier (up to 100 emails/day) |

**Total estimated infrastructure: ~$35-50 USD/month**

## Warranty & Support

- 30 days post-launch bug fixes included at no extra cost
- Post-warranty support available at $60/hour or via Option C monthly license
- Platform updates (security patches, dependency updates) included in monthly license

## Non-Compete

- Developer will not license the platform to a direct competitor in the NSW OC/Selective exam prep market within the same geographic area
- Developer retains the right to license the platform in other education markets (other states, other exam types, other countries)

## Next Steps

1. Client selects pricing option (A, B, or C)
2. Contract signed with scope, timeline, and payment terms
3. Client provides branding assets and initial content requirements
4. Development begins on M1
