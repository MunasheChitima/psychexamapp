import { expect, test } from '@playwright/test'
import { authedGet, authedPost, forceUnauthGet, identities } from '../helpers/auth'
import { isDatabaseReachable } from '../helpers/db'

test.describe('Challenges and live session APIs', () => {
  test('challenge endpoints are protected when unauthenticated', async ({ request }) => {
    const createRes = await request.post('/api/challenges', {
      headers: { 'content-type': 'application/json' },
      data: {
      title: 'E2E Challenge',
      type: 'accuracy',
      targetValue: 10,
      domain: 'ethics',
      durationDays: 3,
      },
    })
    expect(createRes.status()).toBe(401)

    const listRes = await forceUnauthGet(request, '/api/challenges')
    expect(listRes.status()).toBe(401)

    const joinRes = await request.post('/api/challenges/join', {
      headers: { 'content-type': 'application/json' },
      data: { code: 'BAD123' },
    })
    expect(joinRes.status()).toBe(401)
  })

  test('live session endpoints are protected when unauthenticated', async ({ request }) => {
    const createRes = await request.post('/api/live/create', {
      headers: { 'content-type': 'application/json' },
      data: {
      domain: 'all',
      questionCount: 3,
      questionDurationSec: 20,
      },
    })
    expect(createRes.status()).toBe(401)

    const joinRes = await request.post('/api/live/join', {
      headers: { 'content-type': 'application/json' },
      data: {
      roomCode: 'ABC123',
      displayName: 'Secondary Player',
      },
    })
    expect(joinRes.status()).toBe(401)

    const startRes = await request.post('/api/live/ABC123/start')
    expect(startRes.status()).toBe(401)

    const stateRes = await request.post('/api/live/ABC123/state')
    expect(stateRes.status()).toBe(401)

    const invalidAnswerRes = await request.post('/api/live/ABC123/answer', {
      headers: { 'content-type': 'application/json' },
      data: {
      answerIndex: 999,
      },
    })
    expect(invalidAnswerRes.status()).toBe(401)

    const nextByNonHost = await request.post('/api/live/ABC123/next')
    expect(nextByNonHost.status()).toBe(401)
  })

  test('challenge and live session endpoints return authed happy-path responses', async ({ request }) => {
    test.skip(!(await isDatabaseReachable()), 'Database is not reachable for authenticated flow coverage')
    const challengeCreate = await authedPost(request, '/api/challenges', identities.primary, {
      title: `E2E Challenge ${Date.now()}`,
      type: 'accuracy',
      targetValue: 10,
      domain: 'ethics',
      durationDays: 3,
    })
    expect(challengeCreate.status()).toBe(200)
    const challengeCreateBody = await challengeCreate.json()
    const joinCode = challengeCreateBody?.challenge?.joinCode as string
    expect(joinCode).toHaveLength(6)

    const secondaryJoin = await authedPost(request, '/api/challenges/join', identities.secondary, {
      code: joinCode,
    })
    expect(secondaryJoin.status()).toBe(200)
    const secondaryJoinBody = await secondaryJoin.json()
    expect(secondaryJoinBody?.joined).toBe(true)

    const challengeList = await authedGet(request, '/api/challenges', identities.secondary)
    expect(challengeList.status()).toBe(200)
    const challengeListBody = await challengeList.json()
    expect(Array.isArray(challengeListBody?.challenges)).toBe(true)
    expect(challengeListBody.challenges.some((c: { joinCode?: string }) => c.joinCode === joinCode)).toBe(true)

    const liveCreate = await authedPost(request, '/api/live/create', identities.primary, {
      domain: 'all',
      questionCount: 3,
      questionDurationSec: 20,
    })
    expect(liveCreate.status()).toBe(200)
    const liveCreateBody = await liveCreate.json()
    const roomCode = liveCreateBody?.roomCode as string
    expect(roomCode).toHaveLength(6)

    const liveJoin = await authedPost(request, '/api/live/join', identities.secondary, {
      roomCode,
      displayName: 'Secondary Player',
    })
    expect(liveJoin.status()).toBe(200)
    const liveJoinBody = await liveJoin.json()
    expect(liveJoinBody?.joined).toBe(true)

    const liveStart = await authedPost(request, `/api/live/${roomCode}/start`, identities.primary, {})
    expect(liveStart.status()).toBe(200)
    const liveStartBody = await liveStart.json()
    expect(liveStartBody?.started).toBe(true)

    const liveState = await authedPost(request, `/api/live/${roomCode}/state`, identities.secondary, {})
    expect(liveState.status()).toBe(200)
    const liveStateBody = await liveState.json()
    expect(liveStateBody?.roomCode).toBe(roomCode)
    expect(typeof liveStateBody?.status).toBe('string')
    expect(typeof liveStateBody?.playerCount).toBe('number')
  })
})
