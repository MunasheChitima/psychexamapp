# NSW OC & Selective Exam Prep - Client Specification

## Client Brief Summary

Build a website for Opportunity Class (OC) and Selective High School exam practice materials for students in New South Wales, Australia. The site serves parents purchasing subscriptions for their children (Years 4-6 typically).

## Exam Structure

### OC Test (Opportunity Class Placement Test)

For entry into Year 5 Opportunity Classes.

| Section | Questions | Time | Type |
|---------|-----------|------|------|
| Reading Comprehension | 40 | 30 min | Multiple-choice |
| Mathematical Reasoning | 35 | 40 min | Multiple-choice |
| Thinking Skills | 40 | 40 min | Multiple-choice |

**Total:** 115 questions, 110 minutes

### Selective High School Test

For entry into Year 7 Selective High Schools.

| Section | Questions | Time | Type |
|---------|-----------|------|------|
| Reading Test | 17 (3 questions have multiple parts) | 45 min | Multiple-choice |
| Mathematical Reasoning Test | 35 | 40 min | Multiple-choice |
| Thinking Skills Test | 40 | 40 min | Multiple-choice |

**Total:** 92+ questions, 125 minutes

### Key Differences Between OC and Selective

- OC is for younger students (Year 4 sitting for Year 5 placement)
- Selective is for older students (Year 6 sitting for Year 7 placement)
- Selective Reading has fewer but more complex questions with multi-part answers
- Mathematical Reasoning is the same format for both
- Thinking Skills is the same format for both
- Content difficulty scales appropriately for each age group

## Functional Requirements

### FR-0: Study Style Onboarding (Differentiator)
- Child's first action is a 12-question "Study Style Profile" (2-3 minutes)
- Determines learning preference (4 types: hands-on, visual, analytical, social)
- All subsequent feedback, study tips, and recommendations adapt to their style
- Optional retake after 30 days to track shifts
- NOT branded as "Kolb" — called "Study Style Profile" or "Learning Preference Quiz"
- Questions reworded for ages 9-12 reading level

### FR-1: User Authentication
- Magic link authentication (no passwords)
- Parent creates account via email, receives login link
- Parent adds child profiles (display nickname only, no real name required)
- 30-day "remember this device" session
- No password storage, no password reset flow needed

### FR-2: Subscription System
| Tier | Access Level | Trial |
|------|-------------|-------|
| Free Trial | Limited questions (7 days) | Auto-expires |
| Monthly | ~40% of question bank | - |
| Quarterly | ~60% of question bank | - |
| Half-Yearly | ~80% of question bank | - |
| Yearly | 100% of question bank | - |

- Stripe payment processing
- Auto-renewal with email reminders before charge
- Cancel anytime, access continues until period ends
- Upgrade/downgrade between tiers
- Client sets specific pricing for each tier

### FR-3: Practice Exam Engine
- **Start exam:** Select OC or Selective, then specific section or full exam
- **Timer:** Countdown per section with visual indicator
- **Extend time:** Option to add extra time (configurable by admin)
- **Pause/Save:** Save progress and resume later
- **Navigation:** Move between questions within a section, flag for review
- **Submit:** Manual submit or auto-submit when time expires
- **Results:** Show score, pass/fail per question, correct answers with explanations
- **History:** View all past attempts with comparison

### FR-4: Content Protection
- Questions rendered as styled HTML text (not images)
- Right-click disabled on exam pages
- Text selection disabled on question content
- Print stylesheet hides question content
- No download/export of questions
- Questions fetched from server per-page (not bulk loaded)

### FR-5: Content Management (Admin)
- Client uploads questions and answers
- Support for: plain text, formatted text (bold, italic, lists), mathematical notation
- Bulk import via CSV/Excel
- Tag questions by: exam type (OC/Selective), section, difficulty, access tier
- Preview as student before publishing
- Edit/archive/delete questions

### FR-6: Student Dashboard
- Current subscription status and tier
- Practice exam history with scores
- Progress by section (Reading, Math, Thinking Skills)
- Weak area identification
- Recommended practice areas
- Countdown to exam date

### FR-7: Parent Dashboard (Stretch Goal)
- View child's progress and scores
- Manage subscription
- Multiple children per account

### FR-8: Mobile Responsiveness
- Fully responsive design (mobile-first)
- Touch-friendly exam interface
- Works on tablets (common for student use)

## Non-Functional Requirements

