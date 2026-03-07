import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'
import Stripe from 'stripe'

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')

  if (!sig || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET)
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        const userId = session.metadata?.userId
        const examStartDate = session.metadata?.examStartDate

        if (userId && session.subscription) {
          const subId = session.subscription as string
          const sub = await stripe.subscriptions.retrieve(subId)
          const meta = sub.metadata

          // Auto-cancel the subscription on the exam start date
          if (examStartDate) {
            const cancelAt = Math.floor(new Date(examStartDate).getTime() / 1000)
            await stripe.subscriptions.update(subId, { cancel_at: cancelAt })
          }

          await prisma.subscription.upsert({
            where: { userId },
            update: {
              stripeCustomerId: session.customer as string,
              stripeSubscriptionId: subId,
              examSittingId: meta.examSittingId || '',
              examStartDate: meta.examStartDate || '',
              examEndDate: meta.examEndDate || '',
              monthlyRate: parseInt(meta.monthlyRate || '19'),
              pricingTier: meta.pricingTier || 'standard',
              status: 'active',
              isResubscription: meta.isResubscription === 'true',
              failDiscountApplied: meta.isResubscription === 'true',
              expiresAt: new Date(meta.examStartDate || Date.now()),
            },
            create: {
              userId,
              stripeCustomerId: session.customer as string,
              stripeSubscriptionId: subId,
              examSittingId: meta.examSittingId || '',
              examStartDate: meta.examStartDate || '',
              examEndDate: meta.examEndDate || '',
              monthlyRate: parseInt(meta.monthlyRate || '19'),
              pricingTier: meta.pricingTier || 'standard',
              status: 'active',
              isResubscription: meta.isResubscription === 'true',
              failDiscountApplied: meta.isResubscription === 'true',
              expiresAt: new Date(meta.examStartDate || Date.now()),
            },
          })

          await prisma.studyData.upsert({
            where: { userId },
            update: {
              examSittingId: meta.examSittingId || '',
              examDate: meta.examStartDate || '',
            },
            create: {
              userId,
              examSittingId: meta.examSittingId || '',
              examDate: meta.examStartDate || '',
            },
          })
        }
        break
      }
      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        const userId = subscription.metadata?.userId
        if (userId) {
          await prisma.subscription.update({
            where: { userId },
            data: { status: 'expired', cancelledAt: new Date() },
          })
        }
        break
      }
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription
        const userId = subscription.metadata?.userId
        if (userId) {
          const status = subscription.status === 'active' ? 'active'
            : subscription.status === 'canceled' ? 'expired'
            : subscription.status
          await prisma.subscription.update({
            where: { userId },
            data: { status },
          })
        }
        break
      }
    }
  } catch (error) {
    console.error('Webhook handler error:', error)
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 })
  }

  return NextResponse.json({ received: true })
}
