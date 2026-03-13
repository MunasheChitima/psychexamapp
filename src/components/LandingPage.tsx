'use client'

import Link from 'next/link'
import {
  BookOpen,
  Brain,
  Check,
  ChevronRight,
  Clock,
  FlaskConical,
  Sparkles,
  Target,
  Trophy,
  Users,
  Zap,
  BarChart3,
  Shield,
} from 'lucide-react'
import { getHomePageJsonLd, toJsonLdScript } from '@/lib/structuredData'

const FEATURES = [
  {
    icon: Brain,
    title: 'Adaptive Practice Questions',
    description:
      '1,493+ questions calibrated 40% harder than exam level with detailed explanations, clinical pearls, and APS Code references.',
  },
  {
    icon: Zap,
    title: 'Spaced Repetition Flashcards',
    description:
      '1,007+ flashcards using the SM-2 algorithm. The system adapts to your memory, surfacing cards right before you forget them.',
  },
  {
    icon: Target,
    title: 'Full Exam Simulations',
    description:
      'Timed practice under real exam conditions across all four NPPE domains with weighted question distribution.',
  },
  {
    icon: BarChart3,
    title: 'Progress Analytics',
    description:
      'Track readiness scores per domain, identify weak areas, and get personalised study plans that evolve as you improve.',
  },
  {
    icon: Users,
    title: 'Live Quiz & Study Buddies',
    description:
      'Challenge friends in real-time quiz sessions and unlock the Study Buddy Deal for discounted subscriptions.',
  },
  {
    icon: FlaskConical,
    title: 'Kolb Learning Styles',
    description:
      'Discover your learning style and receive tailored study recommendations based on your preferences.',
  },
]

const STEPS = [
  {
    number: '01',
    title: 'Choose your exam sitting',
    description: 'Select your upcoming AHPRA exam date. Your subscription auto-expires on exam day.',
  },
  {
    number: '02',
    title: 'Study with adaptive tools',
    description: 'Practice questions adapt to your level. Flashcards use spaced repetition. Simulations mirror the real exam.',
  },
  {
    number: '03',
    title: 'Track your readiness',
    description: 'Monitor domain-level progress, identify weak areas, and follow your personalised study plan.',
  },
  {
    number: '04',
    title: 'Walk in confident',
    description: 'By exam day, you\'ll have practised across all domains with content calibrated harder than the real exam.',
  },
]

const DOMAINS = [
  { name: 'Ethics', weight: '30%', color: 'bg-blue-500', description: 'APS Code, mandatory reporting, confidentiality, professional boundaries' },
  { name: 'Assessment', weight: '30%', color: 'bg-green-500', description: 'Psychometrics, DSM-5 diagnostics, risk assessment, cultural considerations' },
  { name: 'Interventions', weight: '30%', color: 'bg-purple-500', description: 'Evidence-based therapies, treatment planning, crisis response, supervision' },
  { name: 'Communication', weight: '10%', color: 'bg-orange-500', description: 'Report writing, inter-professional communication, telehealth, consent' },
]

const PRICING_PREVIEW = [
  { label: 'Early Bird', rate: 12, note: '6+ months out', savings: 'Save 37%' },
  { label: 'Standard', rate: 15, note: '4+ months out', savings: 'Save 21%' },
  { label: 'Focused', rate: 17, note: '2+ months out', savings: 'Save 11%' },
  { label: 'Last Minute', rate: 19, note: '<2 months out', savings: '' },
]

const INCLUDED = [
  '1,493+ practice questions across 4 domains',
  '1,007+ flashcards with spaced repetition',
  'Unlimited practice quizzes & exam simulations',
  'Personalised weak-area study plans',
  'Detailed progress analytics',
  'Premium study materials & resources',
  'Live quiz sessions with friends',
  'Study Buddy discounts',
]