- **Performance:** Page load under 2 seconds on 4G
- **Availability:** 99.9% uptime (Vercel handles this)
- **Scalability:** Handle 1,000+ concurrent users during peak exam prep season (Aug-Oct)
- **Data Privacy:** Comply with Australian Privacy Act, especially regarding children's data
- **Browser Support:** Chrome, Safari, Firefox, Edge (latest 2 versions)

## Competitive Analysis

### Reference Sites

| Site | Strengths | Weaknesses |
|------|-----------|------------|
| braintreecoaching.com.au | Established brand, comprehensive content | Dated design, slow, poor mobile experience |
| notesedu.com.au | Good content organisation | Cluttered UI, not intuitive |
| oztests.com.au | Large question bank | Very dated design, poor UX |

### Differentiators for This Build

1. **Personalised learning** — Study Style Profile adapts all feedback to how the child actually learns. No competitor does this.
2. **Modern, fast UI** — None of the competitors have a genuinely modern web experience
3. **Mobile-first design** — Students increasingly use tablets; competitors are desktop-oriented
4. **Parent analytics dashboard** — Parents are the buyers; give them visibility into progress
5. **Smooth exam experience** — Pause/resume, clean timer UI, question flagging
6. **Performance analytics** — Show improvement over time, identify weak areas by section
7. **Style-specific remediation** — Weak area advice differs based on learning preference, not generic "practice more"

## Content Delivery Plan

- Client provides all question content (text format)
- CSV template with exact columns provided during Milestone 1
- **Hard dependency: Minimum 100 questions in correct CSV format required before Milestone 3 begins**
- Delays in content delivery shift timeline by equivalent business days (in contract)
- Minimum viable launch: 50 questions per section per exam type (300 total)
- Full platform: 200+ questions per section (1,200+ total)
- Content updates are ongoing — admin panel must be self-service
- Math questions use visual template builder in admin (no LaTeX knowledge required)
- Image-based questions (geometry, diagrams) supported via image upload in admin panel

## Question Image Support

Some OC/Selective questions require visual elements:
- Geometry diagrams, shape patterns, number lines
- Answer options that are images (e.g., "which shape comes next?")
- Question model includes `questionImageUrl` and `optionImageUrls` fields
- Admin panel supports image upload per question and per option
- Images stored in S3/Vercel Blob, served via CDN

## Reading Comprehension UX

- Desktop/tablet (>768px): Split-pane view — passage pinned left, questions scroll right
- Mobile (<768px): Sticky "View Passage" button, slide-up panel (75% screen height)
- Passage and question never require scrolling between them during timed exam
- Built during Milestone 3 (exam engine), not deferred to polish phase

## User Journeys

### Journey 1: New Parent Sign-Up
1. Land on homepage (marketing page with features, pricing, sample questions)
2. Click "Start Free Trial"
3. Enter email, receive magic link, click to authenticate
4. Add child profile (display nickname, exam type: OC or Selective)
5. Child takes 12-question Study Style Profile (2-3 minutes)
6. Platform shows learning preference result with "Start Practicing" CTA
7. Access limited question bank (Easy difficulty, Tier 1 only) for 7 days
8. Prompted to subscribe before trial expires

### Journey 2: Student Takes Practice Exam
1. Log in to dashboard
2. Select "Practice Exams"
3. Choose exam type (OC or Selective)
4. Choose section (Reading, Math, Thinking Skills) or Full Exam
5. See instructions and timer preview
6. Start exam — timer begins
7. Answer questions, navigate between them, flag for review
8. Option to pause and save progress
9. Submit or auto-submit when time expires
10. View results: score, breakdown per question, explanations

### Journey 3: Parent Checks Progress
1. Log in to parent dashboard
2. See child's recent activity
3. View score trends over time
4. See weak areas flagged
5. Manage subscription (upgrade/cancel)

## Mathematical Notation Requirements

Some math questions require:
- Fractions
- Exponents
- Geometric shapes/diagrams (as SVG or HTML/CSS)
- Number lines
- Tables and grids
- Basic algebra notation

**Approach:** Use KaTeX or MathJax for mathematical rendering. Store notation in LaTeX format in the database.

## Milestones (Suggested)

| Milestone | Deliverables |
|-----------|-------------|
| M1: Foundation | Auth, user registration, basic UI shell, database schema |
| M2: Subscription | Stripe integration, 4 tiers + trial, tier-gated access |
| M3: Exam Engine | Timed exams, multi-section, pause/resume, results |
| M4: Admin Panel | Question upload, bulk import, content management |
| M5: Content Protection | Anti-copy measures, server-side question delivery |
| M6: Polish & Launch | Mobile optimization, analytics dashboard, landing page, deployment |
