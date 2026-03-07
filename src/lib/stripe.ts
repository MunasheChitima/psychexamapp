import Stripe from 'stripe'

const stripeSecretKey = process.env.STRIPE_SECRET_KEY

// Using a placeholder during build/dev if the key is missing to prevent build crashes.
// Real API calls will fail if the key is invalid or missing in production.
export const stripe = new Stripe(stripeSecretKey || 'sk_test_placeholder', {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  apiVersion: '2026-02-25.clover' as any,
  typescript: true,
})
