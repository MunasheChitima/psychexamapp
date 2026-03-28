import type { PracticeQuestion, EngagementData, DailyMission, QuestionAttempt } from '@apracademy/contracts'
import { updateQuestionHistory } from './spaced-repetition'

const DOMAIN_MISSION_POOL = [
  'ethics', 'assessment', 'interventions', 'communication',
  'management-of-care', 'safety-infection', 'health-promotion',
  'psychosocial', 'basic-care', 'pharmacology', 'risk-reduction',
  'physiological', 'osce-skills',
] as const

const XP_TABLE = {
  base: { medium: 15, hard: 30, expert: 60 },
  streakMultiplierStep: 0.15,
  maxStreakMultiplier: 3.0,
  dailyLoginBonus: 50,
  missionBonus: { easy: 100, medium: 250, hard: 500 },
  perfectRoundBonus: 2.0,
  speedBonus: 10,
} as const

const RANKS = [
  { minLevel: 0, name: 'Novice' },
  { minLevel: 3, name: 'Student' },
  { minLevel: 7, name: 'Scholar' },
  { minLevel: 12, name: 'Practitioner' },
  { minLevel: 18, name: 'Expert' },
  { minLevel: 25, name: 'Master' },
  { minLevel: 35, name: 'Grandmaster' },
] as const

export function xpForLevel(level: number): number {
  return Math.floor(100 * Math.pow(level, 1.5))
}

export function levelFromXp(xp: number): number {
  let level = 0
  while (xpForLevel(level + 1) <= xp) level++
  return level
}

export function rankFromLevel(level: number): string {
  let rank: string = RANKS[0].name
  for (const r of RANKS) {
    if (level >= r.minLevel) rank = r.name
  }
  return rank
}

export function xpProgress(xp: number): { current: number; needed: number; percent: number } {
  const level = levelFromXp(xp)
  const currentLevelXp = xpForLevel(level)
  const nextLevelXp = xpForLevel(level + 1)
  const current = xp - currentLevelXp
  const needed = nextLevelXp - currentLevelXp
  return { current, needed, percent: Math.min(100, Math.round((current / needed) * 100)) }
}

function streakMultiplier(streak: number): number {
  return Math.min(XP_TABLE.maxStreakMultiplier, 1 + streak * XP_TABLE.streakMultiplierStep)
}

export function calculateAnswerXp(
  difficulty: string,
  correct: boolean,
  currentStreak: number,
  responseTimeMs: number
): { xp: number; breakdown: string[] } {
  if (!correct) return { xp: 0, breakdown: ['Incorrect — no XP'] }

  const base = XP_TABLE.base[difficulty as keyof typeof XP_TABLE.base] ?? 15
  const mult = streakMultiplier(currentStreak)
  const speed = responseTimeMs < 15000 ? XP_TABLE.speedBonus : 0

  const total = Math.round(base * mult + speed)
  const breakdown: string[] = []
  breakdown.push(`Base: ${base} XP (${difficulty})`)
  if (mult > 1) breakdown.push(`Streak x${mult.toFixed(2)}`)
  if (speed > 0) breakdown.push(`Speed bonus: +${speed}`)

  return { xp: total, breakdown }
}

// Kept for type compatibility but not used in engine logic
export { selectAdaptiveQuestions } from './adaptive-selection'

