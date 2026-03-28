/**
 * Calculates the score for a live quiz answer.
 * Points = 1000 - (timeFraction * 500) + (streak * 100)
 */
export function calculateLiveAnswerScore(
  timeFractionElapsed: number,
  currentStreak: number
): number {
  return Math.round(1000 - timeFractionElapsed * 500 + currentStreak * 100)
}
