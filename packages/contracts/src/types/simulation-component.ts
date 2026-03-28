import type { Domain } from './domain'
import type { PracticeQuestion } from './practice-question'

export interface SimulationComponent {
  id: string
  title: string
  type: 'timed-exam' | 'adaptive-test' | 'clinical-decision-path'
  domain: Domain
  questions: PracticeQuestion[]
  timeLimit: number
  passingScore: number
  adaptiveRules?: {
    difficultyAdjustment: string
    remediationPaths: string[]
  }
  decisionPoints?: {
    scenario: string
    options: string[]
    consequences: string[]
  }[]
}
