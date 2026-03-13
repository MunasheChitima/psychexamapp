import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  const session = await auth(req)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const studyData = await prisma.studyData.findUnique({
      where: { userId: session.user.id },
    })

    if (!studyData) {
      const newData = await prisma.studyData.upsert({
        where: { userId: session.user.id },
        update: {},
        create: { userId: session.user.id },
      })
      return NextResponse.json(newData)
    }

    return NextResponse.json(studyData)
  } catch (error) {
    console.error('Study data fetch error:', error)
    return NextResponse.json({ error: 'Failed to fetch study data' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  const session = await auth(req)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const updates = await req.json()

    if (typeof updates !== 'object' || updates === null || Array.isArray(updates)) {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
    }

    const fieldValidators: Record<string, (v: unknown) => boolean> = {
      examDate: (v) => typeof v === 'string',
      studyGoal: (v) => typeof v === 'string' && ['intensive', 'moderate', 'casual'].includes(v),
      selectedDomains: (v) => typeof v === 'string' || (Array.isArray(v) && v.every((d: unknown) => typeof d === 'string')),
      studyStats: (v) => typeof v === 'string' || (typeof v === 'object' && v !== null),
      studySessions: (v) => typeof v === 'string' || Array.isArray(v),
      flashcardProgress: (v) => typeof v === 'string' || (typeof v === 'object' && v !== null),
      practiceResults: (v) => typeof v === 'string' || Array.isArray(v),
      materialBookmarks: (v) => typeof v === 'string' || (typeof v === 'object' && v !== null),
      materialCompleted: (v) => typeof v === 'string' || (typeof v === 'object' && v !== null),
      engagementData: (v) => typeof v === 'string' || (typeof v === 'object' && v !== null),
      hasCompletedOnboarding: (v) => typeof v === 'boolean',
    }

    const sanitized: Record<string, unknown> = {}
    for (const [key, validator] of Object.entries(fieldValidators)) {
      if (key in updates) {
        if (!validator(updates[key])) {
          return NextResponse.json({ error: `Invalid value for field: ${key}` }, { status: 400 })
        }
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
