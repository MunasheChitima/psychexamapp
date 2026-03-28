/**
 * All domain types are now defined in @apracademy/contracts.
 * This file re-exports them for backward compatibility with existing app imports.
 */
export type {
  StudyStats,
  StudySession,
  FlashcardProgress,
  Flashcard,
  PracticeQuestion,
  StudyMaterial,
  CaseStudy,
  EdgeCaseScenario,
  MistakeBank,
  RapidReviewMaterial,
  SimulationComponent,
  PracticeResult,
  ResultQuestion,
  QuestionAttempt,
  QuestionHistoryEntry,
  QuestionHistory,
  DailyMission,
  EngagementData,
  AppData,
  ProductLine,
  PsychologyDomain,
  NursingDomain,
  VceSubject,
  Domain,
  PsychologyQuestionType,
  NursingQuestionType,
  VceQuestionType,
  DomainConfig,
  ProductConfig,
  ExamSitting,
  PricingTier,
  PriceQuote,
  StudyDataPatch,
} from '@apracademy/contracts'

export interface Question {
  id: string
  domain: string
  category: string
  difficulty: 'easy' | 'medium' | 'hard'
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
  caseStudy?: string
}

export interface DashboardProps {
  appData: import('@apracademy/contracts').AppData
  updateAppData: (updates: Partial<import('@apracademy/contracts').AppData>) => void
  onPageChange: (page: string, domain?: string) => void
}

export interface ComponentProps {
  appData: import('@apracademy/contracts').AppData
  updateAppData: (updates: Partial<import('@apracademy/contracts').AppData>) => void
}
