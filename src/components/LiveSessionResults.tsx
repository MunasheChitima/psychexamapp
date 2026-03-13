'use client'

import { useState, useEffect, useCallback } from 'react'
import { Trophy, CheckCircle, XCircle, Share2, Loader2, ArrowLeft, Crown } from 'lucide-react'
import { useToast } from '@/components/Toast'

interface PlayerAnswer {
  questionIndex: number
  answerIndex: number
  timeMs: number
  correct: boolean
  points: number
}

interface FinalState {
  status: string
  roomCode: string
  totalQuestions: number
  leaderboard: { rank: number; userId: string; displayName: string; totalScore: number; isMe: boolean }[]
  allQuestions?: { index: number; question: string; options: string[]; correctAnswer: number; domain: string }[]
  allPlayerAnswers?: { userId: string; displayName: string; totalScore: number; answers: PlayerAnswer[] }[]
}

interface ResultsProps {
  roomCode: string
  onExit: () => void
}

export default function LiveSessionResults({ roomCode, onExit }: ResultsProps) {
  const { showToast } = useToast()
  const [state, setState] = useState<FinalState | null>(null)
  const [showBreakdown, setShowBreakdown] = useState(false)

  const loadResults = useCallback(async () => {
    try {
      const res = await fetch(`/api/live/${roomCode}/state`, { method: 'POST', cache: 'no-store' })
      if (res.ok) setState(await res.json())
    } catch { /* ignore */ }
  }, [roomCode])

  useEffect(() => {
    loadResults()
  }, [loadResults])

  const copyShareText = async () => {
    if (!state) return
    const me = state.leaderboard.find((p) => p.isMe)
    if (!me) return
    const text = `I placed #${me.rank} with ${me.totalScore} points in a live quiz battle (${state.totalQuestions} questions). Room: ${state.roomCode}`
    try {
      await navigator.clipboard.writeText(text)
      showToast('Results copied to clipboard!', 'success', 2000)
    } catch { /* ignore */ }
  }

  if (!state) {
    return (
      <div className="min-h-[100dvh] bg-gray-900 flex items-center justify-center">
        <div className="flex items-center gap-2 text-gray-400"><Loader2 className="w-5 h-5 animate-spin" /> Loading results...</div>
      </div>
    )
  }

  const podium = state.leaderboard.slice(0, 3)
  const rest = state.leaderboard.slice(3)
  const me = state.leaderboard.find((p) => p.isMe)

  return (
    <div className="min-h-[100dvh] bg-gray-900 px-4 py-8">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <Trophy className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
          <h1 className="text-xl md:text-3xl font-bold text-white">Game Over</h1>
          <p className="text-gray-400 mt-1">{state.totalQuestions} questions -- Room {state.roomCode}</p>
        </div>

        {/* Podium */}
        <div className="flex items-end justify-center gap-3">
          {podium.length >= 2 && (
            <div className="text-center w-28">
              <div className="bg-gray-700 rounded-t-xl pt-6 pb-4 px-2 relative" style={{ height: 120 }}>
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 w-7 h-7 rounded-full bg-gray-400 text-gray-900 flex items-center justify-center text-sm font-bold">2</span>
                <div className="text-white font-bold text-sm truncate">{podium[1].displayName}</div>
                <div className="text-yellow-400 font-bold text-lg mt-1">{podium[1].totalScore}</div>
                {podium[1].isMe && <span className="text-xs text-blue-400">You</span>}
              </div>
            </div>
          )}
          {podium.length >= 1 && (
            <div className="text-center w-32">
              <div className="bg-yellow-600/30 border-2 border-yellow-500 rounded-t-xl pt-8 pb-4 px-2 relative" style={{ height: 150 }}>
                <Crown className="absolute -top-5 left-1/2 -translate-x-1/2 w-8 h-8 text-yellow-400" />
                <div className="text-white font-bold text-base truncate">{podium[0].displayName}</div>
                <div className="text-yellow-400 font-bold text-2xl mt-1">{podium[0].totalScore}</div>
                {podium[0].isMe && <span className="text-xs text-blue-400">You</span>}
              </div>
            </div>
          )}
          {podium.length >= 3 && (
            <div className="text-center w-28">
              <div className="bg-gray-700 rounded-t-xl pt-6 pb-4 px-2 relative" style={{ height: 100 }}>
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 w-7 h-7 rounded-full bg-orange-700 text-white flex items-center justify-center text-sm font-bold">3</span>
                <div className="text-white font-bold text-sm truncate">{podium[2].displayName}</div>
                <div className="text-yellow-400 font-bold text-lg mt-1">{podium[2].totalScore}</div>
                {podium[2].isMe && <span className="text-xs text-blue-400">You</span>}
              </div>
            </div>
          )}
        </div>

        {/* Your result */}
        {me && (
          <div className="bg-blue-900/30 border border-blue-700 rounded-xl p-4 text-center">
            <p className="text-blue-300 text-sm">Your final place</p>
            <p className="text-white text-3xl font-bold">#{me.rank}</p>
            <p className="text-yellow-400 font-bold text-lg">{me.totalScore} points</p>
          </div>
        )}

        {/* Full leaderboard */}
        {rest.length > 0 && (
          <div className="space-y-2">
            {rest.map((p) => (
              <div key={p.userId} className={`flex items-center justify-between px-4 py-3 rounded-lg ${p.isMe ? 'bg-blue-900/40 border border-blue-700' : 'bg-gray-800 border border-gray-700'}`}>
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-gray-600 flex items-center justify-center text-xs font-bold text-white">{p.rank}</span>
                  <span className="text-white text-sm">{p.displayName}{p.isMe && ' (You)'}</span>
                </div>
                <span className="text-yellow-400 font-bold">{p.totalScore} pts</span>
              </div>
            ))}
          </div>
        )}

        {/* Question breakdown */}
        <div>
          <button onClick={() => setShowBreakdown(!showBreakdown)} className="text-sm text-gray-400 hover:text-white underline">
            {showBreakdown ? 'Hide question breakdown' : 'Show question breakdown'}
          </button>
          {showBreakdown && state.allQuestions && state.allPlayerAnswers && (
            <div className="mt-4 space-y-4">
              {state.allQuestions.map((q) => {
                return (
                  <div key={q.index} className="bg-gray-800 border border-gray-700 rounded-xl p-4">
                    <div className="flex items-start justify-between mb-2">
                      <span className="text-xs text-gray-500">Q{q.index + 1} -- {q.domain}</span>
                    </div>
                    <p className="text-white text-sm font-medium mb-3">{q.question}</p>
                    <div className="space-y-1 mb-3">
                      {q.options.map((opt, oi) => (
                        <div key={oi} className={`text-sm px-3 py-1.5 rounded ${oi === q.correctAnswer ? 'bg-green-900/40 text-green-300 border border-green-700' : 'text-gray-400'}`}>
                          {String.fromCharCode(65 + oi)}. {opt}
                        </div>
                      ))}
                    </div>
                    <div className="space-y-1">
                      {state.allPlayerAnswers!.map((player) => {
                        const ans = player.answers.find((a) => a.questionIndex === q.index)
                        return (
                          <div key={player.userId} className="flex items-center justify-between text-xs text-gray-400">
                            <span>{player.displayName}</span>
                            {ans ? (
                              <div className="flex items-center gap-2">
                                {ans.correct ? <CheckCircle className="w-3.5 h-3.5 text-green-400" /> : <XCircle className="w-3.5 h-3.5 text-red-400" />}
                                <span>{(ans.timeMs / 1000).toFixed(1)}s</span>
                                <span className="font-bold text-yellow-400">+{ans.points}</span>
                              </div>
                            ) : (
                              <span className="text-gray-600">--</span>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button onClick={onExit} className="flex-1 bg-gray-700 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-gray-600">
            <ArrowLeft className="w-5 h-5" /> Back to Buddy Hub
          </button>
          <button onClick={copyShareText} className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-blue-700">
            <Share2 className="w-5 h-5" /> Share
          </button>
        </div>
      </div>
    </div>
  )
}
