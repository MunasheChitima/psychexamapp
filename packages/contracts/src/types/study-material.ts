import type { Domain } from './domain'

export interface StudyMaterial {
  id: string
  title: string
  domain: Domain
  category: string
  content: string
  type: 'guide' | 'checklist' | 'flowchart' | 'table' | 'casestudy'
  difficulty: 'comprehensive'
  lastUpdated: string
  keyPoints: string[]
  commonMistakes: string[]
  examTips: string[]
  references: string[]
}
