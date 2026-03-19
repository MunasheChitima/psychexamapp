import type { NextRequest } from 'next/server'
import { beforeEach, describe, expect, test, vi } from 'vitest'

vi.mock('@/lib/auth', () => ({
  auth: vi.fn(),
}))

vi.mock('@/lib/prisma', () => ({
  prisma: {
    studyData: {
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

import { auth } from '@/lib/auth'
import { prisma, getPrismaInitError, PrismaInitError } from '@/lib/prisma'
import { GET, PUT } from '@/app/api/study-data/route'

type MockedFn = ReturnType<typeof vi.fn>

const mockedAuth = auth as unknown as MockedFn
const mockedGetPrismaInitError = getPrismaInitError as unknown as MockedFn
const mockedFindUnique = prisma.studyData.findUnique as unknown as MockedFn
const mockedUpsert = prisma.studyData.upsert as unknown as MockedFn

const requestLike = {
  headers: new Headers(),
  url: 'http://localhost:3000/api/study-data',
} as unknown as NextRequest

describe('study-data route', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockedGetPrismaInitError.mockReturnValue(null)
  })

  test('GET returns 503 when prisma is unavailable', async () => {
    mockedGetPrismaInitError.mockReturnValue(new PrismaInitError('DATABASE_URL_MISSING', 'missing'))

    const response = await GET(requestLike)
    const body = await response.json()

    expect(response.status).toBe(503)
    expect(body.error).toBe('Study data service unavailable')
    expect(body.code).toBe('DATABASE_URL_MISSING')
  })

  test('GET returns 401 for unauthenticated users', async () => {
    mockedAuth.mockResolvedValue(null)

    const response = await GET(requestLike)
    const body = await response.json()

    expect(response.status).toBe(401)
    expect(body).toEqual({ error: 'Unauthorized' })
  })

  test('PUT accepts and persists examSittingId', async () => {
    mockedAuth.mockResolvedValue({ user: { id: 'user-1' } })
    mockedUpsert.mockResolvedValue({ id: 'study-1', userId: 'user-1', examSittingId: 'sit-001' })

    const req = new Request('http://localhost:3000/api/study-data', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ examSittingId: 'sit-001' }),
    }) as unknown as NextRequest

    const response = await PUT(req)
    const body = await response.json()

    expect(response.status).toBe(200)
    expect(mockedUpsert).toHaveBeenCalledWith(
      expect.objectContaining({
        update: expect.objectContaining({
          examSittingId: 'sit-001',
        }),
      })
    )
    expect(body.examSittingId).toBe('sit-001')
  })

  test('GET returns existing studyData', async () => {
    mockedAuth.mockResolvedValue({ user: { id: 'user-1' } })
    mockedFindUnique.mockResolvedValue({ id: 'study-1', userId: 'user-1' })

    const response = await GET(requestLike)
    const body = await response.json()

    expect(response.status).toBe(200)
    expect(body.id).toBe('study-1')
  })
})
