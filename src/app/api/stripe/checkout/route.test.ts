import { beforeEach, describe, expect, test, vi } from 'vitest'

const mocks = vi.hoisted(() => ({
  auth: vi.fn(),
  checkoutSessionCreate: vi.fn(),
  getSittingById: vi.fn(),
  getPriceQuote: vi.fn(),
  monthsUntilExam: vi.fn(),
  calculateResubscriptionTotal: vi.fn(),
  getProductConfig: vi.fn(),
  examResultFindFirst: vi.fn(),
}))

vi.mock('@/lib/auth', () => ({
  auth: mocks.auth,
}))

vi.mock('@/lib/stripe', () => ({
  stripe: {
    checkout: {
      sessions: {
        create: mocks.checkoutSessionCreate,
      },
    },
  },
}))

vi.mock('@/lib/prisma', () => ({
  prisma: {
    examResult: {
      findFirst: mocks.examResultFindFirst,
    },
  },
}))

vi.mock('@/lib/examSchedule', () => ({
  getSittingById: mocks.getSittingById,
  getPriceQuote: mocks.getPriceQuote,
  monthsUntilExam: mocks.monthsUntilExam,
  calculateResubscriptionTotal: mocks.calculateResubscriptionTotal,
}))

vi.mock('@/lib/productConfig', () => ({
  getProductConfig: mocks.getProductConfig,
}))

import { POST } from '@/app/api/stripe/checkout/route'

function makeRequest(body: object) {
  return new Request('http://localhost/api/stripe/checkout', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  }) as never
}

describe('POST /api/stripe/checkout', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    process.env.NEXTAUTH_URL = 'http://localhost:3100'

    mocks.monthsUntilExam.mockReturnValue(3)
    mocks.auth.mockResolvedValue({
      user: {
        id: 'user_1',
        email: 'user_1@example.com',
      },
    })
    mocks.getSittingById.mockReturnValue({
      id: 'nov_2026',
      label: 'Nov 2026',
      examStart: '2026-11-01',
      examEnd: '2026-11-02',
    })
    mocks.getPriceQuote.mockReturnValue({
      tierId: 'standard',
      tierLabel: 'Standard',
      total: 59,
      months: 3,
    })
    mocks.calculateResubscriptionTotal.mockImplementation((total: number) =>
      Math.round(total * 0.25 * 100) / 100
    )
    mocks.getProductConfig.mockReturnValue({
      examName: 'National Psychology Exam',
    })
    mocks.checkoutSessionCreate.mockResolvedValue({ url: 'https://checkout.stripe.test/session_1' })
    mocks.examResultFindFirst.mockResolvedValue(null)
  })

  test('creates one-time payment checkout session', async () => {
    const response = await POST(makeRequest({ examSittingId: 'nov_2026', isResubscription: false }))

    expect(response.status).toBe(200)
    expect(mocks.checkoutSessionCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        mode: 'payment',
        line_items: expect.arrayContaining([
          expect.objectContaining({
            price_data: expect.objectContaining({
              currency: 'aud',
              unit_amount: 5900,
              product_data: expect.objectContaining({
                name: expect.stringMatching(/National Psychology Exam.*Standard.*Nov 2026/),
              }),
            }),
            quantity: 1,
          }),
        ]),
        metadata: expect.objectContaining({
          userId: 'user_1',
          examSittingId: 'nov_2026',
          productLine: 'psychology',
          pricingTier: 'standard',
          amountPaid: '59',
        }),
      })
    )
  })

  test('applies resit discount when verified', async () => {
    mocks.examResultFindFirst.mockResolvedValue({
      id: 'result_1',
      userId: 'user_1',
      status: 'approved',
      outcome: 'fail',
    })
    mocks.calculateResubscriptionTotal.mockReturnValue(14.75)

    const response = await POST(
      makeRequest({ examSittingId: 'nov_2026', isResubscription: true })
    )

    expect(response.status).toBe(200)
    expect(mocks.checkoutSessionCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        line_items: expect.arrayContaining([
          expect.objectContaining({
            price_data: expect.objectContaining({
              unit_amount: 1475,
            }),
          }),
        ]),
        metadata: expect.objectContaining({
          amountPaid: '14.75',
          isResubscription: 'true',
        }),
      })
    )
  })

  test('returns 400 when exam sitting is missing', async () => {
    const response = await POST(makeRequest({}))

    expect(response.status).toBe(400)
    const body = await response.json()
    expect(body.error).toContain('select an exam sitting')
  })

  test('returns 400 when exam sitting is invalid', async () => {
    mocks.getSittingById.mockReturnValue(undefined)

    const response = await POST(makeRequest({ examSittingId: 'invalid' }))

    expect(response.status).toBe(400)
    const body = await response.json()
    expect(body.error).toContain('Invalid exam sitting')
  })

  test('returns 403 when resit requested but no verified fail', async () => {
    mocks.examResultFindFirst.mockResolvedValue(null)

    const response = await POST(
      makeRequest({ examSittingId: 'nov_2026', isResubscription: true })
    )

    expect(response.status).toBe(403)
    const body = await response.json()
    expect(body.error).toContain('verified failed exam result')
  })

  test('passes productLine to checkout for nursing', async () => {
    mocks.getProductConfig.mockReturnValue({
      examName: 'AHPRA Nursing (NCLEX-RN + OSCE)',
    })

    const response = await POST(
      makeRequest({ examSittingId: 'nov_2026', productLine: 'nursing' })
    )

    expect(response.status).toBe(200)
    expect(mocks.checkoutSessionCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        metadata: expect.objectContaining({
          productLine: 'nursing',
        }),
      })
    )
    expect(mocks.getProductConfig).toHaveBeenCalledWith('nursing')
  })
})