export default function LandingPage() {
  const homepageJsonLd = toJsonLdScript(getHomePageJsonLd())

  return (
    <div className="min-h-[100dvh] bg-white">
      <script
        id="structured-data-homepage"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: homepageJsonLd }}
      />
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-100">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-4 sm:px-6 py-3">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-gray-900 text-lg">APRAcademy</span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/signin"
              className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors hidden sm:block"
            >
              Sign in
            </Link>
            <Link
              href="/signin"
              className="bg-blue-600 text-white text-sm font-semibold px-4 py-2 rounded-xl hover:bg-blue-700 transition-colors"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-indigo-50" />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 pt-16 pb-20 md:pt-24 md:pb-28">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 text-blue-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-6">
              <Sparkles className="w-3.5 h-3.5" />
              Built for the Australian National Psychology Exam
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight tracking-tight mb-5">
              Pass the NPPE with{' '}
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                confidence
              </span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-8 leading-relaxed">
              1,493+ practice questions and 1,007+ flashcards, calibrated harder than the real exam.
              Adaptive learning, spaced repetition, and full exam simulations — everything you need
              in one place.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/signin"
                className="w-full sm:w-auto bg-blue-600 text-white font-semibold px-8 py-3.5 rounded-xl hover:bg-blue-700 transition-all active:scale-[0.98] flex items-center justify-center gap-2 text-base"
              >
                Start Studying Today
                <ChevronRight className="w-4 h-4" />
              </Link>
              <Link
                href="/pricing"
                className="w-full sm:w-auto bg-white text-gray-700 font-semibold px-8 py-3.5 rounded-xl border border-gray-200 hover:bg-gray-50 transition-all flex items-center justify-center gap-2 text-base"
              >
                View Pricing
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="border-y border-gray-100 bg-gray-50/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 text-center">
            {[
              { value: '1,493+', label: 'Practice Questions' },
              { value: '1,007+', label: 'Flashcards' },
              { value: '4', label: 'NPPE Domains' },
              { value: '$12/mo', label: 'From' },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="text-2xl md:text-3xl font-extrabold text-gray-900">{stat.value}</div>
                <div className="text-sm text-gray-500 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 md:py-24 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
              Everything you need to prepare
            </h2>
            <p className="text-gray-600 max-w-xl mx-auto">
              Purpose-built study tools aligned to the NPPE blueprint, with content
              reviewed for Australian regulatory context.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((feature) => (
              <div
                key={feature.title}
                className="bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-lg hover:border-gray-200 transition-all"
              >
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center mb-4">
                  <feature.icon className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Domain Coverage */}
      <section className="py-16 md:py-24 px-4 sm:px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
              Aligned to the NPPE blueprint
            </h2>
            <p className="text-gray-600 max-w-xl mx-auto">
              Questions and flashcards are weighted to match the official exam domain distribution.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 gap-4 max-w-3xl mx-auto">
            {DOMAINS.map((domain) => (
              <div key={domain.name} className="bg-white rounded-2xl border border-gray-100 p-5">
                <div className="flex items-center gap-3 mb-2">
                  <div className={`w-3 h-3 rounded-full ${domain.color}`} />
                  <span className="font-semibold text-gray-900">{domain.name}</span>
                  <span className="ml-auto text-sm font-bold text-gray-500">{domain.weight}</span>
                </div>
                <p className="text-sm text-gray-600">{domain.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 md:py-24 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">How it works</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {STEPS.map((step) => (
              <div key={step.number} className="text-center">
                <div className="text-3xl font-extrabold text-blue-100 mb-3">{step.number}</div>
                <h3 className="font-semibold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-sm text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-16 md:py-24 px-4 sm:px-6 bg-gray-50 scroll-mt-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
              Study until your exam. Not a day more.
            </h2>
            <p className="text-gray-600 max-w-xl mx-auto">
              The earlier you start, the cheaper each month. Your subscription auto-expires on
              your exam date — no action needed, no charges after.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
            {PRICING_PREVIEW.map((tier) => (
              <div
                key={tier.label}
                className="bg-white rounded-xl border border-gray-200 p-4 text-center"
              >
                <div className="text-2xl font-bold text-gray-900">${tier.rate}</div>
                <div className="text-xs text-gray-500">/month</div>
                <div className="text-xs font-medium text-gray-700 mt-1">{tier.label}</div>
                <div className="text-xs text-gray-500 mt-0.5">{tier.note}</div>
                {tier.savings && (
                  <div className="text-xs font-semibold text-green-600 mt-1">{tier.savings}</div>
                )}
              </div>
            ))}
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-6 md:p-8">
            <h3 className="font-semibold text-gray-900 mb-4">Full access includes:</h3>
            <ul className="grid sm:grid-cols-2 gap-2.5 mb-6">
              {INCLUDED.map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-gray-700">
                  <Check className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                  {item}
                </li>
              ))}
            </ul>
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <Link
                href="/signin"
                className="w-full sm:w-auto bg-blue-600 text-white font-semibold px-8 py-3.5 rounded-xl hover:bg-blue-700 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
              >
                <Sparkles className="w-5 h-5" />
                Start Studying Today
              </Link>
              <p className="text-xs text-gray-500">Secure payment via Stripe. Cancel anytime.</p>
            </div>
          </div>

          {/* Resit guarantee */}
          <div className="mt-6 bg-white rounded-2xl border border-gray-200 p-5 flex items-start gap-4">
            <Shield className="w-6 h-6 text-purple-600 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">75% resit discount</h3>
              <p className="text-sm text-gray-600">
                Didn&apos;t pass last time? Submit your previous exam results for verification and
                get 75% off your next subscription period. We want you to succeed.
              </p>
            </div>
          </div>

          {/* Buddy deal */}
          <div className="mt-4 bg-white rounded-2xl border border-gray-200 p-5 flex items-start gap-4">
            <Users className="w-6 h-6 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Study Buddy Deal</h3>
              <p className="text-sm text-gray-600">
                Invite a friend within 3 days of signing up. Once both subscriptions are active,
                the next month is free for both of you — then every month after is half price.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 md:py-24 px-4 sm:px-6">
        <div className="max-w-2xl mx-auto text-center">
          <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Trophy className="w-7 h-7 text-white" />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            Ready to start preparing?
          </h2>
          <p className="text-gray-600 mb-8">
            Join psychology registrars across Australia using APRAcademy to prepare for the NPPE.
            Start with a free account to explore the platform.
          </p>
          <Link
            href="/signin"
            className="inline-flex items-center gap-2 bg-blue-600 text-white font-semibold px-8 py-3.5 rounded-xl hover:bg-blue-700 transition-all active:scale-[0.98] text-base"
          >
            Create Free Account
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-8 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-blue-600 rounded-lg flex items-center justify-center">
              <BookOpen className="w-3.5 h-3.5 text-white" />
            </div>
            <span>&copy; {new Date().getFullYear()} APRAcademy</span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/terms" className="hover:text-gray-900 transition-colors">
              Terms of Service
            </Link>
            <Link href="/privacy" className="hover:text-gray-900 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/signin" className="hover:text-gray-900 transition-colors">
              Sign In
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
