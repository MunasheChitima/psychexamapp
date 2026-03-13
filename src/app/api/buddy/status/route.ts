import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { getActiveBuddyPairByUserId } from '@/lib/buddy'
import type { NextRequest } from 'next/server'

export async function GET(req: NextRequest) {
  const session = await auth(req)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const [pair, referralCode] = await Promise.all([
      getActiveBuddyPairByUserId(session.user.id),
      prisma.referralCode.findUnique({ where: { ownerUserId: session.user.id } }),
    ])

    if (!pair) {
      return NextResponse.json({
        pair: null,
        referralCode,
        hasBuddy: false,
      })
    }

    const buddyUserId = pair.inviterUserId === session.user.id ? pair.inviteeUserId : pair.inviterUserId
    const buddy = await prisma.user.findUnique({
      where: { id: buddyUserId },
      select: { id: true, name: true, email: true },
    })

    return NextResponse.json({
      hasBuddy: true,
      referralCode,
      pair: {
        id: pair.id,
        status: pair.status,
        createdAt: pair.createdAt,
        freeMonthAppliedAt: pair.freeMonthAppliedAt,
        halfOffActiveFrom: pair.halfOffActiveFrom,
        buddy,
      },
    })
  } catch (error) {
    console.error('Buddy status error:', error)
    return NextResponse.json({ error: 'Failed to fetch buddy status' }, { status: 500 })
  }
}

