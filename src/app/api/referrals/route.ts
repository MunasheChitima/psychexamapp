import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { generateReferralCode, getReferralExpiry } from '@/lib/buddy'
import type { NextRequest } from 'next/server'

async function createUniqueCode() {
  for (let attempt = 0; attempt < 10; attempt += 1) {
    const code = generateReferralCode()
    const exists = await prisma.referralCode.findUnique({ where: { code } })
    if (!exists) return code
  }
  throw new Error('Could not generate unique referral code')
}

export async function GET(req: NextRequest) {
  const session = await auth(req)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const [ownedCode, redeemedCode] = await Promise.all([
      prisma.referralCode.findUnique({
        where: { ownerUserId: session.user.id },
      }),
      prisma.referralCode.findUnique({
        where: { redeemedBy: session.user.id },
        include: { owner: { select: { id: true, name: true, email: true } } },
      }),
    ])

    return NextResponse.json({
      ownedCode,
      redeemedCode,
    })
  } catch (error) {
    console.error('Referrals fetch error:', error)
    return NextResponse.json({ error: 'Failed to fetch referral codes' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const session = await auth(req)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const existing = await prisma.referralCode.findUnique({
      where: { ownerUserId: session.user.id },
    })

    if (existing) {
      return NextResponse.json({ referralCode: existing })
    }

    const code = await createUniqueCode()
    const referralCode = await prisma.referralCode.create({
      data: {
        code,
        ownerUserId: session.user.id,
        expiresAt: getReferralExpiry(),
      },
    })

    return NextResponse.json({ referralCode })
  } catch (error) {
    console.error('Referral create error:', error)
    return NextResponse.json({ error: 'Failed to create referral code' }, { status: 500 })
  }
}

