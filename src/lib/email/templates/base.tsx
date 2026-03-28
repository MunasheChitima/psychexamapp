import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components'
import type { CSSProperties, ReactNode } from 'react'

const APP_URL = process.env.NEXTAUTH_URL || 'https://apracademy.app'

export function getAppUrl() {
  return APP_URL
}

function originNoTrailingSlash(): string {
  return APP_URL.replace(/\/$/, '')
}

/** In-app dashboard for psychology NPPE (primary product in this deployment). */
export function getPsychDashboardUrl(): string {
  return `${originNoTrailingSlash()}/psych/dashboard`
}

/** Opens pricing inside the app shell (query `page=pricing`). */
export function getPsychPricingAppUrl(): string {
  return `${originNoTrailingSlash()}/psych/dashboard?page=pricing`
}

export function formatDate(isoDate: string): string {
  const date = new Date(`${isoDate}T00:00:00`)
  return date.toLocaleDateString('en-AU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export function greeting(name?: string) {
  return name ? `Hi ${name},` : 'Hi there,'
}

export function AppEmailLayout({
  preview,
  children,
}: {
  preview: string
  children: ReactNode
}) {
  return (
    <Html lang="en">
      <Head />
      <Preview>{preview}</Preview>
      <Body style={styles.body}>
        <Container style={styles.container}>
          <Section style={styles.header}>
            <Heading as="h1" style={styles.logo}>
              APRAcademy
            </Heading>
          </Section>
          <Section style={styles.content}>{children}</Section>
          <Hr style={styles.rule} />
          <Section style={styles.footer}>
            <Text style={styles.footerText}>
              <Link href={APP_URL} style={styles.link}>
                APRAcademy
              </Link>{' '}
              - Exam prep that works.
            </Text>
            <Text style={styles.footerMuted}>
              You received this because you have an APRAcademy account.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

export function CtaButton({ href, label }: { href: string; label: string }) {
  return (
    <Section style={styles.buttonWrap}>
      <Button href={href} style={styles.button}>
        {label}
      </Button>
    </Section>
  )
}

export function LeadText({ children }: { children: ReactNode }) {
  return <Text style={styles.leadText}>{children}</Text>
}

const styles: Record<string, CSSProperties> = {
  body: {
    margin: 0,
    padding: '24px 0',
    backgroundColor: '#f4f4f5',
    fontFamily:
      "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
  },
  container: {
    maxWidth: '560px',
    margin: '0 auto',
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
  },
  header: {
    background: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
    padding: '28px 32px',
    textAlign: 'center',
  },
  logo: {
    margin: 0,
    color: '#ffffff',
    fontSize: '22px',
    lineHeight: '1.2',
    letterSpacing: '-0.02em',
  },
  content: {
    padding: '32px',
  },
  leadText: {
    margin: '0 0 12px',
    color: '#3f3f46',
    fontSize: '15px',
    lineHeight: '1.6',
  },
  buttonWrap: {
    margin: '24px 0',
  },
  button: {
    backgroundColor: '#6366f1',
    color: '#ffffff',
    padding: '12px 28px',
    borderRadius: '8px',
    textDecoration: 'none',
    fontSize: '15px',
    fontWeight: 600,
  },
  rule: {
    borderColor: '#e4e4e7',
    margin: 0,
  },
  footer: {
    padding: '20px 32px',
    backgroundColor: '#fafafa',
    textAlign: 'center',
  },
  footerText: {
    margin: 0,
    color: '#a1a1aa',
    fontSize: '12px',
    lineHeight: '1.6',
  },
  footerMuted: {
    margin: '8px 0 0',
    color: '#d4d4d8',
    fontSize: '11px',
    lineHeight: '1.4',
  },
  link: {
    color: '#6366f1',
    textDecoration: 'none',
  },
}
