import type { NextRequest } from 'next/server'
import { beforeEach, describe, expect, test, vi } from 'vitest'

vi.mock('@/lib/auth', () => ({
  auth: vi.fn(),
}))

vi.mock('@/lib/prisma', () => ({
  prisma: {
    referralCode: {
      findUnique: vi.fn(),
      update: vi.fn(),
    },
    buddyPair: {
      findFirst: vi.fn(),
    },
  },
}))

import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { POST } from '@/app/api/referrals/redeem/route'

type MockFn = ReturnType<typeof vi.fn>

const mockedAuth = auth as unknown as MockFn
const mockedReferralFindUnique = prisma.referralCode.findUnique as unknown as MockFn
const mockedReferralUpdate = prisma.referralCode.update as unknown as MockFn
const mockedBuddyPairFindFirst = prisma.buddyPair.findFirst as unknown as MockFn

function makeRequest(code: unknown): NextRequest {
  return new Request('http://localhost:3000/api/referrals/redeem', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ code }),
  }) as unknown as NextRequest
}

function buildReferral(overrides: Record<string, unknown> = {}) {
  return {
    id: 'ref_1',
    code: 'BUDDY123',
    ownerUserId: 'inviter_user',
    redeemedBy: null,
    expiresAt: new Date('2099-01-01T00:00:00.000Z'),
    owner: {
      id: 'inviter_user',
      name: 'Inviter User',
      email: 'inviter@example.com',
    },
    ...overrides,
  }
}

describe('POST /api/referrals/redeem', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockedAuth.mockResolvedValue({ user: { id: 'invitee_user' } })
    mockedBuddyPairFindFirst.mockResolvedValue(null)
  })

  test('returns 410 for expired referral code', async () => {
    mockedReferralFindUnique
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce(buildReferral({ expiresAt: new Date('2000-01-01T00:00:00.000Z') }))

    const response = await POST(makeRequest('buddy123'))
    const body = await response.json()

    expect(response.status).toBe(410)
    expect(body).toEqual({ error: 'This referral code has expired' })
  })

  test('returns 400 when user attempts to redeem own code', async () => {
    mockedAuth.mockResolvedValue({ user: { id: 'inviter_user' } })
    mockedReferralFindUnique
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce(buildReferral({ ownerUserId: 'inviter_user' }))

    const response = await POST(makeRequest('buddy123'))
    const body = await response.json()

    expect(response.status).toBe(400)
    expect(body).toEqual({ error: 'You cannot redeem your own referral code' })
  })

  test('returns 409 for already-used referral code', async () => {
    mockedReferralFindUnique
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce(buildReferral({ redeemedBy: 'other_user' }))

    const response = await POST(makeRequest('buddy123'))
    const body = await response.json()

    expect(response.status).toBe(409)
    expect(body).toEqual({ error: 'This referral code has already been used' })
  })

  test('returns 409 when current user already redeemed a code', async () => {
    mockedReferralFindUnique.mockResolvedValueOnce({
      id: 'existing_redemption',
      redeemedBy: 'invitee_user',
    })

    const response = await POST(makeRequest('buddy123'))
    const body = await response.json()

    expect(response.status).toBe(409)
    expect(body).toEqual({ error: 'You have already redeemed a referral code' })
  })

  test('returns 409 when either user is already in an active buddy pair', async () => {
    mockedReferralFindUnique
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce(buildReferral())
    mockedBuddyPairFindFirst.mockResolvedValue({ id: 'pair_1', status: 'active' })

    const response = await POST(makeRequest('buddy123'))
    const body = await response.json()

    expect(response.status).toBe(409)
    expect(body).toEqual({ error: 'One of these users already has an active buddy pair' })
  })

  test('redeems successfully when validation passes', async () => {
    mockedReferralFindUnique
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce(buildReferral())
    mockedReferralUpdate.mockResolvedValue({ code: 'BUDDY123' })

    const response = await POST(makeRequest('buddy123'))
    const body = await response.json()

    expect(response.status).toBe(200)
    expect(body).toMatchObject({
      redeemed: true,
      referralCode: 'BUDDY123',
      inviter: {
        id: 'inviter_user',
      },
    })
    expect(mockedReferralUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 'ref_1' },
        data: expect.objectContaining({
          redeemedBy: 'invitee_user',
          redeemedAt: expect.any(Date),
        }),
      })
    )
  })
})
