import { redirect } from 'next/navigation'
import type { Metadata } from 'next'
import { cookies } from 'next/headers'
import LandingPage from '@/components/LandingPage'
import { auth } from '@/lib/auth'
import {
  DASHBOARD_PREFERENCE_COOKIE,
  PSYCH_DASHBOARD,
  isValidDashboardPreference,
} from '@/lib/dashboardRoutes'

interface HomePageProps {
  searchParams?: Promise<Record<string, string | string[] | undefined>>
}

export const metadata: Metadata = {
  alternates: {
    canonical: '/',
    languages: {
      'en-AU': '/',
    },
  },
}

export default async function Home({ searchParams }: HomePageProps) {
  const session = await auth()

  if (session?.user) {
    const params = new URLSearchParams()
    const resolvedSearchParams = (await searchParams) ?? {}
    for (const [key, value] of Object.entries(resolvedSearchParams)) {
      if (typeof value === 'string') params.set(key, value)
      if (Array.isArray(value)) {
        for (const item of value) params.append(key, item)
      }
    }
    const query = params.toString()
    const jar = await cookies()
    const preferred = jar.get(DASHBOARD_PREFERENCE_COOKIE)?.value
    const base = isValidDashboardPreference(preferred) ? preferred : PSYCH_DASHBOARD
    redirect(query ? `${base}?${query}` : base)
  }

  return <LandingPage />
}
