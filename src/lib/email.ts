import { Resend } from 'resend'
import { prisma } from './prisma'
import {
  buildSubscriptionConfirmationEmail,
  buildExamReminderEmail,
  buildWelcomeEmail,
  renderPaymentFailedEmail,
  renderSubscriptionCancelledEmail,
} from './emailTemplates'
import type { ExamSitting, PricingTier } from './examSchedule'
import { getAppPricingAppUrl } from './email/templates/base'

let _resend: Resend | null = null
function getResend() {
  if (!_resend) {
    if (!process.env.RESEND_API_KEY) {
      throw new Error('RESEND_API_KEY is required to send emails')
    }
    _resend = new Resend(process.env.RESEND_API_KEY)
  }
  return _resend
}

const FROM =
  process.env.EMAIL_FROM || 'APRAcademy <noreply@aphracademy.com.au>'

async function hasSentEmail(
  userId: string,
  emailType: string,
  dedupeKey?: string
): Promise<boolean> {
  const where: { userId: string; emailType: string; dedupeKey?: string } = {
    userId,
    emailType,
  }
  if (dedupeKey) where.dedupeKey = dedupeKey

  const existing = await prisma.emailLog.findFirst({ where })
  return !!existing
}

async function logEmail(
  userId: string,
  emailType: string,
  recipient: string,
  dedupeKey?: string
) {
  await prisma.emailLog.create({
    data: { userId, emailType, recipient, dedupeKey },
  })
}

async function sendEmail({
  to,
  subject,
  html,
  text,
  userId,
  emailType,
  dedupeKey,
}: {
  to: string
  subject: string
  html: string
  text: string
  userId: string
  emailType: string
  dedupeKey?: string
}) {
  const key = dedupeKey ?? emailType
  if (await hasSentEmail(userId, emailType, key)) {
    return { success: true, deduplicated: true }
  }

  const { error } = await getResend().emails.send({
    from: FROM,
    to,
    subject,
    html,
    text,
  })

  if (error) {
    console.error(`Failed to send ${emailType} email to ${to}:`, error)
    return { success: false, error }
  }

  await logEmail(userId, emailType, to, key)
  return { success: true }
}

export async function sendWelcomeEmail(user: {
  id: string
  email: string
  name?: string | null
}) {
  const { html, text } = await buildWelcomeEmail(user.name || undefined)
  return sendEmail({
    to: user.email,
    subject: 'Welcome to APRAcademy — Let\'s get you exam-ready',
    html,
    text,
    userId: user.id,
    emailType: 'welcome',
  })
}

export async function sendSubscriptionConfirmationEmail(user: {
  id: string
  email: string
  name?: string | null
  sitting: ExamSitting
  tier: PricingTier
  monthlyRate?: number
  amountPaid?: number
  months: number
  isResubscription: boolean
}) {
  const { html, text } = await buildSubscriptionConfirmationEmail({
    name: user.name || undefined,
    sitting: user.sitting,
    tier: user.tier,
    amountPaid: user.amountPaid ?? (user.monthlyRate != null ? user.monthlyRate * user.months : 0),
    months: user.months,
    isResubscription: user.isResubscription,
  })

  return sendEmail({
    to: user.email,
    subject: `You're in — ${user.sitting.label} exam prep starts now`,
    html,
    text,
    userId: user.id,
    emailType: 'subscription_confirmation',
    dedupeKey: `subscription_confirmation:${user.sitting.id}`,
  })
}

export async function sendExamReminderEmail(user: {
  id: string
  email: string
  name?: string | null
  sitting: ExamSitting
  daysUntil: number
}) {
  const { html, text } = await buildExamReminderEmail({
    name: user.name || undefined,
    sitting: user.sitting,
    daysUntil: user.daysUntil,
  })

  const label =
    user.daysUntil <= 1 ? 'tomorrow' : `in ${user.daysUntil} days`

  return sendEmail({
    to: user.email,
    subject: `Exam reminder — Your exam starts ${label}`,
    html,
    text,
    userId: user.id,
    emailType: 'exam_reminder',
    dedupeKey: `exam_reminder:${user.sitting.id}:${user.daysUntil}d`,
  })
}

export async function sendPaymentFailedEmail(user: {
  id: string
  email: string
  name?: string | null
  dedupeKey: string
}) {
  const pricingUrl = getAppPricingAppUrl()
  const { html, text } = await renderPaymentFailedEmail({
    name: user.name || undefined,
    manageBillingUrl: pricingUrl,
  })

  return sendEmail({
    to: user.email,
    subject: 'Action needed: update your APRAcademy billing details',
    html,
    text,
    userId: user.id,
    emailType: 'payment_failed',
    dedupeKey: user.dedupeKey,
  })
}

export async function sendSubscriptionCancelledEmail(user: {
  id: string
  email: string
  name?: string | null
  dedupeKey: string
}) {
  const pricingUrl = getAppPricingAppUrl()
  const { html, text } = await renderSubscriptionCancelledEmail({
    name: user.name || undefined,
    supportUrl: pricingUrl,
  })

  return sendEmail({
    to: user.email,
    subject: 'Your APRAcademy subscription has ended',
    html,
    text,
    userId: user.id,
    emailType: 'subscription_cancelled',
    dedupeKey: user.dedupeKey,
  })
}
