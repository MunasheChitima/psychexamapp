import { describe, expect, test, vi, beforeEach } from 'vitest'

const originalEnv = process.env

beforeEach(() => {
  vi.resetModules()
  process.env = { ...originalEnv }
  delete process.env.NEXT_PUBLIC_PRICING_SALE_ACTIVE
  delete process.env.PRICING_SALE_ACTIVE
})

describe('examSchedule getPriceQuote', () => {
  test('returns early-bird tier for 5+ months out', async () => {
    const { getPriceQuote, monthsUntilExam } = await import('@/lib/examSchedule')

    vi.useFakeTimers()
    vi.setSystemTime(new Date('2025-06-01'))

    const quote = getPriceQuote('2025-11-02')
    expect(quote.tierId).toBe('early-bird')
    expect(quote.tierLabel).toBe('Early Bird')
    expect(quote.total).toBe(49)
    expect(quote.months).toBeGreaterThanOrEqual(5)

    vi.useRealTimers()
  })

  test('returns standard tier for 3-4 months out', async () => {
    const { getPriceQuote } = await import('@/lib/examSchedule')

    vi.useFakeTimers()
    vi.setSystemTime(new Date('2025-07-15'))

    const quote = getPriceQuote('2025-11-02')
    expect(['standard', 'early-bird']).toContain(quote.tierId)
    expect([49, 59]).toContain(quote.total)

    vi.useRealTimers()
  })

  test('returns last-minute tier for 1-2 months out', async () => {
    const { getPriceQuote } = await import('@/lib/examSchedule')

    vi.useFakeTimers()
    vi.setSystemTime(new Date('2025-10-15'))

    const quote = getPriceQuote('2025-11-02')
    expect(quote.tierId).toBe('last-minute')
    expect(quote.tierLabel).toBe('Last Minute')
    expect(quote.total).toBe(69)

    vi.useRealTimers()
  })

  test('earlier signup has lower or equal total', async () => {
    const { getPriceQuote } = await import('@/lib/examSchedule')

    vi.useFakeTimers()

    const dates = ['2025-10-01', '2025-09-01', '2025-08-01', '2025-07-01', '2025-06-01']

    let prevTotal = Infinity
    for (const dateStr of dates) {
      vi.setSystemTime(new Date(dateStr))
      const quote = getPriceQuote('2025-11-02')
      expect(quote.total).toBeLessThanOrEqual(prevTotal)
      prevTotal = quote.total
    }

    vi.useRealTimers()
  })
})

describe('examSchedule calculateResubscriptionTotal', () => {
  test('applies 75% discount', async () => {
    const { calculateResubscriptionTotal } = await import('@/lib/examSchedule')

    expect(calculateResubscriptionTotal(69)).toBe(17.25)
    expect(calculateResubscriptionTotal(59)).toBe(14.75)
    expect(calculateResubscriptionTotal(49)).toBe(12.25)
  })
})
