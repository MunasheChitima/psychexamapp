import type { NextRequest } from 'next/server'
import { describe, expect, test, vi, beforeEach } from 'vitest'

vi.mock('@/lib/auth', () => ({
  auth: vi.fn(),
}))

vi.mock('@/lib/prisma', () => ({
  prisma: {
    subscription: {
      findUnique: vi.fn(),
    },
  },
}))

import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { GET } from '@/app/api/subscription/route'

type MockedAuth = ReturnType<typeof vi.fn>
type MockedFindUnique = ReturnType<typeof vi.fn>

const mockedAuth = auth as unknown as MockedAuth
const mockedFindUnique = prisma.subscription.findUnique as unknown as MockedFindUnique

const requestLike = {
  headers: new Headers(),
  url: 'http://localhost:3000/api/subscription',
} as unknown as NextRequest

describe('GET /api/subscription', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  test('returns 401 when user is not authenticated', async () => {
    mockedAuth.mockResolvedValue(null)

    const response = await GET(requestLike)
    const body = await response.json()

    expect(response.status).toBe(401)
    expect(body).toEqual({ error: 'Unauthorized' })
  })

  test('returns inactive when subscription does not exist', async () => {
    mockedAuth.mockResolvedValue({ user: { id: 'user-1' } })
    mockedFindUnique.mockResolvedValue(null)

    const response = await GET(requestLike)
    const body = await response.json()

    expect(response.status).toBe(200)
    expect(body).toEqual({ subscription: null, active: false })
  })

  test('returns active for active status with non-expired date', async () => {
    mockedAuth.mockResolvedValue({ user: { id: 'user-1' } })
    mockedFindUnique.mockResolvedValue({
      id: 'sub-1',
      status: 'active',
      pricingTier: 'standard',
      expiresAt: new Date('2030-01-01T00:00:00.000Z'),
      stripeCustomerId: 'cus_123',
      monthlyRate: 15,
      examSittingId: 'exam-1',
      isResubscription: false,
      failDiscountApplied: false,
    })

    const response = await GET(requestLike)
    const body = await response.json()

    expect(response.status).toBe(200)
    expect(body.active).toBe(true)
    expect(body.subscription.status).toBe('active')
  })

  test('returns active for trialing status with no expiry date', async () => {
    mockedAuth.mockResolvedValue({ user: { id: 'user-1' } })
    mockedFindUnique.mockResolvedValue({
      id: 'sub-2',
      status: 'trialing',
      pricingTier: 'focused',
      expiresAt: null,
      stripeCustomerId: 'cus_456',
      monthlyRate: 17,
      examSittingId: 'exam-2',
      isResubscription: false,
      failDiscountApplied: false,
    })

    const response = await GET(requestLike)
    const body = await response.json()

    expect(response.status).toBe(200)
    expect(body.active).toBe(true)
  })

  test('returns inactive when active subscription is expired', async () => {
    mockedAuth.mockResolvedValue({ user: { id: 'user-1' } })
    mockedFindUnique.mockResolvedValue({
      id: 'sub-3',
      status: 'active',
      pricingTier: 'last-minute',
      expiresAt: new Date('2000-01-01T00:00:00.000Z'),
      stripeCustomerId: 'cus_789',
      monthlyRate: 19,
      examSittingId: 'exam-3',
      isResubscription: false,
      failDiscountApplied: false,
    })

    const response = await GET(requestLike)
    const body = await response.json()

    expect(response.status).toBe(200)
    expect(body.active).toBe(false)
  })

  test('returns inactive for non-active statuses', async () => {
    mockedAuth.mockResolvedValue({ user: { id: 'user-1' } })
    mockedFindUnique.mockResolvedValue({
      id: 'sub-4',
      status: 'past_due',
      pricingTier: 'standard',
      expiresAt: new Date('2030-01-01T00:00:00.000Z'),
      stripeCustomerId: 'cus_111',
      monthlyRate: 15,
      examSittingId: 'exam-4',
      isResubscription: false,
      failDiscountApplied: false,
    })

    const response = await GET(requestLike)
    const body = await response.json()

    expect(response.status).toBe(200)
    expect(body.active).toBe(false)
  })

  test('returns 500 on database errors', async () => {
    mockedAuth.mockResolvedValue({ user: { id: 'user-1' } })
    mockedFindUnique.mockRejectedValue(new Error('database failed'))

    const response = await GET(requestLike)
    const body = await response.json()

    expect(response.status).toBe(500)
    expect(body).toEqual({ error: 'Failed to fetch subscription' })
  })
})
