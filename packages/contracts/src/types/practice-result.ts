import type { Domain } from './domain'

export type ResultQuestion = {
  id: string
  domain: Domain
  category: string
  difficulty: 'easy' | 'medium' | 'hard' | 'expert'
}

export interface PracticeResult {
  id: string
  date: string
  questions: ResultQuestion[]
  score: number
  domain: string
  duration: number
  isComplete: boolean
  currentQuestionIndex: number
  /** Single index for standard MCQ; sorted indices for select-all (e.g. nursing). */
  answers: (number | number[] | null)[]
  timeRemaining: number
  startTime: Date | null
  endTime: Date | null
}
