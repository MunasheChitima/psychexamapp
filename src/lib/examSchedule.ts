/**
 * Exam schedule — re-exports from @apracademy/core-domain.
 * Kept for backward compatibility with existing app imports.
 */
export type { ExamSitting, PricingTier, PriceQuote } from '@apracademy/contracts'

export {
  EXAM_SITTINGS_2026,
  getUpcomingSittings,
  getSittingById,
  monthsUntilExam,
  daysUntilExam,
  PRICING_TIERS,
  FAIL_DISCOUNT_PERCENT,
  getPriceQuote,
  calculateResubscriptionTotal,
  getPricingTier,
} from '@apracademy/core-domain'
