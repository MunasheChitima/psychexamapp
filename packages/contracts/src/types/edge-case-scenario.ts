import type { Domain } from './domain'

export interface EdgeCaseScenario {
  id: string
  title: string
  domain: Domain
  category: string
  scenario: string
  complexity: string
  ethicalConsiderations: string[]
  assessmentChallenges: string[]
  interventionComplications: string[]
  systemIssues: string[]
  recommendedActions: string[]
  references: string[]
}
