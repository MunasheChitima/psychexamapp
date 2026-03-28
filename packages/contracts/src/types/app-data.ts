import type { ProductLine } from './domain'
import type { StudyStats } from './study-stats'
import type { StudySession } from './study-session'
import type { FlashcardProgress } from './flashcard-progress'
import type { PracticeResult } from './practice-result'
import type { EngagementData } from './engagement'
import type { Flashcard } from './flashcard'
import type { PracticeQuestion } from './practice-question'
import type { StudyMaterial } from './study-material'
import type { CaseStudy } from './case-study'
import type { EdgeCaseScenario } from './edge-case-scenario'
import type { MistakeBank } from './mistake-bank'
import type { RapidReviewMaterial } from './rapid-review-material'
import type { SimulationComponent } from './simulation-component'

export interface AppData {
  productLine: ProductLine
  examDate: string
  examSittingId?: string
  studyStats: StudyStats
  studySessions: StudySession[]
  flashcardProgress: FlashcardProgress
  practiceResults: PracticeResult[]
  hasCompletedOnboarding: boolean
  studyGoal: string
  selectedDomains: string[]
  materialBookmarks: Record<string, boolean>
  materialCompleted: Record<string, boolean>
  activeDomain: string
  engagementData: EngagementData
  flashcards: Flashcard[]
  practiceQuestions: PracticeQuestion[]
  studyMaterials: StudyMaterial[]
  caseStudies: CaseStudy[]
  edgeCaseScenarios: EdgeCaseScenario[]
  mistakeBank: MistakeBank[]
  rapidReviewMaterials: RapidReviewMaterial[]
  simulationComponents: SimulationComponent[]
}
