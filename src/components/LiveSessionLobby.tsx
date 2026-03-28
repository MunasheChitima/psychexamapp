'use client'

import { useState, useEffect, useRef } from 'react'
import { Loader2, Zap, Users, Copy, Play } from 'lucide-react'
import { useToast } from '@/components/Toast'
import { getProductConfig } from '@/lib/productConfig'
import type { ProductLine } from '@/types'

interface LobbyProps {
  onSessionStarted: (roomCode: string) => void
  onExit?: () => void
  productLine: ProductLine
}

export default function LiveSessionLobby({ onSessionStarted, onExit, productLine }: LobbyProps) {
  const productConfig = getProductConfig(productLine)
  const { showToast } = useToast()
  const [mode, setMode] = useState<'menu' | 'creating' | 'joining' | 'waiting'>('menu')
  const [domain, setDomain] = useState('all')
  const [questionCount, setQuestionCount] = useState(10)
  const [timerDuration, setTimerDuration] = useState(20)
  const [joinCode, setJoinCode] = useState('')
  const [roomCode, setRoomCode] = useState('')
  const [isHost, setIsHost] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [players, setPlayers] = useState<{ userId: string; displayName: string; totalScore: number; isMe: boolean }[]>([])
  const pollIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    return () => {
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current)
    }
  }, [])

  const createRoom = async () => {
    setBusy(true); setError('')
    try {
      const res = await fetch('/api/live/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ domain, questionCount, questionDurationSec: timerDuration, productLine }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || 'Failed to create room'); return }
      setRoomCode(data.roomCode)
      setIsHost(true)
      setMode('waiting')
      startPolling(data.roomCode)
    } catch { setError('Failed to create room') }
    finally { setBusy(false) }
  }

  const joinRoom = async () => {
    if (!joinCode.trim()) return
    setBusy(true); setError('')
    try {
      const res = await fetch('/api/live/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roomCode: joinCode }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || 'Failed to join room'); return }
      setRoomCode(data.roomCode)
      setIsHost(false)
      setMode('waiting')
      startPolling(data.roomCode)
    } catch { setError('Failed to join room') }
    finally { setBusy(false) }
  }

  const startPolling = (code: string) => {
    if (pollIntervalRef.current) clearInterval(pollIntervalRef.current)
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/live/${code}/state`, { method: 'POST', cache: 'no-store' })
        if (!res.ok) return
        const data = await res.json()
        setPlayers(data.leaderboard || [])
        if (data.status === 'question' || data.status === 'reviewing') {
          clearInterval(interval)
          pollIntervalRef.current = null
          onSessionStarted(code)
        }
      } catch { /* keep polling */ }
    }, 2000)
    pollIntervalRef.current = interval

    fetch(`/api/live/${code}/state`, { method: 'POST', cache: 'no-store' })
      .then((res) => res.json())
      .then((data) => {
        setPlayers(data.leaderboard || [])
        setIsHost(data.isHost)
      })
      .catch(() => {})
  }

  const startGame = async () => {
    setBusy(true); setError('')
    try {
      const res = await fetch(`/api/live/${roomCode}/start`, { method: 'POST' })
      const data = await res.json()
      if (!res.ok) { setError(data.error || 'Failed to start'); return }
      if (pollIntervalRef.current) { clearInterval(pollIntervalRef.current); pollIntervalRef.current = null }
      onSessionStarted(roomCode)
    } catch { setError('Failed to start') }
    finally { setBusy(false) }
  }

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(roomCode)
      showToast('Room code copied!', 'success', 2000)
    } catch { /* ignore */ }
  }

  if (mode === 'waiting') {
    return (
      <div className="min-h-[100dvh] bg-gray-900 flex items-start md:items-center justify-center px-4 py-5 md:py-8">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700">
            <Zap className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Waiting Room</h2>
            <div className="flex items-center justify-center gap-2 mb-6">
              <span className="font-mono text-3xl font-bold text-yellow-400 tracking-widest">{roomCode}</span>
              <button onClick={copyCode} className="text-gray-400 hover:text-white"><Copy className="w-5 h-5" /></button>
            </div>
            <p className="text-gray-400 text-sm mb-6">Share this code with friends to join</p>
            <div className="space-y-2 mb-6 max-h-[36dvh] overflow-y-auto pr-1">
              {players.map((p, i) => (
                <div key={p.userId} className={`flex items-center gap-3 px-4 py-2 rounded-lg ${p.isMe ? 'bg-blue-900/40 border border-blue-700' : 'bg-gray-700/50'}`}>
                  <span className="w-6 h-6 rounded-full bg-gray-600 flex items-center justify-center text-xs font-bold text-white">{i + 1}</span>
                  <span className="text-white text-sm">{p.displayName}{p.isMe && ' (You)'}</span>
                </div>
              ))}
              {players.length === 0 && (
                <div className="flex items-center justify-center gap-2 text-gray-500 py-4">
                  <Loader2 className="w-4 h-4 animate-spin" /> Waiting for players...
                </div>
              )}
            </div>
            <div className="flex items-center justify-center gap-2 text-gray-400 text-sm mb-4">
              <Users className="w-4 h-4" /> {players.length} player{players.length !== 1 && 's'}
            </div>
            {isHost && (
              <button onClick={startGame} disabled={busy || players.length < 1} className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 rounded-xl font-bold text-lg hover:from-yellow-600 hover:to-orange-600 disabled:opacity-50 flex items-center justify-center gap-2">
                <Play className="w-5 h-5" /> Start Game
              </button>
            )}
            {!isHost && (
              <p className="text-gray-400 text-sm">Waiting for host to start the game...</p>
            )}
          </div>
          {error && <div className="text-red-400 text-sm bg-red-900/30 rounded-lg px-4 py-2">{error}</div>}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-[100dvh] bg-gray-900 flex items-start md:items-center justify-center px-4 py-5 md:py-8">
      <div className="max-w-lg w-full space-y-6">
        <div className="text-center">
          <Zap className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
          <h1 className="text-xl md:text-3xl font-bold text-white">Live Quiz Battle</h1>
          <p className="text-gray-400 mt-2">Compete head-to-head in real-time</p>
        </div>

        {mode === 'menu' && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button onClick={() => setMode('creating')} className="bg-gradient-to-br from-blue-600 to-blue-800 text-white p-6 rounded-2xl text-center hover:from-blue-700 hover:to-blue-900 transition-all">
                <Zap className="w-8 h-8 mx-auto mb-2" />
                <div className="font-bold text-lg">Host a Game</div>
                <div className="text-blue-200 text-xs mt-1">Create a room</div>
              </button>
              <button onClick={() => setMode('joining')} className="bg-gradient-to-br from-emerald-600 to-emerald-800 text-white p-6 rounded-2xl text-center hover:from-emerald-700 hover:to-emerald-900 transition-all">
                <Users className="w-8 h-8 mx-auto mb-2" />
                <div className="font-bold text-lg">Join a Game</div>
                <div className="text-emerald-200 text-xs mt-1">Enter room code</div>
              </button>
            </div>
            {onExit && (
              <button onClick={onExit} className="w-full py-3 text-gray-400 hover:text-white text-sm font-medium transition-colors">
                ← Back to Buddy Hub
              </button>
            )}
          </>
        )}

        {mode === 'creating' && (
          <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700 space-y-4">
            <h2 className="text-lg font-bold text-white">Game Settings</h2>
            <div>
              <label className="text-sm text-gray-400 mb-1 block">Domain</label>
              <select value={domain} onChange={(e) => setDomain(e.target.value)} className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg px-3 py-2 text-sm">
                <option value="all">All Domains</option>
                {productConfig.domains.map((item) => (
                  <option key={item.id} value={item.id}>{item.name}</option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-400 mb-1 block">Questions</label>
                <select value={questionCount} onChange={(e) => setQuestionCount(Number(e.target.value))} className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg px-3 py-2 text-sm">
                  <option value={5}>5 questions</option>
                  <option value={10}>10 questions</option>
                  <option value={15}>15 questions</option>
                  <option value={20}>20 questions</option>
                </select>
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-1 block">Timer per question</label>
                <select value={timerDuration} onChange={(e) => setTimerDuration(Number(e.target.value))} className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg px-3 py-2 text-sm">
                  <option value={15}>15 seconds</option>
                  <option value={20}>20 seconds</option>
                  <option value={30}>30 seconds</option>
                  <option value={45}>45 seconds</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={createRoom} disabled={busy} className="flex-1 bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 rounded-xl font-bold hover:from-yellow-600 hover:to-orange-600 disabled:opacity-50">
                {busy ? 'Creating...' : 'Create Room'}
              </button>
              <button onClick={() => setMode('menu')} className="px-4 py-3 text-gray-400 hover:text-white">Back</button>
            </div>
          </div>
        )}

        {mode === 'joining' && (
          <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700 space-y-4">
            <h2 className="text-lg font-bold text-white">Enter Room Code</h2>
            <input
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
              placeholder="ABCDEF"
              maxLength={6}
              className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg px-4 py-3 text-center text-2xl font-mono tracking-widest"
            />
            <div className="flex gap-3">
              <button onClick={joinRoom} disabled={busy || joinCode.length < 4} className="flex-1 bg-gradient-to-r from-emerald-500 to-green-500 text-white py-3 rounded-xl font-bold hover:from-emerald-600 hover:to-green-600 disabled:opacity-50">
                {busy ? 'Joining...' : 'Join Game'}
              </button>
              <button onClick={() => setMode('menu')} className="px-4 py-3 text-gray-400 hover:text-white">Back</button>
            </div>
          </div>
        )}

        {error && <div className="text-red-400 text-sm bg-red-900/30 rounded-lg px-4 py-2 text-center">{error}</div>}
      </div>
    </div>
  )
}
