/**
 * Stripe Setup Script
 *
 * Run once to create all required Stripe resources for APRAcademy:
 *   - Buddy referral coupons (free month + half-off)
 *   - Customer billing portal configuration
 *
 * Usage:
 *   1. Add your STRIPE_SECRET_KEY to .env (test mode key starts with sk_test_)
 *   2. Run: npx tsx scripts/setup-stripe.ts
 *   3. Copy the output values into your .env file
 */

import Stripe from 'stripe'
import * as fs from 'fs'
import * as path from 'path'

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY

if (!STRIPE_SECRET_KEY) {
  console.error('\n❌ STRIPE_SECRET_KEY is not set.')
  console.error('   Add it to your .env file first:')
  console.error('   1. Go to https://dashboard.stripe.com/test/apikeys')
  console.error('   2. Copy the "Secret key" (starts with sk_test_)')
  console.error('   3. Paste it as STRIPE_SECRET_KEY in your .env file')
  console.error('   4. Re-run this script\n')
  process.exit(1)
}

const stripe = new Stripe(STRIPE_SECRET_KEY, {
  apiVersion: '2026-02-25.clover',
  typescript: true,
})

async function findOrCreateCoupon(
  id: string,
  params: Stripe.CouponCreateParams
): Promise<Stripe.Coupon> {
  try {
    const existing = await stripe.coupons.retrieve(id)
    console.log(`  ✓ Coupon "${id}" already exists`)
    return existing
  } catch {
    const coupon = await stripe.coupons.create({ ...params, id })
    console.log(`  ✓ Created coupon "${id}"`)
    return coupon
  }
}

async function setupCoupons() {
  console.log('\n🎟️  Setting up buddy coupons...')

  const freeMonth = await findOrCreateCoupon('buddy-free-month', {
    name: 'Buddy Free Month',
    percent_off: 100,
    duration: 'once',
    metadata: { type: 'buddy-referral', benefit: 'free-month' },
  })

  const halfOff = await findOrCreateCoupon('buddy-half-off', {
    name: 'Buddy Half Off',
    percent_off: 50,
    duration: 'forever',
    metadata: { type: 'buddy-referral', benefit: 'half-off' },
  })

  return { freeMonth, halfOff }
}

async function setupBillingPortal() {
  console.log('\n🔧 Setting up billing portal...')

  const configs = await stripe.billingPortal.configurations.list({ limit: 1 })

  if (configs.data.length > 0) {
    console.log('  ✓ Billing portal configuration already exists')
    return configs.data[0]
  }

  const config = await stripe.billingPortal.configurations.create({
    business_profile: {
      headline: 'APRAcademy — Manage your subscription',
    },
    features: {
      subscription_cancel: {
        enabled: true,
        mode: 'at_period_end',
      },
      payment_method_update: {
        enabled: true,
      },
      invoice_history: {
        enabled: true,
      },
    },
  })

  console.log('  ✓ Created billing portal configuration')
  return config
}

async function verifyWebhookSetup() {
  console.log('\n🔗 Checking webhook endpoints...')

  const webhooks = await stripe.webhookEndpoints.list({ limit: 100 })
  const apraWebhook = webhooks.data.find(
    (wh) => wh.url.includes('apracademy') || wh.url.includes('localhost')
  )

  if (apraWebhook) {
    console.log(`  ✓ Found webhook: ${apraWebhook.url}`)
    console.log(`    Events: ${apraWebhook.enabled_events?.join(', ')}`)
  } else {
    console.log('  ⚠ No webhook endpoint found for APRAcademy.')
    console.log('    For local development, use the Stripe CLI:')
    console.log('      stripe listen --forward-to localhost:3000/api/stripe/webhook')
    console.log('')
    console.log('    For production (Vercel), create one at:')
    console.log('      https://dashboard.stripe.com/test/webhooks/create')
    console.log('    URL: https://your-domain.vercel.app/api/stripe/webhook')
    console.log('    Events needed:')
    console.log('      - checkout.session.completed')
    console.log('      - customer.subscription.deleted')
    console.log('      - customer.subscription.updated')
    console.log('      - invoice.paid')
    console.log('      - invoice.payment_failed')
  }
}

