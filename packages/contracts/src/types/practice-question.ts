import type { Domain, PsychologyQuestionType, NursingQuestionType, VceQuestionType } from './domain'

export interface PracticeQuestion {
  id: string
  domain: Domain
  category: string
  difficulty: 'medium' | 'hard' | 'expert'
  caseStudy: string
  question: string
  options: string[]
  correctAnswer: number
  /** When set (e.g. NCLEX-style select-all), all listed option indices must be selected to score correctly. */
  correctAnswerIndices?: number[]
  distractorRationale: string[]
  explanation: string
  references: string[]
  clinicalPearls?: string
  questionType: PsychologyQuestionType | NursingQuestionType | VceQuestionType
}
