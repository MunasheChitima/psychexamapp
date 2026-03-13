'use client'

import { useState, useMemo, useCallback, useEffect, useRef } from 'react'
import {
  Zap,
  Flame,
  Star,
  Trophy,
  ChevronRight,
  CheckCircle,
  BookOpen,
  Target,
  ArrowRight,
  Clock,
  Sparkles,
} from 'lucide-react'
import { ComponentProps, PracticeQuestion, QuestionAttempt } from '@/types'
import {
  selectAdaptiveQuestions,
  processAnswer,
  ensureTodayMissions,
  updateDailyStreak,
  createDefaultEngagementData,
  xpProgress,
} from '@/lib/engagementEngine'
import { useSubscription } from '@/components/SubscriptionProvider'
import { getAllPracticeQuestions, getProductConfig } from '@/lib/productConfig'

type Phase = 'hub' | 'playing' | 'result' | 'round-complete'

export default function DailyChallenge({ appData, updateAppData }: ComponentProps) {
  const productConfig = useMemo(() => getProductConfig(appData.productLine), [appData.productLine])
  const { isSubscribed } = useSubscription()

  const engagement = useMemo(() => {
    const raw = appData.engagementData
    if (raw && typeof raw === 'object' && 'xp' in raw) return raw
    return createDefaultEngagementData()
  }, [appData.engagementData])

  const [phase, setPhase] = useState<Phase>('hub')
  const [questions, setQuestions] = useState<PracticeQuestion[]>([])
  const [currentIdx, setCurrentIdx] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showExplanation, setShowExplanation] = useState(false)
  const [roundCorrect, setRoundCorrect] = useState(0)
  const [roundXp, setRoundXp] = useState(0)
  const [lastXpGain, setLastXpGain] = useState<{ amount: number; breakdown: string[] } | null>(null)
  const [xpAnimating, setXpAnimating] = useState(false)
  const questionStartTime = useRef<number>(Date.now())

  const allQuestions = useMemo(() => getAllPracticeQuestions(appData.productLine), [appData.productLine])

  const previewQuestions = useMemo(() => {
    return productConfig.domains.flatMap((domain) => allQuestions.filter((q) => q.domain === domain.id).slice(0, 3))
  }, [allQuestions, productConfig.domains])

  const availableQuestions = useMemo(
    () => (isSubscribed ? allQuestions : previewQuestions),
    [isSubscribed, allQuestions, previewQuestions]
  )

  // Ensure missions and streak are fresh on mount
  useEffect(() => {
    let updated = ensureTodayMissions(engagement)
    updated = updateDailyStreak(updated)
    if (
      updated.missionsLastGeneratedDate !== engagement.missionsLastGeneratedDate ||
      updated.lastActiveDate !== engagement.lastActiveDate
    ) {
      updateAppData({ engagementData: updated })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const startRound = useCallback(() => {
    const selected = selectAdaptiveQuestions(
      availableQuestions,
      engagement.questionHistory,
      5,
      appData.selectedDomains
    )
    if (selected.length === 0) return
    setQuestions(selected)
    setCurrentIdx(0)
    setSelectedAnswer(null)
    setShowExplanation(false)
    setRoundCorrect(0)
    setRoundXp(0)
    setLastXpGain(null)
    setPhase('playing')
    questionStartTime.current = Date.now()
  }, [availableQuestions, engagement.questionHistory, appData.selectedDomains])

  const handleAnswer = useCallback((answerIdx: number) => {
    if (selectedAnswer !== null) return
    setSelectedAnswer(answerIdx)

    const q = questions[currentIdx]
    const correct = answerIdx === q.correctAnswer
    const responseTime = Date.now() - questionStartTime.current

    const attempt: QuestionAttempt = {
      questionId: q.id,
      domain: q.domain,
      difficulty: q.difficulty,
      answeredCorrectly: correct,
      timestamp: new Date().toISOString(),
      responseTimeMs: responseTime,
    }

    const { data: newEngagement, xpGained, xpBreakdown } = processAnswer(engagement, attempt)
    updateAppData({ engagementData: newEngagement })

    if (correct) setRoundCorrect(prev => prev + 1)
    setRoundXp(prev => prev + xpGained)
    setLastXpGain({ amount: xpGained, breakdown: xpBreakdown })

    if (xpGained > 0) {
      setXpAnimating(true)
      setTimeout(() => setXpAnimating(false), 1200)
    }

    setShowExplanation(true)
  }, [selectedAnswer, questions, currentIdx, engagement, updateAppData])

  const nextQuestion = useCallback(() => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(prev => prev + 1)
      setSelectedAnswer(null)
      setShowExplanation(false)
      setLastXpGain(null)
      questionStartTime.current = Date.now()
    } else {
      if (roundCorrect === questions.length) {
        const updated = { ...engagement }
        updated.todayStats = { ...updated.todayStats, perfectRounds: updated.todayStats.perfectRounds + 1 }
        updateAppData({ engagementData: updated })
      }
      setPhase('round-complete')
    }
  }, [currentIdx, questions.length, roundCorrect, engagement, updateAppData])

  const progress = useMemo(() => xpProgress(engagement.xp), [engagement.xp])
  const missions = engagement.dailyMissions || []
  const completedMissions = missions.filter(m => m.completed).length

  const currentQuestion = questions[currentIdx]

  // --- Hub View ---
  if (phase === 'hub') {
    return (
      <div className="max-w-2xl mx-auto px-4 py-4 md:py-8 space-y-4">
        {/* XP & Level Header */}
        <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 rounded-3xl p-5 text-white shadow-xl">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                <Trophy className="w-5 h-5" />
              </div>
              <div>
                <p className="text-white/70 text-[10px] font-bold uppercase tracking-widest">Level {engagement.level}</p>
                <p className="text-lg font-black leading-tight">{engagement.rank}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-3xl font-black tabular-nums">{engagement.xp.toLocaleString()}</p>
              <p className="text-white/60 text-[10px] font-bold uppercase tracking-wider">Total XP</p>
            </div>
          </div>

          {/* XP Progress Bar */}
          <div className="relative">
            <div className="flex justify-between text-[10px] text-white/60 font-semibold mb-1">
              <span>Level {engagement.level}</span>
              <span>Level {engagement.level + 1}</span>
            </div>
            <div className="h-2.5 bg-white/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-yellow-300 to-amber-400 rounded-full transition-all duration-700"
                style={{ width: `${progress.percent}%` }}
              />
            </div>
            <p className="text-[10px] text-white/50 mt-1 text-right">{progress.current} / {progress.needed} XP</p>
          </div>

          {/* Streak */}
          <div className="flex items-center gap-4 mt-3 pt-3 border-t border-white/10">
            <div className="flex items-center gap-1.5">
              <Flame className="w-5 h-5 text-orange-300" />
              <span className="font-black text-lg">{engagement.currentStreak}</span>
              <span className="text-white/60 text-xs">day streak</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Star className="w-4 h-4 text-yellow-300" />
              <span className="font-bold text-sm">{engagement.todayStats.xpEarnedToday}</span>
              <span className="text-white/60 text-xs">XP today</span>
            </div>
          </div>
        </div>

        {/* Start Round CTA */}
        <button
          onClick={startRound}
          className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-2xl p-5 flex items-center justify-between shadow-lg shadow-emerald-200 active:scale-[0.98] transition-all group"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <Zap className="w-6 h-6" />
            </div>
            <div className="text-left">
              <p className="font-black text-lg">Quick Round</p>
              <p className="text-white/70 text-xs">5 adaptive questions picked for you</p>
            </div>
          </div>
          <ArrowRight className="w-6 h-6 text-white/70 group-hover:translate-x-1 transition-transform" />
        </button>

        {/* Daily Missions */}
        <div className="bg-white rounded-2xl border shadow-sm p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-purple-600" />
              <h3 className="font-bold text-gray-900">Daily Missions</h3>
            </div>
            <span className="text-xs font-bold text-purple-600 bg-purple-50 px-2.5 py-1 rounded-lg">
              {completedMissions}/{missions.length}
            </span>
          </div>

          <div className="space-y-2.5">
            {missions.map(mission => (
              <div
                key={mission.id}
                className={`p-3 rounded-xl border transition-all ${
                  mission.completed
                    ? 'bg-emerald-50 border-emerald-200'
                    : 'bg-gray-50 border-gray-100'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5 min-w-0">
                    {mission.completed ? (
                      <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />
                    ) : (
                      <div className={`w-5 h-5 rounded-full border-2 shrink-0 ${
                        mission.difficulty === 'hard' ? 'border-red-300' :
                        mission.difficulty === 'medium' ? 'border-amber-300' :
                        'border-blue-300'
                      }`} />
                    )}
                    <div className="min-w-0">
                      <p className={`font-semibold text-sm ${mission.completed ? 'text-emerald-700 line-through' : 'text-gray-900'}`}>
                        {mission.title}
                      </p>
                      <p className="text-[11px] text-gray-500 truncate">{mission.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md">
                      +{mission.xpReward} XP
                    </span>
                  </div>
                </div>
                {!mission.completed && (
                  <div className="mt-2 ml-7.5">
                    <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-purple-500 rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(100, (mission.current / mission.target) * 100)}%` }}
                      />
                    </div>
                    <p className="text-[10px] text-gray-400 mt-0.5">{mission.current}/{mission.target}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Today's Stats */}
        <div className="bg-white rounded-2xl border shadow-sm p-4">
          <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
            <Clock className="w-4 h-4 text-gray-400" />
            Today&apos;s Activity
          </h3>
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center p-2.5 bg-blue-50 rounded-xl">
              <p className="text-xl font-black text-blue-700">{engagement.todayStats.questionsAnswered}</p>
              <p className="text-[10px] text-blue-600 font-semibold">Answered</p>
            </div>
            <div className="text-center p-2.5 bg-emerald-50 rounded-xl">
              <p className="text-xl font-black text-emerald-700">{engagement.todayStats.correctAnswers}</p>
              <p className="text-[10px] text-emerald-600 font-semibold">Correct</p>
            </div>
            <div className="text-center p-2.5 bg-amber-50 rounded-xl">
              <p className="text-xl font-black text-amber-700">{engagement.todayStats.bestStreakToday}</p>
              <p className="text-[10px] text-amber-600 font-semibold">Best Streak</p>
            </div>
          </div>
        </div>

        {/* Weekly XP Graph */}
        <div className="bg-white rounded-2xl border shadow-sm p-4">
          <h3 className="font-bold text-gray-900 mb-3">Weekly XP</h3>
          <div className="flex items-end gap-1.5 h-20">
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => {
              const val = engagement.weeklyXp[i] || 0
              const max = Math.max(...engagement.weeklyXp, 1)
              const heightPct = Math.max(4, (val / max) * 100)
              const isToday = i === new Date().getDay()
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-full flex items-end justify-center" style={{ height: '60px' }}>
                    <div
                      className={`w-full max-w-[28px] rounded-t-md transition-all ${
                        isToday ? 'bg-purple-500' : 'bg-gray-200'
                      }`}
                      style={{ height: `${heightPct}%` }}
                    />
                  </div>
                  <span className={`text-[10px] font-bold ${isToday ? 'text-purple-600' : 'text-gray-400'}`}>{day}</span>
                </div>
              )
            })}
          </div>
        </div>

        <div className="h-4" />
      </div>
    )
  }

  // --- Playing View ---
  if (phase === 'playing' && currentQuestion) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-4 md:py-8">
        {/* Top bar */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-black text-gray-900">{currentIdx + 1}</span>
            <span className="text-sm text-gray-400 font-medium">/ {questions.length}</span>
          </div>
          <div className="flex items-center gap-3">
            {engagement.todayStats.currentStreakToday > 0 && (
              <div className="flex items-center gap-1 px-2.5 py-1 bg-orange-50 rounded-lg">
                <Flame className="w-4 h-4 text-orange-500" />
                <span className="text-sm font-bold text-orange-600">{engagement.todayStats.currentStreakToday}</span>
              </div>
            )}
            <div className={`flex items-center gap-1 px-2.5 py-1 bg-purple-50 rounded-lg transition-all ${xpAnimating ? 'scale-125 bg-purple-100' : ''}`}>
              <Sparkles className="w-4 h-4 text-purple-500" />
              <span className="text-sm font-bold text-purple-600">{roundXp} XP</span>
            </div>
          </div>
        </div>

        {/* Progress dots */}
        <div className="flex gap-1.5 mb-5">
          {questions.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 flex-1 rounded-full transition-all ${
                i < currentIdx ? 'bg-emerald-400' :
                i === currentIdx ? 'bg-purple-500' :
                'bg-gray-200'
              }`}
            />
          ))}
        </div>

        {/* Question card */}
        <div className="bg-white rounded-2xl border shadow-sm overflow-hidden mb-4">
          <div className="p-5 md:p-7">
            <div className="flex flex-wrap gap-2 mb-3">
              <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold text-white uppercase tracking-wide ${
                currentQuestion.domain === 'ethics' ? 'bg-blue-500' :
                currentQuestion.domain === 'assessment' ? 'bg-green-500' :
                currentQuestion.domain === 'interventions' ? 'bg-purple-500' : 'bg-orange-500'
              }`}>
                {currentQuestion.domain}
              </span>
              <span className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase ${
                currentQuestion.difficulty === 'expert' ? 'bg-red-100 text-red-700' :
                currentQuestion.difficulty === 'hard' ? 'bg-amber-100 text-amber-700' :
                'bg-green-100 text-green-700'
              }`}>
                {currentQuestion.difficulty}
              </span>
            </div>

            {currentQuestion.caseStudy && (
              <div className="mb-4 p-3 bg-indigo-50 border-l-4 border-indigo-500 rounded-r-xl">
                <p className="text-indigo-900 text-sm leading-relaxed italic">{currentQuestion.caseStudy}</p>
              </div>
            )}

            <h3 className="text-lg font-bold text-gray-900 mb-5 leading-snug">
              {currentQuestion.question}
            </h3>

            <div className="space-y-2.5">
              {currentQuestion.options.map((option, idx) => {
                const isSelected = selectedAnswer === idx
                const isCorrect = idx === currentQuestion.correctAnswer
                const answered = selectedAnswer !== null

                let borderClass = 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                if (answered) {
                  if (isCorrect) borderClass = 'border-emerald-500 bg-emerald-50'
                  else if (isSelected) borderClass = 'border-red-400 bg-red-50'
                  else borderClass = 'border-gray-100 opacity-60'
                }

                return (
                  <button
                    key={idx}
                    onClick={() => handleAnswer(idx)}
                    disabled={answered}
                    className={`w-full text-left p-3.5 rounded-xl border-2 transition-all active:scale-[0.98] disabled:cursor-default ${borderClass}`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-7 h-7 shrink-0 rounded-full border-2 flex items-center justify-center text-xs font-bold ${
                        answered && isCorrect ? 'border-emerald-500 bg-emerald-500 text-white' :
                        answered && isSelected ? 'border-red-400 bg-red-400 text-white' :
                        'border-gray-300 text-gray-400'
                      }`}>
                        {String.fromCharCode(65 + idx)}
                      </div>
                      <span className="text-gray-900 text-sm font-medium leading-snug">{option}</span>
                    </div>
                  </button>
                )
              })}
            </div>

            {/* XP popup */}
            {lastXpGain && lastXpGain.amount > 0 && (
              <div className="mt-4 flex items-center justify-center animate-bounce">
                <div className="px-4 py-2 bg-purple-600 text-white rounded-full font-black text-sm shadow-lg shadow-purple-200">
                  +{lastXpGain.amount} XP
                </div>
              </div>
            )}

            {/* Explanation */}
            {showExplanation && (
              <div className="mt-5 p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <BookOpen className="w-4 h-4 text-emerald-600" />
                  <h4 className="font-bold text-emerald-900 text-xs uppercase tracking-wide">Explanation</h4>
                </div>
                <p className="text-emerald-900 text-sm leading-relaxed">{currentQuestion.explanation}</p>
              </div>
            )}
          </div>
        </div>

        {/* Next button */}
        {selectedAnswer !== null && (
          <button
            onClick={nextQuestion}
            className="w-full bg-purple-600 text-white py-3.5 rounded-xl font-bold shadow-lg shadow-purple-200 active:scale-[0.97] transition-all flex items-center justify-center gap-2"
          >
            <span>{currentIdx === questions.length - 1 ? 'See Results' : 'Next Question'}</span>
            <ChevronRight className="w-5 h-5" />
          </button>
        )}

        <div className="h-24" />
      </div>
    )
  }

  // --- Round Complete View ---
  if (phase === 'round-complete') {
    const totalQ = questions.length
    const pct = Math.round((roundCorrect / totalQ) * 100)
    const isPerfect = roundCorrect === totalQ

    return (
      <div className="max-w-2xl mx-auto px-4 py-8 md:py-12">
        <div className="bg-white rounded-3xl border shadow-sm p-6 md:p-10 text-center">
          {isPerfect ? (
            <div className="mb-4">
              <div className="w-20 h-20 bg-gradient-to-br from-yellow-300 to-amber-500 rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg shadow-amber-200">
                <Trophy className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-2xl font-black text-gray-900">Perfect Round!</h2>
            </div>
          ) : pct >= 70 ? (
            <div className="mb-4">
              <div className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg shadow-emerald-200">
                <CheckCircle className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-2xl font-black text-gray-900">Great Job!</h2>
            </div>
          ) : (
            <div className="mb-4">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg shadow-blue-200">
                <Target className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-2xl font-black text-gray-900">Keep Practicing!</h2>
            </div>
          )}

          <div className="text-5xl font-black mb-1">
            <span className={pct >= 70 ? 'text-emerald-600' : 'text-blue-600'}>{pct}%</span>
          </div>
          <p className="text-gray-500 text-sm mb-6">{roundCorrect} of {totalQ} correct</p>

          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="p-3 bg-purple-50 rounded-xl">
              <p className="text-2xl font-black text-purple-700">{roundXp}</p>
              <p className="text-[10px] font-bold text-purple-500 uppercase">XP Earned</p>
            </div>
            <div className="p-3 bg-orange-50 rounded-xl">
              <p className="text-2xl font-black text-orange-700">{engagement.currentStreak}</p>
              <p className="text-[10px] font-bold text-orange-500 uppercase">Day Streak</p>
            </div>
          </div>

          {/* Level progress */}
          <div className="mb-6 p-3 bg-gray-50 rounded-xl">
            <div className="flex justify-between text-xs font-semibold text-gray-500 mb-1">
              <span>Lvl {engagement.level} {engagement.rank}</span>
              <span>Lvl {engagement.level + 1}</span>
            </div>
            <div className="h-2.5 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-1000"
                style={{ width: `${progress.percent}%` }}
              />
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <button
              onClick={startRound}
              className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white py-3.5 rounded-xl font-bold shadow-lg shadow-emerald-200 active:scale-[0.97] transition-all flex items-center justify-center gap-2"
            >
              <Zap className="w-5 h-5" />
              <span>Play Again</span>
            </button>
            <button
              onClick={() => setPhase('hub')}
              className="w-full bg-gray-100 text-gray-700 py-3.5 rounded-xl font-bold active:scale-[0.97] transition-all"
            >
              Back to Hub
            </button>
          </div>
        </div>
      </div>
    )
  }

  return null
}
