#!/usr/bin/env npx tsx
import { allGeneratedNursingFlashcards, allGeneratedNursingQuestions } from '../src/data/nursing/generated'

type DomainItem = { domain: string }

function countByDomain<T extends DomainItem>(items: T[]): Record<string, number> {
  return items.reduce<Record<string, number>>((acc, item) => {
    acc[item.domain] = (acc[item.domain] ?? 0) + 1
    return acc
  }, {})
}

const normalize = (value: string) => value.toLowerCase().replace(/\s+/g, ' ').trim()

function main() {
  const questions = allGeneratedNursingQuestions
  const flashcards = allGeneratedNursingFlashcards

  const questionStemCounts = new Map<string, number>()
  for (const question of questions) {
    const key = normalize(question.question)
    questionStemCounts.set(key, (questionStemCounts.get(key) ?? 0) + 1)
  }
  const nearDuplicateStems = [...questionStemCounts.values()].filter((value) => value > 1).length

  const flashcardDuplicateCounts = new Map<string, number>()
  for (const flashcard of flashcards) {
    const key = `${flashcard.domain}::${normalize(flashcard.question)}::${normalize(flashcard.answer)}`
    flashcardDuplicateCounts.set(key, (flashcardDuplicateCounts.get(key) ?? 0) + 1)
  }
  const exactDuplicateFlashcards = [...flashcardDuplicateCounts.values()].filter((value) => value > 1).length

  const invalidQuestions = questions.filter(
    (question) =>
      !question.id ||
      !question.domain ||
      !question.question ||
      !Array.isArray(question.options) ||
      question.options.length < 2 ||
      !question.explanation ||
      !question.questionType,
  ).length

  const invalidFlashcards = flashcards.filter(
    (flashcard) => !flashcard.id || !flashcard.domain || !flashcard.question || !flashcard.answer,
  ).length

  const report = {
    questions: {
      total: questions.length,
      byDomain: countByDomain(questions),
      nearDuplicateStems,
      invalid: invalidQuestions,
    },
    flashcards: {
      total: flashcards.length,
      byDomain: countByDomain(flashcards),
      exactDuplicates: exactDuplicateFlashcards,
      invalid: invalidFlashcards,
    },
  }

  console.log(JSON.stringify(report, null, 2))
}

main()
