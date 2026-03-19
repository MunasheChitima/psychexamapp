import type { NextRequest } from 'next/server'
import { beforeEach, describe, expect, test, vi } from 'vitest'

vi.mock('@/lib/featureFlags', () => ({
  isGuestCloudSaveEnabled: vi.fn(),
}))

vi.mock('@/lib/guestToken', () => ({
  guestTokenHash: vi.fn(),
  isValidGuestToken: vi.fn(),
}))

vi.mock('@/lib/prisma', () => ({
  prisma: {
    guestStudyData: {
      findUnique: vi.fn(),
      upsert: vi.fn(),
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

import { isGuestCloudSaveEnabled } from '@/lib/featureFlags'
import { guestTokenHash, isValidGuestToken } from '@/lib/guestToken'
import { getPrismaInitError, prisma } from '@/lib/prisma'
import { GET, PUT } from '@/app/api/study-data/guest/route'

type MockedFn = ReturnType<typeof vi.fn>

const mockedIsGuestCloudSaveEnabled = isGuestCloudSaveEnabled as unknown as MockedFn
const mockedIsValidGuestToken = isValidGuestToken as unknown as MockedFn
const mockedGuestTokenHash = guestTokenHash as unknown as MockedFn
const mockedGetPrismaInitError = getPrismaInitError as unknown as MockedFn
const mockedFindUnique = prisma.guestStudyData.findUnique as unknown as MockedFn
const mockedUpsert = prisma.guestStudyData.upsert as unknown as MockedFn

describe('guest study-data route', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockedIsGuestCloudSaveEnabled.mockReturnValue(true)
    mockedGetPrismaInitError.mockReturnValue(null)
    mockedIsValidGuestToken.mockReturnValue(true)
    mockedGuestTokenHash.mockReturnValue('hashed-token')
  })

  test('returns 404 when feature flag is disabled', async () => {
    mockedIsGuestCloudSaveEnabled.mockReturnValue(false)
    const response = await GET(new Request('http://localhost:3000/api/study-data/guest?token=abc') as NextRequest)
    const body = await response.json()

    expect(response.status).toBe(404)
    expect(body.error).toBe('Guest cloud save is disabled')
  })

  test('returns 401 for invalid token', async () => {
    mockedIsValidGuestToken.mockReturnValue(false)
    const response = await GET(new Request('http://localhost:3000/api/study-data/guest?token=abc') as NextRequest)
    const body = await response.json()

    expect(response.status).toBe(401)
    expect(body.error).toBe('Invalid or missing guest token')
  })

  test('GET returns stored guest record', async () => {
    mockedFindUnique.mockResolvedValue({
      id: 'guest-1',
      tokenHash: 'hashed-token',
      expiresAt: new Date(Date.now() + 60_000),
      studyGoal: 'moderate',
    })

    const response = await GET(new Request('http://localhost:3000/api/study-data/guest?token=abc') as NextRequest)
    const body = await response.json()

    expect(response.status).toBe(200)
    expect(body.id).toBe('guest-1')
  })

  test('PUT saves guest updates', async () => {
    mockedUpsert.mockResolvedValue({
      id: 'guest-1',
      tokenHash: 'hashed-token',
      examSittingId: 'sit-guest',
    })

    const request = new Request('http://localhost:3000/api/study-data/guest', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'x-guest-token': 'guest-token',
      },
      body: JSON.stringify({ examSittingId: 'sit-guest' }),
    }) as unknown as NextRequest

    const response = await PUT(request)
    const body = await response.json()

    expect(response.status).toBe(200)
    expect(mockedUpsert).toHaveBeenCalled()
    expect(body.examSittingId).toBe('sit-guest')
  })
})
