import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  const session = await auth(req)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { roomCode, displayName } = await req.json()
    const code = String(roomCode || '').trim().toUpperCase()

    if (!code) {
      return NextResponse.json({ error: 'Room code is required' }, { status: 400 })
    }

    const liveSession = await prisma.liveSession.findUnique({
      where: { roomCode: code },
      include: { _count: { select: { players: true } } },
    })

    if (!liveSession) {
      return NextResponse.json({ error: 'Room not found' }, { status: 404 })
    }

    if (liveSession.status === 'complete') {
      return NextResponse.json({ error: 'This session has already ended' }, { status: 410 })
    }

    if (liveSession.status !== 'lobby') {
      return NextResponse.json({ error: 'This session is already in progress' }, { status: 409 })
    }

    const existing = await prisma.liveSessionPlayer.findUnique({
      where: { sessionId_userId: { sessionId: liveSession.id, userId: session.user.id } },
    })

    if (existing) {
      return NextResponse.json({
        joined: true,
        roomCode: code,
        sessionId: liveSession.id,
        alreadyJoined: true,
      })
    }

    const name = String(displayName || session.user.name || session.user.email || 'Player').trim().slice(0, 30)

    await prisma.liveSessionPlayer.create({
      data: {
        sessionId: liveSession.id,
        userId: session.user.id,
        displayName: name,
      },
    })

    return NextResponse.json({
      joined: true,
      roomCode: code,
      sessionId: liveSession.id,
      playerCount: liveSession._count.players + 1,
    })
  } catch (error) {
    console.error('Live join error:', error)
    return NextResponse.json({ error: 'Failed to join session' }, { status: 500 })
  }
}
