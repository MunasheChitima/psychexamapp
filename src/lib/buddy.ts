/**
 * Buddy/referral system.
 * Pure logic delegates to @apracademy/platform; Prisma-dependent queries stay here.
 */
export { REFERRAL_WINDOW_DAYS, REFERRAL_CODE_LENGTH, generateReferralCode, getReferralExpiry } from '@apracademy/platform'

import { prisma } from '@/lib/prisma'

export const BUDDY_FREE_MONTH_COUPON_ID = process.env.STRIPE_BUDDY_FREE_MONTH_COUPON_ID || 'buddy-free-month'
export const BUDDY_HALF_OFF_COUPON_ID = process.env.STRIPE_BUDDY_HALF_OFF_COUPON_ID || 'buddy-half-off'

export async function getActiveBuddyPairByUserId(userId: string) {
  return prisma.buddyPair.findFirst({
    where: {
      status: 'active',
      OR: [{ inviterUserId: userId }, { inviteeUserId: userId }],
    },
  })
}
