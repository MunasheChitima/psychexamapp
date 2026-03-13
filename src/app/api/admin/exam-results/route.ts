import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || '').split(',').map(e => e.trim()).filter(Boolean)

async function isAdmin(email: string | null | undefined): Promise<boolean> {
  if (!email) return false
  return ADMIN_EMAILS.includes(email)
}

export async function GET(req: NextRequest) {
  const session = await auth(req)
  if (!await isAdmin(session?.user?.email)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  try {
    const results = await prisma.examResult.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { email: true, name: true } },
      },
    })

    return NextResponse.json({ results })
  } catch (error) {
    console.error('Admin exam results fetch error:', error)
    return NextResponse.json({ error: 'Failed to fetch exam results' }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  const session = await auth(req)
  if (!await isAdmin(session?.user?.email)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  try {
    const { resultId, status, adminNotes } = await req.json()

    if (!resultId || !['approved', 'rejected'].includes(status)) {
      return NextResponse.json(
        { error: 'Result ID and valid status (approved/rejected) are required' },
        { status: 400 }
      )
    }

    const updated = await prisma.examResult.update({
      where: { id: resultId },
      data: {
        status,
        adminNotes: adminNotes || null,
        reviewedAt: new Date(),
      },
    })

    return NextResponse.json({ result: updated })
  } catch (error) {
    console.error('Admin review error:', error)
    return NextResponse.json(
      { error: 'Failed to update result status' },
      { status: 500 }
    )
  }
}
