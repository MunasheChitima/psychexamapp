import { expect, test } from '@playwright/test'
import { authedGet, authedPost, forceUnauthGet, identities } from '../helpers/auth'
import { isDatabaseReachable } from '../helpers/db'

type E2EIdentity = { id: string, email: string, name: string }

function makeIdentity(seed: string): E2EIdentity {
  return {
    id: `e2e_${seed}_${Date.now()}`,
    email: `e2e.${seed}.${Date.now()}@apracademy.app`,
    name: `E2E ${seed}`,
  }
}

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

  test('referral redeem can succeed before any buddy lifecycle activation', async ({ request }) => {
    test.skip(!(await isDatabaseReachable()), 'Database is not reachable for authenticated flow coverage')

    const createRes = await authedPost(request, '/api/referrals', identities.primary, {})
    expect(createRes.status()).toBe(200)
    const createBody = await createRes.json()
    const code = createBody?.referralCode?.code
    expect(typeof code).toBe('string')

    const redeemRes = await authedPost(request, '/api/referrals/redeem', identities.secondary, { code })
    expect([200, 409]).toContain(redeemRes.status())

    if (redeemRes.status() === 200) {
      const buddyStatusRes = await authedGet(request, '/api/buddy/status', identities.secondary)
      expect(buddyStatusRes.status()).toBe(200)
      const buddyStatusBody = await buddyStatusRes.json()
      expect(buddyStatusBody).toMatchObject({
        hasBuddy: false,
        pair: null,
      })
    }
  })

  test('referral lifecycle enforces one redemption per user', async ({ request }) => {
    test.skip(!(await isDatabaseReachable()), 'Database is not reachable for authenticated flow coverage')

    const createRes = await authedPost(request, '/api/referrals', identities.primary, {})
    expect(createRes.status()).toBe(200)
    const createBody = await createRes.json()
    const code = createBody?.referralCode?.code
    expect(typeof code).toBe('string')

    const firstRedeem = await authedPost(request, '/api/referrals/redeem', identities.secondary, { code })
    expect([200, 409]).toContain(firstRedeem.status())

    const secondRedeem = await authedPost(request, '/api/referrals/redeem', identities.secondary, { code })
    expect(secondRedeem.status()).toBe(409)
    const body = await secondRedeem.json()
    expect(body?.error).toContain('already redeemed')
  })

  test('redeem route returns 400 on self-redeem attempts', async ({ request }) => {
    test.skip(!(await isDatabaseReachable()), 'Database is not reachable for authenticated flow coverage')

    const owner = makeIdentity('self_redeem_owner')
    const createRes = await authedPost(request, '/api/referrals', owner, {})
    expect(createRes.status()).toBe(200)
    const createBody = await createRes.json()
    const code = createBody?.referralCode?.code
    expect(typeof code).toBe('string')

    const selfRedeem = await authedPost(request, '/api/referrals/redeem', owner, { code })
    expect(selfRedeem.status()).toBe(400)
    const body = await selfRedeem.json()
    expect(body?.error).toContain('cannot redeem your own')
  })

  test('redeem route returns 409 when a code is already used', async ({ request }) => {
    test.skip(!(await isDatabaseReachable()), 'Database is not reachable for authenticated flow coverage')

    const owner = makeIdentity('used_code_owner')
    const firstRedeemer = makeIdentity('used_code_redeemer_a')
    const secondRedeemer = makeIdentity('used_code_redeemer_b')

    const createRes = await authedPost(request, '/api/referrals', owner, {})
    expect(createRes.status()).toBe(200)
    const createBody = await createRes.json()
    const code = createBody?.referralCode?.code
    expect(typeof code).toBe('string')

    const firstRedeem = await authedPost(request, '/api/referrals/redeem', firstRedeemer, { code })
    expect(firstRedeem.status()).toBe(200)

    const secondRedeem = await authedPost(request, '/api/referrals/redeem', secondRedeemer, { code })
    expect(secondRedeem.status()).toBe(409)
    const body = await secondRedeem.json()
    expect(body?.error).toContain('already been used')
  })

  test('blocked lifecycle paths keep buddy status non-active for partner cleanup safety', async ({ request }) => {
    test.skip(!(await isDatabaseReachable()), 'Database is not reachable for authenticated flow coverage')

    const owner = makeIdentity('cleanup_owner')
    const firstRedeemer = makeIdentity('cleanup_redeemer_a')
    const secondRedeemer = makeIdentity('cleanup_redeemer_b')

    const createRes = await authedPost(request, '/api/referrals', owner, {})
    expect(createRes.status()).toBe(200)
    const code = (await createRes.json())?.referralCode?.code
    expect(typeof code).toBe('string')

    const firstRedeem = await authedPost(request, '/api/referrals/redeem', firstRedeemer, { code })
    expect(firstRedeem.status()).toBe(200)

    const blockedRedeem = await authedPost(request, '/api/referrals/redeem', secondRedeemer, { code })
    expect(blockedRedeem.status()).toBe(409)

    const ownerStatus = await authedGet(request, '/api/buddy/status', owner)
    const firstRedeemerStatus = await authedGet(request, '/api/buddy/status', firstRedeemer)
    const secondRedeemerStatus = await authedGet(request, '/api/buddy/status', secondRedeemer)

    expect(ownerStatus.status()).toBe(200)
    expect(firstRedeemerStatus.status()).toBe(200)
    expect(secondRedeemerStatus.status()).toBe(200)

    const ownerBody = await ownerStatus.json()
    const firstRedeemerBody = await firstRedeemerStatus.json()
    const secondRedeemerBody = await secondRedeemerStatus.json()

    expect(ownerBody).toMatchObject({ hasBuddy: false, pair: null })
    expect(firstRedeemerBody).toMatchObject({ hasBuddy: false, pair: null })
    expect(secondRedeemerBody).toMatchObject({ hasBuddy: false, pair: null })
  })
})
