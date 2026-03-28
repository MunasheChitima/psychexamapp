import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'
import Stripe from 'stripe'
import { BUDDY_FREE_MONTH_COUPON_ID, BUDDY_HALF_OFF_COUPON_ID, getActiveBuddyPairByUserId } from '@/lib/buddy'
import {
  sendPaymentFailedEmail,
  sendSubscriptionCancelledEmail,
  sendSubscriptionConfirmationEmail,
} from '@/lib/email'
import { getSittingById, PRICING_TIERS } from '@/lib/examSchedule'

const ACTIVE_STATUSES = new Set(['active', 'trialing'])

async function applyCouponToSubscription(subscriptionId: string, couponId: string) {
  await stripe.subscriptions.update(subscriptionId, {
    discounts: [{ coupon: couponId }],
  })
}

async function clearCouponFromSubscription(subscriptionId: string) {
  await stripe.subscriptions.update(subscriptionId, {
    discounts: [],
  })
}

async function getStripeSubscriptionIdByUserId(userId: string) {
  const subscription = await prisma.subscription.findUnique({
    where: { userId },
    select: { stripeSubscriptionId: true, status: true },
  })

  if (!subscription?.stripeSubscriptionId) return null
  if (!ACTIVE_STATUSES.has(subscription.status)) return null
  return subscription.stripeSubscriptionId
}

async function tryCreateOrActivateBuddyPair(userId: string) {
  const redeemed = await prisma.referralCode.findUnique({
    where: { redeemedBy: userId },
  })

  if (!redeemed) return

  const inviterUserId = redeemed.ownerUserId
  const inviteeUserId = userId

  const [inviterSubId, inviteeSubId] = await Promise.all([
    getStripeSubscriptionIdByUserId(inviterUserId),
    getStripeSubscriptionIdByUserId(inviteeUserId),
  ])

  if (!inviterSubId || !inviteeSubId) return

  const pair = await prisma.buddyPair.upsert({
    where: {
      inviterUserId_inviteeUserId: { inviterUserId, inviteeUserId },
    },
    update: {
      status: 'active',
      dissolvedAt: null,
    },
    create: {
      inviterUserId,
      inviteeUserId,
      status: 'active',
    },
  })

  if (!pair.freeMonthAppliedAt) {
    await Promise.all([
      applyCouponToSubscription(inviterSubId, BUDDY_FREE_MONTH_COUPON_ID),
      applyCouponToSubscription(inviteeSubId, BUDDY_FREE_MONTH_COUPON_ID),
    ])

    await prisma.buddyPair.update({
      where: { id: pair.id },
      data: { freeMonthAppliedAt: new Date() },
    })
  }
}

async function maybeActivateHalfOff(invoice: Stripe.Invoice) {
  const invoiceSubscription = invoice.parent?.subscription_details?.subscription
  const stripeSubscriptionId = typeof invoiceSubscription === 'string'
    ? invoiceSubscription
    : invoiceSubscription?.id
  if (!stripeSubscriptionId || invoice.amount_paid !== 0) return

  const dbSub = await prisma.subscription.findFirst({
    where: { stripeSubscriptionId },
    select: { userId: true },
  })
  if (!dbSub?.userId) return

  const pair = await getActiveBuddyPairByUserId(dbSub.userId)
  if (!pair || !pair.freeMonthAppliedAt || pair.halfOffActiveFrom) return

  const [inviterSubId, inviteeSubId] = await Promise.all([
    getStripeSubscriptionIdByUserId(pair.inviterUserId),
    getStripeSubscriptionIdByUserId(pair.inviteeUserId),
  ])
  if (!inviterSubId || !inviteeSubId) return

  await Promise.all([
    applyCouponToSubscription(inviterSubId, BUDDY_HALF_OFF_COUPON_ID),
    applyCouponToSubscription(inviteeSubId, BUDDY_HALF_OFF_COUPON_ID),
  ])

  await prisma.buddyPair.update({
    where: { id: pair.id },
    data: { halfOffActiveFrom: new Date() },
  })
}

