import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { isGuestCloudSaveEnabled } from '@/lib/featureFlags'
import { guestTokenHash, isValidGuestToken } from '@/lib/guestToken'
import { getPrismaInitError, prisma, PrismaInitError } from '@/lib/prisma'
import { mergeGuestIntoUserStudyData } from '@/lib/studyDataSync'

function dbUnavailableResponse(error: PrismaInitError) {
  return NextResponse.json(
    {
      error: 'Study data merge service unavailable',
      code: error.code,
      detail: process.env.NODE_ENV !== 'production' ? error.message : undefined,
    },
    { status: 503 }
  )
}

export async function POST(req: NextRequest) {
  if (!isGuestCloudSaveEnabled()) {
    return NextResponse.json({ merged: false, reason: 'disabled' }, { status: 200 })
  }

  const prismaError = getPrismaInitError()
  if (prismaError) return dbUnavailableResponse(prismaError)

  const session = await auth(req)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await req.json().catch(() => ({}))
    const token = typeof body?.token === 'string' ? body.token : ''
    if (!token || !isValidGuestToken(token)) {
      return NextResponse.json({ merged: false, reason: 'invalid-token' }, { status: 400 })
    }

    const guest = await prisma.guestStudyData.findUnique({
      where: { tokenHash: guestTokenHash(token) },
    })

    if (!guest || guest.expiresAt < new Date()) {
      return NextResponse.json({ merged: false, reason: 'guest-data-not-found' }, { status: 200 })
    }

    const userData = await prisma.studyData.upsert({
      where: { userId: session.user.id },
      update: {},
      create: { userId: session.user.id },
    })

    const mergedPatch = mergeGuestIntoUserStudyData(userData, guest)

    const mergedRecord = await prisma.studyData.update({
      where: { userId: session.user.id },
      data: mergedPatch,
    })

    await prisma.guestStudyData.delete({
      where: { tokenHash: guestTokenHash(token) },
    })

    return NextResponse.json({
      merged: true,
      studyData: mergedRecord,
    })
  } catch (error) {
    if (error instanceof PrismaInitError) return dbUnavailableResponse(error)
    console.error('[study-data:merge-guest] unexpected error', error)
    return NextResponse.json({ error: 'Failed to merge guest study data' }, { status: 500 })
  }
}
