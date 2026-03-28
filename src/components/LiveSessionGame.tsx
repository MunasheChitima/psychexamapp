'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { Clock, Zap, ChevronRight, Loader2 } from 'lucide-react'

interface GameState {
  status: string
  roomCode: string
  isHost: boolean
  currentQuestionIndex: number
  totalQuestions: number
  questionDurationSec: number
  timeRemainingMs: number
  hasAnsweredCurrent: boolean
  domain: string
  playerCount: number
  leaderboard: { rank: number; userId: string; displayName: string; totalScore: number; isMe: boolean }[]
  question?: {
    question: string
    options: string[]
    caseStudy: string | null
    domain: string
    difficulty: string
  }
  correctAnswer?: number
  explanation?: string
  questionResults?: { userId: string; displayName: string; answered: boolean; correct: boolean; points: number; timeMs: number }[]
}

interface GameProps {
  roomCode: string
  onComplete: (roomCode: string) => void
  onExit?: () => void
}

const OPTION_COLORS = [
  'from-red-500 to-red-600',
  'from-blue-500 to-blue-600',
  'from-yellow-500 to-yellow-600',
  'from-green-500 to-green-600',
  'from-purple-500 to-purple-600',
]

export default function LiveSessionGame({ roomCode, onComplete, onExit }: GameProps) {
  const [gameState, setGameState] = useState<GameState | null>(null)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showLeaderboard, setShowLeaderboard] = useState(false)
  const [localTimeRemaining, setLocalTimeRemaining] = useState(-1)
  const [busy, setBusy] = useState(false)
  const [pollError, setPollError] = useState<string | null>(null)
  const lastQuestionIndex = useRef(-1)
  const pollFailures = useRef(0)

  const pollState = useCallback(async () => {
    try {
      const res = await fetch(`/api/live/${roomCode}/state`, { method: 'POST', cache: 'no-store' })
      if (!res.ok) {
        pollFailures.current += 1
        if (pollFailures.current >= 5) {
          setPollError(`Lost connection to room (${res.status}).`)
        }
        return
      }
      pollFailures.current = 0
      setPollError(null)
      const data: GameState = await res.json()
      setGameState(data)

      if (data.status === 'complete') {
        onComplete(roomCode)
        return
      }

      if (data.currentQuestionIndex !== lastQuestionIndex.current) {
        lastQuestionIndex.current = data.currentQuestionIndex
        setSelectedAnswer(null)
        setShowLeaderboard(false)
        setLocalTimeRemaining(data.timeRemainingMs)
      } else if (data.status === 'question' && data.timeRemainingMs > 0) {
        setLocalTimeRemaining(data.timeRemainingMs)
      }

      if (data.timeRemainingMs <= 0 && data.correctAnswer !== undefined) {
        setShowLeaderboard(true)
      }
    } catch {
      pollFailures.current += 1
      if (pollFailures.current >= 5) {
        setPollError('Network error — check your connection.')
      }
    }
  }, [roomCode, onComplete])

  useEffect(() => {
    pollState()
    const interval = setInterval(pollState, 2000)
    return () => clearInterval(interval)
  }, [pollState])

  useEffect(() => {
    if (!gameState || gameState.status !== 'question') return
    if (localTimeRemaining <= 0) return

    const timer = setInterval(() => {
      setLocalTimeRemaining((prev) => {
        if (prev <= 0) return prev
        return Math.max(0, prev - 100)
      })
    }, 100)
    return () => clearInterval(timer)
  }, [gameState?.status, gameState?.currentQuestionIndex, localTimeRemaining])

  const submitAnswer = async (answerIndex: number) => {
    if (busy || selectedAnswer !== null) return
    setSelectedAnswer(answerIndex)
    setBusy(true)
    try {
      const res = await fetch(`/api/live/${roomCode}/answer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answerIndex }),
      })
      const data = await res.json()
      if (!data.recorded && !data.already) {
        setSelectedAnswer(null)
      }
    } catch { /* ignore */ }
    finally { setBusy(false) }
  }

  const advanceQuestion = async () => {
    setBusy(true)
    try {
      await fetch(`/api/live/${roomCode}/next`, { method: 'POST' })
    } catch { /* ignore */ }
    finally { setBusy(false) }
  }

  if (!gameState) {
    return (
      <div className="min-h-[100dvh] bg-gray-900 flex flex-col items-center justify-center gap-4 px-4">
        {pollError ? (
          <>
            <p className="text-red-400 text-sm text-center">{pollError}</p>
            <button
              type="button"
              onClick={() => {
                pollFailures.current = 0
                setPollError(null)
                void pollState()
              }}
              className="px-4 py-2 rounded-lg bg-gray-700 text-white text-sm font-semibold hover:bg-gray-600"
            >
              Retry
            </button>
          </>
        ) : (
          <div className="flex items-center gap-2 text-gray-400">
            <Loader2 className="w-5 h-5 animate-spin" /> Connecting...
          </div>
        )}
        {onExit && (
          <button onClick={onExit} className="text-sm text-gray-500 hover:text-gray-300 transition-colors">
            Leave Game
          </button>
        )}
      </div>
    )
  }

  const timerPercent = gameState.questionDurationSec > 0 && localTimeRemaining > 0
    ? Math.max(0, (localTimeRemaining / (gameState.questionDurationSec * 1000)) * 100)
    : 0
  const timerExpired = localTimeRemaining === 0 && gameState.status === 'question'

  if (showLeaderboard || timerExpired) {
    return (
      <div className="min-h-[100dvh] bg-gray-900 px-4 py-8">
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="text-center">
            <h2 className="text-xl font-bold text-white">
              Question {gameState.currentQuestionIndex + 1} of {gameState.totalQuestions} complete
            </h2>
            <p className="text-gray-400 mt-2 text-sm">
              Correctness and explanations are shown in the final results.
            </p>
          </div>

          {gameState.questionResults && (
            <div className="rounded-xl border border-gray-700 bg-gray-800 px-4 py-3 text-sm text-gray-300">
              {gameState.questionResults.filter((r) => r.answered).length}/{gameState.questionResults.length} players answered this question.
            </div>
          )}

          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-gray-400 uppercase">Leaderboard</h3>
            {gameState.leaderboard.map((p) => (
              <div key={p.userId} className={`flex items-center justify-between px-4 py-2 rounded-lg ${p.isMe ? 'bg-blue-900/40 border border-blue-700' : 'bg-gray-800 border border-gray-700'}`}>
                <div className="flex items-center gap-3">
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${p.rank <= 3 ? 'bg-yellow-500 text-yellow-900' : 'bg-gray-600 text-white'}`}>
                    {p.rank}
                  </span>
                  <span className="text-white text-sm">{p.displayName}</span>
                </div>
                <span className="text-yellow-400 font-bold">{p.totalScore} pts</span>
              </div>
            ))}
          </div>

          {gameState.isHost && (
            <button onClick={advanceQuestion} disabled={busy} className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:from-yellow-600 hover:to-orange-600 disabled:opacity-50">
              {gameState.currentQuestionIndex + 1 >= gameState.totalQuestions ? 'Show Final Results' : 'Next Question'}
              <ChevronRight className="w-5 h-5" />
            </button>
          )}
          {!gameState.isHost && (
            <p className="text-center text-gray-500 text-sm">Waiting for host to continue...</p>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-[100dvh] bg-gray-900 flex flex-col">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Zap className="w-5 h-5 text-yellow-400" />
            <span className="text-white font-bold">Q{gameState.currentQuestionIndex + 1}/{gameState.totalQuestions}</span>
            <span className="text-gray-400 text-xs uppercase">{gameState.question?.domain}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-gray-400" />
            <span className={`font-mono font-bold ${localTimeRemaining > 0 && localTimeRemaining < 5000 ? 'text-red-400' : 'text-white'}`}>
              {localTimeRemaining > 0 ? `${Math.ceil(localTimeRemaining / 1000)}s` : '...'}
            </span>
          </div>
        </div>
      </div>

      {/* Timer bar */}
      <div className="h-1.5 bg-gray-800">
        <div
          className={`h-full transition-all duration-100 ${timerPercent < 20 ? 'bg-red-500' : timerPercent < 50 ? 'bg-yellow-500' : 'bg-green-500'}`}
          style={{ width: `${timerPercent}%` }}
        />
      </div>

      {/* Question */}
      <div className="flex-1 flex flex-col items-center justify-start md:justify-center px-4 py-6 max-w-3xl mx-auto w-full">
        {gameState.question?.caseStudy && (
          <div className="w-full mb-4 p-4 bg-gray-800 border border-gray-700 rounded-xl">
            <p className="text-gray-300 text-sm italic">{gameState.question.caseStudy}</p>
          </div>
        )}

        <h2 className="text-lg md:text-2xl font-bold text-white text-center mb-5 md:mb-8 leading-snug">
          {gameState.question?.question}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-h-[44dvh] overflow-y-auto pr-1 md:max-h-none md:overflow-visible">
          {gameState.question?.options.map((option, idx) => {
            const isSelected = selectedAnswer === idx
            const isDisabled = selectedAnswer !== null || gameState.hasAnsweredCurrent
            return (
              <button
                key={idx}
                onClick={() => submitAnswer(idx)}
                disabled={isDisabled}
                className={`p-3.5 md:p-4 rounded-xl text-white font-medium text-left transition-all ${
                  isSelected
                    ? 'bg-blue-600 ring-2 ring-blue-400'
                    : `bg-gradient-to-r ${OPTION_COLORS[idx % OPTION_COLORS.length]} ${isDisabled ? 'opacity-60' : 'hover:scale-[1.02] hover:shadow-lg'}`
                }`}
              >
                <div className="flex items-start gap-3">
                  <span className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-sm font-bold shrink-0">
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span className="text-sm md:text-base leading-snug">{option}</span>
                </div>
              </button>
            )
          })}
        </div>

        {gameState.hasAnsweredCurrent && (
          <div className="mt-6 text-gray-400 text-sm flex items-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin" /> Waiting for timer to end...
          </div>
        )}
      </div>
    </div>
  )
}
