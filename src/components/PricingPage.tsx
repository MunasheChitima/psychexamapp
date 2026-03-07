'use client'

import { useState, useMemo, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Check, Calendar, Clock, TrendingDown, Loader2, AlertCircle, Sparkles, RotateCcw, ShieldCheck, ArrowRight } from 'lucide-react'
import {
  getUpcomingSittings,
  getPricingTier,
  monthsUntilExam,
  daysUntilExam,
  calculateTotalCost,
  calculateResubscriptionRate,
  PRICING_TIERS,
  FAIL_DISCOUNT_PERCENT,
  type ExamSitting,
} from '@/lib/examSchedule'

const FEATURES = [
  'All 88+ practice questions across 4 domains',
  'All 103+ flashcards with spaced repetition',
  'Unlimited practice quizzes',
  'Full exam simulations under timed conditions',
  'Personalised weak-area study plans',
  'Detailed progress analytics',
  'Study materials and curated resources',
  'Domain-specific study paths',
]

interface PricingPageProps {
  onNavigate?: (page: string) => void
}

export default function PricingPage({ onNavigate }: PricingPageProps) {
  const { data: session } = useSession()
  const [selectedSitting, setSelectedSitting] = useState<ExamSitting | null>(null)
  const [useResitDiscount, setUseResitDiscount] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [hasApprovedFail, setHasApprovedFail] = useState(false)
  const [checkingEligibility, setCheckingEligibility] = useState(true)

  const upcomingSittings = useMemo(() => getUpcomingSittings(), [])

  useEffect(() => {
    if (!session?.user) {
      setCheckingEligibility(false)
      return
    }
    fetch('/api/exam-results')
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data) setHasApprovedFail(data.hasApprovedFail)
      })
      .catch(() => {})
      .finally(() => setCheckingEligibility(false))
  }, [session])

  const pricing = useMemo(() => {
    if (!selectedSitting) return null
    const { tier, months, total } = calculateTotalCost(selectedSitting.examStart)
    const days = daysUntilExam(selectedSitting.examStart)
    const resubRate = calculateResubscriptionRate(tier.monthlyRate)
    return { tier, months, total, days, resubRate, resubTotal: resubRate * months }
  }, [selectedSitting])

  const handleCheckout = async () => {
    if (!session) {
      window.location.href = '/signin'
      return
    }
    if (!selectedSitting) return

    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          examSittingId: selectedSitting.id,
          isResubscription: useResitDiscount && hasApprovedFail,
        }),
      })

      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        setError(data.error || 'Something went wrong')
      }
    } catch {
      setError('Failed to start checkout. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            Study Until Your Exam. Not a Day More.
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Pay $19/month or less until your AHPRA exam date. The earlier you start studying, the cheaper each month. Your subscription auto-expires on exam day.
          </p>
        </div>

        {/* Early bird pricing tiers */}
        <div className="bg-white rounded-2xl border shadow-sm p-6 mb-8">
          <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4 flex items-center gap-2">
            <TrendingDown className="w-4 h-4 text-green-600" />
            Early bird pricing - the sooner you start, the less you pay
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {PRICING_TIERS.map((tier) => (
              <div
                key={tier.id}
                className={`rounded-xl p-4 text-center border ${
                  pricing?.tier.id === tier.id
                    ? 'bg-blue-50 border-blue-300 ring-2 ring-blue-200'
                    : 'bg-gray-50 border-gray-200'
                }`}
              >
                <div className="text-2xl font-bold text-gray-900">${tier.monthlyRate}</div>
                <div className="text-xs text-gray-500">/month</div>
                <div className="text-xs font-medium text-gray-700 mt-1">{tier.label}</div>
                <div className="text-xs text-gray-500 mt-0.5">
                  {tier.minMonths === 0 ? '<2 months out' : `${tier.minMonths}+ months out`}
                </div>
                {tier.savings && (
                  <div className="text-xs font-semibold text-green-600 mt-1">{tier.savings}</div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step 1: Select exam sitting */}
        <div className="bg-white rounded-2xl border shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-1 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-600" />
            Step 1: Select your exam sitting
          </h2>
          <p className="text-sm text-gray-500 mb-4">AHPRA 2026 National Psychology Examination schedule</p>

          <div className="grid sm:grid-cols-2 gap-3">
            {upcomingSittings.map((sitting) => {
              const tier = getPricingTier(sitting.examStart)
              const months = monthsUntilExam(sitting.examStart)
              const days = daysUntilExam(sitting.examStart)
              const isSelected = selectedSitting?.id === sitting.id
              const isPast = days <= 0

              return (
                <button
                  key={sitting.id}
                  onClick={() => !isPast && setSelectedSitting(sitting)}
                  disabled={isPast}
                  className={`text-left p-4 rounded-xl border-2 transition-all ${
                    isPast
                      ? 'opacity-40 cursor-not-allowed border-gray-200 bg-gray-50'
                      : isSelected
                      ? 'border-blue-500 bg-blue-50 shadow-sm'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="font-semibold text-gray-900">{sitting.label}</div>
                    {!isPast && (
                      <span className="text-xs font-bold text-green-700 bg-green-100 px-2 py-0.5 rounded-full">
                        ${tier.monthlyRate}/mo
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-gray-500 space-y-0.5">
                    <div>Exam: {sitting.examStart} to {sitting.examEnd}</div>
                    <div>Registration: {sitting.registrationOpen} to {sitting.registrationClose}</div>
                    {!isPast && (
                      <div className="font-medium text-gray-700 mt-1">
                        {days} days away ({months} {months === 1 ? 'month' : 'months'})
                      </div>
                    )}
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Step 2: Review pricing */}
        {selectedSitting && pricing && (
          <div className="bg-white rounded-2xl border shadow-sm p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-600" />
              Step 2: Review your plan
            </h2>

            {/* Resit discount section */}
            {!checkingEligibility && (
              <div className="mb-6">
                {hasApprovedFail ? (
                  <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={useResitDiscount}
                        onChange={(e) => setUseResitDiscount(e.target.checked)}
                        className="w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500 mt-0.5"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <ShieldCheck className="w-4 h-4 text-purple-600" />
                          <span className="text-sm font-semibold text-purple-900">
                            Apply {FAIL_DISCOUNT_PERCENT}% resit discount
                          </span>
                        </div>
                        <p className="text-xs text-purple-700 mt-1">
                          Your previous exam result has been verified. This discount is applied to every monthly payment.
                        </p>
                      </div>
                    </label>
                  </div>
                ) : (
                  <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                    <div className="flex items-start gap-3">
                      <RotateCcw className="w-4 h-4 text-gray-500 mt-0.5 shrink-0" />
                      <div>
                        <p className="text-sm text-gray-700">
                          <strong>Retaking the exam?</strong> Submit your previous exam results to qualify for a {FAIL_DISCOUNT_PERCENT}% discount.
                        </p>
                        <button
                          onClick={() => onNavigate?.('submit-results')}
                          className="inline-flex items-center gap-1 text-sm text-blue-600 font-medium hover:text-blue-700 mt-2"
                        >
                          Submit your results <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="bg-gray-50 rounded-xl p-5 mb-6">
              <div className="flex items-baseline justify-between mb-3">
                <div>
                  <span className="text-3xl font-bold text-gray-900">
                    ${useResitDiscount && hasApprovedFail ? pricing.resubRate : pricing.tier.monthlyRate}
                  </span>
                  <span className="text-gray-500 ml-1">/month</span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900">
                    {pricing.tier.label} tier
                  </div>
                  {useResitDiscount && hasApprovedFail ? (
                    <div className="text-xs text-purple-600 font-semibold">{FAIL_DISCOUNT_PERCENT}% resit discount</div>
                  ) : pricing.tier.savings ? (
                    <div className="text-xs text-green-600 font-semibold">{pricing.tier.savings}</div>
                  ) : null}
                </div>
              </div>

              <div className="border-t border-gray-200 pt-3 space-y-2 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Billing duration</span>
                  <span>{pricing.months} {pricing.months === 1 ? 'month' : 'months'}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Auto-expires on</span>
                  <span className="font-medium">{selectedSitting.examStart}</span>
                </div>
                <div className="flex justify-between font-semibold text-gray-900 text-base pt-1 border-t border-gray-200">
                  <span>Estimated total</span>
                  <span>
                    ${useResitDiscount && hasApprovedFail
                      ? pricing.resubTotal.toFixed(0)
                      : pricing.total}
                  </span>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Full access includes:</h3>
              <ul className="grid sm:grid-cols-2 gap-2">
                {FEATURES.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm text-gray-600">
                    <Check className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            {error && (
              <div className="flex items-center gap-2 bg-red-50 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {error}
              </div>
            )}

            <button
              onClick={handleCheckout}
              disabled={loading}
              className="w-full bg-blue-600 text-white py-4 rounded-xl font-semibold text-base hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Setting up your plan...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  Start studying for ${useResitDiscount && hasApprovedFail ? pricing.resubRate : pricing.tier.monthlyRate}/month
                </span>
              )}
            </button>

            <p className="text-xs text-center text-gray-500 mt-3">
              Secure payment via Stripe. Auto-cancels on {selectedSitting.examStart}. No charges after your exam.
            </p>
          </div>
        )}

        {/* FAQ */}
        <div className="bg-white rounded-2xl border shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Common questions</h2>
          <div className="space-y-4 text-sm">
            <div>
              <h3 className="font-medium text-gray-900 mb-1">What happens when my exam date arrives?</h3>
              <p className="text-gray-600">Your subscription automatically expires on your exam start date. No action needed - you will never be charged after your exam.</p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 mb-1">How do I get the resit discount?</h3>
              <p className="text-gray-600">Go to &ldquo;Submit Results&rdquo; and provide your AHPRA candidate number and result notification details. Once we verify your result, the {FAIL_DISCOUNT_PERCENT}% discount is automatically unlocked on this page.</p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 mb-1">Why is it cheaper to start earlier?</h3>
              <p className="text-gray-600">Spaced practice over more time is more effective for exam preparation. We reward you with a lower monthly rate for giving yourself more study time.</p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 mb-1">Can I cancel early?</h3>
              <p className="text-gray-600">Yes, you can cancel anytime from your billing portal. However, the subscription is designed to run until your exam date for optimal preparation.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
