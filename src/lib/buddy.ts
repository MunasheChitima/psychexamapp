import { prisma } from '@/lib/prisma'

export const REFERRAL_WINDOW_DAYS = 3
export const REFERRAL_CODE_LENGTH = 8
export const BUDDY_FREE_MONTH_COUPON_ID = process.env.STRIPE_BUDDY_FREE_MONTH_COUPON_ID || 'buddy-free-month'
export const BUDDY_HALF_OFF_COUPON_ID = process.env.STRIPE_BUDDY_HALF_OFF_COUPON_ID || 'buddy-half-off'

const REFERRAL_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'

export function generateReferralCode(length = REFERRAL_CODE_LENGTH) {
  let code = ''
  for (let i = 0; i < length; i += 1) {
    code += REFERRAL_ALPHABET[Math.floor(Math.random() * REFERRAL_ALPHABET.length)]
  }
  return code
}

export function getReferralExpiry(fromDate: Date = new Date()) {
  return new Date(fromDate.getTime() + REFERRAL_WINDOW_DAYS * 24 * 60 * 60 * 1000)
}

export async function getActiveBuddyPairByUserId(userId: string) {
  return prisma.buddyPair.findFirst({
    where: {
      status: 'active',
      OR: [{ inviterUserId: userId }, { inviteeUserId: userId }],
    },
  })
}