const MISSION_TEMPLATES: Array<{
  type: DailyMission['type']
  difficulty: DailyMission['difficulty']
  generate: () => Omit<DailyMission, 'id' | 'current' | 'completed'>
}> = [
  {
    type: 'answer_count',
    difficulty: 'easy',
    generate: () => ({ type: 'answer_count', title: 'Warm Up', description: 'Answer 10 practice questions', target: 10, xpReward: XP_TABLE.missionBonus.easy, difficulty: 'easy' }),
  },
  {
    type: 'answer_count',
    difficulty: 'medium',
    generate: () => ({ type: 'answer_count', title: 'Dedicated Practice', description: 'Answer 25 practice questions', target: 25, xpReward: XP_TABLE.missionBonus.medium, difficulty: 'medium' }),
  },
  {
    type: 'correct_streak',
    difficulty: 'medium',
    generate: () => ({ type: 'correct_streak', title: 'On Fire', description: 'Get 5 correct answers in a row', target: 5, xpReward: XP_TABLE.missionBonus.medium, difficulty: 'medium' }),
  },
  {
    type: 'correct_streak',
    difficulty: 'hard',
    generate: () => ({ type: 'correct_streak', title: 'Unstoppable', description: 'Get 8 correct answers in a row', target: 8, xpReward: XP_TABLE.missionBonus.hard, difficulty: 'hard' }),
  },
  {
    type: 'hard_correct',
    difficulty: 'hard',
    generate: () => ({ type: 'hard_correct', title: 'Challenge Accepted', description: 'Answer 3 hard/expert questions correctly', target: 3, xpReward: XP_TABLE.missionBonus.hard, difficulty: 'hard' }),
  },
  {
    type: 'domain_focus',
    difficulty: 'easy',
    generate: () => {
      const domain = DOMAIN_MISSION_POOL[Math.floor(Math.random() * DOMAIN_MISSION_POOL.length)]
      const label = domain.charAt(0).toUpperCase() + domain.slice(1)
      return { type: 'domain_focus', title: `${label} Focus`, description: `Answer 8 ${label} questions`, target: 8, xpReward: XP_TABLE.missionBonus.easy, difficulty: 'easy', targetDomain: domain }
    },
  },
  {
    type: 'perfect_round',
    difficulty: 'hard',
    generate: () => ({ type: 'perfect_round', title: 'Perfectionist', description: 'Get a perfect score on a 5-question round', target: 1, xpReward: XP_TABLE.missionBonus.hard, difficulty: 'hard' }),
  },
  {
    type: 'speed_round',
    difficulty: 'medium',
    generate: () => ({ type: 'speed_round', title: 'Speed Demon', description: 'Answer 5 questions correctly in under 15 seconds each', target: 5, xpReward: XP_TABLE.missionBonus.medium, difficulty: 'medium' }),
  },
  {
    type: 'review_flashcards',
    difficulty: 'easy',
    generate: () => ({ type: 'review_flashcards', title: 'Card Shark', description: 'Review 15 flashcards', target: 15, xpReward: XP_TABLE.missionBonus.easy, difficulty: 'easy' }),
  },
]

export function generateDailyMissions(): DailyMission[] {
  const easy = MISSION_TEMPLATES.filter(m => m.difficulty === 'easy')
  const medium = MISSION_TEMPLATES.filter(m => m.difficulty === 'medium')
  const hard = MISSION_TEMPLATES.filter(m => m.difficulty === 'hard')
  const pick = (arr: typeof easy) => arr[Math.floor(Math.random() * arr.length)]

  return [
    { ...pick(easy).generate(), id: 'daily-1', current: 0, completed: false },
    { ...pick(medium).generate(), id: 'daily-2', current: 0, completed: false },
    { ...pick(hard).generate(), id: 'daily-3', current: 0, completed: false },
  ]
}

function getWeekStart(): string {
  const now = new Date()
  const day = now.getDay()
  const diff = now.getDate() - day
  const weekStart = new Date(now.setDate(diff))
  return weekStart.toISOString().slice(0, 10)
}

function ensureWeeklyXpFresh(data: EngagementData): EngagementData {
  const currentWeekStart = getWeekStart()
  if (data.weekStartDate === currentWeekStart) return data
  return { ...data, weeklyXp: [0, 0, 0, 0, 0, 0, 0], weekStartDate: currentWeekStart }
}

export function updateDailyStreak(data: EngagementData): EngagementData {
  const today = new Date().toISOString().slice(0, 10)
  const lastActive = data.lastActiveDate
  if (lastActive === today) return data

  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  const yesterdayStr = yesterday.toISOString().slice(0, 10)
  const newStreak = lastActive === yesterdayStr ? data.currentStreak + 1 : 1

  return {
    ...data,
    currentStreak: newStreak,
    bestStreak: Math.max(data.bestStreak, newStreak),
    lastActiveDate: today,
    loginBonusAwardedToday: false,
  }
}

export function updateMissionProgress(
  missions: DailyMission[],
  attempt: QuestionAttempt,
  todayStats: EngagementData['todayStats']
): { missions: DailyMission[]; xpFromMissions: number } {
  let xpFromMissions = 0

  const updated = missions.map(m => {
    if (m.completed) return m
    let newCurrent = m.current

    switch (m.type) {
      case 'answer_count': newCurrent = todayStats.questionsAnswered; break
      case 'correct_streak': newCurrent = Math.max(m.current, todayStats.bestStreakToday); break
      case 'hard_correct': newCurrent = todayStats.hardQuestionsCorrect; break
      case 'domain_focus':
        if (m.targetDomain && attempt.domain === m.targetDomain) newCurrent = m.current + 1
        break
      case 'perfect_round': newCurrent = todayStats.perfectRounds; break
      case 'speed_round':
        if (attempt.answeredCorrectly && attempt.responseTimeMs < 15000) newCurrent = m.current + 1
        break
      case 'review_flashcards': newCurrent = todayStats.flashcardsReviewed; break
    }

    const completed = newCurrent >= m.target
    if (completed && !m.completed) xpFromMissions += m.xpReward
    return { ...m, current: newCurrent, completed }
  })

  return { missions: updated, xpFromMissions }
}

