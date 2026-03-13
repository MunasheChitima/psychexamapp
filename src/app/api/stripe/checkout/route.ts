import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { stripe } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'
import { getSittingById, getPricingTier, monthsUntilExam, calculateResubscriptionRate } from '@/lib/examSchedule'
import { BUDDY_HALF_OFF_COUPON_ID, getActiveBuddyPairByUserId } from '@/lib/buddy'

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id || !session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { examSittingId, isResubscription } = await req.json()

    if (!examSittingId) {
      return NextResponse.json({ error: 'Please select an exam sitting' }, { status: 400 })
    }

    const sitting = getSittingById(examSittingId)
    if (!sitting) {
      return NextResponse.json({ error: 'Invalid exam sitting' }, { status: 400 })
    }

    const tier = getPricingTier(sitting.examStart)
    const months = Math.max(1, monthsUntilExam(sitting.examStart))

    let monthlyRate = tier.monthlyRate
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

      monthlyRate = calculateResubscriptionRate(tier.monthlyRate)
      verifiedResub = true
    }

    const unitAmountCents = Math.round(monthlyRate * 100)

    const price = await stripe.prices.create({
      currency: 'aud',
      unit_amount: unitAmountCents,
      recurring: { interval: 'month' },
      product_data: {
        name: `APRAcademy: Psychology - ${tier.label} - ${sitting.label}`,
        metadata: { examSittingId, tier: tier.id },
      },
    })

    const buddyPair = await getActiveBuddyPairByUserId(session.user.id)
    const hasActiveHalfOff = Boolean(buddyPair?.halfOffActiveFrom)

    const checkoutSession = await stripe.checkout.sessions.create({
      customer_email: session.user.email,
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{ price: price.id, quantity: 1 }],
      subscription_data: {
        ...(hasActiveHalfOff ? { discounts: [{ coupon: BUDDY_HALF_OFF_COUPON_ID }] } : {}),
        metadata: {
          userId: session.user.id,
          examSittingId,
          examStartDate: sitting.examStart,
          examEndDate: sitting.examEnd,
          monthlyRate: monthlyRate.toString(),
          pricingTier: tier.id,
          isResubscription: verifiedResub ? 'true' : 'false',
          totalMonths: months.toString(),
        },
      },
      metadata: {
        userId: session.user.id,
        examSittingId,
        examStartDate: sitting.examStart,
      },
      success_url: `${process.env.NEXTAUTH_URL}/?payment=success&exam=${examSittingId}`,
      cancel_url: `${process.env.NEXTAUTH_URL}/pricing?exam=${examSittingId}`,
      allow_promotion_codes: true,
    })

    return NextResponse.json({
      url: checkoutSession.url,
      tier: tier.id,
      monthlyRate,
      months,
      total: monthlyRate * months,
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
