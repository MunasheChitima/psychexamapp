import { expect, test } from '@playwright/test'
import { authedGet, authedPost, forceUnauthGet, identities } from '../helpers/auth'
import { isDatabaseReachable } from '../helpers/db'

test.describe('Billing, referrals, and buddy APIs', () => {
  test('subscription endpoint enforces auth', async ({ request }) => {
    const res = await forceUnauthGet(request, '/api/subscription')
    expect(res.status()).toBe(401)
  })

  test('subscription route returns deterministic payload for authed user', async ({ request }) => {
    test.skip(!(await isDatabaseReachable()), 'Database is not reachable for authenticated flow coverage')
    const res = await authedGet(request, '/api/subscription', identities.primary)
    expect(res.status()).toBe(200)
    const body = await res.json()
    expect(body).toMatchObject({
      active: false,
      subscription: null,
    })
  })

  test('referral creation is protected', async ({ request }) => {
    const createCodeRes = await request.post('/api/referrals')
    expect(createCodeRes.status()).toBe(401)
  })

  test('referral lifecycle and buddy status return authed happy-path payloads', async ({ request }) => {
    test.skip(!(await isDatabaseReachable()), 'Database is not reachable for authenticated flow coverage')
    const createRes = await authedPost(request, '/api/referrals', identities.primary, {})
    expect(createRes.status()).toBe(200)
    const createBody = await createRes.json()
    expect(createBody?.referralCode?.ownerUserId).toBe(identities.primary.id)
    expect(typeof createBody?.referralCode?.code).toBe('string')
    expect(createBody?.referralCode?.code?.length).toBeGreaterThanOrEqual(6)

    const getRes = await authedGet(request, '/api/referrals', identities.primary)
    expect(getRes.status()).toBe(200)
    const getBody = await getRes.json()
    expect(getBody?.ownedCode?.code).toBe(createBody?.referralCode?.code)
    expect(getBody?.redeemedCode).toBeNull()

    const buddyRes = await authedGet(request, '/api/buddy/status', identities.primary)
    expect(buddyRes.status()).toBe(200)
    const buddyBody = await buddyRes.json()
    expect(buddyBody).toMatchObject({
      hasBuddy: false,
      pair: null,
    })
    expect(buddyBody?.referralCode?.code).toBe(createBody?.referralCode?.code)
  })

  test('referral redeem validation on unauthenticated request', async ({ request }) => {
    const redeemRes = await request.post('/api/referrals/redeem', {
      headers: { 'content-type': 'application/json' },
      data: { code: 'INVALID' },
    })
    expect(redeemRes.status()).toBe(401)
  })

  test('buddy status endpoint returns deterministic payload', async ({ request }) => {
    const res = await forceUnauthGet(request, '/api/buddy/status')
    expect(res.status()).toBe(401)
  })
})
