import {
  Column,
  Heading,
  Link,
  Row,
  Section,
  Text,
} from '@react-email/components'
import type { ExamSitting, PricingTier } from '@/lib/examSchedule'
import {
  AppEmailLayout,
  CtaButton,
  LeadText,
  formatDate,
  getPsychDashboardUrl,
  getPsychPricingAppUrl,
  greeting,
} from './base'

export function WelcomeEmail({ name }: { name?: string }) {
  return (
    <AppEmailLayout preview="Welcome to APRAcademy">
      <Heading as="h2" style={styles.greeting}>
        {greeting(name)}
      </Heading>
      <LeadText>
        Welcome to APRAcademy. You&apos;ve taken the first step toward crushing
        your registration exam.
      </LeadText>
      <LeadText>Here&apos;s what&apos;s waiting for you:</LeadText>
      <Section style={styles.listWrap}>
        <Text style={styles.listItem}>
          <strong>Practice questions</strong> - domain-specific, exam-style
        </Text>
        <Text style={styles.listItem}>
          <strong>Flashcards</strong> - spaced repetition to lock in knowledge
        </Text>
        <Text style={styles.listItem}>
          <strong>Exam simulations</strong> - timed, realistic mock exams
        </Text>
        <Text style={styles.listItem}>
          <strong>Progress tracking</strong> - see exactly where you stand
        </Text>
      </Section>
      <LeadText>
        Subscribe to a study plan to unlock everything and start studying for
        your exam sitting.
      </LeadText>
      <CtaButton href={getPsychDashboardUrl()} label="Go to your dashboard" />
      <Text style={styles.smallMuted}>
        Good luck with your prep - you&apos;ve got this.
      </Text>
    </AppEmailLayout>
  )
}

export function SubscriptionConfirmationEmail({
  name,
  sitting,
  tier,
  amountPaid,
  months,
  isResubscription,
}: {
  name?: string
  sitting: ExamSitting
  tier: PricingTier
  amountPaid: number
  months: number
  isResubscription: boolean
}) {
  const total = amountPaid.toFixed(2)
  return (
    <AppEmailLayout preview="Your purchase is confirmed">
      <Heading as="h2" style={styles.greeting}>
        {greeting(name)}
      </Heading>
      <LeadText>
        {isResubscription
          ? 'Your resit purchase is confirmed.'
          : 'Your purchase is confirmed.'}{' '}
        You now have full access to everything APRAcademy offers.
      </LeadText>
      <Section style={styles.planCard}>
        <Text style={styles.planLabel}>Your plan</Text>
        <Row>
          <Column>
            <Text style={styles.planKey}>Exam sitting</Text>
          </Column>
          <Column align="right">
            <Text style={styles.planValue}>{sitting.label}</Text>
          </Column>
        </Row>
        <Row>
          <Column>
            <Text style={styles.planKey}>Exam window</Text>
          </Column>
          <Column align="right">
            <Text style={styles.planValue}>
              {formatDate(sitting.examStart)} - {formatDate(sitting.examEnd)}
            </Text>
          </Column>
        </Row>
        <Row>
          <Column>
            <Text style={styles.planKey}>Pricing tier</Text>
          </Column>
          <Column align="right">
            <Text style={styles.planValue}>
              {tier.label}
              {isResubscription ? ' (75% resit discount)' : ''}
            </Text>
          </Column>
        </Row>
        <Row>
          <Column>
            <Text style={styles.planKey}>Access until</Text>
          </Column>
          <Column align="right">
            <Text style={styles.planValue}>{formatDate(sitting.examStart)}</Text>
          </Column>
        </Row>
        <Row style={styles.planTotalRow}>
          <Column>
            <Text style={styles.planKey}>Amount paid</Text>
          </Column>
          <Column align="right">
            <Text style={styles.planTotal}>${total} AUD</Text>
          </Column>
        </Row>
      </Section>
      <LeadText>
        Your access runs until your exam start date. Jump in and start studying now.
      </LeadText>
      <CtaButton href={getPsychDashboardUrl()} label="Start studying" />
      <Text style={styles.smallMuted}>
        Need to manage your billing? Use the{' '}
        <Link href={getPsychPricingAppUrl()} style={styles.link}>
          pricing page
        </Link>
        .
      </Text>
    </AppEmailLayout>
  )
}

