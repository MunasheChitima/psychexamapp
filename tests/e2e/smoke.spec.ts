import { test, expect } from '@playwright/test'

test.describe('Public auth smoke tests', () => {
  test('signin page renders expected content', async ({ page }) => {
    await page.goto('/signin')

    await expect(page.getByRole('heading', { name: /welcome to apracademy: psychology/i })).toBeVisible()
    await expect(page.getByLabel(/email address/i)).toBeVisible()
    await expect(page.getByRole('button', { name: /send sign-in link/i })).toBeVisible()
  })

  test('check-email page renders guidance', async ({ page }) => {
    await page.goto('/check-email')

    await expect(page.getByRole('heading', { name: /check your email/i })).toBeVisible()
    await expect(page.getByText(/the link will expire in 24 hours/i)).toBeVisible()
    await expect(page.getByRole('link', { name: /back to sign in/i })).toBeVisible()
  })

  test('home page loads for unauthenticated users', async ({ page }) => {
    await page.goto('/')

    await expect(page).toHaveURL('/')
    const html = await page.content()
    expect(html.length).toBeGreaterThan(200)
  })
})
