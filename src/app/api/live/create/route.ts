import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { pickRandomQuestions } from '@/lib/liveQuestions'

const CODE_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'

function generateRoomCode(length = 6) {
  let code = ''
  for (let i = 0; i < length; i++) {
    code += CODE_ALPHABET[Math.floor(Math.random() * CODE_ALPHABET.length)]
  }
  return code
}

async function createUniqueRoomCode() {
  for (let attempt = 0; attempt < 10; attempt++) {
    const code = generateRoomCode()
    const exists = await prisma.liveSession.findUnique({ where: { roomCode: code } })
    if (!exists) return code
  }
  throw new Error('Could not generate unique room code')
}

export async function POST(req: NextRequest) {
  const session = await auth(req)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { domain, questionCount, questionDurationSec, productLine } = await req.json()

    const count = Math.min(Math.max(Number(questionCount) || 10, 3), 30)
    const duration = Math.min(Math.max(Number(questionDurationSec) || 20, 10), 60)
    const activeProductLine = productLine === 'nursing' ? 'nursing' : 'psychology'
    const allowedDomains = activeProductLine === 'nursing'
      ? ['all', 'management-of-care', 'safety-infection', 'health-promotion', 'psychosocial', 'basic-care', 'pharmacology', 'risk-reduction', 'physiological', 'osce-skills']
      : ['all', 'ethics', 'assessment', 'interventions', 'communication']
    const domainValue = allowedDomains.includes(domain) ? domain : 'all'

    const questions = pickRandomQuestions(count, domainValue, activeProductLine)
    if (questions.length < 3) {
      return NextResponse.json({ error: 'Not enough questions available for this domain' }, { status: 400 })
    }

    const roomCode = await createUniqueRoomCode()
    const questionIds = questions.map((q) => q.id)

    const liveSession = await prisma.liveSession.create({
      data: {
        roomCode,
        hostUserId: session.user.id,
        domain: domainValue,
        questionCount: questions.length,
        questionDurationSec: duration,
        questionIds,
        players: {
          create: {
            userId: session.user.id,
            displayName: session.user.name || session.user.email || 'Host',
          },
        },
      },
    })

    return NextResponse.json({
      roomCode: liveSession.roomCode,
      sessionId: liveSession.id,
      questionCount: questions.length,
      domain: domainValue,
      questionDurationSec: duration,
    })
  } catch (error) {
    console.error('Live session create error:', error)
    return NextResponse.json({ error: 'Failed to create live session' }, { status: 500 })
  }
}
