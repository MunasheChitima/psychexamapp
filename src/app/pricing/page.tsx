import type { Metadata } from 'next'
import PricingPage from '@/components/PricingPage'
import { FAIL_DISCOUNT_PERCENT } from '@/lib/examSchedule'
import { getPricingFaqJsonLd, toJsonLdScript } from '@/lib/structuredData'

export const metadata: Metadata = {
  title: 'Pricing',
  description:
    'APRAcademy pricing for NPPE prep. Start early from $12/month with exam-date auto-expiry and secure Stripe checkout.',
  alternates: {
    canonical: '/pricing',
  },
}

export default function PricingRoutePage() {
  const pricingFaqJsonLd = toJsonLdScript(getPricingFaqJsonLd(FAIL_DISCOUNT_PERCENT))

  return (
    <>
      <script
        id="structured-data-pricing-faq"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: pricingFaqJsonLd }}
      />
      <PricingPage />
    </>
  )
}
