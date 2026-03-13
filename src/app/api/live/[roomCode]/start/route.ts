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
      return NextResponse.json({ error: 'Only the host can start the session' }, { status: 403 })
    }

    if (liveSession.status !== 'lobby') {
      return NextResponse.json({ error: 'Session already started' }, { status: 409 })
    }

    const questionIds = liveSession.questionIds as string[]
    if (questionIds.length === 0) {
      return NextResponse.json({ error: 'No questions available' }, { status: 400 })
    }

    await prisma.liveSession.update({
      where: { id: liveSession.id },
      data: {
        status: 'question',
        currentQuestionIndex: 0,
        questionStartedAt: new Date(),
      },
    })

    return NextResponse.json({ started: true })
  } catch (error) {
    console.error('Live session start error:', error)
    return NextResponse.json({ error: 'Failed to start session' }, { status: 500 })
  }
}
