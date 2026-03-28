import type { Metadata } from 'next'
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import AppShell from '@/components/AppShell'

export const metadata: Metadata = {
  title: 'Nursing Dashboard',
  robots: {
    index: false,
    follow: false,
  },
}

export default async function NursingDashboardPage() {
  const session = await auth()
  if (!session?.user) {
    redirect('/signin?callbackUrl=/nursing/dashboard')
  }

  return <AppShell forcedProductLine="nursing" />
}
