'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import Navigation from '@/components/Navigation'
import Dashboard from './Dashboard'
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

const FORCED_PRODUCT_LINE: AppData['productLine'] | null =
  process.env.NEXT_PUBLIC_DEFAULT_PRODUCT_LINE === 'nursing'
    ? 'nursing'
    : process.env.NEXT_PUBLIC_DEFAULT_PRODUCT_LINE === 'psychology'
      ? 'psychology'
      : null

const DEFAULT_PRODUCT_LINE: AppData['productLine'] = FORCED_PRODUCT_LINE ?? 'psychology'

const DEFAULT_APP_DATA: AppData = {
  productLine: DEFAULT_PRODUCT_LINE,
  examDate: '',
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

export default function Home() {
  const { data: session, status } = useSession()
  const { subscription, refresh: refreshSubscription } = useSubscription()
  const { showToast } = useToast()
  const [currentPage, setCurrentPage] = useState('dashboard')
  const [isLoading, setIsLoading] = useState(true)
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [appData, setAppData] = useState<AppData>(DEFAULT_APP_DATA)

  const isAuthenticated = status === 'authenticated' && !!session?.user

  if (status === 'unauthenticated') {
    return <LandingPage />
  }

  const loadFromLocalStorage = useCallback(() => {
    try {
      const rawExamDate = localStorage.getItem('examDate')
      const savedExamDate = rawExamDate ? (() => { try { return JSON.parse(rawExamDate) } catch { return rawExamDate } })() : ''
      const savedStudyStats = JSON.parse(localStorage.getItem('studyStats') || '{"totalHours":0,"questionsAnswered":0,"correctAnswers":0,"studyStreak":0,"estimatedReadiness":0}')
      const savedStudySessions = JSON.parse(localStorage.getItem('studySessions') || '[]')
      const savedFlashcardProgress = JSON.parse(localStorage.getItem('flashcardProgress') || '{}')
      const savedPracticeResults = JSON.parse(localStorage.getItem('practiceResults') || '[]')
      const hasCompletedOnboarding = localStorage.getItem('hasCompletedOnboarding') === 'true'
      const rawStudyGoal = localStorage.getItem('studyGoal')
      const savedStudyGoal = rawStudyGoal ? (() => { try { return JSON.parse(rawStudyGoal) } catch { return rawStudyGoal } })() : 'moderate'
      const savedProductLine = FORCED_PRODUCT_LINE || (localStorage.getItem('productLine') as AppData['productLine']) || 'psychology'
      const savedSelectedDomains = JSON.parse(localStorage.getItem('selectedDomains') || JSON.stringify(getDefaultDomains(savedProductLine)))
      const savedMaterialBookmarks = JSON.parse(localStorage.getItem('materialBookmarks') || '{}')
      const savedMaterialCompleted = JSON.parse(localStorage.getItem('materialCompleted') || '{}')
      const savedEngagementData = JSON.parse(localStorage.getItem('engagementData') || 'null')

      setAppData(prev => ({
        ...prev,
        examDate: savedExamDate,
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

  const loadFromDatabase = useCallback(async () => {
    try {
      const res = await fetch('/api/study-data')
      if (!res.ok) throw new Error('Failed to load study data')
      const data = await res.json()
      const persistedProductLine = FORCED_PRODUCT_LINE || (localStorage.getItem('productLine') as AppData['productLine']) || 'psychology'

      setAppData(prev => ({
        ...prev,
        productLine: FORCED_PRODUCT_LINE || (data.productLine as AppData['productLine']) || persistedProductLine || prev.productLine,
        examDate: data.examDate || '',
        studyStats: typeof data.studyStats === 'string' ? JSON.parse(data.studyStats) : data.studyStats || prev.studyStats,
        studySessions: typeof data.studySessions === 'string' ? JSON.parse(data.studySessions) : data.studySessions || [],
        flashcardProgress: typeof data.flashcardProgress === 'string' ? JSON.parse(data.flashcardProgress) : data.flashcardProgress || {},
        practiceResults: typeof data.practiceResults === 'string' ? JSON.parse(data.practiceResults) : data.practiceResults || [],
        hasCompletedOnboarding: data.hasCompletedOnboarding || false,
        studyGoal: data.studyGoal || 'moderate',
        selectedDomains: typeof data.selectedDomains === 'string' ? JSON.parse(data.selectedDomains) : data.selectedDomains || prev.selectedDomains,
        materialBookmarks: typeof data.materialBookmarks === 'string' ? JSON.parse(data.materialBookmarks) : data.materialBookmarks || {},
        materialCompleted: typeof data.materialCompleted === 'string' ? JSON.parse(data.materialCompleted) : data.materialCompleted || {},
        engagementData: typeof data.engagementData === 'string' ? JSON.parse(data.engagementData) : data.engagementData || createDefaultEngagementData(),
      }))

      if (!data.hasCompletedOnboarding) {
        setShowOnboarding(true)
      }
    } catch (err) {
      console.error('Error loading from database, falling back to localStorage:', err)
      loadFromLocalStorage()
    }
  }, [loadFromLocalStorage])

  useEffect(() => {
    if (status === 'loading') return

    const load = async () => {
      setIsLoading(true)
      if (isAuthenticated) {
        await loadFromDatabase()
      } else {
        loadFromLocalStorage()
      }
      setIsLoading(false)
    }

    load()
  }, [status, isAuthenticated, loadFromDatabase, loadFromLocalStorage])

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const pageFromQuery = params.get('page')
    if (pageFromQuery) {
      setCurrentPage(pageFromQuery)
      return
    }
    if (params.has('upgrade')) {
      setCurrentPage('pricing')
    }
    if (params.get('payment') === 'success') {
      showToast('Payment successful! Your subscription is being activated...', 'success', 6000)
      window.history.replaceState({}, '', '/')
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
      window.history.replaceState({}, '', '/')
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const updateAppData = useCallback((updates: Partial<AppData>) => {
    try {
      setAppData(prev => ({ ...prev, ...updates }))

      Object.entries(updates).forEach(([key, value]) => {
        if (key !== 'hasCompletedOnboarding') {
          localStorage.setItem(key, JSON.stringify(value))
        }
      })

      if (isAuthenticated) {
        const dbUpdates: Record<string, unknown> = {}
        const jsonFields = ['studyStats', 'studySessions', 'flashcardProgress', 'practiceResults', 'selectedDomains', 'materialBookmarks', 'materialCompleted', 'engagementData']

        for (const [key, value] of Object.entries(updates)) {
          if (jsonFields.includes(key)) {
            dbUpdates[key] = typeof value === 'string' ? value : JSON.stringify(value)
          } else {
            dbUpdates[key] = value
          }
        }

        fetch('/api/study-data', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(dbUpdates),
        }).catch(err => console.error('Background sync error:', err))
      }
    } catch (err) {
      console.error('Error saving app data:', err)
      setError('Failed to save your progress. Please try again.')
    }
  }, [isAuthenticated])

  const handlePageChange = (page: string, domain?: string) => {
    setIsLoading(true)
    setError(null)
    if (domain) {
      setAppData(prev => ({ ...prev, activeDomain: domain }))
    }
    setCurrentPage(page)
    setTimeout(() => setIsLoading(false), 300)
  }

  const handleCompleteOnboarding = (data: { examDate: string; examSittingId: string; studyGoal: string; selectedDomains: string[]; productLine: AppData['productLine'] }) => {
    const resolvedProductLine = FORCED_PRODUCT_LINE ?? data.productLine
    localStorage.setItem('examSittingId', data.examSittingId)
    localStorage.setItem('productLine', resolvedProductLine)
    updateAppData({
      hasCompletedOnboarding: true,
      productLine: resolvedProductLine,
      examDate: data.examDate,
      studyGoal: data.studyGoal,
      selectedDomains: data.selectedDomains,
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
        return <OSCESimulation />
      case 'drug-calculations':
        return <DrugCalculation />
      default:
        return <Dashboard appData={appData} updateAppData={updateAppData} onPageChange={handlePageChange} />
    }
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
    <div className="min-h-[100dvh] bg-gray-50">
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
