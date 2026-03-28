import type { Domain } from './domain'

export interface RapidReviewMaterial {
  id: string
  title: string
  type: 'speed-drill' | 'mnemonic' | 'must-know-list'
  domain: Domain
  content: string
  difficulty: 'easy' | 'medium' | 'hard'
  timeLimit?: number
  references: string[]
}
