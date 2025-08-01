'use client'

import { useState, useEffect } from 'react'
import Navigation from '@/components/Navigation'
import Dashboard from './Dashboard'
import Flashcards from '@/components/Flashcards'
import PracticeQuestions from '@/components/PracticeQuestions'
import StudyMaterials from '@/components/StudyMaterials'
import Progress from '@/components/Progress'
import Onboarding from '@/components/Onboarding'
import { AppData } from '@/types'

export default function Home() {
  const [currentPage, setCurrentPage] = useState('dashboard')
  const [isLoading, setIsLoading] = useState(false)
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Global state for app data
  const [appData, setAppData] = useState<AppData>({
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
    hasCompletedOnboarding: false
  })

  // Load data from localStorage on app start
  useEffect(() => {
    const loadAppData = () => {
      try {
        setIsLoading(true)
        const savedExamDate = localStorage.getItem('examDate') || ''
        const savedStudyStats = JSON.parse(localStorage.getItem('studyStats') || '{"totalHours":0,"questionsAnswered":0,"correctAnswers":0,"studyStreak":0,"estimatedReadiness":0}')
        const savedStudySessions = JSON.parse(localStorage.getItem('studySessions') || '[]')
        const savedFlashcardProgress = JSON.parse(localStorage.getItem('flashcardProgress') || '{}')
        const savedPracticeResults = JSON.parse(localStorage.getItem('practiceResults') || '[]')
        const hasCompletedOnboarding = localStorage.getItem('hasCompletedOnboarding') === 'true'

        setAppData({
          examDate: savedExamDate,
          studyStats: savedStudyStats,
          studySessions: savedStudySessions,
          flashcardProgress: savedFlashcardProgress,
          practiceResults: savedPracticeResults,
          hasCompletedOnboarding
        })

        // Show onboarding for new users
        if (!hasCompletedOnboarding) {
          setShowOnboarding(true)
        }
      } catch (error) {
        console.error('Error loading app data:', error)
        setError('Failed to load your study data. Please refresh the page.')
      } finally {
        setIsLoading(false)
      }
    }

    loadAppData()
  }, [])

  // Function to update app data and save to localStorage
  const updateAppData = (updates: Partial<AppData>) => {
    try {
      const newData = { ...appData, ...updates }
      setAppData(newData)
      
      // Save to localStorage
      Object.entries(updates).forEach(([key, value]) => {
        if (key !== 'hasCompletedOnboarding') {
          localStorage.setItem(key, JSON.stringify(value))
        }
      })
    } catch (error) {
      console.error('Error saving app data:', error)
      setError('Failed to save your progress. Please try again.')
    }
  }

  const handlePageChange = (page: string) => {
    setIsLoading(true)
    setError(null)
    setCurrentPage(page)
    // Simulate loading time for better UX
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
      case 'flashcards':
        return <Flashcards appData={appData} updateAppData={updateAppData} />
      case 'practice':
        return <PracticeQuestions appData={appData} updateAppData={updateAppData} />
      case 'materials':
        return <StudyMaterials appData={appData} updateAppData={updateAppData} />
      case 'progress':
        return <Progress appData={appData} updateAppData={updateAppData} />
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
