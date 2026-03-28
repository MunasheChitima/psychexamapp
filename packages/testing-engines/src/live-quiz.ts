import type { PracticeQuestion } from '@apracademy/contracts'

export interface QuestionPool {
  all: PracticeQuestion[]
  byId: Map<string, PracticeQuestion>
}

/**
 * Creates an indexed question pool from flat arrays of questions.
 * Product-agnostic: the caller passes in the relevant content.
 */
export function createQuestionPool(...questionArrays: PracticeQuestion[][]): QuestionPool {
  const all = questionArrays.flat()
  const byId = new Map(all.map(q => [q.id, q]))
  return { all, byId }
}

export function pickRandomQuestions(
  pool: QuestionPool,
  count: number,
  domain: string
): PracticeQuestion[] {
  const filtered = domain === 'all'
    ? pool.all
    : pool.all.filter((q) => q.domain === domain)
  const shuffled = [...filtered].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, Math.min(count, shuffled.length))
}

export function getQuestionById(pool: QuestionPool, id: string): PracticeQuestion | undefined {
  return pool.byId.get(id)
}

export function getQuestionsByIds(pool: QuestionPool, ids: string[]): PracticeQuestion[] {
  return ids.map((id) => pool.byId.get(id)).filter((q): q is PracticeQuestion => Boolean(q))
}