export function updateMissionsForFlashcard(
  missions: DailyMission[],
  todayStats: EngagementData['todayStats']
): { missions: DailyMission[]; xpFromMissions: number } {
  let xpFromMissions = 0

  const updated = missions.map(m => {
    if (m.completed || m.type !== 'review_flashcards') return m
    const newCurrent = todayStats.flashcardsReviewed
    const completed = newCurrent >= m.target
    if (completed && !m.completed) xpFromMissions += m.xpReward
    return { ...m, current: newCurrent, completed }
  })

  return { missions: updated, xpFromMissions }
}

export function createDefaultEngagementData(): EngagementData {
  return {
    xp: 0, level: 0, rank: 'Novice',
    currentStreak: 0, bestStreak: 0,
    lastActiveDate: null, loginBonusAwardedToday: false,
    dailyMissions: [], missionsLastGeneratedDate: null,
    questionHistory: {},
    todayStats: {
      questionsAnswered: 0, correctAnswers: 0, bestStreakToday: 0,
      currentStreakToday: 0, xpEarnedToday: 0, hardQuestionsCorrect: 0,
      perfectRounds: 0, flashcardsReviewed: 0,
      date: new Date().toISOString().slice(0, 10),
    },
    recentXpGains: [],
    weeklyXp: [0, 0, 0, 0, 0, 0, 0],
    weekStartDate: null,
  }
}

export function ensureTodayMissions(data: EngagementData): EngagementData {
  const today = new Date().toISOString().slice(0, 10)
  let updated = ensureWeeklyXpFresh(data)

  if (updated.missionsLastGeneratedDate === today && updated.dailyMissions.length > 0) return updated

  const isNewDay = updated.todayStats.date !== today
  updated = {
    ...updated,
    dailyMissions: generateDailyMissions(),
    missionsLastGeneratedDate: today,
    todayStats: isNewDay
      ? { questionsAnswered: 0, correctAnswers: 0, bestStreakToday: 0, currentStreakToday: 0, xpEarnedToday: 0, hardQuestionsCorrect: 0, perfectRounds: 0, flashcardsReviewed: 0, date: today }
      : updated.todayStats,
  }
  if (isNewDay) updated.loginBonusAwardedToday = false
  return updated
}

export function processAnswer(
  data: EngagementData,
  attempt: QuestionAttempt
): { data: EngagementData; xpGained: number; xpBreakdown: string[] } {
  let updated = { ...data }
  updated = updateDailyStreak(updated)
  updated = ensureTodayMissions(updated)
  updated.questionHistory = updateQuestionHistory(updated.questionHistory, attempt)

  const ts = { ...updated.todayStats }
  ts.questionsAnswered += 1
  if (attempt.answeredCorrectly) {
    ts.correctAnswers += 1
    ts.currentStreakToday += 1
    ts.bestStreakToday = Math.max(ts.bestStreakToday, ts.currentStreakToday)
    if (attempt.difficulty === 'hard' || attempt.difficulty === 'expert') ts.hardQuestionsCorrect += 1
  } else {
    ts.currentStreakToday = 0
  }
  updated.todayStats = ts

  const { xp: answerXp, breakdown } = calculateAnswerXp(attempt.difficulty, attempt.answeredCorrectly, ts.currentStreakToday, attempt.responseTimeMs)

  let loginBonus = 0
  if (!updated.loginBonusAwardedToday) {
    loginBonus = XP_TABLE.dailyLoginBonus
    updated.loginBonusAwardedToday = true
    breakdown.push(`Daily login: +${loginBonus}`)
  }

  const { missions, xpFromMissions } = updateMissionProgress(updated.dailyMissions, attempt, ts)
  updated.dailyMissions = missions

  const totalXp = answerXp + xpFromMissions + loginBonus
  if (xpFromMissions > 0) breakdown.push(`Mission complete: +${xpFromMissions}`)

  updated.xp += totalXp
  updated.level = levelFromXp(updated.xp)
  updated.rank = rankFromLevel(updated.level)
  updated.todayStats.xpEarnedToday += totalXp

  if (totalXp > 0) {
    updated.recentXpGains = [
      { amount: totalXp, reason: breakdown.join(' · '), timestamp: attempt.timestamp },
      ...updated.recentXpGains,
    ].slice(0, 10)
  }

  const dayOfWeek = new Date().getDay()
  const weeklyXp = [...updated.weeklyXp]
  weeklyXp[dayOfWeek] = (weeklyXp[dayOfWeek] || 0) + totalXp
  updated.weeklyXp = weeklyXp

  return { data: updated, xpGained: totalXp, xpBreakdown: breakdown }
}
