import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(_req: NextRequest, { params }: { params: Promise<{ roomCode: string }> }) {
  const session = await auth(_req)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { roomCode } = await params

  try {
    const liveSession = await prisma.liveSession.findUnique({ where: { roomCode } })
    if (!liveSession) {
      return NextResponse.json({ error: 'Room not found' }, { status: 404 })
    }

    if (liveSession.hostUserId !== session.user.id) {
      return NextResponse.json({ error: 'Only the host can advance' }, { status: 403 })
    }

    if (liveSession.status === 'complete' || liveSession.status === 'lobby') {
      return NextResponse.json({ error: 'Cannot advance in current state' }, { status: 409 })
    }

    const questionIds = liveSession.questionIds as string[]
    const nextIndex = liveSession.currentQuestionIndex + 1

    if (nextIndex >= questionIds.length) {
      await prisma.liveSession.update({
        where: { id: liveSession.id },
        data: { status: 'complete' },
      })
      return NextResponse.json({ complete: true })
    }

    await prisma.liveSession.update({
      where: { id: liveSession.id },
      data: {
        status: 'question',
        currentQuestionIndex: nextIndex,
        questionStartedAt: new Date(),
      },
    })

    return NextResponse.json({ advanced: true, questionIndex: nextIndex })
  } catch (error) {
    console.error('Live session next error:', error)
    return NextResponse.json({ error: 'Failed to advance question' }, { status: 500 })
  }
}
