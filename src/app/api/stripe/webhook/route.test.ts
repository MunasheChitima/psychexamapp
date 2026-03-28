import { beforeEach, describe, expect, test, vi } from 'vitest'

const mocks = vi.hoisted(() => ({
  constructEvent: vi.fn(),
  stripeSubscriptionsUpdate: vi.fn(),
  stripeSubscriptionsRetrieve: vi.fn(),
  getActiveBuddyPairByUserId: vi.fn(),
  sendSubscriptionConfirmationEmail: vi.fn(),
  getSittingById: vi.fn(),
  subscriptionFindUnique: vi.fn(),
  subscriptionFindFirst: vi.fn(),
  subscriptionUpdate: vi.fn(),
  subscriptionUpdateMany: vi.fn(),
  subscriptionUpsert: vi.fn(),
  studyDataUpsert: vi.fn(),
  referralCodeFindUnique: vi.fn(),
  buddyPairUpsert: vi.fn(),
  buddyPairUpdate: vi.fn(),
  userFindUnique: vi.fn(),
  transaction: vi.fn(),
  stripeProcessedEventCreate: vi.fn(),
  stripeProcessedEventDelete: vi.fn(),
}))

vi.mock('@/lib/stripe', () => ({
  stripe: {
    webhooks: { constructEvent: mocks.constructEvent },
    subscriptions: {
      update: mocks.stripeSubscriptionsUpdate,
      retrieve: mocks.stripeSubscriptionsRetrieve,
    },
  },
}))

vi.mock('@/lib/buddy', () => ({
  BUDDY_FREE_MONTH_COUPON_ID: 'coupon_free',
  BUDDY_HALF_OFF_COUPON_ID: 'coupon_half',
  getActiveBuddyPairByUserId: mocks.getActiveBuddyPairByUserId,
}))

vi.mock('@/lib/email', () => ({
  sendSubscriptionConfirmationEmail: mocks.sendSubscriptionConfirmationEmail,
}))

vi.mock('@/lib/examSchedule', () => ({
  getSittingById: mocks.getSittingById,
  PRICING_TIERS: [
    { id: 'early-bird', label: 'Early Bird', total: 49, minMonths: 5, savings: 'Save $20' },
    { id: 'standard', label: 'Standard', total: 59, minMonths: 3, savings: 'Save $10' },
    { id: 'last-minute', label: 'Last Minute', total: 69, minMonths: 1, savings: '' },
  ],
}))

vi.mock('@/lib/prisma', () => ({
  prisma: {
    subscription: {
      findUnique: mocks.subscriptionFindUnique,
      findFirst: mocks.subscriptionFindFirst,
      update: mocks.subscriptionUpdate,
      updateMany: mocks.subscriptionUpdateMany,
      upsert: mocks.subscriptionUpsert,
    },
    studyData: {
      upsert: mocks.studyDataUpsert,
    },
    referralCode: {
      findUnique: mocks.referralCodeFindUnique,
    },
    buddyPair: {
      upsert: mocks.buddyPairUpsert,
      update: mocks.buddyPairUpdate,
    },
    user: {
      findUnique: mocks.userFindUnique,
    },
    stripeProcessedEvent: {
      create: mocks.stripeProcessedEventCreate,
      delete: mocks.stripeProcessedEventDelete,
    },
    $transaction: mocks.transaction,
  },
}))

async function importRoute() {
  return import('@/app/api/stripe/webhook/route')
}

function makeWebhookRequest(body = '{}') {
  return new Request('http://localhost/api/stripe/webhook', {
    method: 'POST',
    headers: { 'stripe-signature': 'sig_test' },
    body,
  }) as never
}

