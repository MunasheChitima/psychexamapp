import { expect, test } from '@playwright/test'
import { addE2ESessionCookies, withE2EIdentity } from '../helpers/auth'
import { E2E_USER } from '../helpers/constants'

const DASHBOARD = '/psych/dashboard'

const bootstrapReturningUserScript = () => {
  localStorage.setItem('hasCompletedOnboarding', 'true')
  localStorage.setItem('examDate', JSON.stringify('2025-11-12'))
  localStorage.setItem('studyGoal', JSON.stringify('moderate'))
  localStorage.setItem('selectedDomains', JSON.stringify(['ethics', 'assessment', 'interventions', 'communication']))
  localStorage.setItem('studyStats', JSON.stringify({
    totalHours: 2,
    questionsAnswered: 12,
    correctAnswers: 8,
    studyStreak: 2,
    estimatedReadiness: 45,
  }))
}

test.describe('Core study journeys', () => {
  test.beforeEach(async ({ page, context }) => {
    await addE2ESessionCookies(context, E2E_USER)
    await withE2EIdentity(page, E2E_USER)
    await page.goto(DASHBOARD)
    await page.evaluate(bootstrapReturningUserScript)
  })

  test('flashcards preview, bookmark and bookmark filter work', async ({ page }) => {
    await page.goto(`${DASHBOARD}?page=flashcards`)
    await expect(page.getByLabel(/card \d+ of \d+/i)).toBeVisible({ timeout: 20_000 })

    await page.getByRole('button', { name: /bookmark this card|remove bookmark/i }).click()
    await page.getByRole('button', { name: /show bookmarked cards only/i }).click()

    await expect(page.getByLabel(/card \d+ of \d+/i)).toBeVisible()
  })

  test('practice session can be saved and resumed', async ({ page }) => {
    await page.goto(`${DASHBOARD}?page=practice`)
    await expect(page.getByRole('heading', { name: /quiz setup/i })).toBeVisible()

    await page.getByRole('button', { name: '5', exact: true }).click()
    await page.getByRole('button', { name: /start quiz/i }).click()

    const answerButtons = page
      .locator('main button')
      .filter({ hasNotText: /save & exit|previous|next|finish/i })
    await answerButtons.first().click()

    await page.getByRole('button', { name: /save & exit/i }).click()
    await expect(page.getByText(/resume previous session/i)).toBeVisible()

    await page.getByRole('button', { name: /^resume$/i }).click()
    await expect(page.getByRole('button', { name: /save & exit/i })).toBeVisible()
  })

  test('study materials page loads (full access or premium gate)', async ({ page }) => {
    await page.goto(`${DASHBOARD}?page=materials`)
    await expect(page.getByRole('heading', { name: /study materials/i })).toBeVisible()
    await expect(
      page.getByText(/organised by domain|premium feature|upgrade to access materials/i).first()
    ).toBeVisible()
  })

  test('progress page renders metrics and timeframe switching', async ({ page }) => {
    await page.goto(`${DASHBOARD}?page=progress`)
    await expect(page.getByRole('heading', { name: /^progress$/i })).toBeVisible({ timeout: 20_000 })
    await expect(page.getByRole('heading', { name: /readiness assessment/i })).toBeVisible({ timeout: 20_000 })
    await expect(page.getByText(/overall readiness/i)).toBeVisible()

    await page.getByLabel(/select timeframe/i).selectOption('all')
    await expect(page.getByRole('heading', { name: /readiness assessment/i })).toBeVisible()
  })
})
