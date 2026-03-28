import { describe, expect, it } from 'vitest'
import type { PracticeQuestion } from '@apracademy/contracts'
import { getExpectedAnswerIndices, isAnswerCorrect, setsEqual } from './questionGrading'

const base = {
  category: 'x',
  caseStudy: '',
  question: 'Q',
  options: ['a', 'b', 'c', 'd', 'e'],
  distractorRationale: ['', '', '', '', ''],
  explanation: '',
  references: [],
  difficulty: 'medium' as const,
} satisfies Partial<PracticeQuestion>

describe('questionGrading', () => {
  it('single-answer uses correctAnswer', () => {
    const q = {
      ...base,
      id: '1',
      domain: 'ethics',
      correctAnswer: 2,
      questionType: 'evidence-based' as const,
    }
    expect(getExpectedAnswerIndices(q)).toEqual([2])
    expect(isAnswerCorrect(q, 2)).toBe(true)
    expect(isAnswerCorrect(q, 1)).toBe(false)
  })

  it('select-all uses correctAnswerIndices when provided', () => {
    const q = {
      ...base,
      id: '2',
      domain: 'health-promotion' as PracticeQuestion['domain'],
      correctAnswer: 0,
      correctAnswerIndices: [0, 1, 2, 4],
      questionType: 'select-all' as const,
    }
    expect(getExpectedAnswerIndices(q)).toEqual([0, 1, 2, 4])
    expect(isAnswerCorrect(q, [0, 1, 2, 4])).toBe(true)
    expect(isAnswerCorrect(q, [0, 1, 2])).toBe(false)
  })

  it('setsEqual compares sorted', () => {
    expect(setsEqual([2, 1], [1, 2])).toBe(true)
    expect(setsEqual([1], [1, 2])).toBe(false)
  })
})
