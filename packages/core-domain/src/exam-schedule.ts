import type { ExamSitting, PricingTier, PriceQuote } from '@apracademy/contracts'

export const EXAM_SITTINGS_2026: ExamSitting[] = [
  {
    id: '2026-feb',
    label: 'February 2026',
    examStart: '2026-02-02',
    examEnd: '2026-02-20',
    registrationOpen: '2025-12-09',
    registrationClose: '2026-01-16',
  },
  {
    id: '2026-may',
    label: 'May 2026',
    examStart: '2026-05-04',
    examEnd: '2026-05-22',
    registrationOpen: '2026-03-10',
    registrationClose: '2026-04-17',
  },
  {
    id: '2026-aug',
    label: 'August 2026',
    examStart: '2026-08-03',
    examEnd: '2026-08-21',
    registrationOpen: '2026-06-09',
    registrationClose: '2026-07-17',
  },
  {
    id: '2026-nov',
    label: 'November 2026',
    examStart: '2026-11-02',
    examEnd: '2026-11-27',
    registrationOpen: '2026-09-08',
    registrationClose: '2026-10-16',
  },
]

export function getUpcomingSittings(): ExamSitting[] {
  const today = new Date().toISOString().split('T')[0]
  return EXAM_SITTINGS_2026.filter(s => s.examEnd >= today)
}

export function getSittingById(id: string): ExamSitting | undefined {
  return EXAM_SITTINGS_2026.find(s => s.id === id)
}

export function monthsUntilExam(examStart: string): number {
  const now = new Date()
  const exam = new Date(examStart)
  const diffMs = exam.getTime() - now.getTime()
  return Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24 * 30.44)))
}

export function daysUntilExam(examStart: string): number {
  const now = new Date()
  const exam = new Date(examStart)
  return Math.max(0, Math.ceil((exam.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)))
}

export const PRICING_TIERS: PricingTier[] = [
  { id: 'early-bird', label: 'Early Bird', total: 49, minMonths: 5, savings: 'Save $20' },
  { id: 'standard', label: 'Standard', total: 59, minMonths: 3, savings: 'Save $10' },
  { id: 'last-minute', label: 'Last Minute', total: 69, minMonths: 1, savings: '' },
]

export const FAIL_DISCOUNT_PERCENT = 75

export function getPriceQuote(examStart: string, options?: { saleActive?: boolean }): PriceQuote {
  const months = Math.max(1, monthsUntilExam(examStart))
  const useSale = options?.saleActive ?? false

  if (useSale) {
    if (months >= 5) {
      return { tierId: 'early-bird', tierLabel: 'Early Bird', total: 24.5, months }
    }
    return { tierId: 'standard', tierLabel: 'Standard', total: 55, months }
  }

  for (const tier of PRICING_TIERS) {
    if (months >= tier.minMonths) {
      return { tierId: tier.id, tierLabel: tier.label, total: tier.total, months }
    }
  }
  const last = PRICING_TIERS[PRICING_TIERS.length - 1]
  return { tierId: last.id, tierLabel: last.label, total: last.total, months }
}

export function calculateResubscriptionTotal(total: number): number {
  return Math.round(total * (1 - FAIL_DISCOUNT_PERCENT / 100) * 100) / 100
}

export function getPricingTier(examStart: string): PricingTier {
  const months = monthsUntilExam(examStart)
  for (const tier of PRICING_TIERS) {
    if (months >= tier.minMonths) return tier
  }
  return PRICING_TIERS[PRICING_TIERS.length - 1]
}
