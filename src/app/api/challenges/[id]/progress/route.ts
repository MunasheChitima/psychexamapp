import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth(req)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id: challengeId } = await params

  try {
    const { questionsAnswered, correctAnswers, bestStreak, sessionId } = await req.json()

    const parsedQuestionsAnswered = Number(questionsAnswered)
    const parsedCorrectAnswers = Number(correctAnswers) || 0
    const parsedBestStreak = Number(bestStreak) || 0

    if (!Number.isFinite(parsedQuestionsAnswered) || parsedQuestionsAnswered < 1) {
      return NextResponse.json({ error: 'Invalid progress data' }, { status: 400 })
    }
    if (parsedCorrectAnswers < 0 || parsedBestStreak < 0) {
      return NextResponse.json({ error: 'Values must be non-negative' }, { status: 400 })
    }

    const challenge = await prisma.challenge.findUnique({ where: { id: challengeId } })
    if (!challenge) {
      return NextResponse.json({ error: 'Challenge not found' }, { status: 404 })
    }
    if (new Date(challenge.endsAt) < new Date()) {
      return NextResponse.json({ error: 'Challenge has ended' }, { status: 410 })
    }

    const participant = await prisma.challengeParticipant.findUnique({
      where: { challengeId_userId: { challengeId, userId: session.user.id } },
    })
    if (!participant) {
      return NextResponse.json({ error: 'You are not a participant' }, { status: 403 })
    }

    if (sessionId && participant.lastSessionId === sessionId) {
      return NextResponse.json({ already: true, message: 'Already recorded' })
    }

    const newBestStreak = Math.max(participant.bestStreak, parsedBestStreak)
    const newQuestionsAnswered = participant.questionsAnswered + parsedQuestionsAnswered
    const newCorrectAnswers = participant.correctAnswers + parsedCorrectAnswers
    const newScore = newCorrectAnswers * 10 + newBestStreak * 5

    await prisma.challengeParticipant.update({
      where: { id: participant.id },
      data: {
        questionsAnswered: newQuestionsAnswered,
        correctAnswers: newCorrectAnswers,
        bestStreak: newBestStreak,
        score: newScore,
        lastSessionId: sessionId || null,
      },
    })

    return NextResponse.json({
      updated: true,
      stats: {
        questionsAnswered: newQuestionsAnswered,
        correctAnswers: newCorrectAnswers,
        bestStreak: newBestStreak,
        score: newScore,
      },
    })
  } catch (error) {
    console.error('Challenge progress error:', error)
    return NextResponse.json({ error: 'Failed to update progress' }, { status: 500 })
  }
}
