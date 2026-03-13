import { expect, test } from '@playwright/test'
import { forceUnauthGet } from '../helpers/auth'

test.describe('Auth and onboarding', () => {
  test('public auth pages render expected content', async ({ page }) => {
    await page.goto('/signin')
    await expect(page.getByRole('heading', { name: /welcome to apracademy: psychology/i })).toBeVisible()
    await expect(page.getByLabel(/email address/i)).toBeVisible()
    await expect(page.getByRole('button', { name: /send sign-in link/i })).toBeVisible()

    await page.goto('/check-email')
    await expect(page.getByRole('heading', { name: /check your email/i })).toBeVisible()
    await expect(page.getByText(/the link will expire in 24 hours/i)).toBeVisible()
    await expect(page.getByRole('link', { name: /back to sign in/i })).toBeVisible()
  })

  test('onboarding preferences persist in local storage', async ({ page, context }) => {
    await context.addCookies([
      {
        name: 'e2e-unauth',
        value: 'true',
        domain: 'localhost',
        path: '/',
      },
    ])

    await page.goto('/')
    await page.evaluate(() => localStorage.clear())
    await page.evaluate(() => {
      localStorage.setItem('hasCompletedOnboarding', 'true')
      localStorage.setItem('examSittingId', 'nov_2025')
      localStorage.setItem('studyGoal', JSON.stringify('moderate'))
    })

    const onboardingState = await page.evaluate(() => ({
      hasCompletedOnboarding: localStorage.getItem('hasCompletedOnboarding'),
      examSittingId: localStorage.getItem('examSittingId'),
    }))

    expect(onboardingState.hasCompletedOnboarding).toBe('true')
    expect(onboardingState.examSittingId).toBeTruthy()
  })

  test('protected API routes reject unauthenticated access', async ({ request }) => {
    const studyData = await forceUnauthGet(request, '/api/study-data')
    expect(studyData.status()).toBe(401)

    const challenges = await forceUnauthGet(request, '/api/challenges')
    expect(challenges.status()).toBe(401)
  })
})
