'use client'

import { useState, useEffect, useMemo } from 'react'
import {
  BookOpen,
  Brain,
  Target,
  Clock,
  TrendingUp,
  Calendar,
  CheckCircle,
  AlertCircle,
  BarChart3,
  FileText,
  Users,
  MessageSquare,
  Search,
  Settings,
  X,
  Trash2
} from 'lucide-react'
import { DashboardProps } from '@/types'

interface Domain {
  id: string
  name: string
  questions: number
  percentage: number
  color: string
  progress: number
  icon: React.ReactNode
}

export default function Dashboard({ appData, updateAppData, onPageChange }: DashboardProps) {
  const [daysUntilExam, setDaysUntilExam] = useState<number | null>(null)
  const [studyStats, setStudyStats] = useState(appData.studyStats)
  const [searchQuery, setSearchQuery] = useState('')
  const [showSettings, setShowSettings] = useState(false)

  const domainProgress = useMemo(() => {
    const progress: Record<string, { answered: number; correct: number }> = {
      ethics: { answered: 0, correct: 0 },
      assessment: { answered: 0, correct: 0 },
      interventions: { answered: 0, correct: 0 },
      communication: { answered: 0, correct: 0 },
    }
    if (appData.practiceResults) {
      appData.practiceResults.forEach(result => {
        if (!result.questions || !result.answers) return
        result.questions.forEach((q, idx) => {
          if (progress[q.domain]) {
            progress[q.domain].answered += 1
            if (result.answers[idx] !== null && result.answers[idx] !== undefined) {
              const scoreRatio = result.score / 100
              if (scoreRatio >= 0.5) {
                progress[q.domain].correct += Math.round(scoreRatio)
              }
            }
          }
        })
      })
    }
    return progress
  }, [appData.practiceResults])

  const computeDomainProgressPercent = (domainId: string): number => {
    const dp = domainProgress[domainId]
    if (!dp || dp.answered === 0) return 0
    return Math.round((dp.correct / dp.answered) * 100)
  }

  const domains: Domain[] = [
    {
      id: 'ethics',
      name: 'Ethics',
      questions: 45,
      percentage: 30,
      color: 'bg-blue-500',
      progress: computeDomainProgressPercent('ethics'),
      icon: <Users className="w-6 h-6" />
    },
    {
      id: 'assessment',
      name: 'Assessment',
      questions: 45,
      percentage: 30,
      color: 'bg-green-500',
      progress: computeDomainProgressPercent('assessment'),
      icon: <BarChart3 className="w-6 h-6" />
    },
    {
      id: 'interventions',
      name: 'Interventions',
      questions: 45,
      percentage: 30,
      color: 'bg-purple-500',
      progress: computeDomainProgressPercent('interventions'),
      icon: <Brain className="w-6 h-6" />
    },
    {
      id: 'communication',
      name: 'Communication',
      questions: 15,
      percentage: 10,
      color: 'bg-orange-500',
      progress: computeDomainProgressPercent('communication'),
      icon: <MessageSquare className="w-6 h-6" />
    }
  ]

  useEffect(() => {
    setStudyStats(appData.studyStats)
    if (appData.examDate) {
      calculateDaysUntilExam(appData.examDate)
    }
  }, [appData])

  const calculateDaysUntilExam = (date: string) => {
    const exam = new Date(date)
    const today = new Date()
    const diffTime = exam.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    setDaysUntilExam(diffDays)
  }

  const handleExamDateChange = (date: string) => {
    updateAppData({ examDate: date })
    calculateDaysUntilExam(date)
  }

  const handleStudyDomain = (domainId: string) => {
    onPageChange('flashcards', domainId)
  }

  const handleStartFlashcards = () => {
    onPageChange('flashcards')
  }

  const handleTakeQuiz = () => {
    onPageChange('practice')
  }

  const handleBrowseMaterials = () => {
    onPageChange('materials')
  }

  const handleViewProgress = () => {
    onPageChange('progress')
  }

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    if (!query.trim()) return
    const q = query.toLowerCase()
    if (q.includes('ethics') || q.includes('confidential') || q.includes('mandatory')) {
      onPageChange('flashcards', 'ethics')
    } else if (q.includes('assess') || q.includes('wais') || q.includes('wisc') || q.includes('dsm') || q.includes('dass')) {
      onPageChange('flashcards', 'assessment')
    } else if (q.includes('interven') || q.includes('cbt') || q.includes('dbt') || q.includes('medication') || q.includes('ssri')) {
      onPageChange('flashcards', 'interventions')
    } else if (q.includes('communic') || q.includes('report') || q.includes('culture') || q.includes('record')) {
      onPageChange('flashcards', 'communication')
    } else if (q.includes('quiz') || q.includes('practice') || q.includes('question')) {
      onPageChange('practice')
    } else if (q.includes('flashcard') || q.includes('review')) {
      onPageChange('flashcards')
    } else if (q.includes('material') || q.includes('study')) {
      onPageChange('materials')
    } else if (q.includes('progress') || q.includes('stats')) {
      onPageChange('progress')
    } else if (q.includes('kolb') || q.includes('learning style')) {
      onPageChange('learning-style')
    } else {
      onPageChange('materials')
    }
  }

  const handleResetAllData = () => {
    if (typeof window !== 'undefined' && window.confirm('Are you sure you want to reset all study data? This cannot be undone.')) {
      localStorage.clear()
      window.location.reload()
    }
  }

  const getStudyRecommendations = () => {
    const recommendations = []

    if (daysUntilExam && daysUntilExam <= 7) {
      recommendations.push({
        type: 'urgent',
        title: 'Exam is approaching!',
        message: 'Focus on practice questions and review weak areas.',
        action: 'Take Practice Quiz',
        onClick: () => handleTakeQuiz()
      })
    }

    if (studyStats.studyStreak < 3) {
      recommendations.push({
        type: 'warning',
        title: 'Build your study streak',
        message: 'Study daily to maintain momentum and improve retention.',
        action: 'Start Flashcards',
        onClick: () => handleStartFlashcards()
      })
    }

    if (studyStats.estimatedReadiness < 70) {
      recommendations.push({
        type: 'info',
        title: 'Increase your readiness',
        message: 'Spend more time on practice questions and materials.',
        action: 'Study Materials',
        onClick: () => handleBrowseMaterials()
      })
    }

    return recommendations
  }

  const getQuickActions = () => {
    return [
      {
        id: 'learning-style',
        title: 'Learning Style',
        description: 'Discover your Kolb learning style for smarter study',
        icon: <Brain className="w-8 h-8 text-indigo-600" />,
        color: 'bg-indigo-600',
        hoverColor: 'hover:bg-indigo-700',
        onClick: () => onPageChange('learning-style')
      },
      {
        id: 'flashcards',
        title: 'Flashcards',
        description: 'Review key concepts with spaced repetition',
        icon: <BookOpen className="w-8 h-8 text-blue-600" />,
        color: 'bg-blue-600',
        hoverColor: 'hover:bg-blue-700',
        onClick: handleStartFlashcards
      },
      {
        id: 'practice',
        title: 'Practice Questions',
        description: 'Test your knowledge with realistic exam questions',
        icon: <Target className="w-8 h-8 text-green-600" />,
        color: 'bg-green-600',
        hoverColor: 'hover:bg-green-700',
        onClick: handleTakeQuiz
      },
      {
        id: 'materials',
        title: 'Study Materials',
        description: 'Access comprehensive study resources',
        icon: <FileText className="w-8 h-8 text-purple-600" />,
        color: 'bg-purple-600',
        hoverColor: 'hover:bg-purple-700',
        onClick: handleBrowseMaterials
      },
      {
        id: 'exam-simulation',
        title: 'Exam Simulation',
        description: 'Full timed exam under real conditions',
        icon: <Clock className="w-8 h-8 text-red-600" />,
        color: 'bg-red-600',
        hoverColor: 'hover:bg-red-700',
        onClick: () => onPageChange('exam-simulation')
      },
      {
        id: 'study-plan',
        title: 'Study Plan',
        description: 'Personalised plan targeting weak areas',
        icon: <TrendingUp className="w-8 h-8 text-teal-600" />,
        color: 'bg-teal-600',
        hoverColor: 'hover:bg-teal-700',
        onClick: () => onPageChange('study-plan')
      },
      {
        id: 'progress',
        title: 'View Progress',
        description: 'Track your performance and readiness',
        icon: <BarChart3 className="w-8 h-8 text-orange-600" />,
        color: 'bg-orange-600',
        hoverColor: 'hover:bg-orange-700',
        onClick: handleViewProgress
      }
    ]
  }

  const recommendations = getStudyRecommendations()
  const quickActions = getQuickActions()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                National Psychology Exam
              </h1>
              <p className="text-gray-600 mt-1">
                Comprehensive Study Application
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-gray-500">Pass Grade</p>
                <p className="text-2xl font-bold text-green-600">70%</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Duration</p>
                <p className="text-2xl font-bold text-blue-600">3.5h</p>
              </div>
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search topics... (e.g. ethics, CBT, DSM, practice questions)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleSearch(searchQuery) }}
              aria-label="Search study materials, questions, or topics"
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Settings Panel */}
        {showSettings && (
          <div className="mb-8 bg-white rounded-lg shadow-sm border p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Settings</h3>
              <button onClick={() => setShowSettings(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Exam Date</label>
                <input
                  type="date"
                  value={appData.examDate}
                  onChange={(e) => handleExamDateChange(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Study Goal</label>
                <select
                  value={appData.studyGoal || 'moderate'}
                  onChange={(e) => {
                    updateAppData({ studyGoal: e.target.value })
                    localStorage.setItem('studyGoal', e.target.value)
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="intensive">Intensive (2+ hours daily)</option>
                  <option value="moderate">Moderate (1 hour daily)</option>
                  <option value="casual">Casual (30 minutes daily)</option>
                </select>
              </div>
              <div className="pt-4 border-t">
                <button
                  onClick={handleResetAllData}
                  className="flex items-center space-x-2 px-4 py-2 text-red-600 border border-red-300 rounded-md hover:bg-red-50 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Reset All Data</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Exam Countdown */}
        {appData.examDate && daysUntilExam !== null && (
          <div className="mb-8">
            <div className={`p-6 rounded-lg border ${daysUntilExam <= 7 ? 'bg-red-50 border-red-200' : daysUntilExam <= 30 ? 'bg-yellow-50 border-yellow-200' : 'bg-blue-50 border-blue-200'}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Calendar className={`w-6 h-6 ${daysUntilExam <= 7 ? 'text-red-600' : daysUntilExam <= 30 ? 'text-yellow-600' : 'text-blue-600'}`} />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {daysUntilExam > 0 ? `${daysUntilExam} days until exam` : 'Exam is today!'}
                    </h3>
                    <p className="text-gray-600">Exam Date: {new Date(appData.examDate).toLocaleDateString()}</p>
                  </div>
                </div>
                {daysUntilExam <= 7 && (
                  <AlertCircle className="w-6 h-6 text-red-600" />
                )}
              </div>
            </div>
          </div>
        )}

        {/* Set Exam Date */}
        {!appData.examDate && (
          <div className="mb-8 p-6 bg-white rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Set Your Exam Date</h3>
            <div className="flex items-center space-x-4">
              <input
                type="date"
                value={appData.examDate}
                onChange={(e) => handleExamDateChange(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <p className="text-gray-600">This will help track your study progress</p>
            </div>
          </div>
        )}

        {/* Study Recommendations */}
        {recommendations.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Study Recommendations</h2>
            <div className="space-y-4">
              {recommendations.map((rec, index) => (
                <div key={index} className={`p-4 rounded-lg border ${rec.type === 'urgent' ? 'bg-red-50 border-red-200' :
                    rec.type === 'warning' ? 'bg-yellow-50 border-yellow-200' :
                      'bg-blue-50 border-blue-200'
                  }`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900">{rec.title}</h3>
                      <p className="text-gray-600">{rec.message}</p>
                    </div>
                    <button
                      onClick={rec.onClick}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    >
                      {rec.action}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Study Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <Clock className="w-8 h-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm text-gray-500">Hours Studied</p>
                <p className="text-2xl font-bold text-gray-900">{studyStats.totalHours}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <Target className="w-8 h-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm text-gray-500">Questions Answered</p>
                <p className="text-2xl font-bold text-gray-900">{studyStats.questionsAnswered}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <CheckCircle className="w-8 h-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm text-gray-500">Correct Answers</p>
                <p className="text-2xl font-bold text-gray-900">{studyStats.correctAnswers}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <TrendingUp className="w-8 h-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm text-gray-500">Study Streak</p>
                <p className="text-2xl font-bold text-gray-900">{studyStats.studyStreak} days</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <BarChart3 className="w-8 h-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm text-gray-500">Readiness</p>
                <p className="text-2xl font-bold text-gray-900">{studyStats.estimatedReadiness}%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickActions.map((action) => (
              <div key={action.id} className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow">
                <div className="flex items-center mb-4">
                  {action.icon}
                  <h3 className="text-lg font-semibold text-gray-900 ml-3">{action.title}</h3>
                </div>
                <p className="text-gray-600 mb-4">
                  {action.description}
                </p>
                <button
                  onClick={action.onClick}
                  className={`w-full ${action.color} text-white py-2 px-4 rounded-md ${action.hoverColor} transition-colors`}
                >
                  {action.title}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Exam Domains */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Exam Domains</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {domains.map((domain) => (
              <div key={domain.id} className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-lg ${domain.color}`}>
                    <div className="text-white">
                      {domain.icon}
                    </div>
                  </div>
                  <span className="text-sm font-medium text-gray-500">
                    {domain.percentage}%
                  </span>
                </div>

                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {domain.name}
                </h3>

                <p className="text-gray-600 mb-4">
                  {domain.questions} questions
                </p>

                <div className="mb-4">
                  <div className="flex justify-between text-sm text-gray-500 mb-1">
                    <span>Progress</span>
                    <span>{domain.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${domain.color.replace('bg-', 'bg-')}`}
                      style={{ width: `${domain.progress}%` }}
                    ></div>
                  </div>
                </div>

                <button
                  onClick={() => handleStudyDomain(domain.id)}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Study {domain.name}
                </button>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
} 