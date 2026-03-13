import { comprehensiveContent } from '@/data/comprehensive'
import { nursingContent } from '@/data/nursing'
import type { PracticeQuestion } from '@/types'

const ALL_PSYCHOLOGY_QUESTIONS: PracticeQuestion[] = [
  ...comprehensiveContent.practiceQuestions.ethics,
  ...comprehensiveContent.practiceQuestions.assessment,
  ...comprehensiveContent.practiceQuestions.interventions,
  ...comprehensiveContent.practiceQuestions.communication,
]

const ALL_NURSING_QUESTIONS: PracticeQuestion[] = Object.values(nursingContent.practiceQuestions).flat()
const ALL_QUESTIONS = [...ALL_PSYCHOLOGY_QUESTIONS, ...ALL_NURSING_QUESTIONS]

const QUESTION_MAP = new Map(ALL_QUESTIONS.map((q) => [q.id, q]))

export function pickRandomQuestions(count: number, domain: string, productLine: 'psychology' | 'nursing' = 'psychology'): PracticeQuestion[] {
  const scopedPool = productLine === 'nursing' ? ALL_NURSING_QUESTIONS : ALL_PSYCHOLOGY_QUESTIONS
  const pool = domain === 'all'
    ? scopedPool
    : scopedPool.filter((q) => q.domain === domain)
  const shuffled = [...pool].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, Math.min(count, shuffled.length))
}

export function getQuestionById(id: string): PracticeQuestion | undefined {
  return QUESTION_MAP.get(id)
}

export function getQuestionsByIds(ids: string[]): PracticeQuestion[] {
  return ids.map((id) => QUESTION_MAP.get(id)).filter((q): q is PracticeQuestion => Boolean(q))
}
