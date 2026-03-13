import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  const session = await auth(req)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { code } = await req.json()
    const joinCode = String(code || '').trim().toUpperCase()

    if (!joinCode) {
      return NextResponse.json({ error: 'Join code is required' }, { status: 400 })
    }

    const challenge = await prisma.challenge.findUnique({
      where: { joinCode },
      include: { _count: { select: { participants: true } } },
    })

    if (!challenge) {
      return NextResponse.json({ error: 'Invalid challenge code' }, { status: 404 })
    }

    if (new Date(challenge.endsAt) < new Date()) {
      return NextResponse.json({ error: 'This challenge has ended' }, { status: 410 })
    }

    const existing = await prisma.challengeParticipant.findUnique({
      where: { challengeId_userId: { challengeId: challenge.id, userId: session.user.id } },
    })

    if (existing) {
      return NextResponse.json({ error: 'You have already joined this challenge' }, { status: 409 })
    }

    await prisma.challengeParticipant.create({
      data: {
        challengeId: challenge.id,
        userId: session.user.id,
      },
    })

    return NextResponse.json({
      joined: true,
      challenge: {
        id: challenge.id,
        title: challenge.title,
        type: challenge.type,
        targetValue: challenge.targetValue,
        domain: challenge.domain,
        endsAt: challenge.endsAt,
        participantCount: challenge._count.participants + 1,
      },
    })
  } catch (error) {
    console.error('Challenge join error:', error)
    return NextResponse.json({ error: 'Failed to join challenge' }, { status: 500 })
  }
}
