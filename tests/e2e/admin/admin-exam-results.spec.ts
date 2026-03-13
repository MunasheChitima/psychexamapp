import { expect, test } from '@playwright/test'
import { authedGet, authedPatch, authedPost, forceUnauthGet } from '../helpers/auth'
import { identities } from '../helpers/auth'
import { isDatabaseReachable } from '../helpers/db'

test.describe('Exam results and admin review APIs', () => {
  test('exam-results/admin endpoints enforce permissions', async ({ request }) => {
    const submitRes = await request.post('/api/exam-results', {
      headers: { 'content-type': 'application/json' },
      data: {
      examSittingId: 'nov_2025',
      candidateNumber: 'E2E-4567',
      resultDescription: 'Failed written exam in previous attempt.',
      },
    })
    expect(submitRes.status()).toBe(401)

    const forbiddenAdminGet = await forceUnauthGet(request, '/api/admin/exam-results')
    expect(forbiddenAdminGet.status()).toBe(403)

    const nonAdminGet = await authedGet(request, '/api/admin/exam-results', identities.secondary)
    expect(nonAdminGet.status()).toBe(403)
  })

  test('exam result submit and admin review happy path works for authed users', async ({ request }) => {
    test.skip(!(await isDatabaseReachable()), 'Database is not reachable for authenticated flow coverage')
    const submitRes = await authedPost(request, '/api/exam-results', identities.primary, {
      examSittingId: 'nov_2025',
      candidateNumber: `E2E-${Date.now()}`,
      resultDescription: 'Failed written exam in previous attempt.',
    })
    expect(submitRes.status()).toBe(201)
    const submitBody = await submitRes.json()
    const resultId = submitBody?.result?.id as string
    expect(resultId).toBeTruthy()

    const adminGet = await authedGet(request, '/api/admin/exam-results', identities.admin)
    expect(adminGet.status()).toBe(200)
    const adminGetBody = await adminGet.json()
    expect(Array.isArray(adminGetBody?.results)).toBe(true)
    expect(adminGetBody.results.some((result: { id?: string }) => result.id === resultId)).toBe(true)

    const adminPatch = await authedPatch(request, '/api/admin/exam-results', identities.admin, {
      resultId,
      status: 'approved',
      adminNotes: 'Verified in E2E',
    })
    expect(adminPatch.status()).toBe(200)
    const adminPatchBody = await adminPatch.json()
    expect(adminPatchBody?.result?.id).toBe(resultId)
    expect(adminPatchBody?.result?.status).toBe('approved')
  })
})
