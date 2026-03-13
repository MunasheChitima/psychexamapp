import type { Domain, Flashcard, PracticeQuestion } from '@/types'

type NursingSeed = {
  id: string
  domain: Domain
  category: string
  question: string
  caseStudy: string
  options: string[]
  correctAnswer: number
  explanation: string
  references: string[]
  flashcardQ: string
  flashcardA: string
}

export function buildNursingContent(seed: NursingSeed[]) {
  const practiceQuestions: PracticeQuestion[] = seed.map((item) => ({
    id: item.id,
    domain: item.domain,
    category: item.category,
    difficulty: 'hard',
    caseStudy: item.caseStudy,
    question: item.question,
    options: item.options,
    correctAnswer: item.correctAnswer,
    distractorRationale: item.options.map((_, index) =>
      index === item.correctAnswer ? 'Best answer aligned to Australian nursing standards.' : 'Partially correct or unsafe for this scenario.'
    ),
    explanation: item.explanation,
    references: item.references,
    clinicalPearls: 'Apply NMBA standards, scope, and patient safety principles first.',
    questionType: 'clinical-judgment',
  }))

  const flashcards: Flashcard[] = seed.map((item, index) => ({
    id: `${item.id}-f${index + 1}`,
    domain: item.domain,
    question: item.flashcardQ,
    answer: item.flashcardA,
    category: item.category,
    difficulty: 'medium',
    lastReviewed: null,
    nextReview: null,
    reviewCount: 0,
    masteryLevel: 0,
    references: item.references,
    clinicalPearls: 'Anchor decisions to Australian policy and safe care.',
  }))

  return { practiceQuestions, flashcards }
}
