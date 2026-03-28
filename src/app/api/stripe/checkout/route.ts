import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { stripe } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'
import { getSittingById, getPriceQuote, monthsUntilExam, calculateResubscriptionTotal } from '@/lib/examSchedule'
import { getProductConfig } from '@/lib/productConfig'
import type { ProductLine } from '@/types'
import { dashboardPathForProductLine } from '@/lib/dashboardRoutes'

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id || !session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { examSittingId, isResubscription, productLine = 'psychology' } = await req.json()

    if (!examSittingId) {
      return NextResponse.json({ error: 'Please select an exam sitting' }, { status: 400 })
    }

    const sitting = getSittingById(examSittingId)
    if (!sitting) {
      return NextResponse.json({ error: 'Invalid exam sitting' }, { status: 400 })
    }

    const line = productLine as ProductLine
    const productConfig = getProductConfig(line)
    const quote = getPriceQuote(sitting.examStart)
    const months = monthsUntilExam(sitting.examStart)

    let amountToCharge = quote.total
    let verifiedResub = false

    if (isResubscription) {
      const approvedFail = await prisma.examResult.findFirst({
        where: {
          userId: session.user.id,
          status: 'approved',
          outcome: 'fail',
        },
      })

      if (!approvedFail) {
        return NextResponse.json(
          { error: 'Resit discount requires a verified failed exam result. Please submit your results first.' },
          { status: 403 }
        )
      }

      amountToCharge = calculateResubscriptionTotal(quote.total)
      verifiedResub = true
    }

    const unitAmountCents = Math.round(amountToCharge * 100)

    const checkoutSession = await stripe.checkout.sessions.create({
      customer_email: session.user.email,
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'aud',
            unit_amount: unitAmountCents,
            product_data: {
              name: `APRAcademy: ${productConfig.examName} - ${quote.tierLabel} - ${sitting.label}`,
              metadata: { examSittingId, tier: quote.tierId },
            },
          },
          quantity: 1,
        },
      ],
      metadata: {
        userId: session.user.id,
        examSittingId,
        examStartDate: sitting.examStart,
        examEndDate: sitting.examEnd,
        productLine,
        pricingTier: quote.tierId,
        amountPaid: amountToCharge.toString(),
        isResubscription: verifiedResub ? 'true' : 'false',
        totalMonths: months.toString(),
      },
      success_url: `${process.env.NEXTAUTH_URL}${dashboardPathForProductLine(line)}?payment=success&exam=${examSittingId}`,
      cancel_url: `${process.env.NEXTAUTH_URL}/pricing?exam=${examSittingId}`,
      allow_promotion_codes: true,
    })

    return NextResponse.json({
      url: checkoutSession.url,
      tier: quote.tierId,
      total: amountToCharge,
      months,
      expiresAt: sitting.examStart,
    })
  } catch (error) {
    console.error('Checkout error:', error)
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}
