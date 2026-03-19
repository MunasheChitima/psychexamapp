'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useSession } from 'next-auth/react'
import Navigation from '@/components/Navigation'
import Dashboard from '@/app/Dashboard'
import Flashcards from '@/components/Flashcards'
import PracticeQuestions from '@/components/PracticeQuestions'
import StudyMaterials from '@/components/StudyMaterials'
import Progress from '@/components/Progress'
import KolbAssessment from '@/components/KolbAssessment'
import Onboarding from '@/components/Onboarding'
import PricingPage from '@/components/PricingPage'
import ExamSimulation from '@/components/ExamSimulation'
import WeakAreaPlan from '@/components/WeakAreaPlan'
import SubmitResults from '@/components/SubmitResults'
import BuddyHub from '@/components/BuddyHub'
import LiveSessionContainer from '@/components/LiveSessionContainer'
import DailyChallenge from '@/components/DailyChallenge'
import OSCESimulation from '@/components/OSCESimulation'
import DrugCalculation from '@/components/DrugCalculation'
import LandingPage from '@/components/LandingPage'
import { AppData } from '@/types'
import { useSubscription } from '@/components/SubscriptionProvider'
import { useToast } from '@/components/Toast'
import { createDefaultEngagementData } from '@/lib/engagementEngine'
import { getDefaultDomains } from '@/lib/productConfig'

const PSYCHOLOGY_DOMAINS = ['ethics', 'assessment', 'interventions', 'communication'] as const
const NURSING_ONLY_PAGES = new Set(['osce-simulation', 'drug-calculations'])
const ENV_DEFAULT_PRODUCT_LINE = (process.env.NEXT_PUBLIC_DEFAULT_PRODUCT_LINE ?? '').trim().toLowerCase()
const ENABLE_GUEST_CLOUD_SAVE = ['1', 'true', 'yes', 'on'].includes((process.env.NEXT_PUBLIC_ENABLE_GUEST_CLOUD_SAVE ?? '').trim().toLowerCase())
const GUEST_TOKEN_STORAGE_KEY = 'guestStudyToken'
const SYNC_DEBOUNCE_MS = 800
const FORCE_PSYCHOLOGY_APP = true
const FORCED_PRODUCT_LINE: AppData['productLine'] | null = FORCE_PSYCHOLOGY_APP
  ? 'psychology'
  : ENV_DEFAULT_PRODUCT_LINE === 'nursing'
    ? 'nursing'
    : ENV_DEFAULT_PRODUCT_LINE === 'psychology'
      ? 'psychology'
      : null

const DEFAULT_PRODUCT_LINE: AppData['productLine'] = FORCED_PRODUCT_LINE ?? 'psychology'

function sanitizeSelectedDomains(domains: unknown, productLine: AppData['productLine']): string[] {
  const fallback = getDefaultDomains(productLine)
  if (!Array.isArray(domains)) return fallback
  const allowed = productLine === 'psychology'
    ? new Set<string>(PSYCHOLOGY_DOMAINS)
    : new Set<string>(getDefaultDomains(productLine))
  const sanitized = domains.filter((domain): domain is string => typeof domain === 'string' && allowed.has(domain))
  return sanitized.length > 0 ? sanitized : fallback
}

const DEFAULT_APP_DATA: AppData = {
  productLine: DEFAULT_PRODUCT_LINE,
  examDate: '',
  examSittingId: '',
  studyStats: {
    totalHours: 0,
    questionsAnswered: 0,
    correctAnswers: 0,
    studyStreak: 0,
    estimatedReadiness: 0
  },
  studySessions: [],
  flashcardProgress: {},
  practiceResults: [],
  hasCompletedOnboarding: false,
  studyGoal: 'moderate',
  selectedDomains: getDefaultDomains(DEFAULT_PRODUCT_LINE),
  materialBookmarks: {},
  materialCompleted: {},
  activeDomain: 'all',
  engagementData: createDefaultEngagementData(),
  flashcards: [],
  practiceQuestions: [],
  studyMaterials: [],
  caseStudies: [],
  edgeCaseScenarios: [],
  mistakeBank: [],
  rapidReviewMaterials: [],
  simulationComponents: [],
}

