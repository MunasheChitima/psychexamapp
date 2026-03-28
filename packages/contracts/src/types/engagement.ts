export interface QuestionAttempt {
  questionId: string
  domain: string
  difficulty: string
  answeredCorrectly: boolean
  timestamp: string
  responseTimeMs: number
}

export interface QuestionHistoryEntry {
  attempts: number
  correctCount: number
  lastAttempted: string
  lastCorrect: boolean
  nextDueDate: string | null
  consecutiveCorrect: number
  easeFactor: number
  domain: string
}

export interface QuestionHistory {
  [questionId: string]: QuestionHistoryEntry
}

export interface DailyMission {
  id: string
  type: 'answer_count' | 'correct_streak' | 'domain_focus' | 'hard_correct' | 'perfect_round' | 'review_flashcards' | 'speed_round'
  title: string
  description: string
  target: number
  current: number
  xpReward: number
  completed: boolean
  difficulty: 'easy' | 'medium' | 'hard'
  targetDomain?: string
}

export interface EngagementData {
  xp: number
  level: number
  rank: string
  currentStreak: number
  bestStreak: number
  lastActiveDate: string | null
  loginBonusAwardedToday: boolean
  dailyMissions: DailyMission[]
  missionsLastGeneratedDate: string | null
  questionHistory: QuestionHistory
  todayStats: {
    questionsAnswered: number
    correctAnswers: number
    bestStreakToday: number
    currentStreakToday: number
    xpEarnedToday: number
    hardQuestionsCorrect: number
    perfectRounds: number
    flashcardsReviewed: number
    date: string
  }
  recentXpGains: Array<{ amount: number; reason: string; timestamp: string }>
  weeklyXp: number[]
  weekStartDate: string | null
}
