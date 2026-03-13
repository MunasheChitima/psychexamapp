import { expect, test } from '@playwright/test'

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
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.evaluate(bootstrapReturningUserScript)
  })

  test('flashcards preview, bookmark and bookmark filter work', async ({ page }) => {
    await page.goto('/?page=flashcards')
    await expect(page.getByText(/free preview/i)).toBeVisible()

    await page.getByRole('button', { name: /bookmark this card|remove bookmark/i }).click()
    await page.getByRole('button', { name: /show bookmarked cards only/i }).click()

    await expect(page.getByLabel(/card \d+ of \d+/i)).toBeVisible()
  })

  test('practice session can be saved and resumed', async ({ page }) => {
    await page.goto('/?page=practice')
    await expect(page.getByRole('heading', { name: /quiz setup/i })).toBeVisible()

    await page.getByRole('button', { name: '5 questions', exact: true }).click()
    await page.getByRole('button', { name: /start quiz/i }).click()

    const answerButtons = page
      .locator('main button')
      .filter({ hasNotText: /save & exit|previous|next|finish/i })
    await answerButtons.first().click()

    await page.getByRole('button', { name: /save & exit/i }).click()
    await expect(page.getByText(/resume previous session/i)).toBeVisible()

    await page.getByRole('button', { name: /resume session/i }).click()
    await expect(page.getByRole('button', { name: /save & exit/i })).toBeVisible()
  })

  test('study materials remain gated for unsubscribed users', async ({ page }) => {
    await page.goto('/?page=materials')
    await expect(page.getByText(/premium feature/i)).toBeVisible()
    await expect(page.getByRole('button', { name: /upgrade to access materials/i })).toBeVisible()
  })

  test('progress page renders metrics and timeframe switching', async ({ page }) => {
    await page.goto('/?page=progress')
    await expect(page.getByRole('heading', { name: /progress tracking/i })).toBeVisible()
    await expect(page.getByText(/readiness score/i)).toBeVisible()

    await page.getByRole('combobox').selectOption('all')
    await expect(page.getByRole('heading', { name: /readiness assessment/i })).toBeVisible()
  })
})
