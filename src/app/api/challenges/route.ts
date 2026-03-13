import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

const JOIN_CODE_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'

function generateJoinCode(length = 6) {
  let code = ''
  for (let i = 0; i < length; i++) {
    code += JOIN_CODE_ALPHABET[Math.floor(Math.random() * JOIN_CODE_ALPHABET.length)]
  }
  return code
}

async function createUniqueJoinCode() {
  for (let attempt = 0; attempt < 10; attempt++) {
    const code = generateJoinCode()
    const exists = await prisma.challenge.findUnique({ where: { joinCode: code } })
    if (!exists) return code
  }
  throw new Error('Could not generate unique join code')
}

export async function GET(req: NextRequest) {
  const session = await auth(req)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const participations = await prisma.challengeParticipant.findMany({
      where: { userId: session.user.id },
      include: {
        challenge: {
          include: {
            _count: { select: { participants: true } },
            participants: {
              orderBy: { score: 'desc' },
              select: { userId: true, score: true, questionsAnswered: true, correctAnswers: true, bestStreak: true },
            },
          },
        },
      },
      orderBy: { joinedAt: 'desc' },
    })

    const challenges = participations.map((p) => {
      const c = p.challenge
      const rank = c.participants.findIndex((part) => part.userId === session.user!.id) + 1
      const isExpired = new Date(c.endsAt) < new Date()
      return {
        id: c.id,
        joinCode: c.joinCode,
        title: c.title,
        type: c.type,
        targetValue: c.targetValue,
        domain: c.domain,
        startsAt: c.startsAt,
        endsAt: c.endsAt,
        status: isExpired ? 'completed' : c.status,
        participantCount: c._count.participants,
        myStats: {
          questionsAnswered: p.questionsAnswered,
          correctAnswers: p.correctAnswers,
          bestStreak: p.bestStreak,
          score: p.score,
          rank,
        },
      }
    })

    return NextResponse.json({ challenges })
  } catch (error) {
    console.error('Challenges list error:', error)
    return NextResponse.json({ error: 'Failed to fetch challenges' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const session = await auth(req)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { title, type, targetValue, domain, durationDays } = await req.json()

    if (!title?.trim()) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 })
    }
    if (!['volume', 'accuracy', 'streak'].includes(type)) {
      return NextResponse.json({ error: 'Type must be volume, accuracy, or streak' }, { status: 400 })
    }
    if (!targetValue || targetValue < 1) {
      return NextResponse.json({ error: 'Target value must be at least 1' }, { status: 400 })
    }
    const days = Math.min(Math.max(Number(durationDays) || 3, 1), 30)

    const joinCode = await createUniqueJoinCode()
    const now = new Date()
    const endsAt = new Date(now.getTime() + days * 24 * 60 * 60 * 1000)

    const challenge = await prisma.challenge.create({
      data: {
        joinCode,
        creatorId: session.user.id,
        title: title.trim(),
        type,
        targetValue: Number(targetValue),
        domain: domain || 'all',
        startsAt: now,
        endsAt,
        participants: {
          create: { userId: session.user.id },
        },
      },
    })

    return NextResponse.json({ challenge: { ...challenge, joinCode } })
  } catch (error) {
    console.error('Challenge create error:', error)
    return NextResponse.json({ error: 'Failed to create challenge' }, { status: 500 })
  }
}
