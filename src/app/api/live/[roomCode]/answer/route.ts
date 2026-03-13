import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { getQuestionById } from '@/lib/liveQuestions'

interface PlayerAnswer {
  questionIndex: number
  answerIndex: number
  timeMs: number
  correct: boolean
  points: number
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ roomCode: string }> }) {
  const session = await auth(req)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { roomCode } = await params

  try {
    const { answerIndex } = await req.json()

    if (typeof answerIndex !== 'number' || !Number.isInteger(answerIndex) || answerIndex < 0) {
      return NextResponse.json({ error: 'Invalid answer index' }, { status: 400 })
    }

    const liveSession = await prisma.liveSession.findUnique({ where: { roomCode } })
    if (!liveSession) {
      return NextResponse.json({ error: 'Room not found' }, { status: 404 })
    }

    if (liveSession.status !== 'question') {
      return NextResponse.json({ error: 'Not accepting answers right now' }, { status: 409 })
    }

    const player = await prisma.liveSessionPlayer.findUnique({
      where: { sessionId_userId: { sessionId: liveSession.id, userId: session.user.id } },
    })
    if (!player) {
      return NextResponse.json({ error: 'You are not in this session' }, { status: 403 })
    }

    const existingAnswers = (player.answers as unknown as PlayerAnswer[]) || []
    const alreadyAnswered = existingAnswers.some((a) => a.questionIndex === liveSession.currentQuestionIndex)
    if (alreadyAnswered) {
      return NextResponse.json({ already: true, message: 'Already answered this question' })
    }

    if (!liveSession.questionStartedAt) {
      return NextResponse.json({ error: 'Question timer not started' }, { status: 409 })
    }

    const now = Date.now()
    const started = new Date(liveSession.questionStartedAt).getTime()
    const timeMs = now - started
    const durationMs = liveSession.questionDurationSec * 1000

    if (timeMs > durationMs + 2000) {
      return NextResponse.json({ error: 'Time is up for this question' }, { status: 410 })
    }

    const questionIds = liveSession.questionIds as string[]
    const questionId = questionIds[liveSession.currentQuestionIndex]
    const question = getQuestionById(questionId)
    if (!question) {
      return NextResponse.json({ error: 'Question not found' }, { status: 500 })
    }

    if (answerIndex >= question.options.length) {
      return NextResponse.json({ error: 'Answer index out of range' }, { status: 400 })
    }

    const correct = answerIndex === question.correctAnswer
    let points = 0
    if (correct) {
      const timeFraction = Math.min(timeMs / durationMs, 1)
      points = Math.round(1000 - timeFraction * 500)

      const consecutiveCorrect = (() => {
        let streak = 0
        for (let i = existingAnswers.length - 1; i >= 0; i--) {
          if (existingAnswers[i].correct) streak++
          else break
        }
        return streak
      })()
      points += consecutiveCorrect * 100
    }

    const newAnswer: PlayerAnswer = {
      questionIndex: liveSession.currentQuestionIndex,
      answerIndex,
      timeMs: Math.round(timeMs),
      correct,
      points,
    }

    await prisma.liveSessionPlayer.update({
      where: { id: player.id },
      data: {
        answers: [...existingAnswers, { ...newAnswer }] as unknown as import('@/generated/prisma/client').Prisma.InputJsonValue,
        totalScore: player.totalScore + points,
      },
    })

    return NextResponse.json({ recorded: true, correct, points, timeMs: Math.round(timeMs) })
  } catch (error) {
    console.error('Live answer error:', error)
    return NextResponse.json({ error: 'Failed to record answer' }, { status: 500 })
  }
}
