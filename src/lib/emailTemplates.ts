import type { ExamSitting, PricingTier } from './examSchedule'

const APP_URL = process.env.NEXTAUTH_URL || 'https://apracademy.app'

function layout(content: string) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>APRAcademy</title>
</head>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5;padding:32px 16px">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.08)">
          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#6366f1,#8b5cf6);padding:28px 32px;text-align:center">
              <span style="font-size:22px;font-weight:700;color:#ffffff;letter-spacing:-0.02em">APRAcademy</span>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:32px">
              ${content}
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding:20px 32px;background:#fafafa;border-top:1px solid #e4e4e7;text-align:center">
              <p style="margin:0;font-size:12px;color:#a1a1aa;line-height:1.6">
                <a href="${APP_URL}" style="color:#6366f1;text-decoration:none">APRAcademy</a> — Exam prep that works.
              </p>
              <p style="margin:8px 0 0;font-size:11px;color:#d4d4d8">
                You received this because you have an APRAcademy account.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}

function button(text: string, href: string) {
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:24px 0">
  <tr>
    <td style="background:#6366f1;border-radius:8px;padding:12px 28px">
      <a href="${href}" style="color:#ffffff;font-size:15px;font-weight:600;text-decoration:none;display:inline-block">${text}</a>
    </td>
  </tr>
</table>`
}

function greeting(name?: string) {
  return name ? `Hi ${name},` : 'Hi there,'
}

export function buildWelcomeEmail(name?: string): string {
  return layout(`
    <p style="margin:0 0 16px;font-size:16px;color:#18181b;font-weight:600">${greeting(name)}</p>
    <p style="margin:0 0 12px;font-size:15px;color:#3f3f46;line-height:1.6">
      Welcome to APRAcademy. You've taken the first step toward crushing your registration exam.
    </p>
    <p style="margin:0 0 12px;font-size:15px;color:#3f3f46;line-height:1.6">
      Here's what's waiting for you:
    </p>
    <ul style="margin:0 0 16px;padding-left:20px;font-size:15px;color:#3f3f46;line-height:1.8">
      <li><strong>Practice questions</strong> — domain-specific, exam-style</li>
      <li><strong>Flashcards</strong> — spaced repetition to lock in knowledge</li>
      <li><strong>Exam simulations</strong> — timed, realistic mock exams</li>
      <li><strong>Progress tracking</strong> — see exactly where you stand</li>
    </ul>
    <p style="margin:0 0 4px;font-size:15px;color:#3f3f46;line-height:1.6">
      Subscribe to a study plan to unlock everything and start studying for your exam sitting.
    </p>
    ${button('Go to your dashboard', APP_URL)}
    <p style="margin:0;font-size:14px;color:#71717a;line-height:1.5">
      Good luck with your prep — you've got this.
    </p>
  `)
}

export function buildSubscriptionConfirmationEmail(opts: {
  name?: string
  sitting: ExamSitting
  tier: PricingTier
  monthlyRate: number
  months: number
  isResubscription: boolean
}): string {
  const { name, sitting, tier, monthlyRate, months, isResubscription } = opts
  const total = (monthlyRate * months).toFixed(2)

  return layout(`
    <p style="margin:0 0 16px;font-size:16px;color:#18181b;font-weight:600">${greeting(name)}</p>
    <p style="margin:0 0 12px;font-size:15px;color:#3f3f46;line-height:1.6">
      ${isResubscription ? 'Your resit subscription is confirmed.' : 'Your subscription is confirmed.'} You now have full access to everything APRAcademy offers.
    </p>

    <!-- Plan details -->
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:20px 0;background:#f9fafb;border-radius:8px;border:1px solid #e4e4e7">
      <tr>
        <td style="padding:16px 20px">
          <p style="margin:0 0 12px;font-size:13px;font-weight:600;color:#6366f1;text-transform:uppercase;letter-spacing:0.05em">Your plan</p>
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td style="font-size:14px;color:#52525b;padding:4px 0">Exam sitting</td>
              <td style="font-size:14px;color:#18181b;font-weight:600;text-align:right;padding:4px 0">${sitting.label}</td>
            </tr>
            <tr>
              <td style="font-size:14px;color:#52525b;padding:4px 0">Exam window</td>
              <td style="font-size:14px;color:#18181b;font-weight:600;text-align:right;padding:4px 0">${formatDate(sitting.examStart)} – ${formatDate(sitting.examEnd)}</td>
            </tr>
            <tr>
              <td style="font-size:14px;color:#52525b;padding:4px 0">Pricing tier</td>
              <td style="font-size:14px;color:#18181b;font-weight:600;text-align:right;padding:4px 0">${tier.label}${isResubscription ? ' (75% resit discount)' : ''}</td>
            </tr>
            <tr>
              <td style="font-size:14px;color:#52525b;padding:4px 0">Monthly rate</td>
              <td style="font-size:14px;color:#18181b;font-weight:600;text-align:right;padding:4px 0">$${monthlyRate.toFixed(2)}/mo</td>
            </tr>
            <tr>
              <td style="font-size:14px;color:#52525b;padding:4px 0">Duration</td>
              <td style="font-size:14px;color:#18181b;font-weight:600;text-align:right;padding:4px 0">${months} month${months !== 1 ? 's' : ''}</td>
            </tr>
            <tr>
              <td style="font-size:14px;color:#52525b;padding:8px 0 0;border-top:1px solid #e4e4e7">Estimated total</td>
              <td style="font-size:15px;color:#18181b;font-weight:700;text-align:right;padding:8px 0 0;border-top:1px solid #e4e4e7">$${total} AUD</td>
            </tr>
          </table>
        </td>
      </tr>
    </table>

    <p style="margin:0 0 4px;font-size:15px;color:#3f3f46;line-height:1.6">
      Your subscription auto-expires on your exam start date — no cancellation needed. Jump in and start studying now.
    </p>
    ${button('Start studying', APP_URL)}
    <p style="margin:0;font-size:14px;color:#71717a;line-height:1.5">
      Need to manage your billing? You can do that from the <a href="${APP_URL}/?page=pricing" style="color:#6366f1;text-decoration:none">pricing page</a>.
    </p>
  `)
}

export function buildExamReminderEmail(opts: {
  name?: string
  sitting: ExamSitting
  daysUntil: number
}): string {
  const { name, sitting, daysUntil } = opts

  const urgencyColor = daysUntil <= 1 ? '#dc2626' : daysUntil <= 3 ? '#f59e0b' : '#6366f1'
  const timeLabel =
    daysUntil <= 1
      ? 'starts tomorrow'
      : `is in ${daysUntil} days`

  return layout(`
    <p style="margin:0 0 16px;font-size:16px;color:#18181b;font-weight:600">${greeting(name)}</p>

    <!-- Countdown badge -->
    <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 20px">
      <tr>
        <td style="background:${urgencyColor};border-radius:6px;padding:8px 16px">
          <span style="color:#ffffff;font-size:14px;font-weight:700">Your exam ${timeLabel}</span>
        </td>
      </tr>
    </table>

    <p style="margin:0 0 12px;font-size:15px;color:#3f3f46;line-height:1.6">
      The <strong>${sitting.label}</strong> exam window runs from
      <strong>${formatDate(sitting.examStart)}</strong> to <strong>${formatDate(sitting.examEnd)}</strong>.
    </p>

    <p style="margin:0 0 12px;font-size:15px;color:#3f3f46;line-height:1.6">
      A few things to check off:
    </p>
    <ul style="margin:0 0 16px;padding-left:20px;font-size:15px;color:#3f3f46;line-height:1.8">
      <li>Confirm your exam booking and venue details</li>
      <li>Review any weak domains on your progress page</li>
      <li>Run one more exam simulation for confidence</li>
      <li>Rest up the night before — you've done the work</li>
    </ul>

    ${button('Final review', APP_URL)}
    <p style="margin:0;font-size:14px;color:#71717a;line-height:1.5">
      You've put in the effort. Trust your preparation.
    </p>
  `)
}

function formatDate(isoDate: string): string {
  const d = new Date(isoDate + 'T00:00:00')
  return d.toLocaleDateString('en-AU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}
