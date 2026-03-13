import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { getSittingById } from '@/lib/examSchedule'

export async function GET(req: NextRequest) {
  const session = await auth(req)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const results = await prisma.examResult.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' },
    })

    const hasApprovedFail = results.some(
      r => r.status === 'approved' && r.outcome === 'fail'
    )

    return NextResponse.json({ results, hasApprovedFail })
  } catch (error) {
    console.error('Exam results fetch error:', error)
    return NextResponse.json({ error: 'Failed to fetch exam results' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const session = await auth(req)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { examSittingId, candidateNumber, resultDescription } = await req.json()

    if (!examSittingId || !candidateNumber || !resultDescription) {
      return NextResponse.json(
        { error: 'All fields are required: exam sitting, candidate number, and result details' },
        { status: 400 }
      )
    }

    const sitting = getSittingById(examSittingId)
    if (!sitting) {
      return NextResponse.json({ error: 'Invalid exam sitting' }, { status: 400 })
    }

    const today = new Date().toISOString().split('T')[0]
    if (today < sitting.examEnd) {
      return NextResponse.json(
        { error: 'Results can only be submitted after the exam period has ended' },
        { status: 400 }
      )
    }

    const existing = await prisma.examResult.findFirst({
      where: {
        userId: session.user.id,
        examSittingId,
        status: { in: ['pending', 'approved'] },
      },
    })

    if (existing) {
      return NextResponse.json(
        { error: existing.status === 'pending'
            ? 'You already have a pending result submission for this exam sitting'
            : 'Your result for this exam sitting has already been verified' },
        { status: 409 }
      )
    }

    const result = await prisma.examResult.create({
      data: {
        userId: session.user.id,
        examSittingId,
        candidateNumber: candidateNumber.trim(),
        resultDescription: resultDescription.trim(),
        outcome: 'fail',
      },
    })

    return NextResponse.json({ result }, { status: 201 })
  } catch (error) {
    console.error('Exam result submission error:', error)
    return NextResponse.json(
      { error: 'Failed to submit exam result. Please try again.' },
      { status: 500 }
    )
  }
}