export default function AppShell() {
  const { data: session, status } = useSession()
  const { subscription, refresh: refreshSubscription } = useSubscription()
  const { showToast } = useToast()
  const [currentPage, setCurrentPage] = useState('dashboard')
  const [isLoading, setIsLoading] = useState(true)
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [appData, setAppData] = useState<AppData>(DEFAULT_APP_DATA)
  const guestTokenRef = useRef<string | null>(null)
  const pendingSyncRef = useRef<Record<string, unknown>>({})
  const syncInFlightRef = useRef(false)
  const syncTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const prevIsAuthenticatedRef = useRef(false)

  const isAuthenticated = status === 'authenticated' && !!session?.user

  const loadFromLocalStorage = useCallback(() => {
    try {
      const rawExamDate = localStorage.getItem('examDate')
      const savedExamDate = rawExamDate ? (() => { try { return JSON.parse(rawExamDate) } catch { return rawExamDate } })() : ''
      const rawExamSittingId = localStorage.getItem('examSittingId')
      const savedExamSittingId = rawExamSittingId ? (() => { try { return JSON.parse(rawExamSittingId) } catch { return rawExamSittingId } })() : ''
      const savedStudyStats = JSON.parse(localStorage.getItem('studyStats') || '{"totalHours":0,"questionsAnswered":0,"correctAnswers":0,"studyStreak":0,"estimatedReadiness":0}')
      const savedStudySessions = JSON.parse(localStorage.getItem('studySessions') || '[]')
      const savedFlashcardProgress = JSON.parse(localStorage.getItem('flashcardProgress') || '{}')
      const savedPracticeResults = JSON.parse(localStorage.getItem('practiceResults') || '[]')
      const hasCompletedOnboarding = localStorage.getItem('hasCompletedOnboarding') === 'true'
      const rawStudyGoal = localStorage.getItem('studyGoal')
      const savedStudyGoal = rawStudyGoal ? (() => { try { return JSON.parse(rawStudyGoal) } catch { return rawStudyGoal } })() : 'moderate'
      const savedProductLine = FORCED_PRODUCT_LINE || (localStorage.getItem('productLine') as AppData['productLine']) || 'psychology'
      const savedSelectedDomainsRaw = JSON.parse(localStorage.getItem('selectedDomains') || JSON.stringify(getDefaultDomains(savedProductLine)))
      const savedSelectedDomains = sanitizeSelectedDomains(savedSelectedDomainsRaw, savedProductLine)
      const savedMaterialBookmarks = JSON.parse(localStorage.getItem('materialBookmarks') || '{}')
      const savedMaterialCompleted = JSON.parse(localStorage.getItem('materialCompleted') || '{}')
      const savedEngagementData = JSON.parse(localStorage.getItem('engagementData') || 'null')

      setAppData(prev => ({
        ...prev,
        examDate: savedExamDate,
        examSittingId: savedExamSittingId,
        studyStats: savedStudyStats,
        studySessions: savedStudySessions,
        flashcardProgress: savedFlashcardProgress,
        practiceResults: savedPracticeResults,
        hasCompletedOnboarding,
        productLine: savedProductLine,
        studyGoal: savedStudyGoal,
        selectedDomains: savedSelectedDomains,
        materialBookmarks: savedMaterialBookmarks,
        materialCompleted: savedMaterialCompleted,
        engagementData: savedEngagementData || createDefaultEngagementData(),
      }))

      if (!hasCompletedOnboarding) {
        setShowOnboarding(true)
      }
    } catch (err) {
      console.error('Error loading local data:', err)
      setError('Failed to load your study data. Please refresh the page.')
    }
  }, [])

  const ensureGuestToken = useCallback(async () => {
    if (!ENABLE_GUEST_CLOUD_SAVE) return null
    if (guestTokenRef.current) return guestTokenRef.current

    const localToken = localStorage.getItem(GUEST_TOKEN_STORAGE_KEY)
    if (localToken) {
      guestTokenRef.current = localToken
      return localToken
    }

    try {
      const res = await fetch('/api/study-data/guest-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: localToken || undefined }),
      })
      if (!res.ok) return null
      const data = await res.json()
      const token = typeof data.token === 'string' ? data.token : null
      if (token) {
        guestTokenRef.current = token
        localStorage.setItem(GUEST_TOKEN_STORAGE_KEY, token)
      }
      return token
    } catch {
      return null
    }
  }, [])

  const hydrateFromRemoteData = useCallback((data: Record<string, unknown>) => {
    const persistedProductLine = FORCED_PRODUCT_LINE || (localStorage.getItem('productLine') as AppData['productLine']) || 'psychology'
    const resolvedProductLine = FORCED_PRODUCT_LINE || (data.productLine as AppData['productLine']) || persistedProductLine || 'psychology'
    const resolvedSelectedDomainsRaw =
      typeof data.selectedDomains === 'string'
        ? JSON.parse(data.selectedDomains)
        : data.selectedDomains
    const resolvedSelectedDomains = sanitizeSelectedDomains(
      resolvedSelectedDomainsRaw || getDefaultDomains(resolvedProductLine),
      resolvedProductLine
    )

    setAppData(prev => ({
      ...prev,
      productLine: resolvedProductLine,
      examDate: typeof data.examDate === 'string' ? data.examDate : '',
      examSittingId: typeof data.examSittingId === 'string' ? data.examSittingId : '',
      studyStats: typeof data.studyStats === 'string' ? JSON.parse(data.studyStats) : data.studyStats || prev.studyStats,
      studySessions: typeof data.studySessions === 'string' ? JSON.parse(data.studySessions) : data.studySessions || [],
      flashcardProgress: typeof data.flashcardProgress === 'string' ? JSON.parse(data.flashcardProgress) : data.flashcardProgress || {},
      practiceResults: typeof data.practiceResults === 'string' ? JSON.parse(data.practiceResults) : data.practiceResults || [],
      hasCompletedOnboarding: data.hasCompletedOnboarding === true,
      studyGoal: typeof data.studyGoal === 'string' ? data.studyGoal : 'moderate',
      selectedDomains: resolvedSelectedDomains,
      materialBookmarks: typeof data.materialBookmarks === 'string' ? JSON.parse(data.materialBookmarks) : data.materialBookmarks || {},
      materialCompleted: typeof data.materialCompleted === 'string' ? JSON.parse(data.materialCompleted) : data.materialCompleted || {},
      engagementData: typeof data.engagementData === 'string' ? JSON.parse(data.engagementData) : data.engagementData || createDefaultEngagementData(),
    }))

    if (data.hasCompletedOnboarding !== true) {
      setShowOnboarding(true)
    }
  }, [])

  const loadFromRemote = useCallback(async () => {
    try {
      if (isAuthenticated) {
        const res = await fetch('/api/study-data')
        if (!res.ok) throw new Error('Failed to load study data')
        const data = await res.json()
        hydrateFromRemoteData(data)
        return
      }

      if (ENABLE_GUEST_CLOUD_SAVE) {
        const guestToken = await ensureGuestToken()
        if (guestToken) {
          const res = await fetch('/api/study-data/guest', {
            headers: { 'x-guest-token': guestToken },
          })
          if (res.ok) {
            const data = await res.json()
            hydrateFromRemoteData(data)
            return
          }
        }
      }

      loadFromLocalStorage()
    } catch (err) {
      console.error('Error loading remote study data, falling back to localStorage:', err)
      loadFromLocalStorage()
    }
  }, [ensureGuestToken, hydrateFromRemoteData, isAuthenticated, loadFromLocalStorage])

  useEffect(() => {
    if (status === 'loading') return

    const load = async () => {
      setIsLoading(true)
      await loadFromRemote()
      setIsLoading(false)
    }

    load()
  }, [status, loadFromRemote])

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const pageFromQuery = params.get('page')
    if (pageFromQuery) {
      if (FORCED_PRODUCT_LINE === 'psychology' && NURSING_ONLY_PAGES.has(pageFromQuery)) {
        setCurrentPage('dashboard')
      } else {
        setCurrentPage(pageFromQuery)
      }
      return
    }
    if (params.has('upgrade')) {
      setCurrentPage('pricing')
    }
    if (params.get('payment') === 'success') {
      showToast('Payment successful! Your subscription is being activated...', 'success', 6000)
      window.history.replaceState({}, '', '/dashboard')
      let attempts = 0
      const pollSubscription = setInterval(async () => {
        attempts++
        try {
          const res = await fetch('/api/subscription', { cache: 'no-store' })
          const data = await res.json()
          if (data.active) {
            clearInterval(pollSubscription)
            await refreshSubscription()
            return
          }
        } catch { /* continue polling */ }
        if (attempts >= 10) clearInterval(pollSubscription)
      }, 3000)
      return () => clearInterval(pollSubscription)
    }
    if (params.get('payment') === 'cancel') {
      showToast('Checkout was cancelled. You can try again anytime.', 'info')
      window.history.replaceState({}, '', '/dashboard')
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (FORCED_PRODUCT_LINE === 'psychology') {
      localStorage.setItem('productLine', 'psychology')
    }
  }, [])

  useEffect(() => {
    return () => {
      if (syncTimerRef.current) {
        clearTimeout(syncTimerRef.current)
      }
    }
  }, [])

  useEffect(() => {
    if (status === 'loading') return

    const wasAuthenticated = prevIsAuthenticatedRef.current
    prevIsAuthenticatedRef.current = isAuthenticated

    if (!ENABLE_GUEST_CLOUD_SAVE || !isAuthenticated || wasAuthenticated) return

    const mergeGuestData = async () => {
      const guestToken = localStorage.getItem(GUEST_TOKEN_STORAGE_KEY)
      if (!guestToken) return

      try {
        const res = await fetch('/api/study-data/merge-guest', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token: guestToken }),
        })
        if (!res.ok) return
        const data = await res.json()
        if (data?.merged) {
          localStorage.removeItem(GUEST_TOKEN_STORAGE_KEY)
          guestTokenRef.current = null
          await loadFromRemote()
        }
      } catch (error) {
        console.error('Guest merge failed:', error)
      }
    }

    void mergeGuestData()
  }, [isAuthenticated, loadFromRemote, status])

  const flushPendingSync = useCallback(async () => {
    if (syncInFlightRef.current) return

    const updates = pendingSyncRef.current
    if (Object.keys(updates).length === 0) return

    pendingSyncRef.current = {}
    syncInFlightRef.current = true

    try {
      if (isAuthenticated) {
        const res = await fetch('/api/study-data', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updates),
        })
        if (!res.ok) throw new Error(`Authenticated sync failed with ${res.status}`)
      } else if (ENABLE_GUEST_CLOUD_SAVE) {
        const guestToken = await ensureGuestToken()
        if (guestToken) {
          const res = await fetch('/api/study-data/guest', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'x-guest-token': guestToken,
            },
            body: JSON.stringify({ updates }),
          })
          if (!res.ok) throw new Error(`Guest sync failed with ${res.status}`)
        }
      }
    } catch (err) {
      pendingSyncRef.current = {
        ...updates,
        ...pendingSyncRef.current,
      }
      console.error('Background sync error:', err)
    } finally {
      syncInFlightRef.current = false
      if (Object.keys(pendingSyncRef.current).length > 0) {
        void flushPendingSync()
      }
    }
  }, [ensureGuestToken, isAuthenticated])

  const queueSync = useCallback((updates: Record<string, unknown>) => {
    pendingSyncRef.current = {
      ...pendingSyncRef.current,
      ...updates,
    }

    if (syncTimerRef.current) clearTimeout(syncTimerRef.current)
    syncTimerRef.current = setTimeout(() => {
      void flushPendingSync()
    }, SYNC_DEBOUNCE_MS)
  }, [flushPendingSync])

  const updateAppData = useCallback((updates: Partial<AppData>) => {
    try {
      setAppData(prev => ({ ...prev, ...updates }))

      Object.entries(updates).forEach(([key, value]) => {
        if (key !== 'hasCompletedOnboarding') {
          localStorage.setItem(key, JSON.stringify(value))
        }
      })

      queueSync(updates as Record<string, unknown>)
    } catch (err) {
      console.error('Error saving app data:', err)
      setError('Failed to save your progress. Please try again.')
    }
  }, [queueSync])

  const handlePageChange = (page: string, domain?: string) => {
    setIsLoading(true)
    setError(null)
    if (domain) {
      setAppData(prev => ({ ...prev, activeDomain: domain }))
    }
    if (FORCED_PRODUCT_LINE === 'psychology' && NURSING_ONLY_PAGES.has(page)) {
      setCurrentPage('dashboard')
    } else {
      setCurrentPage(page)
    }
    setTimeout(() => setIsLoading(false), 300)
  }

  const handleCompleteOnboarding = (data: { examDate: string; examSittingId: string; studyGoal: string; selectedDomains: string[]; productLine: AppData['productLine'] }) => {
    const resolvedProductLine = FORCED_PRODUCT_LINE ?? data.productLine
    const resolvedSelectedDomains = sanitizeSelectedDomains(data.selectedDomains, resolvedProductLine)
    localStorage.setItem('examSittingId', data.examSittingId)
    localStorage.setItem('productLine', resolvedProductLine)
    updateAppData({
      hasCompletedOnboarding: true,
      productLine: resolvedProductLine,
      examDate: data.examDate,
      examSittingId: data.examSittingId,
      studyGoal: data.studyGoal,
      selectedDomains: resolvedSelectedDomains,
    })
    localStorage.setItem('hasCompletedOnboarding', 'true')
    setShowOnboarding(false)
  }

  const renderPage = () => {
    if (isLoading) {
      return (
        <div className="min-h-[100dvh] bg-gray-50 flex items-center justify-center" role="status" aria-label="Loading application">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" aria-hidden="true"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      )
    }

    if (error) {
      return (
        <div className="min-h-[100dvh] bg-gray-50 flex items-center justify-center" role="alert">
          <div className="text-center max-w-md mx-auto p-6">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <p className="text-red-800">{error}</p>
            </div>
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Refresh Page
            </button>
          </div>
        </div>
      )
    }

    switch (currentPage) {
      case 'dashboard':
        return <Dashboard appData={appData} updateAppData={updateAppData} onPageChange={handlePageChange} />
      case 'learning-style':
        return <KolbAssessment appData={appData} updateAppData={updateAppData} />
      case 'flashcards':
        return <Flashcards appData={appData} updateAppData={updateAppData} />
      case 'practice':
        return <PracticeQuestions appData={appData} updateAppData={updateAppData} />
      case 'materials':
        return <StudyMaterials appData={appData} updateAppData={updateAppData} />
      case 'progress':
        return <Progress appData={appData} updateAppData={updateAppData} />
      case 'pricing':
        return <PricingPage onNavigate={handlePageChange} />
      case 'exam-simulation':
        return <ExamSimulation appData={appData} updateAppData={updateAppData} onBack={() => handlePageChange('dashboard')} />
      case 'study-plan':
        return <WeakAreaPlan appData={appData} onNavigate={handlePageChange} />
      case 'submit-results':
        return <SubmitResults onDiscountUnlocked={() => handlePageChange('pricing')} />
      case 'buddy':
        return <BuddyHub onNavigate={handlePageChange} />
      case 'live-session':
        return <LiveSessionContainer productLine={appData.productLine} onExit={() => handlePageChange('buddy')} />
      case 'daily-challenge':
        return <DailyChallenge appData={appData} updateAppData={updateAppData} />
      case 'osce-simulation':
        return appData.productLine === 'nursing'
          ? <OSCESimulation />
          : <Dashboard appData={appData} updateAppData={updateAppData} onPageChange={handlePageChange} />
      case 'drug-calculations':
        return appData.productLine === 'nursing'
          ? <DrugCalculation />
          : <Dashboard appData={appData} updateAppData={updateAppData} onPageChange={handlePageChange} />
      default:
        return <Dashboard appData={appData} updateAppData={updateAppData} onPageChange={handlePageChange} />
    }
  }

  if (status === 'unauthenticated') {
    return <LandingPage />
  }

  if (showOnboarding) {
    return <Onboarding onComplete={handleCompleteOnboarding} initialProductLine={appData.productLine} lockedProductLine={FORCED_PRODUCT_LINE ?? undefined} />
  }

  const pageTitle = {
    dashboard: 'Dashboard',
    'learning-style': 'Learning Style Assessment',
    flashcards: 'Flashcards',
    practice: 'Practice Questions',
    materials: 'Study Materials',
    progress: 'Progress',
    pricing: 'Pricing',
    'exam-simulation': 'Exam Simulation',
    'study-plan': 'Study Plan',
    'submit-results': 'Submit Results',
    buddy: 'Buddy Hub',
    'live-session': 'Live Quiz',
    'daily-challenge': 'Daily Challenge',
    'osce-simulation': 'OSCE Simulation',
    'drug-calculations': 'Drug Calculations',
  }[currentPage] || 'Dashboard'

  return (
    <div className="min-h-[100dvh] bg-gray-50 mobile-page-shell">
      <a href="#main-content" className="skip-to-content">
        Skip to main content
      </a>
      {subscription?.status === 'past_due' && (
        <div className="bg-amber-50 border-b border-amber-300 px-4 py-2 text-xs text-amber-900 flex items-center justify-between safe-top" role="alert">
          <span className="mr-2">Payment overdue. Update billing to restore access.</span>
          <button
            onClick={async () => {
              try {
                const res = await fetch('/api/stripe/portal', { method: 'POST' })
                const data = await res.json()
                if (res.ok && data.url) window.location.href = data.url
              } catch { /* handled silently */ }
            }}
            className="shrink-0 px-3 py-1.5 text-xs font-medium bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
          >
            Update
          </button>
        </div>
      )}
      <Navigation currentPage={currentPage} onPageChange={handlePageChange} productLine={appData.productLine} />
      <div id="main-content" tabIndex={-1} className="outline-none">
        <div aria-live="polite" aria-atomic="true" className="sr-only">
          {pageTitle} page loaded
        </div>
        {renderPage()}
      </div>
    </div>
  )
}