async function printEnvValues(coupons: { freeMonth: Stripe.Coupon; halfOff: Stripe.Coupon }) {
  console.log('\n' + '═'.repeat(60))
  console.log('📋 Add these to your .env file:')
  console.log('═'.repeat(60))
  console.log(`STRIPE_SECRET_KEY="${STRIPE_SECRET_KEY}"`)
  console.log(`STRIPE_BUDDY_FREE_MONTH_COUPON_ID="${coupons.freeMonth.id}"`)
  console.log(`STRIPE_BUDDY_HALF_OFF_COUPON_ID="${coupons.halfOff.id}"`)
  console.log('')
  console.log('⚠️  STRIPE_WEBHOOK_SECRET must be set separately:')
  console.log('   Local dev:  stripe listen --forward-to localhost:3000/api/stripe/webhook')
  console.log('               (the CLI prints the signing secret: whsec_...)')
  console.log('   Production: Get it from the webhook page in Stripe Dashboard')
  console.log('═'.repeat(60))
}

async function updateEnvFile(coupons: { freeMonth: Stripe.Coupon; halfOff: Stripe.Coupon }) {
  const envPath = path.resolve(__dirname, '..', '.env')

  if (!fs.existsSync(envPath)) {
    console.log('\n⚠️  No .env file found — skipping auto-update')
    return
  }

  let content = fs.readFileSync(envPath, 'utf-8')
  let updated = false

  const updates: [RegExp, string][] = [
    [
      /^STRIPE_SECRET_KEY=.*$/m,
      `STRIPE_SECRET_KEY="${STRIPE_SECRET_KEY}"`,
    ],
    [
      /^STRIPE_BUDDY_FREE_MONTH_COUPON_ID=.*$/m,
      `STRIPE_BUDDY_FREE_MONTH_COUPON_ID="${coupons.freeMonth.id}"`,
    ],
    [
      /^STRIPE_BUDDY_HALF_OFF_COUPON_ID=.*$/m,
      `STRIPE_BUDDY_HALF_OFF_COUPON_ID="${coupons.halfOff.id}"`,
    ],
  ]

  for (const [pattern, replacement] of updates) {
    if (pattern.test(content)) {
      content = content.replace(pattern, replacement)
      updated = true
    }
  }

  if (!content.includes('STRIPE_BUDDY_FREE_MONTH_COUPON_ID')) {
    content += `\nSTRIPE_BUDDY_FREE_MONTH_COUPON_ID="${coupons.freeMonth.id}"`
    updated = true
  }
  if (!content.includes('STRIPE_BUDDY_HALF_OFF_COUPON_ID')) {
    content += `\nSTRIPE_BUDDY_HALF_OFF_COUPON_ID="${coupons.halfOff.id}"`
    updated = true
  }

  if (updated) {
    fs.writeFileSync(envPath, content)
    console.log('\n✅ Updated .env file with coupon IDs')
  }
}

async function main() {
  const key = STRIPE_SECRET_KEY!
  console.log('🚀 APRAcademy Stripe Setup')
  console.log(`   Mode: ${key.startsWith('sk_test_') ? 'TEST' : '⚠️  LIVE'}`)

  if (!key.startsWith('sk_test_')) {
    console.warn('\n⚠️  WARNING: You are using a LIVE key. Use sk_test_ for development.\n')
  }

  try {
    const account = await stripe.accounts.retrieve()
    console.log(`   Account: ${account.settings?.dashboard?.display_name || account.id}`)
  } catch (err) {
    console.error('❌ Failed to connect to Stripe. Check your API key.')
    process.exit(1)
  }

  const coupons = await setupCoupons()
  await setupBillingPortal()
  await verifyWebhookSetup()
  await updateEnvFile(coupons)
  await printEnvValues(coupons)

  console.log('\n✅ Stripe setup complete!\n')
}

main().catch((err) => {
  console.error('\n❌ Setup failed:', err.message)
  process.exit(1)
})
