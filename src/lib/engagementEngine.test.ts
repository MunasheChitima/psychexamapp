import {
  calculateAnswerXp,
  createDefaultEngagementData,
  levelFromXp,
  processAnswer,
  rankFromLevel,
  updateMissionProgress,
  updateMissionsForFlashcard,
  xpForLevel,
  xpProgress,
} from '@/lib/engagementEngine'
import type { DailyMission, QuestionAttempt } from '@/types'

describe('engagementEngine', () => {
  test('calculates level thresholds and progress', () => {
    expect(xpForLevel(1)).toBe(100)
    expect(levelFromXp(99)).toBe(0)
    expect(levelFromXp(100)).toBe(1)

    const progress = xpProgress(150)
    expect(progress).toEqual({ current: 50, needed: 182, percent: 27 })
  })

  test('maps ranks from level milestones', () => {
    expect(rankFromLevel(0)).toBe('Novice')
    expect(rankFromLevel(3)).toBe('Student')
    expect(rankFromLevel(35)).toBe('Grandmaster')
  })

  test('awards XP for correct fast answer with streak bonus', () => {
    const result = calculateAnswerXp('medium', true, 2, 5000)
    expect(result.xp).toBe(30)
    expect(result.breakdown).toContain('Base: 15 XP (medium)')
    expect(result.breakdown).toContain('Streak x1.30')
    expect(result.breakdown).toContain('Speed bonus: +10')
  })

  test('gives zero XP for incorrect answers', () => {
    expect(calculateAnswerXp('expert', false, 10, 2000)).toEqual({
      xp: 0,
      breakdown: ['Incorrect — no XP'],
    })
  })

  test('completes matching domain mission and grants reward once', () => {
    const mission: DailyMission = {
      id: 'm1',
      type: 'domain_focus',
      title: 'Ethics Focus',
      description: 'Answer 1 ethics question',
      target: 1,
      current: 0,
      xpReward: 100,
      completed: false,
      difficulty: 'easy',
      targetDomain: 'ethics',
    }

    const attempt: QuestionAttempt = {
      questionId: 'q1',
      domain: 'ethics',
      difficulty: 'medium',
      answeredCorrectly: true,
      timestamp: '2026-03-13T00:00:00.000Z',
      responseTimeMs: 8000,
    }

    const { missions, xpFromMissions } = updateMissionProgress(
      [mission],
      attempt,
      {
        questionsAnswered: 1,
        correctAnswers: 1,
        bestStreakToday: 1,
        currentStreakToday: 1,
        xpEarnedToday: 0,
        hardQuestionsCorrect: 0,
        perfectRounds: 0,
        flashcardsReviewed: 0,
        date: '2026-03-13',
      }
    )

    expect(missions[0].current).toBe(1)
    expect(missions[0].completed).toBe(true)
    expect(xpFromMissions).toBe(100)
  })

  test('updates flashcard mission progress and reward', () => {
    const mission: DailyMission = {
      id: 'm-flash',
      type: 'review_flashcards',
      title: 'Card Shark',
      description: 'Review 10 flashcards',
      target: 10,
      current: 0,
      xpReward: 100,
      completed: false,
      difficulty: 'easy',
    }

    const { missions, xpFromMissions } = updateMissionsForFlashcard([mission], {
      questionsAnswered: 0,
      correctAnswers: 0,
      bestStreakToday: 0,
      currentStreakToday: 0,
      xpEarnedToday: 0,
      hardQuestionsCorrect: 0,
      perfectRounds: 0,
      flashcardsReviewed: 12,
      date: '2026-03-13',
    })

    expect(missions[0].current).toBe(12)
    expect(missions[0].completed).toBe(true)
    expect(xpFromMissions).toBe(100)
  })

  test('processAnswer applies answer XP, daily login bonus, and mission XP', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-03-13T09:00:00.000Z'))

    const today = '2026-03-13'
    const data = createDefaultEngagementData()
    data.missionsLastGeneratedDate = today
    data.todayStats.date = today
    data.dailyMissions = [
      {
        id: 'daily-1',
        type: 'answer_count',
        title: 'Warm Up',
        description: 'Answer 1 practice question',
        target: 1,
        current: 0,
        xpReward: 100,
        completed: false,
        difficulty: 'easy',
      },
    ]

    const attempt: QuestionAttempt = {
      questionId: 'q-1',
      domain: 'ethics',
      difficulty: 'medium',
      answeredCorrectly: true,
      timestamp: '2026-03-13T09:00:00.000Z',
      responseTimeMs: 5000,
    }

    const result = processAnswer(data, attempt)
    expect(result.xpGained).toBe(177)
    expect(result.data.loginBonusAwardedToday).toBe(true)
    expect(result.data.dailyMissions[0].completed).toBe(true)
    expect(result.data.todayStats.questionsAnswered).toBe(1)
    expect(result.data.recentXpGains[0].amount).toBe(177)

    vi.useRealTimers()
  })
})
