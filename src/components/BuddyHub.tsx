'use client'

import { useEffect, useState, useCallback } from 'react'
import { Copy, Gift, Users, Trophy, Loader2, Plus, Target, Flame, BarChart3, Clock, ChevronRight, Zap, Share2 } from 'lucide-react'
import { useToast } from '@/components/Toast'

interface BuddyStatusResponse {
  hasBuddy: boolean
  referralCode: {
    code: string
    expiresAt: string
    redeemedBy: string | null
  } | null
  pair: {
    id: string
    status: string
    createdAt: string
    freeMonthAppliedAt: string | null
    halfOffActiveFrom: string | null
    buddy: {
      id: string
      name: string | null
      email: string
    } | null
  } | null
}

interface ChallengeListItem {
  id: string
  joinCode: string
  title: string
  type: string
  targetValue: number
  domain: string
  startsAt: string
  endsAt: string
  status: string
  participantCount: number
  myStats: {
    questionsAnswered: number
    correctAnswers: number
    bestStreak: number
    score: number
    rank: number
  }
}

interface LeaderboardEntry {
  rank: number
  userId: string
  name: string
  questionsAnswered: number
  correctAnswers: number
  bestStreak: number
  score: number
  accuracy: number
  isMe: boolean
}

interface ChallengeDetail {
  challenge: {
    id: string
    joinCode: string
    title: string
    type: string
    targetValue: number
    domain: string
    startsAt: string
    endsAt: string
    status: string
    creator: { id: string; name: string | null; email: string }
  }
  leaderboard: LeaderboardEntry[]
}

interface LiveSessionEntryProps {
  onNavigate: (page: string) => void
}

