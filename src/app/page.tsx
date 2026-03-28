import { redirect } from 'next/navigation'
import type { Metadata } from 'next'
import { cookies } from 'next/headers'
import LandingPage from '@/components/LandingPage'
import { auth } from '@/lib/auth'
import {
  DASHBOARD_PREFERENCE_COOKIE,
  NURSING_DASHBOARD,
  PSYCH_DASHBOARD,
  isValidDashboardPreference,
} from '@/lib/dashboardRoutes'
import { defaultDashboardPathForSuite, getExamSuite } from '@/lib/examSuite'
import NursingPublicLanding from '@/components/NursingPublicLanding'

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

  if (getExamSuite() === 'nursing' && !session?.user) {
    return <NursingPublicLanding />
  }

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
    const fallback = defaultDashboardPathForSuite()
    let base = isValidDashboardPreference(preferred) ? preferred : fallback
    const suite = getExamSuite()
    if (suite === 'psychology' && base.startsWith('/nursing')) base = PSYCH_DASHBOARD
    if (suite === 'nursing' && base.startsWith('/psych')) base = NURSING_DASHBOARD
    redirect(query ? `${base}?${query}` : base)
  }

  return <LandingPage />
}
