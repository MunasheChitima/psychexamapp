import { render, toPlainText } from '@react-email/render'
import type { ReactElement } from 'react'
import type { ExamSitting, PricingTier } from '@/lib/examSchedule'
import {
  ExamReminderEmail,
  MagicLinkEmail,
  PaymentFailedEmail,
  SubscriptionCancelledEmail,
  SubscriptionConfirmationEmail,
  WelcomeEmail,
} from './components'

export type RenderedEmail = {
  html: string
  text: string
}

async function renderTemplate(element: ReactElement): Promise<RenderedEmail> {
  const html = await render(element)
  const text = toPlainText(html)
  return { html, text }
}

export function renderWelcomeEmail(name?: string) {
  return renderTemplate(<WelcomeEmail name={name} />)
}

export function renderSubscriptionConfirmationEmail(opts: {
  name?: string
  sitting: ExamSitting
  tier: PricingTier
  amountPaid: number
  months: number
  isResubscription: boolean
}) {
  return renderTemplate(<SubscriptionConfirmationEmail {...opts} />)
}

export function renderExamReminderEmail(opts: {
  name?: string
  sitting: ExamSitting
  daysUntil: number
}) {
  return renderTemplate(<ExamReminderEmail {...opts} />)
}

export function renderPaymentFailedEmail(opts: {
  name?: string
  manageBillingUrl: string
}) {
  return renderTemplate(<PaymentFailedEmail {...opts} />)
}

export function renderSubscriptionCancelledEmail(opts: {
  name?: string
  supportUrl: string
}) {
  return renderTemplate(<SubscriptionCancelledEmail {...opts} />)
}

export function renderMagicLinkEmail(opts: { loginUrl: string; host: string }) {
  return renderTemplate(<MagicLinkEmail {...opts} />)
}
