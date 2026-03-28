import type { PracticeQuestion } from '@apracademy/contracts'

/** Sorted unique indices the learner must select for a full score (select-all and standard MCQ). */
export function getExpectedAnswerIndices(question: PracticeQuestion): number[] {
  const { questionType, correctAnswer, correctAnswerIndices, distractorRationale } = question

  if (questionType !== 'select-all') {
    return [correctAnswer]
  }

  if (correctAnswerIndices && correctAnswerIndices.length > 0) {
    return [...new Set(correctAnswerIndices)].filter((i) => i >= 0 && i < question.options.length).sort((a, b) => a - b)
  }

  const fromRationale = distractorRationale
    .map((text, i) => (/^\s*correct[\s\u2013\u2014-]/i.test(text.trim()) ? i : -1))
    .filter((i) => i >= 0)

  if (fromRationale.length > 0) {
    return [...new Set(fromRationale)].sort((a, b) => a - b)
  }

  return [correctAnswer]
}

export function setsEqual(a: number[], b: number[]): boolean {
  if (a.length !== b.length) return false
  const sa = [...a].sort((x, y) => x - y)
  const sb = [...b].sort((x, y) => x - y)
  return sa.every((v, i) => v === sb[i])
}

export function isAnswerCorrect(question: PracticeQuestion, selected: number | number[] | null | undefined): boolean {
  if (selected === null || selected === undefined) return false
  const expected = getExpectedAnswerIndices(question)
  if (expected.length <= 1) {
    const idx = Array.isArray(selected) ? selected[0] : selected
    return idx === expected[0]
  }
  const sel = (Array.isArray(selected) ? selected : [selected]).filter(
    (i) => typeof i === 'number' && i >= 0 && i < question.options.length
  )
  return setsEqual(sel, expected)
}
