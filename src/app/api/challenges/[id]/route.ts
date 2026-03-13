import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth(_req)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params

  try {
    const challenge = await prisma.challenge.findUnique({
      where: { id },
      include: {
        creator: { select: { id: true, name: true, email: true } },
        participants: {
          include: {
            user: { select: { id: true, name: true, email: true } },
          },
        },
      },
    })

    if (!challenge) {
      return NextResponse.json({ error: 'Challenge not found' }, { status: 404 })
    }

    const isParticipant = challenge.participants.some((p) => p.userId === session.user!.id)
    if (!isParticipant) {
      return NextResponse.json({ error: 'You are not a participant in this challenge' }, { status: 403 })
    }

    const sorted = [...challenge.participants]
    switch (challenge.type) {
      case 'volume':
        sorted.sort((a, b) => b.questionsAnswered - a.questionsAnswered)
        break
      case 'accuracy':
        sorted.sort((a, b) => {
          const accA = a.questionsAnswered > 0 ? a.correctAnswers / a.questionsAnswered : 0
          const accB = b.questionsAnswered > 0 ? b.correctAnswers / b.questionsAnswered : 0
          return accB - accA
        })
        break
      case 'streak':
        sorted.sort((a, b) => b.bestStreak - a.bestStreak)
        break
      default:
        sorted.sort((a, b) => b.score - a.score)
    }

    const isExpired = new Date(challenge.endsAt) < new Date()

    return NextResponse.json({
      challenge: {
        id: challenge.id,
        joinCode: challenge.joinCode,
        title: challenge.title,
        type: challenge.type,
        targetValue: challenge.targetValue,
        domain: challenge.domain,
        startsAt: challenge.startsAt,
        endsAt: challenge.endsAt,
        status: isExpired ? 'completed' : challenge.status,
        creator: challenge.creator,
      },
      leaderboard: sorted.map((p, index) => ({
        rank: index + 1,
        userId: p.userId,
        name: p.user.name || p.user.email,
        questionsAnswered: p.questionsAnswered,
        correctAnswers: p.correctAnswers,
        bestStreak: p.bestStreak,
        score: p.score,
        accuracy: p.questionsAnswered > 0 ? Math.round((p.correctAnswers / p.questionsAnswered) * 100) : 0,
        isMe: p.userId === session.user!.id,
      })),
    })
  } catch (error) {
    console.error('Challenge fetch error:', error)
    return NextResponse.json({ error: 'Failed to fetch challenge' }, { status: 500 })
  }
}