export default function BuddyHub({ onNavigate }: LiveSessionEntryProps & Record<string, unknown>) {
  const { showToast } = useToast()
  const [status, setStatus] = useState<BuddyStatusResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [codeInput, setCodeInput] = useState('')
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState('')

  const [challenges, setChallenges] = useState<ChallengeListItem[]>([])
  const [challengesLoading, setChallengesLoading] = useState(true)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [challengeJoinCode, setChallengeJoinCode] = useState('')
  const [selectedChallenge, setSelectedChallenge] = useState<ChallengeDetail | null>(null)

  const [newTitle, setNewTitle] = useState('')
  const [newType, setNewType] = useState('volume')
  const [newTarget, setNewTarget] = useState(25)
  const [newDomain, setNewDomain] = useState('all')
  const [newDuration, setNewDuration] = useState(3)

  const loadStatus = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/buddy/status', { cache: 'no-store' })
      const data = await res.json()
      if (res.ok) setStatus(data)
      else setMessage(data.error || 'Unable to load buddy data')
    } catch {
      setMessage('Unable to load buddy data')
    } finally {
      setLoading(false)
    }
  }, [])

  const loadChallenges = useCallback(async () => {
    setChallengesLoading(true)
    try {
      const res = await fetch('/api/challenges', { cache: 'no-store' })
      const data = await res.json()
      if (res.ok) setChallenges(data.challenges || [])
    } catch { /* ignore */ }
    finally { setChallengesLoading(false) }
  }, [])

  useEffect(() => {
    loadStatus()
    loadChallenges()
  }, [loadStatus, loadChallenges])

  const createCode = async () => {
    setBusy(true); setMessage('')
    try {
      const res = await fetch('/api/referrals', { method: 'POST' })
      const data = await res.json()
      if (!res.ok) setMessage(data.error || 'Could not create referral code')
      else { await loadStatus(); setMessage('Referral code ready to share.') }
    } catch { setMessage('Could not create referral code') }
    finally { setBusy(false) }
  }

  const redeemCode = async () => {
    if (!codeInput.trim()) return
    setBusy(true); setMessage('')
    try {
      const res = await fetch('/api/referrals/redeem', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: codeInput }),
      })
      const data = await res.json()
      if (!res.ok) setMessage(data.error || 'Could not redeem code')
      else { setCodeInput(''); await loadStatus(); setMessage('Referral applied. Subscribe to activate your buddy deal.') }
    } catch { setMessage('Could not redeem code') }
    finally { setBusy(false) }
  }

  const copyText = async (text: string, label = 'Copied!') => {
    try {
      await navigator.clipboard.writeText(text)
      showToast(label, 'success', 2000)
    } catch {
      showToast('Copy failed. Please copy manually.', 'error')
    }
  }

  const createChallenge = async () => {
    if (!newTitle.trim()) { setMessage('Challenge title required'); return }
    setBusy(true); setMessage('')
    try {
      const res = await fetch('/api/challenges', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newTitle, type: newType, targetValue: newTarget, domain: newDomain, durationDays: newDuration }),
      })
      const data = await res.json()
      if (!res.ok) { setMessage(data.error || 'Failed to create challenge'); return }
      setNewTitle(''); setShowCreateForm(false)
      await loadChallenges()
      setMessage(`Challenge created! Share code: ${data.challenge.joinCode}`)
    } catch { setMessage('Failed to create challenge') }
    finally { setBusy(false) }
  }

  const joinChallenge = async () => {
    if (!challengeJoinCode.trim()) return
    setBusy(true); setMessage('')
    try {
      const res = await fetch('/api/challenges/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: challengeJoinCode }),
      })
      const data = await res.json()
      if (!res.ok) { setMessage(data.error || 'Could not join challenge'); return }
      setChallengeJoinCode('')
      await loadChallenges()
      setMessage(`Joined: ${data.challenge.title}`)
    } catch { setMessage('Could not join challenge') }
    finally { setBusy(false) }
  }

  const viewLeaderboard = async (id: string) => {
    try {
      const res = await fetch(`/api/challenges/${id}`, { cache: 'no-store' })
      const data = await res.json()
      if (res.ok) setSelectedChallenge(data)
      else setMessage(data.error || 'Could not load leaderboard')
    } catch { setMessage('Could not load leaderboard') }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'volume': return <Target className="w-4 h-4" />
      case 'accuracy': return <BarChart3 className="w-4 h-4" />
      case 'streak': return <Flame className="w-4 h-4" />
      default: return <Trophy className="w-4 h-4" />
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'volume': return 'Most Questions'
      case 'accuracy': return 'Best Accuracy'
      case 'streak': return 'Longest Streak'
      default: return type
    }
  }

  const timeLeft = (endsAt: string) => {
    const diff = new Date(endsAt).getTime() - Date.now()
    if (diff <= 0) return 'Ended'
    const hours = Math.floor(diff / 3600000)
    if (hours < 24) return `${hours}h left`
    return `${Math.ceil(hours / 24)}d left`
  }

  if (loading) {
    return (
      <div className="min-h-[100dvh] bg-gray-50 flex items-center justify-center">
        <div className="flex items-center gap-2 text-gray-600">
          <Loader2 className="w-5 h-5 animate-spin" />
          Loading buddy hub...
        </div>
      </div>
    )
  }

  if (selectedChallenge) {
    const c = selectedChallenge.challenge
    const lb = selectedChallenge.leaderboard
    const shareText = (() => {
      const me = lb.find((e) => e.isMe)
      if (!me) return ''
      return `I'm #${me.rank} in "${c.title}" -- ${me.questionsAnswered} questions, ${me.accuracy}% accuracy, ${me.bestStreak} best streak. Beat me! Join: ${c.joinCode}`
    })()

    return (
      <div className="min-h-[100dvh] bg-gray-50 py-8 px-4">
        <div className="max-w-3xl mx-auto space-y-6">
          <button onClick={() => setSelectedChallenge(null)} className="text-sm text-blue-600 hover:text-blue-700">
            &larr; Back to Buddy Hub
          </button>
          <div className="bg-white border rounded-xl p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-xl font-bold text-gray-900">{c.title}</h2>
                <div className="flex items-center gap-3 mt-1 text-sm text-gray-600">
                  <span className="flex items-center gap-1">{getTypeIcon(c.type)} {getTypeLabel(c.type)}</span>
                  <span>Target: {c.targetValue}</span>
                  <span className={c.status === 'completed' ? 'text-gray-500' : 'text-green-600'}>{c.status === 'completed' ? 'Ended' : timeLeft(c.endsAt)}</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs text-gray-500">Join code</div>
                <button onClick={() => copyText(c.joinCode, 'Join code copied.')} className="font-mono font-bold text-blue-600 hover:text-blue-700">{c.joinCode}</button>
              </div>
            </div>
            <div className="space-y-2">
              {lb.map((entry) => (
                <div key={entry.userId} className={`flex items-center justify-between p-3 rounded-lg border ${entry.isMe ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-200'}`}>
                  <div className="flex items-center gap-3">
                    <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${entry.rank <= 3 ? 'bg-yellow-400 text-yellow-900' : 'bg-gray-200 text-gray-600'}`}>
                      {entry.rank}
                    </span>
                    <span className="font-medium text-gray-900">{entry.name}{entry.isMe && ' (You)'}</span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span>{entry.questionsAnswered} Qs</span>
                    <span>{entry.accuracy}%</span>
                    <span className="flex items-center gap-1"><Flame className="w-3.5 h-3.5 text-orange-500" />{entry.bestStreak}</span>
                    <span className="font-bold text-gray-900">{entry.score} pts</span>
                  </div>
                </div>
              ))}
            </div>
            {shareText && (
              <button onClick={() => copyText(shareText, 'Share text copied.')} className="mt-4 flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700">
                <Share2 className="w-4 h-4" /> Copy shareable summary
              </button>
            )}
          </div>
          {message && <div className="text-sm bg-blue-50 text-blue-700 px-4 py-3 border border-blue-200 rounded-lg">{message}</div>}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-[100dvh] bg-gray-50 py-5 md:py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="bg-white border rounded-xl p-5 md:p-6">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Users className="w-6 h-6 text-blue-600" />
            Buddy Hub
          </h1>
          <p className="text-sm text-gray-600 mt-2">
            Invite a friend within 3 days, unlock a free next month for both of you, then split 50% off after that.
          </p>
        </div>

        {/* Referral section */}
        <div className="grid md:grid-cols-2 gap-4 md:gap-6">
          <div className="bg-white border rounded-xl p-5 md:p-6">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Gift className="w-5 h-5 text-green-600" />
              Your referral code
            </h2>
            {status?.referralCode ? (
              <div className="mt-4">
                <div className="flex items-center justify-between bg-gray-50 border rounded-lg px-4 py-3">
                  <span className="font-mono text-xl font-bold tracking-wider">{status.referralCode.code}</span>
                  <button onClick={() => copyText(status.referralCode!.code, 'Referral code copied.')} className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700">
                    <Copy className="w-4 h-4" /> Copy
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-2">Expires: {new Date(status.referralCode.expiresAt).toLocaleString()}</p>
              </div>
            ) : (
              <button onClick={createCode} disabled={busy} className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-60">
                Create referral code
              </button>
            )}
          </div>
          <div className="bg-white border rounded-xl p-5 md:p-6">
            <h2 className="text-lg font-semibold text-gray-900">Redeem a friend&apos;s code</h2>
            <div className="mt-4 flex flex-col sm:flex-row gap-2">
              <input value={codeInput} onChange={(e) => setCodeInput(e.target.value.toUpperCase())} placeholder="Enter code" className="flex-1 border rounded-lg px-3 py-2 text-sm" />
              <button onClick={redeemCode} disabled={busy || !codeInput.trim()} className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 disabled:opacity-60">Redeem</button>
            </div>
          </div>
        </div>

        {/* Buddy status */}
        {status?.pair && (
          <div className="bg-white border rounded-xl p-6">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-purple-600" /> Buddy pair
            </h2>
            <div className="mt-3 text-sm text-gray-700 space-y-1">
              <p>Paired with: <strong>{status.pair.buddy?.name || status.pair.buddy?.email || 'Buddy'}</strong></p>
              <p>Free month activated: {status.pair.freeMonthAppliedAt ? 'Yes' : 'Pending'}</p>
              <p>50% split discount active: {status.pair.halfOffActiveFrom ? 'Yes' : 'Pending'}</p>
            </div>
          </div>
        )}

        {/* Challenges section */}
        <div className="bg-white border rounded-xl p-5 md:p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-orange-600" /> Study Challenges
            </h2>
            <div className="flex gap-2">
              <button onClick={() => setShowCreateForm(!showCreateForm)} className="flex items-center gap-1 text-sm bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700">
                <Plus className="w-4 h-4" /> Create
              </button>
            </div>
          </div>

          {/* Join challenge */}
          <div className="flex flex-col sm:flex-row gap-2 mb-4">
            <input value={challengeJoinCode} onChange={(e) => setChallengeJoinCode(e.target.value.toUpperCase())} placeholder="Enter challenge code to join" className="flex-1 border rounded-lg px-3 py-2 text-sm" />
            <button onClick={joinChallenge} disabled={busy || !challengeJoinCode.trim()} className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 disabled:opacity-60 text-sm">Join</button>
          </div>

          {/* Create form */}
          {showCreateForm && (
            <div className="border rounded-xl p-4 mb-4 bg-gray-50 space-y-3">
              <input value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="Challenge title (e.g. Weekend Ethics Sprint)" className="w-full border rounded-lg px-3 py-2 text-sm" />
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <select value={newType} onChange={(e) => setNewType(e.target.value)} className="border rounded-lg px-3 py-2 text-sm">
                  <option value="volume">Most Questions</option>
                  <option value="accuracy">Best Accuracy</option>
                  <option value="streak">Longest Streak</option>
                </select>
                <input type="number" min={1} max={500} value={newTarget} onChange={(e) => setNewTarget(Number(e.target.value))} placeholder="Target" className="border rounded-lg px-3 py-2 text-sm" />
                <select value={newDomain} onChange={(e) => setNewDomain(e.target.value)} className="border rounded-lg px-3 py-2 text-sm">
                  <option value="all">All Domains</option>
                  <option value="ethics">Ethics</option>
                  <option value="assessment">Assessment</option>
                  <option value="interventions">Interventions</option>
                  <option value="communication">Communication</option>
                </select>
                <select value={newDuration} onChange={(e) => setNewDuration(Number(e.target.value))} className="border rounded-lg px-3 py-2 text-sm">
                  <option value={1}>1 day</option>
                  <option value={3}>3 days</option>
                  <option value={5}>5 days</option>
                  <option value={7}>7 days</option>
                </select>
              </div>
              <div className="flex gap-2">
                <button onClick={createChallenge} disabled={busy} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-60 text-sm">Create Challenge</button>
                <button onClick={() => setShowCreateForm(false)} className="text-sm text-gray-600 hover:text-gray-800">Cancel</button>
              </div>
            </div>
          )}

          {/* Challenge list */}
          {challengesLoading ? (
            <div className="flex items-center gap-2 text-gray-500 text-sm py-4"><Loader2 className="w-4 h-4 animate-spin" /> Loading challenges...</div>
          ) : challenges.length === 0 ? (
            <p className="text-sm text-gray-500 py-4">No challenges yet. Create one or join with a code.</p>
          ) : (
            <div className="space-y-3">
              {challenges.map((c) => (
                <button key={c.id} onClick={() => viewLeaderboard(c.id)} className="w-full text-left border rounded-xl p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-semibold text-gray-900">{c.title}</div>
                      <div className="flex flex-wrap items-center gap-2.5 mt-1 text-xs text-gray-500">
                        <span className="flex items-center gap-1">{getTypeIcon(c.type)} {getTypeLabel(c.type)}</span>
                        <span>Target: {c.targetValue}</span>
                        <span>{c.participantCount} players</span>
                        <span className={c.status === 'completed' ? 'text-gray-500' : 'text-green-600'}>
                          <Clock className="w-3 h-3 inline mr-0.5" />{timeLeft(c.endsAt)}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-right">
                        <div className="text-xs text-gray-500">Rank #{c.myStats.rank}</div>
                        <div className="text-sm font-bold text-gray-900">{c.myStats.score} pts</div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-500" />
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs text-gray-600">
                    <span>{c.myStats.questionsAnswered} Qs answered</span>
                    <span>{c.myStats.questionsAnswered > 0 ? Math.round((c.myStats.correctAnswers / c.myStats.questionsAnswered) * 100) : 0}% accuracy</span>
                    <span className="flex items-center gap-0.5"><Flame className="w-3 h-3 text-orange-500" />{c.myStats.bestStreak} streak</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Live Session entry */}
        <div className="bg-white border rounded-xl p-6">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-500" /> Live Quiz Sessions
          </h2>
          <p className="text-sm text-gray-600 mt-2">
            Compete head-to-head in real-time Kahoot-style quiz battles. Speed matters -- faster correct answers earn more points.
          </p>
          <button onClick={() => onNavigate('live-session')} className="mt-4 bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-5 py-2.5 rounded-lg font-semibold hover:from-yellow-600 hover:to-orange-600 transition-all">
            Launch Live Session
          </button>
        </div>

        {message && <div className="text-sm bg-blue-50 text-blue-700 px-4 py-3 border border-blue-200 rounded-lg">{message}</div>}
      </div>
    </div>
  )
}