describe('POST /api/stripe/webhook buddy lifecycle', () => {
  beforeEach(() => {
    vi.resetModules()
    vi.clearAllMocks()

    process.env.STRIPE_WEBHOOK_SECRET = 'whsec_test'

    mocks.sendSubscriptionConfirmationEmail.mockResolvedValue(undefined)
    mocks.transaction.mockResolvedValue([])
    mocks.getSittingById.mockReturnValue(null)
    mocks.subscriptionUpdate.mockResolvedValue({})
    mocks.subscriptionUpdateMany.mockResolvedValue({ count: 1 })
    mocks.subscriptionUpsert.mockResolvedValue({})
    mocks.studyDataUpsert.mockResolvedValue({})
    mocks.userFindUnique.mockResolvedValue(null)
    mocks.stripeSubscriptionsUpdate.mockResolvedValue({})
    mocks.stripeSubscriptionsRetrieve.mockResolvedValue({
      metadata: {
        examSittingId: '',
        examStartDate: '',
        examEndDate: '',
        monthlyRate: '19',
        pricingTier: 'standard',
        isResubscription: 'false',
        totalMonths: '1',
      },
    })
    mocks.stripeProcessedEventCreate.mockResolvedValue({})
    mocks.stripeProcessedEventDelete.mockResolvedValue({})
  })

  test('creates subscription record for one-time payment checkout', async () => {
    const { POST } = await importRoute()

    mocks.getSittingById.mockReturnValue({
      id: 'nov_2026',
      label: 'November 2026',
      examStart: '2026-11-02',
      examEnd: '2026-11-27',
    })
    mocks.userFindUnique.mockResolvedValue({
      email: 'user@example.com',
      name: 'Test User',
    })

    mocks.constructEvent.mockReturnValue({
      id: 'evt_onetime_1',
      type: 'checkout.session.completed',
      data: {
        object: {
          mode: 'payment',
          payment_status: 'paid',
          metadata: {
            userId: 'user_onetime',
            examSittingId: 'nov_2026',
            examStartDate: '2026-11-02',
            examEndDate: '2026-11-27',
            productLine: 'psychology',
            pricingTier: 'early-bird',
            amountPaid: '49',
            isResubscription: 'false',
            totalMonths: '6',
          },
          customer: 'cus_onetime',
        },
      },
    })

    const response = await POST(makeWebhookRequest())

    expect(response.status).toBe(200)
    expect(mocks.subscriptionUpsert).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { userId: 'user_onetime' },
        create: expect.objectContaining({
          userId: 'user_onetime',
          stripeSubscriptionId: null,
          monthlyRate: 49,
          pricingTier: 'early-bird',
          status: 'active',
          examStartDate: '2026-11-02',
        }),
      })
    )
    expect(mocks.sendSubscriptionConfirmationEmail).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 'user_onetime',
        amountPaid: 49,
        months: 6,
      })
    )
  })

  test('activates buddy pair and applies free-month coupon on checkout completion', async () => {
    const { POST } = await importRoute()

    mocks.constructEvent.mockReturnValue({
      id: 'evt_checkout_activate_1',
      type: 'checkout.session.completed',
      data: {
        object: {
          metadata: { userId: 'invitee_user' },
          subscription: 'sub_invitee',
          customer: 'cus_invitee',
        },
      },
    })
    mocks.referralCodeFindUnique.mockResolvedValue({
      ownerUserId: 'inviter_user',
      redeemedBy: 'invitee_user',
    })
    mocks.subscriptionFindUnique
      .mockResolvedValueOnce({ stripeSubscriptionId: 'sub_inviter', status: 'active' })
      .mockResolvedValueOnce({ stripeSubscriptionId: 'sub_invitee', status: 'active' })
    mocks.buddyPairUpsert.mockResolvedValue({
      id: 'pair_1',
      freeMonthAppliedAt: null,
    })

    const response = await POST(makeWebhookRequest())

    expect(response.status).toBe(200)
    expect(mocks.buddyPairUpsert).toHaveBeenCalledWith(
      expect.objectContaining({
        update: expect.objectContaining({ status: 'active' }),
        create: expect.objectContaining({
          inviterUserId: 'inviter_user',
          inviteeUserId: 'invitee_user',
        }),
      })
    )
    expect(mocks.stripeSubscriptionsUpdate).toHaveBeenCalledTimes(2)
    expect(mocks.stripeSubscriptionsUpdate).toHaveBeenNthCalledWith(1, 'sub_inviter', {
      discounts: [{ coupon: 'coupon_free' }],
    })
    expect(mocks.stripeSubscriptionsUpdate).toHaveBeenNthCalledWith(2, 'sub_invitee', {
      discounts: [{ coupon: 'coupon_free' }],
    })
    expect(mocks.buddyPairUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 'pair_1' },
        data: expect.objectContaining({ freeMonthAppliedAt: expect.any(Date) }),
      })
    )
  })

  test('returns duplicate acknowledgement on replayed webhook id', async () => {
    const { POST } = await importRoute()
    mocks.stripeProcessedEventCreate
      .mockReset()
      .mockResolvedValueOnce({})
      .mockRejectedValueOnce(Object.assign(new Error('duplicate event'), { code: 'P2002' }))
    mocks.constructEvent.mockReturnValue({
      id: 'evt_duplicate_1',
      type: 'invoice.payment_failed',
      data: {
        object: {
          parent: { subscription_details: { subscription: 'sub_123' } },
        },
      },
    })

    const first = await POST(makeWebhookRequest())
    const second = await POST(makeWebhookRequest())
    const secondBody = await second.json()

    expect(first.status).toBe(200)
    expect(second.status).toBe(200)
    expect(secondBody).toEqual({ received: true, duplicate: true })
    expect(mocks.subscriptionUpdateMany).toHaveBeenCalledTimes(1)
  })

  test('reprocesses same event id after module reload without duplicating state-side effects', async () => {
    mocks.stripeProcessedEventCreate
      .mockReset()
      .mockResolvedValueOnce({})
      .mockRejectedValueOnce(Object.assign(new Error('duplicate event'), { code: 'P2002' }))
    const firstModule = await importRoute()
    mocks.constructEvent.mockReturnValue({
      id: 'evt_restart_replay_1',
      type: 'invoice.paid',
      data: {
        object: {
          amount_paid: 0,
          parent: {
            subscription_details: {
              subscription: 'sub_invitee',
            },
          },
        },
      },
    })
    mocks.subscriptionFindFirst.mockResolvedValue({ userId: 'invitee_user' })
    mocks.getActiveBuddyPairByUserId.mockResolvedValue({
      id: 'pair_restart',
      inviterUserId: 'inviter_user',
      inviteeUserId: 'invitee_user',
      freeMonthAppliedAt: new Date('2026-01-01T00:00:00.000Z'),
      halfOffActiveFrom: new Date('2026-02-01T00:00:00.000Z'),
    })

    const firstResponse = await firstModule.POST(makeWebhookRequest())
    expect(firstResponse.status).toBe(200)
    expect(mocks.stripeSubscriptionsUpdate).not.toHaveBeenCalled()
    expect(mocks.buddyPairUpdate).not.toHaveBeenCalled()

    vi.resetModules()
    const secondModule = await importRoute()
    const secondResponse = await secondModule.POST(makeWebhookRequest())

    expect(secondResponse.status).toBe(200)
    expect(mocks.stripeSubscriptionsUpdate).not.toHaveBeenCalled()
    expect(mocks.buddyPairUpdate).not.toHaveBeenCalled()
  })

  test('activates half-off after zero-dollar invoice when free month was applied', async () => {
    const { POST } = await importRoute()
    mocks.constructEvent.mockReturnValue({
      id: 'evt_invoice_half_off_1',
      type: 'invoice.paid',
      data: {
        object: {
          amount_paid: 0,
          parent: {
            subscription_details: {
              subscription: 'sub_invitee',
            },
          },
        },
      },
    })
    mocks.subscriptionFindFirst.mockResolvedValue({ userId: 'invitee_user' })
    mocks.getActiveBuddyPairByUserId.mockResolvedValue({
      id: 'pair_2',
      inviterUserId: 'inviter_user',
      inviteeUserId: 'invitee_user',
      freeMonthAppliedAt: new Date('2026-01-01T00:00:00.000Z'),
      halfOffActiveFrom: null,
    })
    mocks.subscriptionFindUnique
      .mockResolvedValueOnce({ stripeSubscriptionId: 'sub_inviter', status: 'active' })
      .mockResolvedValueOnce({ stripeSubscriptionId: 'sub_invitee', status: 'active' })

    const response = await POST(makeWebhookRequest())

    expect(response.status).toBe(200)
    expect(mocks.stripeSubscriptionsUpdate).toHaveBeenCalledTimes(2)
    expect(mocks.stripeSubscriptionsUpdate).toHaveBeenNthCalledWith(1, 'sub_inviter', {
      discounts: [{ coupon: 'coupon_half' }],
    })
    expect(mocks.stripeSubscriptionsUpdate).toHaveBeenNthCalledWith(2, 'sub_invitee', {
      discounts: [{ coupon: 'coupon_half' }],
    })
    expect(mocks.buddyPairUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 'pair_2' },
        data: expect.objectContaining({ halfOffActiveFrom: expect.any(Date) }),
      })
    )
  })

  test('does not reapply half-off coupons when already active', async () => {
    const { POST } = await importRoute()
    mocks.constructEvent.mockReturnValue({
      id: 'evt_invoice_half_off_replay_1',
      type: 'invoice.paid',
      data: {
        object: {
          amount_paid: 0,
          parent: {
            subscription_details: {
              subscription: 'sub_invitee',
            },
          },
        },
      },
    })
    mocks.subscriptionFindFirst.mockResolvedValue({ userId: 'invitee_user' })
    mocks.getActiveBuddyPairByUserId.mockResolvedValue({
      id: 'pair_2',
      inviterUserId: 'inviter_user',
      inviteeUserId: 'invitee_user',
      freeMonthAppliedAt: new Date('2026-01-01T00:00:00.000Z'),
      halfOffActiveFrom: new Date('2026-02-01T00:00:00.000Z'),
    })

    const response = await POST(makeWebhookRequest())

    expect(response.status).toBe(200)
    expect(mocks.stripeSubscriptionsUpdate).not.toHaveBeenCalled()
    expect(mocks.buddyPairUpdate).not.toHaveBeenCalled()
  })

  test('dissolves active pair and clears partner coupon on subscription deletion', async () => {
    const { POST } = await importRoute()
    mocks.constructEvent.mockReturnValue({
      id: 'evt_subscription_deleted_1',
      type: 'customer.subscription.deleted',
      data: {
        object: {
          metadata: {
            userId: 'invitee_user',
          },
        },
      },
    })
    mocks.getActiveBuddyPairByUserId.mockResolvedValue({
      id: 'pair_3',
      inviterUserId: 'inviter_user',
      inviteeUserId: 'invitee_user',
      status: 'active',
    })
    mocks.subscriptionFindUnique.mockResolvedValue({
      stripeSubscriptionId: 'sub_inviter',
      status: 'active',
    })

    const response = await POST(makeWebhookRequest())

    expect(response.status).toBe(200)
    expect(mocks.subscriptionUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { userId: 'invitee_user' },
        data: expect.objectContaining({
          status: 'expired',
          cancelledAt: expect.any(Date),
        }),
      })
    )
    expect(mocks.stripeSubscriptionsUpdate).toHaveBeenCalledWith('sub_inviter', { discounts: [] })
    expect(mocks.buddyPairUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 'pair_3' },
        data: expect.objectContaining({
          status: 'dissolved',
          dissolvedAt: expect.any(Date),
        }),
      })
    )
  })
})
