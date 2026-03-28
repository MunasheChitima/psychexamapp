import type { QuestionAttempt, QuestionHistory } from '@apracademy/contracts'

/**
 * SM-2 quality grade derived from correctness + speed + difficulty.
 * Replaces hardcoded grade=4 to produce meaningful ease factor evolution.
 */
function sm2QualityGrade(correct: boolean, responseTimeMs: number, difficulty: string): number {
  if (!correct) {
    return responseTimeMs < 10000 ? 1 : 0
  }
  const diffPenalty = difficulty === 'expert' ? 0.5 : difficulty === 'hard' ? 0.3 : 0
  if (responseTimeMs < 10000) return Math.max(3, 5 - diffPenalty)
  if (responseTimeMs < 30000) return Math.max(3, 4 - diffPenalty)
  return 3
}

export function updateQuestionHistory(
  history: QuestionHistory,
  attempt: QuestionAttempt
): QuestionHistory {
  const prev = history[attempt.questionId]
  const ef = prev?.easeFactor ?? 2.5
  const consec = prev?.consecutiveCorrect ?? 0

  const grade = sm2QualityGrade(attempt.answeredCorrectly, attempt.responseTimeMs, attempt.difficulty)

  let newEf: number
  let newConsec: number
  let intervalDays: number

  if (attempt.answeredCorrectly) {
    newConsec = consec + 1
    newEf = Math.max(1.3, ef + (0.1 - (5 - grade) * (0.08 + (5 - grade) * 0.02)))

    if (newConsec === 1) intervalDays = 1
    else if (newConsec === 2) intervalDays = 3
    else intervalDays = Math.round((prev?.consecutiveCorrect ?? 1) * newEf)

    intervalDays = Math.min(intervalDays, 60)
  } else {
    newConsec = 0
    newEf = Math.max(1.3, ef - 0.2)
    intervalDays = 1
  }

  const nextDue = new Date()
  nextDue.setDate(nextDue.getDate() + intervalDays)

  return {
    ...history,
    [attempt.questionId]: {
      attempts: (prev?.attempts ?? 0) + 1,
      correctCount: (prev?.correctCount ?? 0) + (attempt.answeredCorrectly ? 1 : 0),
      lastAttempted: attempt.timestamp,
      lastCorrect: attempt.answeredCorrectly,
      nextDueDate: nextDue.toISOString(),
      consecutiveCorrect: newConsec,
      easeFactor: newEf,
      domain: attempt.domain,
    },
  }
}
