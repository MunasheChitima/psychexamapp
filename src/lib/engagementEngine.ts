/**
 * Engagement engine — re-exports from @apracademy/testing-engines.
 * Kept for backward compatibility with existing app imports.
 */
export {
  xpForLevel,
  levelFromXp,
  rankFromLevel,
  xpProgress,
  calculateAnswerXp,
  selectAdaptiveQuestions,
  updateQuestionHistory,
  generateDailyMissions,
  updateDailyStreak,
  updateMissionProgress,
  updateMissionsForFlashcard,
  createDefaultEngagementData,
  ensureTodayMissions,
  processAnswer,
} from '@apracademy/testing-engines'
