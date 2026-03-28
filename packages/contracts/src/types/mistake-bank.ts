export interface MistakeBank {
  id: string
  category: string
  commonMistake: string
  whyItsWrong: string
  correctApproach: string
  examRelevance: 'high' | 'medium'
  exampleQuestion?: string
  references: string[]
}
