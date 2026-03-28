'use client'

import { useState, useEffect, useMemo, useRef } from 'react'
import {
  Clock,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  XCircle,
  BookOpen
} from 'lucide-react'
import { ComponentProps, PracticeQuestion, QuestionAttempt } from '@/types'
import type { PracticeResult, ResultQuestion } from '@/types'
import { getKolbFeedback, getKolbStyleById, KolbStyleId } from '@/data/kolbLearningStyles'
import { useSubscription } from '@/components/SubscriptionProvider'
import { processAnswer, createDefaultEngagementData } from '@/lib/engagementEngine'
import { getProductConfig } from '@/lib/productConfig'
import { usePracticeQuestions } from '@/hooks/useContent'
import { getExpectedAnswerIndices, isAnswerCorrect } from '@/lib/questionGrading'

interface QuizSession {
  sessionId: string
  questions: PracticeQuestion[]
  currentQuestionIndex: number
  answers: (number | number[] | null)[]
  timeRemaining: number
  isComplete: boolean
  score: number
  startTime: Date | null
  endTime: Date | null
  selectedDomain: string
  mode: 'practice' | 'timed'
  bestCorrectStreak: number
}

const isKolbStyleId = (value: string): value is KolbStyleId => (
  value === 'diverging' || value === 'assimilating' || value === 'converging' || value === 'accommodating'
)

