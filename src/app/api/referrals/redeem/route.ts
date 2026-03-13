import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  const session = await auth(req)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await req.json()
    const code = String(body?.code || '').trim().toUpperCase()

    if (!code) {
      return NextResponse.json({ error: 'Referral code is required' }, { status: 400 })
    }

    const existingRedemption = await prisma.referralCode.findUnique({
      where: { redeemedBy: session.user.id },
    })
    if (existingRedemption) {
      return NextResponse.json({ error: 'You have already redeemed a referral code' }, { status: 409 })
    }

    const referral = await prisma.referralCode.findUnique({
      where: { code },
      include: { owner: true },
    })

    if (!referral) {
      return NextResponse.json({ error: 'Invalid referral code' }, { status: 404 })
    }

    if (referral.ownerUserId === session.user.id) {
      return NextResponse.json({ error: 'You cannot redeem your own referral code' }, { status: 400 })
    }

    if (referral.redeemedBy) {
      return NextResponse.json({ error: 'This referral code has already been used' }, { status: 409 })
    }

    if (new Date(referral.expiresAt) < new Date()) {
      return NextResponse.json({ error: 'This referral code has expired' }, { status: 410 })
    }

    const activePair = await prisma.buddyPair.findFirst({
      where: {
        status: 'active',
        OR: [
          { inviterUserId: session.user.id },
          { inviteeUserId: session.user.id },
          { inviterUserId: referral.ownerUserId },
          { inviteeUserId: referral.ownerUserId },
        ],
      },
    })
    if (activePair) {
      return NextResponse.json({ error: 'One of these users already has an active buddy pair' }, { status: 409 })
    }

    const updated = await prisma.referralCode.update({
      where: { id: referral.id },
      data: {
        redeemedBy: session.user.id,
        redeemedAt: new Date(),
      },
    })

    return NextResponse.json({
      redeemed: true,
      referralCode: updated.code,
      inviter: {
        id: referral.owner.id,
        name: referral.owner.name,
        email: referral.owner.email,
      },
    })
  } catch (error) {
    console.error('Referral redeem error:', error)
    return NextResponse.json({ error: 'Failed to redeem referral code' }, { status: 500 })
  }
}

