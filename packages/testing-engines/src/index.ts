export {
  xpForLevel,
  levelFromXp,
  rankFromLevel,
  xpProgress,
  calculateAnswerXp,
  generateDailyMissions,
  updateDailyStreak,
  updateMissionProgress,
  updateMissionsForFlashcard,
  createDefaultEngagementData,
  ensureTodayMissions,
  processAnswer,
} from './engagement-engine'

export {
  selectAdaptiveQuestions,
} from './adaptive-selection'

export {
  updateQuestionHistory,
} from './spaced-repetition'

export {
  pickRandomQuestions,
  getQuestionById,
  getQuestionsByIds,
  createQuestionPool,
} from './live-quiz'

export type { QuestionPool } from './live-quiz'

export {
  calculateLiveAnswerScore,
} from './scoring'
