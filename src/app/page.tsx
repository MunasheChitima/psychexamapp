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
import { AppData } from '@/types'

const DEFAULT_APP_DATA: AppData = {
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
  selectedDomains: ['ethics', 'assessment', 'interventions', 'communication'],
  materialBookmarks: {},
  materialCompleted: {},
  activeDomain: 'all',
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
  const [currentPage, setCurrentPage] = useState('dashboard')
  const [isLoading, setIsLoading] = useState(true)
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [appData, setAppData] = useState<AppData>(DEFAULT_APP_DATA)

  const isAuthenticated = status === 'authenticated' && !!session?.user

  const loadFromLocalStorage = useCallback(() => {
    try {
      const savedExamDate = localStorage.getItem('examDate') || ''
      const savedStudyStats = JSON.parse(localStorage.getItem('studyStats') || '{"totalHours":0,"questionsAnswered":0,"correctAnswers":0,"studyStreak":0,"estimatedReadiness":0}')
      const savedStudySessions = JSON.parse(localStorage.getItem('studySessions') || '[]')
      const savedFlashcardProgress = JSON.parse(localStorage.getItem('flashcardProgress') || '{}')
      const savedPracticeResults = JSON.parse(localStorage.getItem('practiceResults') || '[]')
      const hasCompletedOnboarding = localStorage.getItem('hasCompletedOnboarding') === 'true'
      const savedStudyGoal = localStorage.getItem('studyGoal') || 'moderate'
      const savedSelectedDomains = JSON.parse(localStorage.getItem('selectedDomains') || '["ethics","assessment","interventions","communication"]')
      const savedMaterialBookmarks = JSON.parse(localStorage.getItem('materialBookmarks') || '{}')
      const savedMaterialCompleted = JSON.parse(localStorage.getItem('materialCompleted') || '{}')

      setAppData(prev => ({
        ...prev,
        examDate: savedExamDate,
        studyStats: savedStudyStats,
        studySessions: savedStudySessions,
        flashcardProgress: savedFlashcardProgress,
        practiceResults: savedPracticeResults,
        hasCompletedOnboarding,
        studyGoal: savedStudyGoal,
        selectedDomains: savedSelectedDomains,
        materialBookmarks: savedMaterialBookmarks,
        materialCompleted: savedMaterialCompleted,
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

      setAppData(prev => ({
        ...prev,
        examDate: data.examDate || '',
        studyStats: typeof data.studyStats === 'string' ? JSON.parse(data.studyStats) : data.studyStats || prev.studyStats,
        studySessions: typeof data.studySessions === 'string' ? JSON.parse(data.studySessions) : data.studySessions || [],
        flashcardProgress: typeof data.flashcardProgress === 'string' ? JSON.parse(data.flashcardProgress) : data.flashcardProgress || {},
        practiceResults: typeof data.practiceResults === 'string' ? JSON.parse(data.practiceResults) : data.practiceResults || [],
        hasCompletedOnboarding: data.hasCompletedOnboarding || false,
        studyGoal: data.studyGoal || 'moderate',
        selectedDomains: typeof data.selectedDomains === 'string' ? JSON.parse(data.selectedDomains) : data.selectedDomains || ['ethics', 'assessment', 'interventions', 'communication'],
        materialBookmarks: typeof data.materialBookmarks === 'string' ? JSON.parse(data.materialBookmarks) : data.materialBookmarks || {},
        materialCompleted: typeof data.materialCompleted === 'string' ? JSON.parse(data.materialCompleted) : data.materialCompleted || {},
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
        const jsonFields = ['studyStats', 'studySessions', 'flashcardProgress', 'practiceResults', 'selectedDomains', 'materialBookmarks', 'materialCompleted']

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

  const handleCompleteOnboarding = () => {
    updateAppData({ hasCompletedOnboarding: true })
    localStorage.setItem('hasCompletedOnboarding', 'true')
    setShowOnboarding(false)
  }

  const renderPage = () => {
    if (isLoading) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      )
    }

    if (error) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
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
      default:
        return <Dashboard appData={appData} updateAppData={updateAppData} onPageChange={handlePageChange} />
    }
  }

  if (showOnboarding) {
    return <Onboarding onComplete={handleCompleteOnboarding} />
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation currentPage={currentPage} onPageChange={handlePageChange} />
      {renderPage()}
    </div>
  )
}
