import type { Metadata } from 'next'
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import AppShell from '@/components/AppShell'

export const metadata: Metadata = {
  title: 'Psychology Dashboard',
  robots: {
    index: false,
    follow: false,
  },
}

export default async function PsychDashboardPage() {
  const session = await auth()
  if (!session?.user) {
    redirect('/signin?callbackUrl=/psych/dashboard')
  }

  return <AppShell forcedProductLine="psychology" />
}
