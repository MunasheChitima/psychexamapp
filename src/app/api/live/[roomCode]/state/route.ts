import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { getQuestionsByIds } from '@/lib/liveQuestions'

interface PlayerAnswer {
  questionIndex: number
  answerIndex: number
  timeMs: number
  correct: boolean
  points: number
}

const TWO_HOURS_MS = 2 * 60 * 60 * 1000

export async function POST(_req: NextRequest, { params }: { params: Promise<{ roomCode: string }> }) {
  const session = await auth(_req)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { roomCode } = await params

  try {
  const liveSession = await prisma.liveSession.findUnique({
    where: { roomCode },
    include: {
      players: {
        orderBy: { totalScore: 'desc' },
        select: {
          userId: true,
          displayName: true,
          totalScore: true,
          answers: true,
        },
      },
    },
  })

  if (!liveSession) {
    return NextResponse.json({ error: 'Room not found' }, { status: 404 })
  }

  // Expire stale rooms
  if (Date.now() - new Date(liveSession.updatedAt).getTime() > TWO_HOURS_MS && liveSession.status !== 'complete') {
    await prisma.liveSession.update({
      where: { id: liveSession.id },
      data: { status: 'complete' },
    })
    liveSession.status = 'complete'
  }

  // Auto-advance if timer expired and host hasn't called /next
  if (
    liveSession.status === 'question' &&
    liveSession.questionStartedAt
  ) {
    const elapsed = Date.now() - new Date(liveSession.questionStartedAt).getTime()
    const autoAdvanceMs = (liveSession.questionDurationSec + 5) * 1000
    if (elapsed > autoAdvanceMs) {
      const questionIds = liveSession.questionIds as string[]
      const nextIndex = liveSession.currentQuestionIndex + 1
      if (nextIndex >= questionIds.length) {
        await prisma.liveSession.update({
          where: { id: liveSession.id },
          data: { status: 'complete' },
        })
        liveSession.status = 'complete'
      } else {
        await prisma.liveSession.update({
          where: { id: liveSession.id },
          data: {
            status: 'question',
            currentQuestionIndex: nextIndex,
            questionStartedAt: new Date(),
          },
        })
        liveSession.currentQuestionIndex = nextIndex
        liveSession.questionStartedAt = new Date()
      }
    }
  }

  const questionIds = liveSession.questionIds as string[]
  const questions = getQuestionsByIds(questionIds)
  const currentQuestion = questions[liveSession.currentQuestionIndex]

  const isHost = liveSession.hostUserId === session.user.id
  const myAnswers = (() => {
    const me = liveSession.players.find((p) => p.userId === session.user!.id)
    return (me?.answers as unknown as PlayerAnswer[]) || []
  })()
  const hasAnsweredCurrent = myAnswers.some((a) => a.questionIndex === liveSession.currentQuestionIndex)

  let timeRemainingMs = 0
  if (liveSession.status === 'question' && liveSession.questionStartedAt) {
    const elapsed = Date.now() - new Date(liveSession.questionStartedAt).getTime()
    timeRemainingMs = Math.max(0, liveSession.questionDurationSec * 1000 - elapsed)
  }

  const leaderboard = liveSession.players.map((p, i) => ({
    rank: i + 1,
    userId: p.userId,
    displayName: p.displayName,
    totalScore: p.totalScore,
    isMe: p.userId === session.user!.id,
  }))

  const response: Record<string, unknown> = {
    status: liveSession.status,
    roomCode: liveSession.roomCode,
    isHost,
    currentQuestionIndex: liveSession.currentQuestionIndex,
    totalQuestions: questionIds.length,
    questionDurationSec: liveSession.questionDurationSec,
    timeRemainingMs,
    hasAnsweredCurrent,
    domain: liveSession.domain,
    leaderboard,
    playerCount: liveSession.players.length,
  }

  if ((liveSession.status === 'question' || liveSession.status === 'reviewing') && currentQuestion) {
    response.question = {
      question: currentQuestion.question,
      options: currentQuestion.options,
      caseStudy: currentQuestion.caseStudy || null,
      domain: currentQuestion.domain,
      difficulty: currentQuestion.difficulty,
    }
  }

  // After timer expires or in review/complete, reveal correct answer
  if (liveSession.status === 'complete' || (liveSession.status === 'question' && timeRemainingMs <= 0)) {
    if (currentQuestion) {
      response.correctAnswer = currentQuestion.correctAnswer
      response.explanation = currentQuestion.explanation
    }

    response.questionResults = liveSession.players.map((p) => {
      const answers = (p.answers as unknown as PlayerAnswer[]) || []
      const thisAnswer = answers.find((a) => a.questionIndex === liveSession.currentQuestionIndex)
      return {
        userId: p.userId,
        displayName: p.displayName,
        answered: Boolean(thisAnswer),
        correct: thisAnswer?.correct || false,
        points: thisAnswer?.points || 0,
        timeMs: thisAnswer?.timeMs || 0,
      }
    })
  }

  // For completed sessions, include full question history
  if (liveSession.status === 'complete') {
    response.allQuestions = questions.map((q, idx) => ({
      index: idx,
      question: q.question,
      options: q.options,
      correctAnswer: q.correctAnswer,
      domain: q.domain,
    }))

    response.allPlayerAnswers = liveSession.players.map((p) => ({
      userId: p.userId,
      displayName: p.displayName,
      totalScore: p.totalScore,
      answers: (p.answers as unknown as PlayerAnswer[]) || [],
    }))
  }

  return NextResponse.json(response)
  } catch (error) {
    console.error('Live session state error:', error)
    return NextResponse.json({ error: 'Failed to fetch session state' }, { status: 500 })
  }
}
