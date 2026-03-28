import type { Metadata } from 'next'
import PricingPage from '@/components/PricingPage'
import { FAIL_DISCOUNT_PERCENT } from '@/lib/examSchedule'
import { getPricingFaqJsonLd, toJsonLdScript } from '@/lib/structuredData'
import type { ProductLine } from '@/types'

export const metadata: Metadata = {
  title: 'Pricing',
  description:
    'APRAcademy pricing for NPPE and nursing prep. From $49 one-time. Pay once, full access until your exam date. Secure Stripe checkout.',
  alternates: {
    canonical: '/pricing',
    languages: {
      'en-AU': '/pricing',
    },
  },
}

export default async function PricingRoutePage({
  searchParams,
}: {
  searchParams: Promise<{ product?: string }>
}) {
  const params = await searchParams
  const product = (params?.product ?? 'psychology').toLowerCase()
  const productLine: ProductLine = product === 'nursing' ? 'nursing' : 'psychology'

  const pricingFaqJsonLd = toJsonLdScript(getPricingFaqJsonLd(FAIL_DISCOUNT_PERCENT))

  return (
    <>
      <script
        id="structured-data-pricing-faq"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: pricingFaqJsonLd }}
      />
      <PricingPage productLine={productLine} />
    </>
  )
}
