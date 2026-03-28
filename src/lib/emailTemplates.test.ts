import {
  buildExamReminderEmail,
  buildSubscriptionConfirmationEmail,
  buildWelcomeEmail,
  renderMagicLinkEmail,
} from '@/lib/emailTemplates'

describe('email templates', () => {
  test('renders welcome email html and text', async () => {
    const rendered = await buildWelcomeEmail('Munashe')

    expect(rendered.html).toContain('Welcome to APRAcademy')
    expect(rendered.html).toContain('Munashe')
    expect(rendered.text).toContain('Welcome to APRAcademy')
  })

  test('renders subscription confirmation details', async () => {
    const rendered = await buildSubscriptionConfirmationEmail({
      name: 'Sam',
      sitting: {
        id: 'aphra-may-2026',
        label: 'May 2026',
        examStart: '2026-05-01',
        examEnd: '2026-05-31',
        registrationOpen: '2026-03-01',
        registrationClose: '2026-04-01',
      },
      tier: {
        id: 'standard',
        label: 'Standard',
        total: 59,
        minMonths: 3,
        savings: 'Save $10',
      },
      amountPaid: 59,
      months: 3,
      isResubscription: false,
    })

    expect(rendered.html).toContain('Your plan')
    expect(rendered.html).toContain('May 2026')
    expect(rendered.text).toContain('Amount paid')
  })

  test('renders exam reminder urgency copy', async () => {
    const rendered = await buildExamReminderEmail({
      name: 'Tariro',
      sitting: {
        id: 'aphra-june-2026',
        label: 'June 2026',
        examStart: '2026-06-01',
        examEnd: '2026-06-30',
        registrationOpen: '2026-04-01',
        registrationClose: '2026-05-01',
      },
      daysUntil: 1,
    })

    expect(rendered.html).toContain('starts tomorrow')
    expect(rendered.text).toContain('A few things to check off')
  })

  test('renders magic-link email with host and sign-in link', async () => {
    const rendered = await renderMagicLinkEmail({
      loginUrl: 'https://apracademy.app/api/auth/callback',
      host: 'apracademy.app',
    })

    expect(rendered.html).toContain('Sign in to APRAcademy')
    expect(rendered.html).toContain('apracademy.app')
    expect(rendered.text).toContain('Sign in to APRAcademy')
  })
})