async function dissolveBuddyPairForUser(userId: string) {
  const pair = await getActiveBuddyPairByUserId(userId)
  if (!pair) return

  const partnerUserId = pair.inviterUserId === userId ? pair.inviteeUserId : pair.inviterUserId
  const partnerSubId = await getStripeSubscriptionIdByUserId(partnerUserId)
  if (partnerSubId) {
    await clearCouponFromSubscription(partnerSubId)
  }

  await prisma.buddyPair.update({
    where: { id: pair.id },
    data: { status: 'dissolved', dissolvedAt: new Date() },
  })
}

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

  let claimedEvent = false
  try {
    await prisma.stripeProcessedEvent.create({ data: { id: event.id } })
    claimedEvent = true
  } catch (err: unknown) {
    const code = err && typeof err === 'object' && 'code' in err ? (err as { code: string }).code : ''
    if (code === 'P2002') {
      return NextResponse.json({ received: true, duplicate: true })
    }
    console.error('Stripe webhook idempotency claim failed:', err)
    return NextResponse.json({ error: 'Could not record event' }, { status: 500 })
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        const userId = session.metadata?.userId
        const examStartDate = session.metadata?.examStartDate

        if (!userId) break

        if (session.mode === 'payment' && session.payment_status === 'paid') {
          const meta = session.metadata || {}
          const subscriptionData = {
            stripeCustomerId: (session.customer as string) || null,
            stripeSubscriptionId: null,
            examSittingId: meta.examSittingId || '',
            examStartDate: meta.examStartDate || '',
            examEndDate: meta.examEndDate || '',
            monthlyRate: parseFloat(meta.amountPaid || '49'),
            pricingTier: meta.pricingTier || 'early-bird',
            status: 'active',
            isResubscription: meta.isResubscription === 'true',
            failDiscountApplied: meta.isResubscription === 'true',
            expiresAt: new Date(meta.examStartDate || Date.now()),
          }

          await prisma.$transaction([
            prisma.subscription.upsert({
              where: { userId },
              update: subscriptionData,
              create: { userId, ...subscriptionData },
            }),
            prisma.studyData.upsert({
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
            }),
          ])

          const sitting = getSittingById(meta.examSittingId || '')
          const tier = PRICING_TIERS.find((t) => t.id === (meta.pricingTier || ''))
          if (sitting && tier) {
            const user = await prisma.user.findUnique({
              where: { id: userId },
              select: { email: true, name: true },
            })
            if (user?.email) {
              sendSubscriptionConfirmationEmail({
                id: userId,
                email: user.email,
                name: user.name,
                sitting,
                tier,
                amountPaid: parseFloat(meta.amountPaid || '49'),
                months: parseInt(meta.totalMonths || '1', 10),
                isResubscription: meta.isResubscription === 'true',
              }).catch((err) =>
                console.error('Subscription confirmation email failed:', err)
              )
            }
          }
        } else if (session.subscription) {
          const subId = session.subscription as string
          const sub = await stripe.subscriptions.retrieve(subId)
          const meta = sub.metadata

          if (examStartDate) {
            const cancelAt = Math.floor(new Date(examStartDate).getTime() / 1000)
            await stripe.subscriptions.update(subId, { cancel_at: cancelAt })
          }

          const subscriptionData = {
            stripeCustomerId: session.customer as string,
            stripeSubscriptionId: subId,
            examSittingId: meta.examSittingId || '',
            examStartDate: meta.examStartDate || '',
            examEndDate: meta.examEndDate || '',
            monthlyRate: parseFloat(meta.monthlyRate || '19'),
            pricingTier: meta.pricingTier || 'standard',
            status: 'active',
            isResubscription: meta.isResubscription === 'true',
            failDiscountApplied: meta.isResubscription === 'true',
            expiresAt: new Date(meta.examStartDate || Date.now()),
          }

          await prisma.$transaction([
            prisma.subscription.upsert({
              where: { userId },
              update: subscriptionData,
              create: { userId, ...subscriptionData },
            }),
            prisma.studyData.upsert({
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
            }),
          ])

          await tryCreateOrActivateBuddyPair(userId)

          const sitting = getSittingById(meta.examSittingId || '')
          const tier = PRICING_TIERS.find((t) => t.id === (meta.pricingTier || ''))
          if (sitting && tier) {
            const user = await prisma.user.findUnique({
              where: { id: userId },
              select: { email: true, name: true },
            })
            if (user?.email) {
              sendSubscriptionConfirmationEmail({
                id: userId,
                email: user.email,
                name: user.name,
                sitting,
                tier,
                monthlyRate: parseFloat(meta.monthlyRate || '19'),
                months: parseInt(meta.totalMonths || '1', 10),
                isResubscription: meta.isResubscription === 'true',
              }).catch((err) =>
                console.error('Subscription confirmation email failed:', err)
              )
            }
          }
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
          await dissolveBuddyPairForUser(userId)

          const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { email: true, name: true },
          })

          if (user?.email) {
            sendSubscriptionCancelledEmail({
              id: userId,
              email: user.email,
              name: user.name,
              dedupeKey: `subscription_cancelled:${subscription.id}`,
            }).catch((err) =>
              console.error('Subscription cancelled email failed:', err)
            )
          }
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
      case 'invoice.paid': {
        const invoice = event.data.object as Stripe.Invoice
        await maybeActivateHalfOff(invoice)
        break
      }
      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice
        const invoiceId = invoice.id
        const invoiceSubscription = invoice.parent?.subscription_details?.subscription
        const stripeSubscriptionId = typeof invoiceSubscription === 'string'
          ? invoiceSubscription
          : invoiceSubscription?.id
        const stripeCustomerId = typeof invoice.customer === 'string'
          ? invoice.customer
          : invoice.customer?.id

        if (stripeSubscriptionId) {
          await prisma.subscription.updateMany({
            where: { stripeSubscriptionId },
            data: { status: 'past_due' },
          })
        } else if (stripeCustomerId) {
          await prisma.subscription.updateMany({
            where: { stripeCustomerId },
            data: { status: 'past_due' },
          })
        }

        const subscription = stripeSubscriptionId
          ? await prisma.subscription.findFirst({
              where: { stripeSubscriptionId },
              select: {
                userId: true,
                user: { select: { email: true, name: true } },
              },
            })
          : stripeCustomerId
            ? await prisma.subscription.findFirst({
                where: { stripeCustomerId },
                select: {
                  userId: true,
                  user: { select: { email: true, name: true } },
                },
              })
            : null

        if (subscription?.user?.email) {
          sendPaymentFailedEmail({
            id: subscription.userId,
            email: subscription.user.email,
            name: subscription.user.name,
            dedupeKey: `payment_failed:${invoiceId || event.id}`,
          }).catch((err) =>
            console.error('Payment failed email failed:', err)
          )
        }
        break
      }
    }
  } catch (error) {
    console.error('Webhook handler error:', error)
    if (claimedEvent) {
      await prisma.stripeProcessedEvent.delete({ where: { id: event.id } }).catch(() => {
        /* allow Stripe retry even if delete races */
      })
    }
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 })
  }

  return NextResponse.json({ received: true })
}
