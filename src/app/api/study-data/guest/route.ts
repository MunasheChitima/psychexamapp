import { NextRequest, NextResponse } from 'next/server'
import { getPrismaInitError, prisma, PrismaInitError } from '@/lib/prisma'
import { guestTokenHash, isValidGuestToken } from '@/lib/guestToken'
import {
  sanitizeStudyDataPatch,
  toGuestStudyDataCreateInput,
  toGuestStudyDataUpdateInput,
} from '@/lib/studyDataSync'
import { isGuestCloudSaveEnabled } from '@/lib/featureFlags'

const GUEST_TTL_DAYS = 30

function getExpiresAtDate(): Date {
  return new Date(Date.now() + GUEST_TTL_DAYS * 24 * 60 * 60 * 1000)
}

function dbUnavailableResponse(error: PrismaInitError) {
  return NextResponse.json(
    {
      error: 'Guest study data service unavailable',
      code: error.code,
      detail: process.env.NODE_ENV !== 'production' ? error.message : undefined,
    },
    { status: 503 }
  )
}

function resolveToken(req: NextRequest, fallback?: unknown): string | null {
  const fromHeader = req.headers.get('x-guest-token')
  if (fromHeader) return fromHeader
  const fromQuery = new URL(req.url).searchParams.get('token')
  if (fromQuery) return fromQuery
  if (typeof fallback === 'string') return fallback
  return null
}

function invalidTokenResponse() {
  return NextResponse.json({ error: 'Invalid or missing guest token' }, { status: 401 })
}

export async function GET(req: NextRequest) {
  if (!isGuestCloudSaveEnabled()) {
    return NextResponse.json({ error: 'Guest cloud save is disabled' }, { status: 404 })
  }

  const prismaError = getPrismaInitError()
  if (prismaError) return dbUnavailableResponse(prismaError)

  const token = resolveToken(req)
  if (!token || !isValidGuestToken(token)) {
    return invalidTokenResponse()
  }

  try {
    const now = new Date()
    const tokenHash = guestTokenHash(token)
    const existing = await prisma.guestStudyData.findUnique({
      where: { tokenHash },
    })

    if (existing && existing.expiresAt >= now) {
      return NextResponse.json(existing)
    }

    const created = await prisma.guestStudyData.upsert({
      where: { tokenHash },
      update: {
        expiresAt: getExpiresAtDate(),
        lastSyncedAt: now,
      },
      create: {
        tokenHash,
        expiresAt: getExpiresAtDate(),
        lastSyncedAt: now,
      },
    })

    return NextResponse.json(created)
  } catch (error) {
    if (error instanceof PrismaInitError) return dbUnavailableResponse(error)
    console.error('[guest-study-data:get] unexpected error', error)
    return NextResponse.json({ error: 'Failed to fetch guest study data' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  if (!isGuestCloudSaveEnabled()) {
    return NextResponse.json({ error: 'Guest cloud save is disabled' }, { status: 404 })
  }

  const prismaError = getPrismaInitError()
  if (prismaError) return dbUnavailableResponse(prismaError)

  try {
    const body = await req.json()
    const token = resolveToken(req, body?.token)
    if (!token || !isValidGuestToken(token)) {
      return invalidTokenResponse()
    }

    const parsed = sanitizeStudyDataPatch(body?.updates ?? body)
    if (!parsed.ok) {
      return NextResponse.json(
        { error: parsed.field ? `Invalid value for field: ${parsed.field}` : parsed.reason },
        { status: 400 }
      )
    }

    const now = new Date()
    const expiresAt = getExpiresAtDate()
    const tokenHash = guestTokenHash(token)

    const studyData = await prisma.guestStudyData.upsert({
      where: { tokenHash },
      update: toGuestStudyDataUpdateInput(parsed.data, { lastSyncedAt: now, expiresAt }),
      create: toGuestStudyDataCreateInput(parsed.data, { lastSyncedAt: now, expiresAt, tokenHash }),
    })

    return NextResponse.json(studyData)
  } catch (error) {
    if (error instanceof PrismaInitError) return dbUnavailableResponse(error)
    console.error('[guest-study-data:put] unexpected error', error)
    return NextResponse.json({ error: 'Failed to save guest study data' }, { status: 500 })
  }
}
