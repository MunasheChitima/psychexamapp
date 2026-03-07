import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const studyData = await prisma.studyData.findUnique({
    where: { userId: session.user.id },
  })

  if (!studyData) {
    const newData = await prisma.studyData.create({
      data: { userId: session.user.id },
    })
    return NextResponse.json(newData)
  }

  return NextResponse.json(studyData)
}

export async function PUT(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const updates = await req.json()

    const allowedFields = [
      'examDate', 'studyGoal', 'selectedDomains', 'studyStats',
      'studySessions', 'flashcardProgress', 'practiceResults',
      'materialBookmarks', 'materialCompleted', 'hasCompletedOnboarding',
    ]

    const sanitized: Record<string, unknown> = {}
    for (const key of allowedFields) {
      if (key in updates) {
        sanitized[key] = updates[key]
      }
    }

    const studyData = await prisma.studyData.upsert({
      where: { userId: session.user.id },
      update: sanitized,
      create: { userId: session.user.id, ...sanitized },
    })

    return NextResponse.json(studyData)
  } catch (error) {
    console.error('Study data update error:', error)
    return NextResponse.json(
      { error: 'Failed to save study data' },
      { status: 500 }
    )
  }
}
