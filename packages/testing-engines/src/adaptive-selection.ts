import type { PracticeQuestion, QuestionHistory } from '@apracademy/contracts'

interface ScoredQuestion {
  question: PracticeQuestion
  score: number
  reason: 'due_review' | 'novel' | 'confidence' | 'stretch' | 'zone'
}

function getDaysBetween(a: string, b: string): number {
  return (new Date(b).getTime() - new Date(a).getTime()) / (1000 * 60 * 60 * 24)
}

function domainAccuracy(history: QuestionHistory, domain: string): number {
  let total = 0
  let correct = 0
  for (const [, h] of Object.entries(history)) {
    if (domain !== 'all' && h.domain !== domain) continue
    total += h.attempts
    correct += h.correctCount
  }
  if (total === 0) return 0.5
  return correct / total
}

function shuffleArray<T>(arr: T[]): void {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
}

export function selectAdaptiveQuestions(
  pool: PracticeQuestion[],
  history: QuestionHistory,
  count: number,
  selectedDomains: string[]
): PracticeQuestion[] {
  const now = new Date().toISOString()
  const domainPool = pool.filter(q => selectedDomains.includes(q.domain))
  if (domainPool.length === 0) return []

  const globalAccuracy = domainAccuracy(history, 'all')

  const scored: ScoredQuestion[] = domainPool.map(q => {
    const h = history[q.id]
    let score = 0
    let reason: ScoredQuestion['reason'] = 'novel'

    if (!h) {
      score = 80 + Math.random() * 20
      reason = 'novel'
    } else if (h.nextDueDate && new Date(h.nextDueDate) <= new Date(now)) {
      const overdueDays = getDaysBetween(h.nextDueDate, now)
      score = 100 + Math.min(overdueDays * 5, 50)
      reason = 'due_review'
    } else if (!h.lastCorrect) {
      score = 60 + Math.random() * 15
      reason = 'due_review'
    } else {
      score = 10 + Math.random() * 20
      reason = 'zone'
    }

    return { question: q, score, reason }
  })

  const difficultyTier: Record<string, number> = { medium: 0, hard: 1, expert: 2 }

  let targetConfidenceRatio: number
  let targetStretchRatio: number

  if (globalAccuracy > 0.8) {
    targetConfidenceRatio = 0.1
    targetStretchRatio = 0.4
  } else if (globalAccuracy > 0.65) {
    targetConfidenceRatio = 0.25
    targetStretchRatio = 0.2
  } else if (globalAccuracy > 0.45) {
    targetConfidenceRatio = 0.4
    targetStretchRatio = 0.1
  } else {
    targetConfidenceRatio = 0.55
    targetStretchRatio = 0.05
  }

  for (const sq of scored) {
    if (sq.reason === 'due_review') continue

    const tier = difficultyTier[sq.question.difficulty] ?? 1
    const roll = Math.random()

    if (tier === 0 && roll < targetConfidenceRatio) {
      sq.score += 40
      sq.reason = 'confidence'
    } else if (tier === 2 && roll < targetStretchRatio) {
      sq.score += 35
      sq.reason = 'stretch'
    } else {
      sq.score += 15
      sq.reason = 'zone'
    }
  }

  scored.sort((a, b) => b.score - a.score)

  const selected: ScoredQuestion[] = []
  const domainCounts: Record<string, number> = {}
  const maxPerDomain = Math.ceil(count * 0.5)

  for (const sq of scored) {
    if (selected.length >= count) break
    const dc = domainCounts[sq.question.domain] || 0
    if (dc >= maxPerDomain && selected.length < count - 1) continue
    selected.push(sq)
    domainCounts[sq.question.domain] = dc + 1
  }

  if (selected.length < count) {
    const selectedIds = new Set(selected.map(s => s.question.id))
    for (const sq of scored) {
      if (selected.length >= count) break
      if (!selectedIds.has(sq.question.id)) selected.push(sq)
    }
  }

  const reviews = selected.filter(s => s.reason === 'due_review')
  const others = selected.filter(s => s.reason !== 'due_review')
  shuffleArray(others)

  const result: PracticeQuestion[] = []
  let ri = 0
  let oi = 0
  for (let i = 0; i < selected.length; i++) {
    if (ri < reviews.length && (i === 0 || i === 3 || i === 7 || i % 5 === 0)) {
      result.push(reviews[ri].question)
      ri++
    } else if (oi < others.length) {
      result.push(others[oi].question)
      oi++
    } else if (ri < reviews.length) {
      result.push(reviews[ri].question)
      ri++
    }
  }

  return result
}
