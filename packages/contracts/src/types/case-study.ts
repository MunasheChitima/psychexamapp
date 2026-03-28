import type { Domain } from './domain'

export interface CaseStudy {
  id: string
  title: string
  domain: Domain
  category: string
  caseContent: string
  presentation: string
  assessmentPoints: string[]
  treatmentChallenges: string[]
  ethicalDilemmas: string[]
  unexpectedOutcomes: string[]
  discussionQuestions: string[]
  modelAnswers: string[]
  difficulty: 'medium' | 'hard' | 'expert'
  references: string[]
}
