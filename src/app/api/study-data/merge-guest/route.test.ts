import type { NextRequest } from 'next/server'
import { beforeEach, describe, expect, test, vi } from 'vitest'

vi.mock('@/lib/auth', () => ({
  auth: vi.fn(),
}))

vi.mock('@/lib/featureFlags', () => ({
  isGuestCloudSaveEnabled: vi.fn(),
}))

vi.mock('@/lib/guestToken', () => ({
  guestTokenHash: vi.fn(),
  isValidGuestToken: vi.fn(),
}))

vi.mock('@/lib/studyDataSync', () => ({
  mergeGuestIntoUserStudyData: vi.fn(),
}))

vi.mock('@/lib/prisma', () => ({
  prisma: {
    guestStudyData: {
      findUnique: vi.fn(),
      delete: vi.fn(),
    },
    studyData: {
      upsert: vi.fn(),
      update: vi.fn(),
    },
  },
  getPrismaInitError: vi.fn(),
  PrismaInitError: class PrismaInitError extends Error {
    code: string
    constructor(code: string, message: string) {
      super(message)
      this.code = code
    }
  },
}))

import { auth } from '@/lib/auth'
import { isGuestCloudSaveEnabled } from '@/lib/featureFlags'
import { guestTokenHash, isValidGuestToken } from '@/lib/guestToken'
import { mergeGuestIntoUserStudyData } from '@/lib/studyDataSync'
import { getPrismaInitError, prisma } from '@/lib/prisma'
import { POST } from '@/app/api/study-data/merge-guest/route'

type MockedFn = ReturnType<typeof vi.fn>

const mockedAuth = auth as unknown as MockedFn
const mockedIsGuestCloudSaveEnabled = isGuestCloudSaveEnabled as unknown as MockedFn
const mockedIsValidGuestToken = isValidGuestToken as unknown as MockedFn
const mockedGuestTokenHash = guestTokenHash as unknown as MockedFn
const mockedMergeGuestIntoUserStudyData = mergeGuestIntoUserStudyData as unknown as MockedFn
const mockedGetPrismaInitError = getPrismaInitError as unknown as MockedFn
const mockedFindGuest = prisma.guestStudyData.findUnique as unknown as MockedFn
const mockedDeleteGuest = prisma.guestStudyData.delete as unknown as MockedFn
const mockedUpsertUser = prisma.studyData.upsert as unknown as MockedFn
const mockedUpdateUser = prisma.studyData.update as unknown as MockedFn

describe('POST /api/study-data/merge-guest', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockedIsGuestCloudSaveEnabled.mockReturnValue(true)
    mockedGetPrismaInitError.mockReturnValue(null)
    mockedAuth.mockResolvedValue({ user: { id: 'user-1' } })
    mockedIsValidGuestToken.mockReturnValue(true)
    mockedGuestTokenHash.mockReturnValue('hashed-token')
  })

  test('returns merged false when feature flag is disabled', async () => {
    mockedIsGuestCloudSaveEnabled.mockReturnValue(false)

    const response = await POST(
      new Request('http://localhost:3000/api/study-data/merge-guest', {
        method: 'POST',
        body: JSON.stringify({ token: 'guest-token' }),
      }) as NextRequest
    )
    const body = await response.json()

    expect(response.status).toBe(200)
    expect(body).toEqual({ merged: false, reason: 'disabled' })
  })

  test('returns 401 when user is unauthenticated', async () => {
    mockedAuth.mockResolvedValue(null)

    const response = await POST(
      new Request('http://localhost:3000/api/study-data/merge-guest', {
        method: 'POST',
        body: JSON.stringify({ token: 'guest-token' }),
      }) as NextRequest
    )
    const body = await response.json()

    expect(response.status).toBe(401)
    expect(body).toEqual({ error: 'Unauthorized' })
  })

  test('merges guest data into user data', async () => {
    mockedFindGuest.mockResolvedValue({
      tokenHash: 'hashed-token',
      expiresAt: new Date(Date.now() + 60_000),
      studyGoal: 'moderate',
      updatedAt: new Date(),
    })
    mockedUpsertUser.mockResolvedValue({
      userId: 'user-1',
      studyGoal: 'casual',
      updatedAt: new Date(Date.now() - 60_000),
    })
    mockedMergeGuestIntoUserStudyData.mockReturnValue({
      studyGoal: 'moderate',
      hasCompletedOnboarding: true,
    })
    mockedUpdateUser.mockResolvedValue({
      userId: 'user-1',
      studyGoal: 'moderate',
      hasCompletedOnboarding: true,
    })
    mockedDeleteGuest.mockResolvedValue({})

    const response = await POST(
      new Request('http://localhost:3000/api/study-data/merge-guest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: 'guest-token' }),
      }) as NextRequest
    )
    const body = await response.json()

    expect(response.status).toBe(200)
    expect(mockedMergeGuestIntoUserStudyData).toHaveBeenCalled()
    expect(mockedDeleteGuest).toHaveBeenCalledWith({
      where: { tokenHash: 'hashed-token' },
    })
    expect(body.merged).toBe(true)
  })
})
