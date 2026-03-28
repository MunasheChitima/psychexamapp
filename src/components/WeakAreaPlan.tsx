'use client'

import { useMemo } from 'react'
import { AlertTriangle, TrendingUp, BookOpen, Target, ArrowRight } from 'lucide-react'
import { AppData } from '@/types'
import { getProductConfig } from '@/lib/productConfig'
import { usePracticeQuestions } from '@/hooks/useContent'

interface WeakAreaPlanProps {
  appData: AppData
  onNavigate: (page: string, domain?: string) => void
}

interface DomainAnalysis {
  domain: string
  label: string
  questionsAnswered: number
  correctAnswers: number
  accuracy: number
  strength: 'weak' | 'developing' | 'strong'
  recommendation: string
}

export default function WeakAreaPlan({ appData, onNavigate }: WeakAreaPlanProps) {
  const productConfig = useMemo(() => getProductConfig(appData.productLine), [appData.productLine])
  const { questions: allQuestionsList } = usePracticeQuestions(appData.productLine)
  const allQuestionsMap = useMemo(() => {
    return new Map(allQuestionsList.map(q => [q.id, q]))
  }, [allQuestionsList])

  const analysis: DomainAnalysis[] = useMemo(() => {
    const domains = productConfig.domains.map((domain) => ({ id: domain.id, label: domain.name }))

    const stats: Record<string, { answered: number; correct: number }> = {}
    domains.forEach(d => { stats[d.id] = { answered: 0, correct: 0 } })

    if (appData.practiceResults && Array.isArray(appData.practiceResults)) {
      appData.practiceResults.forEach(result => {
        if (result.questions && result.answers) {
          result.questions.forEach((question, idx) => {
            if (stats[question.domain]) {
              stats[question.domain].answered++
              const userAnswer = result.answers[idx]
              if (userAnswer !== null && userAnswer !== undefined) {
                const originalQuestion = allQuestionsMap.get(question.id)
                if (originalQuestion && userAnswer === originalQuestion.correctAnswer) {
                  stats[question.domain].correct++
                }
              }
            }
          })
        }
      })
    }

    return domains.map(d => {
      const s = stats[d.id]
      const accuracy = s.answered > 0 ? Math.round((s.correct / s.answered) * 100) : 0
      let strength: DomainAnalysis['strength'] = 'weak'
      let recommendation = ''

      if (s.answered === 0) {
        strength = 'weak'
        recommendation = `You have not practiced any ${d.label} questions yet. Start with flashcards to build foundational knowledge, then move to practice questions.`
      } else if (accuracy >= 80) {
        strength = 'strong'
        recommendation = `Strong performance in ${d.label}. Maintain with periodic review using spaced repetition flashcards.`
      } else if (accuracy >= 60) {
        strength = 'developing'
        recommendation = `Developing competence in ${d.label}. Focus on the questions you got wrong and review related study materials.`
      } else {
        strength = 'weak'
        recommendation = `${d.label} needs significant attention. Start with study materials to rebuild concepts, then drill with flashcards before retrying practice questions.`
      }

      return {
        domain: d.id,
        label: d.label,
        questionsAnswered: s.answered,
        correctAnswers: s.correct,
        accuracy,
        strength,
        recommendation,
      }
    })
  }, [appData.practiceResults, allQuestionsMap, productConfig.domains])

  const weakAreas = analysis.filter(a => a.strength === 'weak')
  const developingAreas = analysis.filter(a => a.strength === 'developing')
  const strongAreas = analysis.filter(a => a.strength === 'strong')

  const overallAccuracy = useMemo(() => {
    const total = analysis.reduce((sum, a) => sum + a.questionsAnswered, 0)
    const correct = analysis.reduce((sum, a) => sum + a.correctAnswers, 0)
    return total > 0 ? Math.round((correct / total) * 100) : 0
  }, [analysis])

  const strengthColor = (s: DomainAnalysis['strength']) => {
    switch (s) {
      case 'weak': return 'text-red-600 bg-red-50 border-red-200'
      case 'developing': return 'text-yellow-600 bg-yellow-50 border-yellow-200'
      case 'strong': return 'text-green-600 bg-green-50 border-green-200'
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Personalised Study Plan</h1>
        <p className="text-gray-600">Based on your practice results, here is your targeted study plan to strengthen weak areas and maintain strong ones.</p>
      </div>

      {/* Overall readiness */}
      <div className="bg-white rounded-2xl shadow-sm border p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Exam Readiness</h2>
          <div className={`text-2xl font-bold ${overallAccuracy >= 70 ? 'text-green-600' : overallAccuracy >= 50 ? 'text-yellow-600' : 'text-red-600'}`}>
            {overallAccuracy}%
          </div>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className={`h-3 rounded-full transition-all ${overallAccuracy >= 70 ? 'bg-green-500' : overallAccuracy >= 50 ? 'bg-yellow-500' : 'bg-red-500'}`}
            style={{ width: `${overallAccuracy}%` }}
          />
        </div>
        <p className="text-sm text-gray-500 mt-2">
          {overallAccuracy >= 70
            ? 'You are on track for a strong exam performance.'
            : overallAccuracy >= 50
            ? 'Good progress, but focus on your weak areas to improve.'
            : 'Focus your study time on the weak areas below to build a strong foundation.'}
        </p>
      </div>

      {/* Weak areas - priority */}
      {weakAreas.length > 0 && (
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-red-600 uppercase tracking-wider mb-3 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" /> Priority Areas
          </h3>
          <div className="space-y-3">
            {weakAreas.map(area => (
              <div key={area.domain} className={`rounded-xl border p-5 ${strengthColor(area.strength)}`}>
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="font-semibold text-gray-900">{area.label}</h4>
                    <p className="text-sm text-gray-600">
                      {area.questionsAnswered > 0
                        ? `${area.accuracy}% accuracy (${area.correctAnswers}/${area.questionsAnswered})`
                        : 'No questions attempted'}
                    </p>
                  </div>
                  <span className="text-xs font-medium px-2 py-1 rounded bg-red-100 text-red-700">Weak</span>
                </div>
                <p className="text-sm text-gray-700 mb-3">{area.recommendation}</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => onNavigate('materials')}
                    className="flex items-center gap-1 text-xs bg-white border rounded-lg px-3 py-1.5 text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <BookOpen className="w-3.5 h-3.5" /> Study Materials
                  </button>
                  <button
                    onClick={() => onNavigate('flashcards', area.domain)}
                    className="flex items-center gap-1 text-xs bg-white border rounded-lg px-3 py-1.5 text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <ArrowRight className="w-3.5 h-3.5" /> Flashcards
                  </button>
                  <button
                    onClick={() => onNavigate('practice')}
                    className="flex items-center gap-1 text-xs bg-white border rounded-lg px-3 py-1.5 text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <Target className="w-3.5 h-3.5" /> Practice
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Developing areas */}
      {developingAreas.length > 0 && (
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-yellow-600 uppercase tracking-wider mb-3 flex items-center gap-2">
            <TrendingUp className="w-4 h-4" /> Developing
          </h3>
          <div className="space-y-3">
            {developingAreas.map(area => (
              <div key={area.domain} className={`rounded-xl border p-5 ${strengthColor(area.strength)}`}>
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="font-semibold text-gray-900">{area.label}</h4>
                    <p className="text-sm text-gray-600">{area.accuracy}% accuracy ({area.correctAnswers}/{area.questionsAnswered})</p>
                  </div>
                  <span className="text-xs font-medium px-2 py-1 rounded bg-yellow-100 text-yellow-700">Developing</span>
                </div>
                <p className="text-sm text-gray-700">{area.recommendation}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Strong areas */}
      {strongAreas.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-green-600 uppercase tracking-wider mb-3">Strong Areas</h3>
          <div className="space-y-3">
            {strongAreas.map(area => (
              <div key={area.domain} className={`rounded-xl border p-5 ${strengthColor(area.strength)}`}>
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="font-semibold text-gray-900">{area.label}</h4>
                    <p className="text-sm text-gray-600">{area.accuracy}% accuracy ({area.correctAnswers}/{area.questionsAnswered})</p>
                  </div>
                  <span className="text-xs font-medium px-2 py-1 rounded bg-green-100 text-green-700">Strong</span>
                </div>
                <p className="text-sm text-gray-700">{area.recommendation}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