export default function PracticeQuestions({ appData, updateAppData }: ComponentProps) {
  const productConfig = useMemo(() => getProductConfig(appData.productLine), [appData.productLine])
  const { isSubscribed, loading: subscriptionLoading } = useSubscription()
  const questionStartTime = useRef<number>(Date.now())
  const domainLabelMap = useMemo(
    () => productConfig.domains.reduce<Record<string, string>>((acc, domain) => {
      acc[domain.id] = domain.name
      return acc
    }, {}),
    [productConfig.domains]
  )
  const domainBarColorMap = useMemo(
    () => productConfig.domains.reduce<Record<string, string>>((acc, domain) => {
      acc[domain.id] = domain.color
      return acc
    }, {}),
    [productConfig.domains]
  )

  const getEngagement = () => {
    const raw = appData.engagementData
    if (raw && typeof raw === 'object' && 'xp' in raw) return raw
    return createDefaultEngagementData()
  }

  const [selectedDomain, setSelectedDomain] = useState<string>('all')
  const [quizMode, setQuizMode] = useState<'practice' | 'timed'>('practice')
  const [selectedQuestionCount, setSelectedQuestionCount] = useState<number | 'all'>(25)
  const [isQuizActive, setIsQuizActive] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [currentSession, setCurrentSession] = useState<QuizSession | null>(null)
  const [timeLimit] = useState(210) // 3.5 hours in minutes
  const [showReviewMode, setShowReviewMode] = useState(false)
  const [reviewFilter, setReviewFilter] = useState<'all' | 'incorrect' | 'correct'>('all')
  const [selectedDifficulty, setSelectedDifficulty] = useState<'all' | 'medium' | 'hard' | 'expert'>('all')
  const [resumeCandidate, setResumeCandidate] = useState<PracticeResult | null>(null)
  /** Draft selections for select-all (multi-index) questions before Confirm */
  const [multiDraft, setMultiDraft] = useState<number[]>([])

  // Aggregate full question bank — from DB if seeded, else static
  const { questions: allQuestions, loading: questionsLoading, error: questionsError } = usePracticeQuestions(appData.productLine)

  const previewQuestions = useMemo(() => {
    return productConfig.domains.flatMap((domain) =>
      allQuestions.filter((q) => q.domain === domain.id).slice(0, 3)
    )
  }, [allQuestions, productConfig.domains])

  const allAvailableQuestions = useMemo(
    () => (isSubscribed ? allQuestions : previewQuestions),
    [allQuestions, previewQuestions, isSubscribed]
  )

  const domains = [
    { id: 'all', name: 'All Domains', color: 'bg-gray-500' },
    ...productConfig.domains.map((domain) => ({ id: domain.id, name: domain.name, color: domain.color })),
  ]

  const filteredQuestions = useMemo(() => {
    return allAvailableQuestions
      .filter(q => selectedDomain === 'all' || q.domain === selectedDomain)
      .filter(q => selectedDifficulty === 'all' || q.difficulty === selectedDifficulty)
  }, [allAvailableQuestions, selectedDomain, selectedDifficulty])

  const seenQuestionIds = useMemo(() => {
    const seen = new Set<string>()
    appData.practiceResults.forEach((result) => {
      result.questions?.forEach((question) => seen.add(question.id))
    })
    return seen
  }, [appData.practiceResults])

  const upsertPracticeResult = (result: PracticeResult) => {
    const withoutCurrent = appData.practiceResults.filter((existing) => existing.id !== result.id)
    updateAppData({ practiceResults: [...withoutCurrent, result] })
  }

  const createPersistedResult = (session: QuizSession, isComplete: boolean, scoreOverride?: number): PracticeResult => {
    const compactQuestions: ResultQuestion[] = session.questions.map((q) => ({
      id: q.id,
      domain: q.domain,
      category: q.category,
      difficulty: q.difficulty as ResultQuestion['difficulty'],
    }))

    return {
      id: session.sessionId,
      date: session.startTime?.toISOString() || new Date().toISOString(),
      questions: compactQuestions,
      score: scoreOverride ?? session.score,
      domain: session.selectedDomain === 'all' ? 'mixed' : session.selectedDomain,
      duration: Math.round((new Date().getTime() - (session.startTime?.getTime() || Date.now())) / 60000),
      isComplete,
      currentQuestionIndex: session.currentQuestionIndex,
      answers: session.answers,
      timeRemaining: session.timeRemaining,
      startTime: session.startTime || new Date(),
      endTime: isComplete ? new Date() : null,
    }
  }

  const calculateBestCorrectStreak = (session: QuizSession) => {
    let currentStreak = 0
    let bestStreak = 0
    session.answers.forEach((answer, index) => {
      if (isAnswerCorrect(session.questions[index], answer)) {
        currentStreak += 1
        if (currentStreak > bestStreak) bestStreak = currentStreak
      } else {
        currentStreak = 0
      }
    })
    return bestStreak
  }

  const startQuiz = () => {
    const unseen = filteredQuestions.filter((question) => !seenQuestionIds.has(question.id))
    const seen = filteredQuestions.filter((question) => seenQuestionIds.has(question.id))
    const prioritizedQuestions = [
      ...unseen.sort(() => Math.random() - 0.5),
      ...seen.sort(() => Math.random() - 0.5),
    ]
    const questionLimit = selectedQuestionCount === 'all'
      ? prioritizedQuestions.length
      : Math.min(selectedQuestionCount, prioritizedQuestions.length)
    const selectedQuestions = prioritizedQuestions.slice(0, questionLimit)
    const session: QuizSession = {
      sessionId: `practice-${Date.now()}`,
      questions: selectedQuestions,
      currentQuestionIndex: 0,
      answers: new Array(selectedQuestions.length).fill(null),
      timeRemaining: quizMode === 'timed' ? timeLimit * 60 : 0,
      isComplete: false,
      score: 0,
      startTime: new Date(),
      endTime: null,
      selectedDomain,
      mode: quizMode,
      bestCorrectStreak: 0
    }
    setCurrentSession(session)
    setIsQuizActive(true)
    setShowResults(false)
    setMultiDraft([])
    questionStartTime.current = Date.now()
  }

  const handleAnswer = (answerIndex: number) => {
    if (!currentSession) return

    const q = currentSession.questions[currentSession.currentQuestionIndex]
    if (getExpectedAnswerIndices(q).length > 1) return

    const correct = isAnswerCorrect(q, answerIndex)
    const responseTime = Date.now() - questionStartTime.current

    const attempt: QuestionAttempt = {
      questionId: q.id,
      domain: q.domain,
      difficulty: q.difficulty,
      answeredCorrectly: correct,
      timestamp: new Date().toISOString(),
      responseTimeMs: responseTime,
    }

    const { data: newEngagement } = processAnswer(getEngagement(), attempt)
    updateAppData({ engagementData: newEngagement })

    const newAnswers = [...currentSession.answers]
    newAnswers[currentSession.currentQuestionIndex] = answerIndex

    const updatedSession: QuizSession = {
      ...currentSession,
      answers: newAnswers,
    }

    setCurrentSession(updatedSession)
  }

  const confirmMultiAnswer = () => {
    if (!currentSession) return
    const q = currentSession.questions[currentSession.currentQuestionIndex]
    const expected = getExpectedAnswerIndices(q)
    if (expected.length <= 1) return
    if (multiDraft.length === 0) return

    const sorted = [...new Set(multiDraft)].sort((a, b) => a - b)
    const correct = isAnswerCorrect(q, sorted)
    const responseTime = Date.now() - questionStartTime.current

    const attempt: QuestionAttempt = {
      questionId: q.id,
      domain: q.domain,
      difficulty: q.difficulty,
      answeredCorrectly: correct,
      timestamp: new Date().toISOString(),
      responseTimeMs: responseTime,
    }

    const { data: newEngagement } = processAnswer(getEngagement(), attempt)
    updateAppData({ engagementData: newEngagement })

    const newAnswers = [...currentSession.answers]
    newAnswers[currentSession.currentQuestionIndex] = sorted

    setCurrentSession({
      ...currentSession,
      answers: newAnswers,
    })
  }

  const nextQuestion = () => {
    if (!currentSession) return

    if (currentSession.currentQuestionIndex < currentSession.questions.length - 1) {
      questionStartTime.current = Date.now()
      setMultiDraft([])
      setCurrentSession({
        ...currentSession,
        currentQuestionIndex: currentSession.currentQuestionIndex + 1,
      })
    } else {
      completeQuiz()
    }
  }

  const previousQuestion = () => {
    if (!currentSession || currentSession.currentQuestionIndex === 0) return

    const prevIndex = currentSession.currentQuestionIndex - 1
    const prevQ = currentSession.questions[prevIndex]
    const prevAns = currentSession.answers[prevIndex]
    if (getExpectedAnswerIndices(prevQ).length > 1 && Array.isArray(prevAns)) {
      setMultiDraft([...prevAns])
    } else {
      setMultiDraft([])
    }

    setCurrentSession({
      ...currentSession,
      currentQuestionIndex: prevIndex,
    })
  }

  const reportToChallenges = async (questionsCount: number, correct: number, streak: number, quizSessionId: string) => {
    try {
      const res = await fetch('/api/challenges', { cache: 'no-store' })
      if (!res.ok) return
      const data = await res.json()
      const active = (data.challenges || []).filter((c: { status: string }) => c.status === 'active')
      await Promise.allSettled(
        active.map((c: { id: string }) =>
          fetch(`/api/challenges/${c.id}/progress`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              questionsAnswered: questionsCount,
              correctAnswers: correct,
              bestStreak: streak,
              sessionId: quizSessionId,
            }),
          })
        )
      )
    } catch {
      // non-blocking
    }
  }

  const completeQuiz = () => {
    if (!currentSession) return

    const correctAnswers = currentSession.answers.filter((answer, index) =>
      isAnswerCorrect(currentSession.questions[index], answer)
    ).length

    const score = Math.round((correctAnswers / currentSession.questions.length) * 100)
    const bestCorrectStreak = calculateBestCorrectStreak(currentSession)

    const completedSession = {
      ...currentSession,
      score,
      bestCorrectStreak,
      isComplete: true,
      endTime: new Date(),
    }

    setCurrentSession(completedSession)
    setIsQuizActive(false)
    setShowResults(true)

    // Update app data with quiz results
    const newStudyStats = { ...appData.studyStats }
    newStudyStats.questionsAnswered += currentSession.questions.length
    newStudyStats.correctAnswers += correctAnswers
    newStudyStats.totalHours += 0.5

    const savedResult = createPersistedResult(completedSession, true, score)
    const withoutCurrent = appData.practiceResults.filter((existing) => existing.id !== currentSession.sessionId)

    updateAppData({
      studyStats: newStudyStats,
      practiceResults: [...withoutCurrent, savedResult]
    })
    setResumeCandidate(null)

    reportToChallenges(
      currentSession.questions.length,
      correctAnswers,
      bestCorrectStreak,
      currentSession.sessionId
    )
  }

  const completeQuizRef = useRef(completeQuiz)
  completeQuizRef.current = completeQuiz

  const resetQuiz = () => {
    setCurrentSession(null)
    setIsQuizActive(false)
    setShowResults(false)
  }

  const toggleReviewMode = () => {
    setShowReviewMode(!showReviewMode)
  }

  const saveAndExit = () => {
    if (!currentSession) return
    const savedResult = createPersistedResult(currentSession, false)
    upsertPracticeResult(savedResult)
    setIsQuizActive(false)
    setShowResults(false)
    setCurrentSession(null)
    setResumeCandidate(savedResult)
  }

  const resumeQuiz = (savedResult: PracticeResult) => {
    const questionMap = new Map(allQuestions.map((question) => [question.id, question]))
    const restoredQuestions = savedResult.questions
      .map((question) => questionMap.get(question.id))
      .filter((question): question is PracticeQuestion => Boolean(question))

    if (restoredQuestions.length === 0) return

    const restoredSession: QuizSession = {
      sessionId: savedResult.id,
      questions: restoredQuestions,
      currentQuestionIndex: Math.min(savedResult.currentQuestionIndex, restoredQuestions.length - 1),
      answers: Array.from(
        { length: restoredQuestions.length },
        (_, index) => savedResult.answers[index] ?? null
      ),
      timeRemaining: savedResult.timeRemaining,
      isComplete: false,
      score: savedResult.score || 0,
      startTime: savedResult.startTime ? new Date(savedResult.startTime) : new Date(savedResult.date),
      endTime: null,
      selectedDomain: savedResult.domain === 'mixed' ? 'all' : savedResult.domain,
      mode: savedResult.timeRemaining > 0 ? 'timed' : 'practice',
      bestCorrectStreak: 0,
    }

    setSelectedDomain(restoredSession.selectedDomain)
    setQuizMode(restoredSession.mode)
    setCurrentSession(restoredSession)
    setIsQuizActive(true)
    setShowResults(false)
    setMultiDraft([])
  }

  const discardSavedSession = (sessionId: string) => {
    const filteredResults = appData.practiceResults.filter((result) => result.id !== sessionId)
    updateAppData({ practiceResults: filteredResults })
    setResumeCandidate(null)
  }

  useEffect(() => {
    const latestIncomplete = [...appData.practiceResults]
      .reverse()
      .find((result) => !result.isComplete && result.answers?.some((answer) => answer !== null))
    setResumeCandidate(latestIncomplete || null)
  }, [appData.practiceResults])

  const cqIndex = currentSession?.currentQuestionIndex ?? 0
  const answerSlot = currentSession?.answers[cqIndex]
  const cqMeta = currentSession?.questions[cqIndex]
  useEffect(() => {
    if (!isQuizActive || !currentSession || !cqMeta) return
    if (getExpectedAnswerIndices(cqMeta).length > 1) {
      if (Array.isArray(answerSlot)) setMultiDraft([...answerSlot])
      else setMultiDraft([])
    } else {
      setMultiDraft([])
    }
  }, [isQuizActive, currentSession?.sessionId, cqIndex, answerSlot, cqMeta?.id])

  useEffect(() => {
    if (!isQuizActive || !currentSession || currentSession.isComplete) return

    const savedResult = createPersistedResult(currentSession, false)
    upsertPracticeResult(savedResult)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    isQuizActive,
    currentSession?.sessionId,
    currentSession?.currentQuestionIndex,
    currentSession?.timeRemaining,
    currentSession?.answers,
  ])

  // Timer effect for timed mode
  useEffect(() => {
    if (!isQuizActive || !currentSession || quizMode !== 'timed') return

    const timer = setInterval(() => {
      setCurrentSession(prev => {
        if (!prev || prev.timeRemaining <= 0) return prev
        return { ...prev, timeRemaining: prev.timeRemaining - 1 }
      })
    }, 1000)

    return () => clearInterval(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isQuizActive, quizMode])

  useEffect(() => {
    if (isQuizActive && currentSession && quizMode === 'timed' && currentSession.timeRemaining <= 0) {
      completeQuizRef.current()
    }
  }, [currentSession?.timeRemaining, isQuizActive, currentSession, quizMode])

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const currentQuestion = currentSession?.questions[currentSession.currentQuestionIndex]
  const currentAnswer = currentSession?.answers[currentSession.currentQuestionIndex]
  const expectedForCurrent = currentQuestion ? getExpectedAnswerIndices(currentQuestion) : []
  const isMultiSelectQuestion = expectedForCurrent.length > 1
  const multiAnswerLocked = isMultiSelectQuestion && Array.isArray(currentAnswer)
  const singleAnswerLocked = !isMultiSelectQuestion && currentAnswer !== null && currentAnswer !== undefined
  const canAdvance = multiAnswerLocked || singleAnswerLocked

  const resultsMetrics = useMemo(() => {
    if (!currentSession) return null

    const domainTotals: Record<string, number> = {}
    const domainCorrect: Record<string, number> = {}
    productConfig.domains.forEach((domain) => {
      domainTotals[domain.id] = 0
      domainCorrect[domain.id] = 0
    })

    currentSession.questions.forEach((question, index) => {
      const domain = question.domain
      if (!(domain in domainTotals)) return
      domainTotals[domain] += 1
      if (isAnswerCorrect(question, currentSession.answers[index])) {
        domainCorrect[domain] += 1
      }
    })

    const domainPercentages: Record<string, number> = {}
    Object.keys(domainTotals).forEach((domainId) => {
      domainPercentages[domainId] = domainTotals[domainId]
        ? Math.round((domainCorrect[domainId] / domainTotals[domainId]) * 100)
        : 0
    })

    const answeredCount = currentSession.answers.filter((answer) => {
      if (answer === null) return false
      if (Array.isArray(answer)) return answer.length > 0
      return true
    }).length
    const correctCount = Object.values(domainCorrect).reduce((sum, value) => sum + value, 0)
    const incorrectCount = answeredCount - correctCount
    const activeDomains = Object.keys(domainTotals).filter((domain) => domainTotals[domain] > 0)
    const strongestDomain = activeDomains.reduce((best, domain) => (
      domainPercentages[domain] > domainPercentages[best] ? domain : best
    ), activeDomains[0] ?? productConfig.domains[0]?.id ?? 'ethics')
    const weakestDomain = activeDomains.reduce((worst, domain) => (
      domainPercentages[domain] < domainPercentages[worst] ? domain : worst
    ), activeDomains[0] ?? productConfig.domains[0]?.id ?? 'ethics')

    return {
      correctCount,
      incorrectCount,
      domainTotals,
      domainCorrect,
      domainPercentages,
      activeDomains,
      strongestDomain,
      weakestDomain,
    }
  }, [currentSession, productConfig.domains])

  const kolbStyleId = useMemo(() => {
    if (!showResults || !currentSession || typeof window === 'undefined') return null
    const savedStyle = window.localStorage.getItem('kolb-learning-style')
    return savedStyle && isKolbStyleId(savedStyle) ? savedStyle : null
  }, [showResults, currentSession])

  const kolbStyle = useMemo(() => {
    if (!kolbStyleId) return null
    return getKolbStyleById(kolbStyleId)
  }, [kolbStyleId])

  const kolbFeedback = useMemo(() => {
    if (!kolbStyleId || !resultsMetrics) return []
    if (appData.productLine !== 'psychology') return []
    const psychologyPercentages = {
      ethics: resultsMetrics.domainPercentages.ethics ?? 0,
      assessment: resultsMetrics.domainPercentages.assessment ?? 0,
      interventions: resultsMetrics.domainPercentages.interventions ?? 0,
      communication: resultsMetrics.domainPercentages.communication ?? 0,
    }
    return getKolbFeedback(kolbStyleId, psychologyPercentages).slice(0, 4)
  }, [kolbStyleId, resultsMetrics, appData.productLine])

  if (subscriptionLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-gray-600">Loading subscription access...</p>
      </div>
    )
  }

  if (questionsLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-5 px-4">
        <div className="w-full max-w-lg space-y-3 animate-pulse" aria-hidden="true">
          <div className="h-9 bg-gray-200 rounded-xl" />
          <div className="h-28 bg-gray-100 rounded-xl" />
          <div className="h-28 bg-gray-100 rounded-xl" />
          <div className="h-28 bg-gray-100 rounded-xl" />
        </div>
        <p className="text-sm text-gray-600">Loading questions…</p>
      </div>
    )
  }

  if (questionsError) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <p className="text-red-600">{questionsError}</p>
        <p className="text-sm text-gray-600">Please refresh the page or try again later.</p>
      </div>
    )
  }

  if (showResults && currentSession) {
    return (
      <div className="min-h-[100dvh] bg-gray-50">
        <header className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <h1 className="text-xl md:text-3xl font-bold text-gray-900">Quiz Results</h1>
            <p className="text-sm text-gray-600 mt-0.5">Practice Questions Complete</p>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-4 py-6 md:py-8">
          <div className="bg-white rounded-2xl shadow-sm border p-6 md:p-8">
            <div className="text-center mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-3">Quiz Complete!</h2>
              <div className="text-5xl md:text-6xl font-bold mb-3">
                {currentSession.score >= 70 ? (
                  <span className="text-green-600">{currentSession.score}%</span>
                ) : (
                  <span className="text-red-600">{currentSession.score}%</span>
                )}
              </div>
              <p className="text-sm text-gray-600">
                {currentSession.score >= 70 ? 'Passing Score!' : 'Below passing threshold (70%)'}
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
              <div className="text-center p-3 bg-gray-50 rounded-xl">
                <p className="text-xl font-bold text-blue-600">{currentSession.questions.length}</p>
                <p className="text-xs text-gray-600">Total</p>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-xl">
                <p className="text-xl font-bold text-green-600">
                  {resultsMetrics?.correctCount ?? 0}
                </p>
                <p className="text-xs text-gray-600">Correct</p>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-xl">
                <p className="text-xl font-bold text-red-600">
                  {resultsMetrics?.incorrectCount ?? 0}
                </p>
                <p className="text-xs text-gray-600">Incorrect</p>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-xl">
                <p className="text-xl font-bold text-purple-600">{currentSession.bestCorrectStreak}</p>
                <p className="text-xs text-gray-600">Best Streak</p>
              </div>
            </div>

            <div className="mb-6 rounded-xl border border-gray-200 p-4 md:p-5">
              <h3 className="text-lg font-bold text-gray-900">Personalised Feedback</h3>
              {kolbStyle && resultsMetrics ? (
                <>
                  <div className="mt-3 flex items-center gap-3 rounded-lg bg-gray-50 p-3">
                    <span className="text-2xl" aria-hidden="true">{kolbStyle.iconEmoji}</span>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{kolbStyle.name} learner</p>
                      <p className="text-xs text-gray-600">{kolbStyle.feedbackStyle}</p>
                    </div>
                  </div>

                  <div className="mt-4 space-y-3">
                    {resultsMetrics.activeDomains.map((domain) => (
                      <div key={domain}>
                        <div className="mb-1 flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-700">{domainLabelMap[domain] || domain}</span>
                          <span className="text-sm font-semibold text-gray-900">
                            {resultsMetrics.domainPercentages[domain]}% ({resultsMetrics.domainCorrect[domain]}/{resultsMetrics.domainTotals[domain]})
                          </span>
                        </div>
                        <div className="h-2 w-full rounded-full bg-gray-200">
                          <div
                            className={`h-2 rounded-full ${domainBarColorMap[domain] || 'bg-slate-500'}`}
                            style={{ width: `${resultsMetrics.domainPercentages[domain]}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 rounded-lg bg-blue-50 p-3">
                    <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">
                      Strongest: {domainLabelMap[resultsMetrics.strongestDomain] || resultsMetrics.strongestDomain} | Focus next: {domainLabelMap[resultsMetrics.weakestDomain] || resultsMetrics.weakestDomain}
                    </p>
                  </div>

                  <ul className="mt-4 space-y-2 text-sm text-gray-700">
                    {kolbFeedback.map((item) => (
                      <li key={item} className="flex gap-2">
                        <span className="text-blue-500">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </>
              ) : (
                <div className="mt-3 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
                  Complete your Learning Style assessment to unlock style-specific quiz feedback and next-step study actions.
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row justify-center gap-3">
              <button
                onClick={resetQuiz}
                className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors active:scale-[0.97]"
              >
                Take Another Quiz
              </button>
              <button
                onClick={toggleReviewMode}
                className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors active:scale-[0.97]"
              >
                {showReviewMode ? 'Hide Review' : 'Review Answers'}
              </button>
            </div>

            {showReviewMode && (
              <div className="mt-5 flex flex-wrap justify-center gap-2">
                <button
                  onClick={() => setReviewFilter('all')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors ${reviewFilter === 'all' ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-700'}`}
                >
                  All ({currentSession.questions.length})
                </button>
                <button
                  onClick={() => setReviewFilter('incorrect')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors ${reviewFilter === 'incorrect' ? 'bg-red-600 text-white' : 'bg-red-50 text-red-700'}`}
                >
                  Incorrect ({currentSession.answers.filter((a, i) => a !== null && !isAnswerCorrect(currentSession.questions[i], a)).length})
                </button>
                <button
                  onClick={() => setReviewFilter('correct')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors ${reviewFilter === 'correct' ? 'bg-green-600 text-white' : 'bg-green-50 text-green-700'}`}
                >
                  Correct ({currentSession.answers.filter((a, i) => isAnswerCorrect(currentSession.questions[i], a)).length})
                </button>
              </div>
            )}

            {showReviewMode && (
              <div className="mt-8 border-t pt-8">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Question Review</h3>
                <div className="space-y-6">
                  {currentSession.questions.map((question, index) => {
                    const userAnswer = currentSession.answers[index]
                    const isCorrectAnswer = isAnswerCorrect(question, userAnswer)
                    const expectedIdx = getExpectedAnswerIndices(question)
                    const userPicked = (oi: number) => {
                      if (Array.isArray(userAnswer)) return userAnswer.includes(oi)
                      if (userAnswer === null || userAnswer === undefined) return false
                      return userAnswer === oi
                    }
                    const isCorrectOption = (oi: number) => expectedIdx.includes(oi)

                    if (reviewFilter === 'incorrect' && isCorrectAnswer) return null
                    if (reviewFilter === 'correct' && !isCorrectAnswer) return null

                    return (
                      <div key={index} className="border border-gray-200 rounded-lg p-6">
                        <div className="flex items-center justify-between mb-4">
                          <span className="text-sm font-medium text-gray-600">Question {index + 1}</span>
                          <div className="flex items-center space-x-2">
                            <span className={`px-2 py-1 rounded text-xs font-medium uppercase ${question.difficulty === 'hard' || question.difficulty === 'expert' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                              }`}>
                              {question.difficulty}
                            </span>
                            {isCorrectAnswer ? (
                              <CheckCircle className="w-5 h-5 text-green-600" />
                            ) : (
                              <XCircle className="w-5 h-5 text-red-600" />
                            )}
                          </div>
                        </div>

                        {question.caseStudy && (
                          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                            <p className="text-sm text-blue-800">{question.caseStudy}</p>
                          </div>
                        )}

                        <h4 className="font-semibold text-gray-900 mb-4">{question.question}</h4>

                        <div className="space-y-2 mb-4">
                          {question.options.map((option, optionIndex) => (
                            <div
                              key={optionIndex}
                              className={`p-3 rounded-lg border-2 ${
                                isCorrectOption(optionIndex)
                                  ? 'border-green-500 bg-green-50'
                                  : userPicked(optionIndex) && !isCorrectOption(optionIndex)
                                    ? 'border-red-500 bg-red-50'
                                    : 'border-gray-200'
                              }`}
                            >
                              <div className="flex items-start space-x-2">
                                <div className="shrink-0 mt-0.5">
                                  {isCorrectOption(optionIndex) && (
                                    <CheckCircle className="w-4 h-4 text-green-600" />
                                  )}
                                  {userPicked(optionIndex) && !isCorrectOption(optionIndex) && (
                                    <XCircle className="w-4 h-4 text-red-600" />
                                  )}
                                </div>
                                <div>
                                  <span className="text-gray-900">{option}</span>
                                  {question.distractorRationale?.[optionIndex] && (
                                    <p className="text-xs text-gray-600 mt-1 italic">
                                      {question.distractorRationale[optionIndex]}
                                    </p>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="bg-gray-50 rounded-lg p-4">
                          <h5 className="font-semibold text-gray-900 mb-2">Explanation:</h5>
                          <p className="text-gray-700 mb-3">{question.explanation}</p>
                          {question.references && (
                            <div>
                              <h6 className="font-medium text-gray-900 mb-1">References:</h6>
                              <ul className="text-sm text-gray-600 space-y-1">
                                {question.references.map((ref, refIndex) => (
                                  <li key={refIndex}>• {ref}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    )
  }

  if (!isQuizActive) {
    return (
      <div className="min-h-[100dvh] bg-gray-50">
        <main className="max-w-3xl lg:max-w-4xl mx-auto px-4 md:px-6 py-4 md:py-8">
          <div className="mb-4">
            <h1 className="text-xl md:text-3xl font-bold text-gray-900">Practice Questions</h1>
            <p className="text-sm text-gray-600 mt-0.5">Test your knowledge with realistic exam questions</p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 md:p-8 mb-6">
            <h2 className="text-lg md:text-2xl font-bold text-gray-900 mb-4">Quiz Setup</h2>

            {!isSubscribed && (
              <div className="mb-4 rounded-xl bg-amber-50 border border-amber-200 px-4 py-2.5 flex items-center justify-between gap-3">
                <p className="text-xs text-amber-800 font-medium">Free preview — 3 questions/domain</p>
                <button
                  onClick={() => window.location.assign('/?upgrade=1')}
                  className="shrink-0 px-3 py-1.5 bg-amber-600 text-white text-xs font-semibold rounded-lg hover:bg-amber-700 transition-colors active:scale-95"
                >
                  Upgrade
                </button>
              </div>
            )}

            {resumeCandidate && (
              <div className="mb-4 rounded-xl border border-blue-200 bg-blue-50 p-3 md:p-4">
                <h3 className="text-sm font-semibold text-blue-900">Resume previous session?</h3>
                <p className="text-xs text-blue-800 mt-1">
                  Question {resumeCandidate.currentQuestionIndex + 1} of {resumeCandidate.questions.length} in progress.
                </p>
                <div className="mt-2.5 flex gap-2">
                  <button
                    onClick={() => resumeQuiz(resumeCandidate)}
                    className="px-4 py-2 bg-blue-600 text-white text-xs font-semibold rounded-xl hover:bg-blue-700 active:scale-95 transition-all"
                  >
                    Resume
                  </button>
                  <button
                    onClick={() => discardSavedSession(resumeCandidate.id)}
                    className="px-4 py-2 bg-white border border-blue-300 text-blue-700 text-xs font-semibold rounded-xl hover:bg-blue-100 active:scale-95 transition-all"
                  >
                    Discard
                  </button>
                </div>
              </div>
            )}

            <div className="mb-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-2">Domain</h3>
              <div className="flex flex-wrap gap-2">
                {domains.map((domain) => (
                  <button
                    key={domain.id}
                    onClick={() => setSelectedDomain(domain.id)}
                    className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all active:scale-95 ${selectedDomain === domain.id
                      ? `${domain.color} text-white`
                      : 'bg-gray-50 text-gray-700 border border-gray-200'
                      }`}
                  >
                    {domain.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-2">Difficulty</h3>
              <div className="flex flex-wrap gap-2">
                {[
                  { id: 'all', name: 'All', color: 'bg-gray-500' },
                  { id: 'medium', name: 'Medium', color: 'bg-yellow-500' },
                  { id: 'hard', name: 'Hard', color: 'bg-red-500' },
                  { id: 'expert', name: 'Expert', color: 'bg-indigo-600' }
                ].map((level) => (
                  <button
                    key={level.id}
                    onClick={() => setSelectedDifficulty(level.id as PracticeQuestion['difficulty'] | 'all')}
                    className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all active:scale-95 ${selectedDifficulty === level.id
                      ? `${level.color} text-white`
                      : 'bg-gray-50 text-gray-700 border border-gray-200'
                      }`}
                  >
                    {level.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-2">Mode</h3>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setQuizMode('practice')}
                  className={`p-3 rounded-xl border-2 transition-all active:scale-[0.97] ${quizMode === 'practice'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200'
                    }`}
                >
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-blue-600 shrink-0" />
                    <div className="text-left min-w-0">
                      <h4 className="text-sm font-semibold text-gray-900">Practice</h4>
                      <p className="text-xs text-gray-600">Review feedback at end</p>
                    </div>
                  </div>
                </button>
                <button
                  onClick={() => setQuizMode('timed')}
                  className={`p-3 rounded-xl border-2 transition-all active:scale-[0.97] ${quizMode === 'timed'
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200'
                    }`}
                >
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-green-600 shrink-0" />
                    <div className="text-left min-w-0">
                      <h4 className="text-sm font-semibold text-gray-900">Timed</h4>
                      <p className="text-xs text-gray-600">3.5h exam sim</p>
                    </div>
                  </div>
                </button>
              </div>
            </div>

            <div className="mb-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-2">Questions</h3>
              <div className="flex flex-wrap gap-2">
                {[5, 10, 25, 50, 'all'].map((count) => (
                  <button
                    key={count}
                    onClick={() => setSelectedQuestionCount(count as number | 'all')}
                    className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all active:scale-95 ${
                      selectedQuestionCount === count
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-50 text-gray-700 border border-gray-200'
                    }`}
                  >
                    {count === 'all' ? 'All' : count}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-gray-50 p-3 rounded-xl mb-4">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-600">
                  <span className="font-semibold text-gray-700">
                    {selectedQuestionCount === 'all'
                      ? filteredQuestions.length
                      : Math.min(Number(selectedQuestionCount), filteredQuestions.length)}
                  </span> questions
                </span>
                <span className="text-gray-600">
                  {quizMode === 'timed' ? '3.5h limit' : 'No limit'}
                </span>
                <span className="text-gray-600">
                  Pass: <span className="font-semibold text-gray-700">70%</span>
                </span>
              </div>
            </div>

            <button
              onClick={startQuiz}
              disabled={filteredQuestions.length === 0}
              className="w-full bg-blue-600 text-white py-3.5 px-6 rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-[0.98] font-bold text-sm shadow-lg shadow-blue-200"
            >
              Start Quiz
            </button>
          </div>

          {/* Bottom spacer for mobile nav */}
          <div className="h-4 md:h-0" />
        </main>
      </div>
    )
  }

  if (!currentQuestion || !currentSession) return null

  return (
    <div className="min-h-[100dvh] bg-gray-50">
      {/* Sticky header with progress */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex justify-between items-center">
            <div className="min-w-0">
              <p className="text-sm font-bold text-gray-900">
                {currentSession.currentQuestionIndex + 1} <span className="text-gray-600 font-normal">/ {currentSession.questions.length}</span>
              </p>
            </div>
            <div className="flex items-center gap-2">
              {quizMode === 'timed' && (
                <div className="flex items-center gap-1.5 px-2.5 py-1 bg-red-50 rounded-lg" role="timer" aria-label={`Time remaining: ${formatTime(currentSession.timeRemaining)}`}>
                  <Clock className="w-4 h-4 text-red-600" aria-hidden="true" />
                  <span className="text-sm font-mono font-bold text-red-600" aria-live="off">
                    {formatTime(currentSession.timeRemaining)}
                  </span>
                </div>
              )}
              <button
                onClick={saveAndExit}
                className="text-sm font-semibold text-gray-700 px-3 py-1.5 rounded-lg hover:bg-gray-100 active:scale-95 transition-all"
              >
                Save & Exit
              </button>
            </div>
          </div>
          {/* Progress bar */}
          <div className="mt-2 w-full bg-gray-200 rounded-full h-2.5 ring-1 ring-gray-100" role="progressbar" aria-valuenow={currentSession.currentQuestionIndex + 1} aria-valuemin={1} aria-valuemax={currentSession.questions.length} aria-label={`Question ${currentSession.currentQuestionIndex + 1} of ${currentSession.questions.length}`}>
            <div
              className="h-full min-h-[10px] bg-blue-600 rounded-full transition-all duration-300"
              style={{ width: `${((currentSession.currentQuestionIndex + 1) / currentSession.questions.length) * 100}%` }}
            />
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-4 pb-24 md:py-8 md:pb-8">
        <div className="bg-white rounded-2xl shadow-sm border overflow-hidden mb-4">
          <div className="p-4 md:p-8">
            {/* Domain & difficulty tags */}
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className={`px-2.5 py-1 rounded-lg text-xs font-bold text-white uppercase tracking-wide ${
                currentQuestion.domain === 'ethics' ? 'bg-blue-500' :
                currentQuestion.domain === 'assessment' ? 'bg-green-500' :
                currentQuestion.domain === 'interventions' ? 'bg-purple-500' : 'bg-orange-500'
              }`}>
                {currentQuestion.domain}
              </span>
              <span className="px-2.5 py-1 rounded-lg text-xs font-medium bg-gray-100 text-gray-700">
                {currentQuestion.category}
              </span>
              <span className={`px-2 py-1 rounded-lg text-xs font-bold uppercase ${
                currentQuestion.difficulty === 'hard' || currentQuestion.difficulty === 'expert' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
              }`}>
                {currentQuestion.difficulty}
              </span>
            </div>

            {currentQuestion.caseStudy && (
              <div className="mb-4 p-3 md:p-4 bg-indigo-50 border-l-4 border-indigo-500 rounded-r-xl">
                <h4 className="font-bold text-indigo-950 mb-1.5 uppercase text-xs tracking-wider">Clinical vignette</h4>
                <p className="text-indigo-900 leading-relaxed text-sm md:text-lg font-serif italic">{currentQuestion.caseStudy}</p>
              </div>
            )}

            <h3 className="text-lg md:text-2xl font-bold text-gray-900 mb-4 md:mb-5 leading-snug">
              {currentQuestion.question}
            </h3>

            <div className="space-y-2.5 md:space-y-3 max-h-[42dvh] overflow-y-auto pr-1 md:max-h-none md:overflow-visible">
              {isMultiSelectQuestion && (
                <p className="text-sm text-amber-800 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 mb-2">
                  Select all that apply, then tap <strong>Confirm selections</strong> before Next.
                </p>
              )}
              {currentQuestion.options.map((option, index) => {
                if (isMultiSelectQuestion) {
                  const locked = multiAnswerLocked && Array.isArray(currentAnswer) && currentAnswer.includes(index)
                  const drafting = !multiAnswerLocked && multiDraft.includes(index)
                  const active = locked || drafting
                  return (
                    <button
                      key={index}
                      type="button"
                      onClick={() => {
                        if (multiAnswerLocked) return
                        setMultiDraft((prev) =>
                          prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index].sort((a, b) => a - b)
                        )
                      }}
                      disabled={multiAnswerLocked}
                      className={`w-full text-left p-3.5 md:p-4 rounded-xl border-2 transition-all duration-200 active:scale-[0.98] ${
                        active ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                      } ${multiAnswerLocked ? 'cursor-default' : ''}`}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`w-7 h-7 shrink-0 rounded-md border-2 flex items-center justify-center font-bold text-xs ${
                            active ? 'border-blue-500 bg-blue-500 text-white' : 'border-gray-300 text-gray-400'
                          }`}
                        >
                          {active ? '✓' : String.fromCharCode(65 + index)}
                        </div>
                        <span className="text-gray-900 text-sm md:text-base font-medium leading-snug">{option}</span>
                      </div>
                    </button>
                  )
                }
                return (
                  <button
                    key={index}
                    onClick={() => handleAnswer(index)}
                    disabled={singleAnswerLocked}
                    className={`w-full text-left p-3.5 md:p-4 rounded-xl border-2 transition-all duration-200 active:scale-[0.98] ${
                      currentAnswer === index
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                    } disabled:cursor-default`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-7 h-7 shrink-0 rounded-full border-2 flex items-center justify-center font-bold text-xs ${
                        currentAnswer === index
                          ? 'border-blue-500 bg-blue-500 text-white'
                          : 'border-gray-300 text-gray-400'
                      }`}>
                        {String.fromCharCode(65 + index)}
                      </div>
                      <span className="text-gray-900 text-sm md:text-base font-medium leading-snug">{option}</span>
                    </div>
                  </button>
                )
              })}
            </div>
            {isMultiSelectQuestion && !multiAnswerLocked && (
              <div className="mt-4">
                <button
                  type="button"
                  onClick={confirmMultiAnswer}
                  disabled={multiDraft.length === 0}
                  className="w-full py-3 rounded-xl bg-blue-600 text-white font-semibold text-sm disabled:opacity-40"
                >
                  Confirm selections ({multiDraft.length} selected)
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Fixed bottom nav for quiz */}
        <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-lg border-t z-[70] md:relative md:bg-transparent md:border-0 md:backdrop-blur-none" style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}>
          <div className="max-w-4xl mx-auto flex justify-between items-center px-4 py-2.5 md:py-0 md:pb-8">
            <button
              onClick={previousQuestion}
              disabled={currentSession.currentQuestionIndex === 0}
              className="flex items-center gap-1.5 px-4 py-2.5 bg-gray-100 rounded-xl font-semibold text-sm text-gray-700 disabled:opacity-30 transition-all active:scale-95"
            >
              <ChevronLeft className="w-5 h-5" />
              <span className="hidden sm:inline">Previous</span>
            </button>

            <button
              onClick={nextQuestion}
              disabled={!canAdvance}
              className="flex items-center gap-1.5 px-6 py-2.5 bg-blue-600 text-white rounded-xl font-semibold text-sm shadow-lg shadow-blue-200 disabled:opacity-30 transition-all active:scale-95"
            >
              <span>
                {currentSession.currentQuestionIndex === currentSession.questions.length - 1 ? 'Finish' : 'Next'}
              </span>
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Spacer for fixed bottom nav on mobile */}
        <div className="h-16 md:h-0" />
      </main>
    </div>
  )
}