export function ExamReminderEmail({
  name,
  sitting,
  daysUntil,
}: {
  name?: string
  sitting: ExamSitting
  daysUntil: number
}) {
  const urgencyColor =
    daysUntil <= 1 ? '#dc2626' : daysUntil <= 3 ? '#f59e0b' : '#6366f1'
  const timeLabel = daysUntil <= 1 ? 'starts tomorrow' : `is in ${daysUntil} days`

  return (
    <AppEmailLayout preview="Exam reminder from APRAcademy">
      <Heading as="h2" style={styles.greeting}>
        {greeting(name)}
      </Heading>
      <Section
        style={{
          ...styles.badge,
          backgroundColor: urgencyColor,
        }}
      >
        <Text style={styles.badgeText}>Your exam {timeLabel}</Text>
      </Section>
      <LeadText>
        The <strong>{sitting.label}</strong> exam window runs from{' '}
        <strong>{formatDate(sitting.examStart)}</strong> to{' '}
        <strong>{formatDate(sitting.examEnd)}</strong>.
      </LeadText>
      <LeadText>A few things to check off:</LeadText>
      <Section style={styles.listWrap}>
        <Text style={styles.listItem}>- Confirm your exam booking and venue details</Text>
        <Text style={styles.listItem}>
          - Review any weak domains on your progress page
        </Text>
        <Text style={styles.listItem}>
          - Run one more exam simulation for confidence
        </Text>
        <Text style={styles.listItem}>
          - Rest up the night before - you&apos;ve done the work
        </Text>
      </Section>
      <CtaButton href={getPsychDashboardUrl()} label="Final review" />
      <Text style={styles.smallMuted}>You&apos;ve put in the effort. Trust your preparation.</Text>
    </AppEmailLayout>
  )
}

export function PaymentFailedEmail({
  name,
  manageBillingUrl,
}: {
  name?: string
  manageBillingUrl: string
}) {
  return (
    <AppEmailLayout preview="Payment issue with your APRAcademy subscription">
      <Heading as="h2" style={styles.greeting}>
        {greeting(name)}
      </Heading>
      <LeadText>
        We couldn&apos;t process your latest APRAcademy subscription payment.
      </LeadText>
      <LeadText>
        Please update your payment method to avoid interruptions to your access.
      </LeadText>
      <CtaButton href={manageBillingUrl} label="Update billing details" />
      <Text style={styles.smallMuted}>
        If you&apos;ve already updated billing details, you can ignore this email.
      </Text>
    </AppEmailLayout>
  )
}

export function SubscriptionCancelledEmail({
  name,
  supportUrl,
}: {
  name?: string
  supportUrl: string
}) {
  return (
    <AppEmailLayout preview="Your APRAcademy subscription has ended">
      <Heading as="h2" style={styles.greeting}>
        {greeting(name)}
      </Heading>
      <LeadText>Your APRAcademy subscription is now marked as expired.</LeadText>
      <LeadText>
        If this wasn&apos;t expected or you need help getting back in, we&apos;re ready
        to help.
      </LeadText>
      <CtaButton href={supportUrl} label="View pricing options" />
      <Text style={styles.smallMuted}>
        You can reactivate any time and continue your exam prep from where you
        left off.
      </Text>
    </AppEmailLayout>
  )
}

export function MagicLinkEmail({
  loginUrl,
  host,
}: {
  loginUrl: string
  host: string
}) {
  return (
    <AppEmailLayout preview="Your secure sign in link">
      <Heading as="h2" style={styles.greeting}>
        Sign in to APRAcademy
      </Heading>
      <LeadText>
        Use the secure link below to sign in to your account on {host}.
      </LeadText>
      <CtaButton href={loginUrl} label="Sign in to APRAcademy" />
      <Text style={styles.smallMuted}>
        This link expires automatically. If you didn&apos;t request it, you can
        safely ignore this message.
      </Text>
    </AppEmailLayout>
  )
}

const styles = {
  greeting: {
    margin: '0 0 16px',
    color: '#18181b',
    fontSize: '20px',
    lineHeight: '1.3',
  },
  smallMuted: {
    margin: 0,
    color: '#71717a',
    fontSize: '14px',
    lineHeight: '1.5',
  },
  listWrap: {
    margin: '0 0 16px',
  },
  listItem: {
    margin: '0 0 8px',
    color: '#3f3f46',
    fontSize: '15px',
    lineHeight: '1.6',
  },
  planCard: {
    margin: '20px 0',
    backgroundColor: '#f9fafb',
    border: '1px solid #e4e4e7',
    borderRadius: '8px',
    padding: '16px 20px',
  },
  planLabel: {
    margin: '0 0 12px',
    color: '#6366f1',
    fontSize: '13px',
    fontWeight: 600,
    textTransform: 'uppercase' as const,
    letterSpacing: '0.05em',
  },
  planKey: {
    margin: '0 0 8px',
    color: '#52525b',
    fontSize: '14px',
    lineHeight: '1.4',
  },
  planValue: {
    margin: '0 0 8px',
    color: '#18181b',
    fontSize: '14px',
    fontWeight: 600,
    lineHeight: '1.4',
  },
  planTotalRow: {
    borderTop: '1px solid #e4e4e7',
    paddingTop: '8px',
    marginTop: '4px',
  },
  planTotal: {
    margin: '0 0 8px',
    color: '#18181b',
    fontSize: '15px',
    fontWeight: 700,
    lineHeight: '1.4',
  },
  badge: {
    display: 'inline-block',
    borderRadius: '6px',
    margin: '0 0 20px',
    padding: '8px 16px',
  },
  badgeText: {
    margin: 0,
    color: '#ffffff',
    fontSize: '14px',
    fontWeight: 700,
  },
  link: {
    color: '#6366f1',
    textDecoration: 'none',
  },
}
