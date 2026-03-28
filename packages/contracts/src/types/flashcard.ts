import type { Domain } from './domain'

export interface Flashcard {
  id: string
  domain: Domain
  question: string
  answer: string
  options?: string[]
  correctOption?: number
  category: string
  difficulty: 'easy' | 'medium' | 'hard' | 'expert'
  explanation?: string
  lastReviewed: Date | null
  nextReview: Date | null
  reviewCount: number
  masteryLevel: number
  isBookmarked?: boolean
  references?: string[]
  clinicalPearls?: string | null
}
