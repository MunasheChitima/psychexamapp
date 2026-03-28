/**
 * Live quiz question helpers — delegates to @apracademy/testing-engines.
 * This file wires in the product-specific content packs.
 */
import { createQuestionPool, pickRandomQuestions as pickFromPool, getQuestionById as getById, getQuestionsByIds as getByIds } from '@apracademy/testing-engines'
import type { QuestionPool } from '@apracademy/testing-engines'
import { comprehensiveContent } from '@/data/comprehensive'
import { nursingContent } from '@/data/nursing'
import type { PracticeQuestion, ProductLine } from '@apracademy/contracts'

const ALL_PSYCHOLOGY_QUESTIONS: PracticeQuestion[] = [
  ...comprehensiveContent.practiceQuestions.ethics,
  ...comprehensiveContent.practiceQuestions.assessment,
  ...comprehensiveContent.practiceQuestions.interventions,
  ...comprehensiveContent.practiceQuestions.communication,
]

const ALL_NURSING_QUESTIONS: PracticeQuestion[] = Object.values(nursingContent.practiceQuestions).flat()

const PSYCHOLOGY_POOL = createQuestionPool(ALL_PSYCHOLOGY_QUESTIONS)
const NURSING_POOL = createQuestionPool(ALL_NURSING_QUESTIONS)
const COMBINED_POOL = createQuestionPool(ALL_PSYCHOLOGY_QUESTIONS, ALL_NURSING_QUESTIONS)

const POOL_BY_PRODUCT: Record<ProductLine, QuestionPool> = {
  psychology: PSYCHOLOGY_POOL,
  nursing: NURSING_POOL,
}

export function pickRandomQuestions(count: number, domain: string, productLine: ProductLine = 'psychology'): PracticeQuestion[] {
  const pool = POOL_BY_PRODUCT[productLine] ?? PSYCHOLOGY_POOL
  return pickFromPool(pool, count, domain)
}

export function getQuestionById(id: string): PracticeQuestion | undefined {
  return getById(COMBINED_POOL, id)
}

export function getQuestionsByIds(ids: string[]): PracticeQuestion[] {
  return getByIds(COMBINED_POOL, ids)
}
