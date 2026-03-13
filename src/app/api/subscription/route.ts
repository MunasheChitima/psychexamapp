import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import type { NextRequest } from 'next/server'

const ACTIVE_STATUSES = new Set(['active', 'trialing'])

export async function GET(req: NextRequest) {
  const session = await auth(req)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const subscription = await prisma.subscription.findUnique({
      where: { userId: session.user.id },
    })

    if (!subscription) {
      return NextResponse.json({ subscription: null, active: false })
    }

    const isNotExpired = !subscription.expiresAt || new Date(subscription.expiresAt) > new Date()
    const active = ACTIVE_STATUSES.has(subscription.status) && isNotExpired

    return NextResponse.json({
      active,
      subscription: {
        id: subscription.id,
        status: subscription.status,
        pricingTier: subscription.pricingTier,
        expiresAt: subscription.expiresAt,
        stripeCustomerId: subscription.stripeCustomerId,
        monthlyRate: subscription.monthlyRate,
        examSittingId: subscription.examSittingId,
        isResubscription: subscription.isResubscription,
        failDiscountApplied: subscription.failDiscountApplied,
      },
    })
  } catch (error) {
    console.error('Subscription fetch error:', error)
    return NextResponse.json({ error: 'Failed to fetch subscription' }, { status: 500 })
  }
}
