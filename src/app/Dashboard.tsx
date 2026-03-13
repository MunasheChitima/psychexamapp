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
  Trash2,
  Zap,
  ChevronRight,
  Play
} from 'lucide-react'
import { DashboardProps } from '@/types'
import ConfirmModal from '@/components/ConfirmModal'
import { getAllPracticeQuestions, getProductConfig } from '@/lib/productConfig'

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
  const productConfig = useMemo(() => getProductConfig(appData.productLine), [appData.productLine])
  const [daysUntilExam, setDaysUntilExam] = useState<number | null>(null)
  const [studyStats, setStudyStats] = useState(appData.studyStats)
  const [searchQuery, setSearchQuery] = useState('')
  const [showSettings, setShowSettings] = useState(false)
  const [openingBillingPortal, setOpeningBillingPortal] = useState(false)
  const [billingError, setBillingError] = useState<string | null>(null)
  const [showResetConfirm, setShowResetConfirm] = useState(false)
  const [resetting, setResetting] = useState(false)

  const allQuestionsMap = useMemo(() => {
    const all = getAllPracticeQuestions(appData.productLine)
    return new Map(all.map(q => [q.id, q]))
  }, [appData.productLine])

  const domainProgress = useMemo(() => {
    const progress: Record<string, { answered: number; correct: number }> = {}
    productConfig.domains.forEach((domain) => {
      progress[domain.id] = { answered: 0, correct: 0 }
    })
    if (appData.practiceResults) {
      appData.practiceResults.forEach(result => {
        if (!result.questions || !result.answers) return
        result.questions.forEach((q, idx) => {
          if (progress[q.domain]) {
            progress[q.domain].answered += 1
            const userAnswer = result.answers[idx]
            if (userAnswer !== null && userAnswer !== undefined) {
              const originalQuestion = allQuestionsMap.get(q.id)
              if (originalQuestion && userAnswer === originalQuestion.correctAnswer) {
                progress[q.domain].correct += 1
              }
            }
          }
        })
      })
    }
    return progress
  }, [appData.practiceResults, allQuestionsMap, productConfig.domains])

  const computeDomainProgressPercent = (domainId: string): number => {
    const dp = domainProgress[domainId]
    if (!dp || dp.answered === 0) return 0
    return Math.round((dp.correct / dp.answered) * 100)
  }

  const iconForDomain = (domainId: string) => {
    if (domainId.includes('communication')) return <MessageSquare className="w-5 h-5" />
    if (domainId.includes('assessment') || domainId.includes('risk') || domainId.includes('promotion')) return <BarChart3 className="w-5 h-5" />
    if (domainId.includes('ethics') || domainId.includes('management') || domainId.includes('safety')) return <Users className="w-5 h-5" />
    return <Brain className="w-5 h-5" />
  }

  const domains: Domain[] = productConfig.domains.map((domain) => ({
    id: domain.id,
    name: domain.name,
    questions: 0,
    percentage: domain.examWeight,
    color: domain.color,
    progress: computeDomainProgressPercent(domain.id),
    icon: iconForDomain(domain.id),
  }))

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

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    if (!query.trim()) return
    const q = query.toLowerCase()
    const matchingDomain = productConfig.domains.find((domain) => q.includes(domain.name.toLowerCase()) || q.includes(domain.id.toLowerCase()))
    if (matchingDomain) {
      onPageChange('flashcards', matchingDomain.id)
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

  const handleResetAllData = async () => {
    setResetting(true)
    try {
      await fetch('/api/study-data', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studyStats: JSON.stringify({ totalHours: 0, questionsAnswered: 0, correctAnswers: 0, studyStreak: 0, estimatedReadiness: 0 }),
          studySessions: JSON.stringify([]),
          flashcardProgress: JSON.stringify({}),
          practiceResults: JSON.stringify([]),
          materialBookmarks: JSON.stringify({}),
          materialCompleted: JSON.stringify({}),
        }),
      })
    } catch {
      // continue with local clear
    }
    localStorage.clear()
    window.location.reload()
  }

  const handleManageBilling = async () => {
    setOpeningBillingPortal(true)
    setBillingError(null)
    try {
      const response = await fetch('/api/stripe/portal', { method: 'POST' })
      const data = await response.json()
      if (response.ok && data.url) {
        window.location.href = data.url
        return
      }
      setBillingError(data.error || 'Unable to open billing portal.')
    } catch (error) {
      console.error('Billing portal error:', error)
      setBillingError('Unable to open billing portal. Please try again.')
    } finally {
      setOpeningBillingPortal(false)
    }
  }

  const getStudyRecommendation = () => {
    if (daysUntilExam && daysUntilExam <= 7) {
      return { type: 'urgent' as const, title: 'Exam is approaching!', message: 'Focus on practice questions and weak areas.', action: 'Take Quiz', onClick: () => onPageChange('practice') }
    }
    if (studyStats.studyStreak < 3) {
      return { type: 'warning' as const, title: 'Build your streak', message: 'Study daily to improve retention.', action: 'Start Flashcards', onClick: () => onPageChange('flashcards') }
    }
    if (studyStats.estimatedReadiness < 70) {
      return { type: 'info' as const, title: 'Boost readiness', message: 'More practice will get you there.', action: 'Study Now', onClick: () => onPageChange('materials') }
    }
    return null
  }

  const recommendation = getStudyRecommendation()

  return (
    <div className="min-h-[100dvh] bg-gray-50">
      <main className="px-4 md:px-6 lg:px-8 max-w-3xl lg:max-w-6xl mx-auto py-5 md:py-8">

        {/* ── Hero section: greeting + exam countdown ── */}
        <section className="mb-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                Study Hub
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                {productConfig.examName}
              </p>
            </div>
            <button
              onClick={() => setShowSettings(!showSettings)}
              aria-label="Open settings"
              aria-expanded={showSettings}
              className="p-2.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-colors mt-1"
            >
              <Settings className="w-5 h-5" aria-hidden="true" />
            </button>
          </div>

          {/* Exam countdown or date picker */}
          {appData.examDate && daysUntilExam !== null ? (
            <div className={`p-4 rounded-2xl ${
              daysUntilExam <= 7 ? 'bg-red-600 text-white' :
              daysUntilExam <= 30 ? 'bg-amber-500 text-white' :
              'bg-blue-600 text-white'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Calendar className="w-6 h-6 opacity-80" aria-hidden="true" />
                  <div>
                    <p className="text-2xl font-bold">
                      {daysUntilExam > 0 ? `${daysUntilExam} days` : 'Exam day!'}
                    </p>
                    <p className="text-sm opacity-80">
                      {new Date(appData.examDate).toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </p>
                  </div>
                </div>
                {daysUntilExam <= 7 && <AlertCircle className="w-6 h-6 opacity-80" aria-hidden="true" />}
              </div>
            </div>
          ) : (
            <div className="p-4 bg-white rounded-2xl border border-gray-200">
              <p className="text-sm font-medium text-gray-700 mb-2">When is your exam?</p>
              <input
                type="date"
                value={appData.examDate}
                onChange={(e) => handleExamDateChange(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          )}
        </section>

        {/* ── Recommendation banner (single, not a list) ── */}
        {recommendation && (
          <section className="mb-6">
            <button
              onClick={recommendation.onClick}
              className={`w-full p-4 rounded-2xl text-left flex items-center justify-between gap-3 transition-all active:scale-[0.98] ${
                recommendation.type === 'urgent' ? 'bg-red-50 border border-red-200' :
                recommendation.type === 'warning' ? 'bg-amber-50 border border-amber-200' :
                'bg-blue-50 border border-blue-200'
              }`}
            >
              <div className="min-w-0">
                <p className="font-semibold text-gray-900 text-sm">{recommendation.title}</p>
                <p className="text-xs text-gray-600 mt-0.5">{recommendation.message}</p>
              </div>
              <span className="shrink-0 px-4 py-2 bg-blue-600 text-white text-xs font-semibold rounded-xl">
                {recommendation.action}
              </span>
            </button>
          </section>
        )}

        {/* ── Primary CTA: Start studying ── */}
        <section className="mb-6">
          <button
            onClick={() => onPageChange('practice')}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-2xl p-5 flex items-center justify-between transition-all active:scale-[0.98] shadow-lg shadow-blue-200"
          >
            <div>
              <p className="text-lg font-bold">Start Studying</p>
              <p className="text-sm text-blue-100 mt-0.5">Jump into practice questions</p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <Play className="w-6 h-6" aria-hidden="true" />
            </div>
          </button>
        </section>

        {/* ── Stats: 2x3 grid on mobile, 5-col on desktop ── */}
        <section className="mb-6" role="region" aria-label="Study statistics">
          <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
            {[
              { icon: <Clock className="w-4 h-4 text-blue-700" />, label: 'Hours', value: String(studyStats.totalHours), desc: `${studyStats.totalHours} hours studied` },
              { icon: <Target className="w-4 h-4 text-green-700" />, label: 'Answered', value: String(studyStats.questionsAnswered), desc: `${studyStats.questionsAnswered} questions answered` },
              { icon: <CheckCircle className="w-4 h-4 text-emerald-700" />, label: 'Correct', value: String(studyStats.correctAnswers), desc: `${studyStats.correctAnswers} correct` },
              { icon: <TrendingUp className="w-4 h-4 text-purple-700" />, label: 'Streak', value: `${studyStats.studyStreak}d`, desc: `${studyStats.studyStreak} day streak` },
              { icon: <BarChart3 className="w-4 h-4 text-orange-700" />, label: 'Ready', value: `${studyStats.estimatedReadiness}%`, desc: `${studyStats.estimatedReadiness}% readiness` },
            ].map((stat) => (
              <div key={stat.label} className="bg-white p-3 rounded-xl border border-gray-100" aria-label={stat.desc}>
                <div className="flex items-center gap-1.5 mb-1">
                  <span aria-hidden="true">{stat.icon}</span>
                  <span className="text-[11px] text-gray-600 font-medium">{stat.label}</span>
                </div>
                <p className="text-xl font-bold text-gray-900" aria-hidden="true">{stat.value}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Quick Actions: 2x2 grid ── */}
        <section className="mb-6">
          <h2 className="text-base font-bold text-gray-900 mb-3">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              { id: 'flashcards', title: 'Flashcards', icon: <BookOpen className="w-5 h-5" />, color: 'text-blue-600', bg: 'bg-blue-50', onClick: () => onPageChange('flashcards') },
              { id: 'exam-simulation', title: 'Full Exam', icon: <Clock className="w-5 h-5" />, color: 'text-red-600', bg: 'bg-red-50', onClick: () => onPageChange('exam-simulation') },
              ...(appData.productLine === 'nursing'
                ? [
                  { id: 'osce-simulation', title: 'OSCE', icon: <Target className="w-5 h-5" />, color: 'text-indigo-600', bg: 'bg-indigo-50', onClick: () => onPageChange('osce-simulation') },
                  { id: 'drug-calculations', title: 'Drug Calc', icon: <BarChart3 className="w-5 h-5" />, color: 'text-pink-600', bg: 'bg-pink-50', onClick: () => onPageChange('drug-calculations') },
                ]
                : [
                  { id: 'live-session', title: 'Live Quiz', icon: <Zap className="w-5 h-5" />, color: 'text-amber-600', bg: 'bg-amber-50', onClick: () => onPageChange('live-session') },
                  { id: 'study-plan', title: 'Study Plan', icon: <TrendingUp className="w-5 h-5" />, color: 'text-teal-600', bg: 'bg-teal-50', onClick: () => onPageChange('study-plan') },
                ]),
            ].map((action) => (
              <button
                key={action.id}
                onClick={action.onClick}
                className="bg-white p-4 rounded-2xl border border-gray-100 text-left hover:border-gray-200 transition-all active:scale-[0.97]"
              >
                <div className={`w-10 h-10 ${action.bg} rounded-xl flex items-center justify-center mb-2 ${action.color}`} aria-hidden="true">
                  {action.icon}
                </div>
                <p className="font-semibold text-gray-900 text-sm">{action.title}</p>
              </button>
            ))}
          </div>
        </section>

        {/* ── Exam Domains: vertical list on mobile ── */}
        <section className="mb-6">
          <h2 className="text-base font-bold text-gray-900 mb-3">Domains</h2>
          <div className="space-y-2 lg:grid lg:grid-cols-2 lg:gap-3 lg:space-y-0">
            {domains.map((domain) => (
              <button
                key={domain.id}
                onClick={() => onPageChange('flashcards', domain.id)}
                className="w-full bg-white p-4 rounded-2xl border border-gray-100 flex items-center gap-4 hover:border-gray-200 transition-all active:scale-[0.98]"
              >
                <div className={`w-10 h-10 ${domain.color} rounded-xl flex items-center justify-center shrink-0`}>
                  <span className="text-white" aria-hidden="true">{domain.icon}</span>
                </div>
                <div className="flex-1 min-w-0 text-left">
                  <div className="flex items-center justify-between mb-1.5">
                    <p className="font-semibold text-gray-900 text-sm">{domain.name}</p>
                    <span className="text-xs text-gray-500">{domain.percentage}% of exam</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-gray-100 rounded-full h-1.5" role="progressbar" aria-valuenow={domain.progress} aria-valuemin={0} aria-valuemax={100} aria-label={`${domain.name}: ${domain.progress}%`}>
                      <div className={`h-1.5 rounded-full ${domain.color} transition-all`} style={{ width: `${domain.progress}%` }} />
                    </div>
                    <span className="text-xs font-medium text-gray-600 w-8 text-right" aria-hidden="true">{domain.progress}%</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400 shrink-0" aria-hidden="true" />
              </button>
            ))}
          </div>
        </section>

        {/* ── More links row ── */}
        <section className="mb-6">
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => onPageChange('materials')}
              className="bg-white p-4 rounded-2xl border border-gray-100 flex items-center gap-3 hover:border-gray-200 transition-all active:scale-[0.97]"
            >
              <div className="w-9 h-9 bg-purple-50 rounded-lg flex items-center justify-center text-purple-600" aria-hidden="true">
                <FileText className="w-4 h-4" />
              </div>
              <p className="font-medium text-gray-900 text-sm">Materials</p>
            </button>
            <button
              onClick={() => onPageChange('buddy')}
              className="bg-white p-4 rounded-2xl border border-gray-100 flex items-center gap-3 hover:border-gray-200 transition-all active:scale-[0.97]"
            >
              <div className="w-9 h-9 bg-cyan-50 rounded-lg flex items-center justify-center text-cyan-600" aria-hidden="true">
                <Users className="w-4 h-4" />
              </div>
              <p className="font-medium text-gray-900 text-sm">Buddy Hub</p>
            </button>
          </div>
        </section>

        {/* ── Search ── */}
        <section className="mb-6">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" aria-hidden="true" />
            <input
              type="text"
              placeholder="Search topics, questions, materials..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleSearch(searchQuery) }}
              aria-label="Search study materials, questions, or topics"
              className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            />
          </div>
        </section>

        {/* Spacer for bottom nav */}
        <div className="h-2 md:h-0" />
      </main>

      {/* ── Settings Panel (overlay on mobile, inline on desktop) ── */}
      {showSettings && (
        <>
          <div className="fixed inset-0 bg-black/30 z-40 md:hidden" onClick={() => setShowSettings(false)} />
          <div className="fixed inset-x-0 bottom-0 z-40 md:absolute md:inset-auto md:right-4 md:top-16 bg-white rounded-t-2xl md:rounded-2xl shadow-xl border p-5 animate-slide-up md:animate-fade-in md:w-80 md:max-h-[80vh] overflow-y-auto" style={{ paddingBottom: 'calc(1.25rem + env(safe-area-inset-bottom, 0px))' }}>
            <div className="flex justify-center md:hidden mb-3">
              <div className="w-10 h-1 bg-gray-300 rounded-full" aria-hidden="true" />
            </div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Settings</h3>
              <button onClick={() => setShowSettings(false)} aria-label="Close settings" className="p-2 text-gray-500 hover:text-gray-700 rounded-xl">
                <X className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Exam Date</label>
                <input
                  type="date"
                  value={appData.examDate}
                  onChange={(e) => handleExamDateChange(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Study Goal</label>
                <select
                  value={appData.studyGoal || 'moderate'}
                  onChange={(e) => updateAppData({ studyGoal: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="intensive">Intensive (2+ hours daily)</option>
                  <option value="moderate">Moderate (1 hour daily)</option>
                  <option value="casual">Casual (30 minutes daily)</option>
                </select>
              </div>
              <div className="pt-4 border-t space-y-3">
                {billingError && (
                  <div className="p-3 text-sm text-red-800 bg-red-50 border border-red-200 rounded-xl">{billingError}</div>
                )}
                <button
                  onClick={handleManageBilling}
                  disabled={openingBillingPortal}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 text-blue-600 border border-blue-200 rounded-xl hover:bg-blue-50 transition-colors disabled:opacity-60"
                >
                  <Settings className="w-4 h-4" aria-hidden="true" />
                  <span>{openingBillingPortal ? 'Opening Billing...' : 'Manage Billing'}</span>
                </button>
                <button
                  onClick={() => setShowResetConfirm(true)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 text-red-600 border border-red-200 rounded-xl hover:bg-red-50 transition-colors"
                >
                  <Trash2 className="w-4 h-4" aria-hidden="true" />
                  <span>Reset All Data</span>
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      <ConfirmModal
        open={showResetConfirm}
        title="Reset All Study Data"
        message="This will permanently delete all your study progress, quiz results, flashcard data, and bookmarks. This action cannot be undone."
        confirmLabel="Reset Everything"
        variant="danger"
        loading={resetting}
        onConfirm={handleResetAllData}
        onCancel={() => setShowResetConfirm(false)}
      />
    </div>
  )
}
