'use client'

import { useState } from 'react'
import LiveSessionLobby from './LiveSessionLobby'
import LiveSessionGame from './LiveSessionGame'
import LiveSessionResults from './LiveSessionResults'
import type { ProductLine } from '@/types'

interface ContainerProps {
  onExit: () => void
  productLine: ProductLine
}

export default function LiveSessionContainer({ onExit, productLine }: ContainerProps) {
  const [phase, setPhase] = useState<'lobby' | 'game' | 'results'>('lobby')
  const [roomCode, setRoomCode] = useState('')

  const handleSessionStarted = (code: string) => {
    setRoomCode(code)
    setPhase('game')
  }

  const handleGameComplete = (code: string) => {
    setRoomCode(code)
    setPhase('results')
  }

  const handleExit = () => {
    setPhase('lobby')
    setRoomCode('')
    onExit()
  }

  switch (phase) {
    case 'lobby':
      return <LiveSessionLobby onSessionStarted={handleSessionStarted} onExit={handleExit} productLine={productLine} />
    case 'game':
      return <LiveSessionGame roomCode={roomCode} onComplete={handleGameComplete} onExit={handleExit} />
    case 'results':
      return <LiveSessionResults roomCode={roomCode} onExit={handleExit} />
  }
}
