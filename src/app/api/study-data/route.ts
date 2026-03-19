import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma, getPrismaInitError, PrismaInitError } from '@/lib/prisma'
import { sanitizeStudyDataPatch, toStudyDataUpdateInput } from '@/lib/studyDataSync'

function getSafeErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message
  return 'Unknown error'
}

function dbUnavailableResponse(error: PrismaInitError) {
  return NextResponse.json(
    {
      error: 'Study data service unavailable',
      code: error.code,
      detail: process.env.NODE_ENV !== 'production' ? error.message : undefined,
    },
    { status: 503 }
  )
}

function handleRouteError(context: string, error: unknown) {
  if (error instanceof PrismaInitError) {
    console.error(`[study-data:${context}] Prisma unavailable`, {
      code: error.code,
      message: error.message,
    })
    return dbUnavailableResponse(error)
  }

  console.error(`[study-data:${context}] unexpected error`, {
    message: getSafeErrorMessage(error),
  })
  return NextResponse.json({ error: `Failed to ${context} study data` }, { status: 500 })
}

export async function GET(req: NextRequest) {
  const prismaError = getPrismaInitError()
  if (prismaError) {
    return dbUnavailableResponse(prismaError)
  }

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
    return handleRouteError('fetch', error)
  }
}

export async function PUT(req: NextRequest) {
  const prismaError = getPrismaInitError()
  if (prismaError) {
    return dbUnavailableResponse(prismaError)
  }

  const session = await auth(req)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const updates = await req.json()
    const parsed = sanitizeStudyDataPatch(updates)
    if (!parsed.ok) {
      return NextResponse.json(
        { error: parsed.field ? `Invalid value for field: ${parsed.field}` : parsed.reason },
        { status: 400 }
      )
    }

    const updateData = toStudyDataUpdateInput(parsed.data)
    const studyData = await prisma.studyData.upsert({
      where: { userId: session.user.id },
      update: updateData,
      create: { userId: session.user.id, ...updateData } as import('@/generated/prisma/client').Prisma.StudyDataCreateInput,
    })

    return NextResponse.json(studyData)
  } catch (error) {
    return handleRouteError('save', error)
  }
}
