'use client'

import { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import { Clock, AlertTriangle, ChevronLeft, ChevronRight, Flag, CheckCircle2, XCircle, BarChart3 } from 'lucide-react'
import { AppData } from '@/types'
import { practiceQuestions as comprehensivePracticeQuestions, extendedEthicsQuestions, assessmentQuestions, interventionsQuestions, communicationQuestions } from '@/data/comprehensive'

interface ExamSimulationProps {
  appData: AppData
  updateAppData: (updates: Partial<AppData>) => void
  onBack: () => void
}

interface SimQuestion {
  id: string
  domain: string
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
  difficulty: string
}

type ExamPhase = 'setup' | 'running' | 'review'

const EXAM_DURATION_MINUTES = 120
const EXAM_QUESTION_COUNT = 50

export default function ExamSimulation({ appData, updateAppData, onBack }: ExamSimulationProps) {
  const [phase, setPhase] = useState<ExamPhase>('setup')
  const [timeRemaining, setTimeRemaining] = useState(EXAM_DURATION_MINUTES * 60)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<number, number>>({})
  const [flagged, setFlagged] = useState<Set<number>>(new Set())
  const [showResults, setShowResults] = useState(false)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const allQuestions: SimQuestion[] = useMemo(() => {
    const all = [...comprehensivePracticeQuestions, ...extendedEthicsQuestions, ...assessmentQuestions, ...interventionsQuestions, ...communicationQuestions]
    return all.map(q => ({
      id: q.id,
      domain: q.domain,
      question: q.question,
      options: q.options,
      correctAnswer: q.correctAnswer,
      explanation: q.explanation,
      difficulty: q.difficulty,
    }))
  }, [])

  const examQuestions = useMemo(() => {
    const shuffled = [...allQuestions].sort(() => Math.random() - 0.5)

    const domains = ['ethics', 'assessment', 'interventions', 'communication']
    const perDomain = Math.floor(EXAM_QUESTION_COUNT / domains.length)
    const selected: SimQuestion[] = []

    for (const domain of domains) {
      const domainQs = shuffled.filter(q => q.domain === domain)
      selected.push(...domainQs.slice(0, perDomain))
    }

    const remaining = EXAM_QUESTION_COUNT - selected.length
    const unused = shuffled.filter(q => !selected.includes(q))
    selected.push(...unused.slice(0, remaining))

    return selected.sort(() => Math.random() - 0.5)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase])

  const startExam = () => {
    setPhase('running')
    setTimeRemaining(EXAM_DURATION_MINUTES * 60)
    setCurrentIndex(0)
    setAnswers({})
    setFlagged(new Set())
    setShowResults(false)
  }

  const submitExam = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current)
    setPhase('review')

    let correct = 0
    examQuestions.forEach((q, i) => {
      if (answers[i] === q.correctAnswer) correct++
    })

    const score = Math.round((correct / examQuestions.length) * 100)
    const result = {
      id: `exam-sim-${Date.now()}`,
      date: new Date().toISOString(),
      score,
      domain: 'all',
      duration: EXAM_DURATION_MINUTES * 60 - timeRemaining,
      isComplete: true,
      currentQuestionIndex: examQuestions.length - 1,
      answers: examQuestions.map((_, i) => answers[i] ?? null),
      timeRemaining,
      startTime: null,
      endTime: null,
      questions: examQuestions.map(q => ({
        domain: q.domain as 'ethics' | 'assessment' | 'interventions' | 'communication',
        id: q.id,
        category: q.domain,
        difficulty: q.difficulty as 'easy' | 'medium' | 'hard' | 'expert',
      })),
    }

    const newResults = [...(appData.practiceResults || []), result]
    updateAppData({ practiceResults: newResults })
    localStorage.setItem('practiceResults', JSON.stringify(newResults))
  }, [examQuestions, answers, timeRemaining, appData.practiceResults, updateAppData])

  useEffect(() => {
    if (phase !== 'running') return

    timerRef.current = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          submitExam()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [phase, submitExam])

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600)
    const m = Math.floor((seconds % 3600) / 60)
    const s = seconds % 60
    return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }

  const answeredCount = Object.keys(answers).length

  if (phase === 'setup') {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-white rounded-2xl shadow-sm border p-8 text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Clock className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-3">Exam Simulation</h1>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            Simulate the real National Psychology Exam experience with timed conditions, balanced domain coverage, and full performance analysis.
          </p>

          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="text-2xl font-bold text-gray-900">{EXAM_QUESTION_COUNT}</div>
              <div className="text-sm text-gray-500">Questions</div>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="text-2xl font-bold text-gray-900">{EXAM_DURATION_MINUTES}</div>
              <div className="text-sm text-gray-500">Minutes</div>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="text-2xl font-bold text-gray-900">4</div>
              <div className="text-sm text-gray-500">Domains</div>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8 text-left">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-5 h-5 text-yellow-600 shrink-0 mt-0.5" />
              <div className="text-sm text-yellow-800">
                <strong>Exam conditions:</strong> Once started, the timer cannot be paused. You may flag questions for review and navigate freely between questions. The exam auto-submits when time runs out.
              </div>
            </div>
          </div>

          <div className="flex gap-3 justify-center">
            <button onClick={onBack} className="px-6 py-3 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors">
              Back
            </button>
            <button onClick={startExam} className="px-8 py-3 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors">
              Start Exam
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (phase === 'review') {
    let correct = 0
    const domainScores: Record<string, { correct: number; total: number }> = {}
    examQuestions.forEach((q, i) => {
      if (!domainScores[q.domain]) domainScores[q.domain] = { correct: 0, total: 0 }
      domainScores[q.domain].total++
      if (answers[i] === q.correctAnswer) {
        correct++
        domainScores[q.domain].correct++
      }
    })
    const score = Math.round((correct / examQuestions.length) * 100)
    const passed = score >= 70

    return (
      <div className="max-w-3xl mx-auto p-6">
        <div className="bg-white rounded-2xl shadow-sm border p-8">
          <div className="text-center mb-8">
            <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 ${passed ? 'bg-green-100' : 'bg-red-100'}`}>
              {passed ? <CheckCircle2 className="w-10 h-10 text-green-600" /> : <XCircle className="w-10 h-10 text-red-600" />}
            </div>
            <h2 className="text-2xl font-bold text-gray-900">{passed ? 'Passed!' : 'Keep Practising'}</h2>
            <p className="text-gray-600 mt-1">
              You scored {score}% ({correct}/{examQuestions.length})
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-gray-50 rounded-xl p-4 text-center">
              <div className="text-sm text-gray-500 mb-1">Time Used</div>
              <div className="text-lg font-bold">{formatTime(EXAM_DURATION_MINUTES * 60 - timeRemaining)}</div>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 text-center">
              <div className="text-sm text-gray-500 mb-1">Answered</div>
              <div className="text-lg font-bold">{answeredCount}/{examQuestions.length}</div>
            </div>
          </div>

          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5" /> Domain Breakdown
          </h3>
          <div className="space-y-3 mb-8">
            {Object.entries(domainScores).map(([domain, { correct: dc, total }]) => {
              const pct = Math.round((dc / total) * 100)
              return (
                <div key={domain}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium capitalize">{domain}</span>
                    <span className="text-gray-500">{dc}/{total} ({pct}%)</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className={`h-2 rounded-full ${pct >= 70 ? 'bg-green-500' : pct >= 50 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              )
            })}
          </div>

          {!showResults ? (
            <button onClick={() => setShowResults(true)} className="w-full py-3 bg-blue-50 text-blue-600 rounded-lg font-medium hover:bg-blue-100 transition-colors mb-4">
              Review Answers
            </button>
          ) : (
            <div className="space-y-4 mb-4 max-h-96 overflow-y-auto">
              {examQuestions.map((q, i) => {
                const isCorrect = answers[i] === q.correctAnswer
                return (
                  <div key={q.id} className={`p-4 rounded-lg border ${isCorrect ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
                    <div className="text-sm font-medium text-gray-900 mb-2">Q{i + 1}: {q.question}</div>
                    <div className="text-sm text-gray-700 mb-1">
                      Your answer: {answers[i] !== undefined ? q.options[answers[i]] : 'Not answered'}
                    </div>
                    {!isCorrect && (
                      <div className="text-sm text-green-700">
                        Correct: {q.options[q.correctAnswer]}
                      </div>
                    )}
                    <div className="text-xs text-gray-500 mt-2">{q.explanation}</div>
                  </div>
                )
              })}
            </div>
          )}

          <div className="flex gap-3">
            <button onClick={onBack} className="flex-1 py-3 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors">
              Back to Dashboard
            </button>
            <button onClick={startExam} className="flex-1 py-3 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors">
              Retake Exam
            </button>
          </div>
        </div>
      </div>
    )
  }

  const currentQ = examQuestions[currentIndex]

  return (
    <div className="max-w-3xl mx-auto p-4">
      {/* Timer bar */}
      <div className="bg-white rounded-xl shadow-sm border mb-4 p-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className={`flex items-center gap-2 font-mono text-lg font-bold ${timeRemaining < 300 ? 'text-red-600' : 'text-gray-900'}`}>
            <Clock className="w-5 h-5" />
            {formatTime(timeRemaining)}
          </div>
          <div className="text-sm text-gray-500">
            {answeredCount}/{examQuestions.length} answered
          </div>
        </div>
        <button
          onClick={() => { if (confirm('Are you sure you want to submit the exam?')) submitExam() }}
          className="px-4 py-2 bg-red-600 text-white text-sm rounded-lg font-medium hover:bg-red-700 transition-colors"
        >
          Submit Exam
        </button>
      </div>

      {/* Question navigator */}
      <div className="bg-white rounded-xl shadow-sm border mb-4 p-3">
        <div className="flex flex-wrap gap-1.5">
          {examQuestions.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={`w-8 h-8 rounded text-xs font-medium transition-colors ${
                i === currentIndex
                  ? 'bg-blue-600 text-white'
                  : answers[i] !== undefined
                  ? 'bg-green-100 text-green-700'
                  : flagged.has(i)
                  ? 'bg-yellow-100 text-yellow-700 border border-yellow-300'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>

      {/* Question */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm text-gray-500">Question {currentIndex + 1} of {examQuestions.length}</span>
          <div className="flex items-center gap-2">
            <span className="text-xs bg-gray-100 px-2 py-1 rounded capitalize">{currentQ.domain}</span>
            <button
              onClick={() => {
                const next = new Set(flagged)
                if (next.has(currentIndex)) next.delete(currentIndex)
                else next.add(currentIndex)
                setFlagged(next)
              }}
              className={`p-1.5 rounded transition-colors ${flagged.has(currentIndex) ? 'text-yellow-600 bg-yellow-50' : 'text-gray-400 hover:text-yellow-600'}`}
            >
              <Flag className="w-4 h-4" />
            </button>
          </div>
        </div>

        <h3 className="text-lg font-medium text-gray-900 mb-6">{currentQ.question}</h3>

        <div className="space-y-3 mb-8">
          {currentQ.options.map((option, oi) => (
            <button
              key={oi}
              onClick={() => setAnswers(prev => ({ ...prev, [currentIndex]: oi }))}
              className={`w-full text-left p-4 rounded-lg border transition-all ${
                answers[currentIndex] === oi
                  ? 'border-blue-500 bg-blue-50 text-blue-900'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <span className="font-medium mr-2">{String.fromCharCode(65 + oi)}.</span>
              {option}
            </button>
          ))}
        </div>

        <div className="flex justify-between">
          <button
            onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
            disabled={currentIndex === 0}
            className="flex items-center gap-1 px-4 py-2 text-sm text-gray-600 hover:text-gray-900 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-4 h-4" /> Previous
          </button>
          <button
            onClick={() => setCurrentIndex(Math.min(examQuestions.length - 1, currentIndex + 1))}
            disabled={currentIndex === examQuestions.length - 1}
            className="flex items-center gap-1 px-4 py-2 text-sm text-gray-600 hover:text-gray-900 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Next <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
