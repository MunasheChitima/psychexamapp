/**
 * Database-backed content service.
 * Fetches questions, flashcards, and study materials from the DB.
 * Falls back to static imports when DB is unavailable.
 */
import { prisma, getPrismaInitError } from '@/lib/prisma'
import type { PracticeQuestion, Flashcard, StudyMaterial } from '@apracademy/contracts'
import type { ProductLine } from '@apracademy/contracts'
import { getAllPracticeQuestions as getStaticQuestions } from '@/lib/productConfig'
import { getAllFlashcards as getStaticFlashcards } from '@/lib/productConfig'
import { getAllStudyMaterials as getStaticStudyMaterials } from '@/lib/productConfig'

function toPracticeQuestion(row: {
  externalId: string
  domain: string
  category: string
  difficulty: string
  question: string
  options: unknown
  correctAnswer: number
  caseStudy: string | null
  distractorRationale: unknown
  explanation: string
  references: unknown
  clinicalPearls: string | null
  questionType: string
}): PracticeQuestion {
  return {
    id: row.externalId,
    domain: row.domain as PracticeQuestion['domain'],
    category: row.category,
    difficulty: row.difficulty as PracticeQuestion['difficulty'],
    question: row.question,
    options: (row.options as string[]) ?? [],
    correctAnswer: row.correctAnswer,
    caseStudy: row.caseStudy ?? '',
    distractorRationale: (row.distractorRationale as string[]) ?? [],
    explanation: row.explanation,
    references: (row.references as string[]) ?? [],
    clinicalPearls: row.clinicalPearls ?? undefined,
    questionType: row.questionType as PracticeQuestion['questionType'],
  }
}

function toFlashcard(row: {
  externalId: string
  domain: string
  question: string
  answer: string
  options: unknown
  correctOption: number | null
  category: string
  difficulty: string
  explanation: string | null
  references: unknown
  clinicalPearls: string | null
}): Flashcard {
  return {
    id: row.externalId,
    domain: row.domain as Flashcard['domain'],
    question: row.question,
    answer: row.answer,
    options: (row.options as string[]) ?? undefined,
    correctOption: row.correctOption ?? undefined,
    category: row.category,
    difficulty: row.difficulty as Flashcard['difficulty'],
    explanation: row.explanation ?? undefined,
    references: (row.references as string[]) ?? undefined,
    clinicalPearls: row.clinicalPearls ?? undefined,
    lastReviewed: null,
    nextReview: null,
    reviewCount: 0,
    masteryLevel: 0,
  }
}

function toStudyMaterial(row: {
  externalId: string
  title: string
  domain: string
  category: string
  content: string
  type: string
  lastUpdated: string
  keyPoints: unknown
  commonMistakes: unknown
  examTips: unknown
  references: unknown
}): StudyMaterial {
  return {
    id: row.externalId,
    title: row.title,
    domain: row.domain as StudyMaterial['domain'],
    category: row.category,
    content: row.content,
    type: row.type as StudyMaterial['type'],
    difficulty: 'comprehensive',
    lastUpdated: row.lastUpdated,
    keyPoints: (row.keyPoints as string[]) ?? [],
    commonMistakes: (row.commonMistakes as string[]) ?? [],
    examTips: (row.examTips as string[]) ?? [],
    references: (row.references as string[]) ?? [],
  }
}

export async function getPracticeQuestionsFromDb(
  productLine: ProductLine
): Promise<PracticeQuestion[] | null> {
  if (getPrismaInitError()) return null
  try {
    const rows = await prisma.practiceQuestionContent.findMany({
      where: { productLine },
      orderBy: { externalId: 'asc' },
    })
    if (rows.length === 0) return null
    return rows.map(toPracticeQuestion)
  } catch (err) {
    console.error('[contentDb] DB read failed, using static fallback', err)
    return null
  }
}

export async function getFlashcardsFromDb(
  productLine: ProductLine
): Promise<Flashcard[] | null> {
  if (getPrismaInitError()) return null
  try {
    const rows = await prisma.flashcardContent.findMany({
      where: { productLine },
      orderBy: { externalId: 'asc' },
    })
    if (rows.length === 0) return null
    return rows.map(toFlashcard)
  } catch (err) {
    console.error('[contentDb] DB read failed, using static fallback', err)
    return null
  }
}

export async function getStudyMaterialsFromDb(
  productLine: ProductLine
): Promise<StudyMaterial[] | null> {
  if (getPrismaInitError()) return null
  try {
    const rows = await prisma.studyMaterialContent.findMany({
      where: { productLine },
      orderBy: { externalId: 'asc' },
    })
    if (rows.length === 0) return null
    return rows.map(toStudyMaterial)
  } catch (err) {
    console.error('[contentDb] DB read failed, using static fallback', err)
    return null
  }
}

/**
 * Get practice questions — from DB if available, else from static imports.
 */
export async function getAllPracticeQuestionsAsync(
  productLine: ProductLine
): Promise<PracticeQuestion[]> {
  const fromDb = await getPracticeQuestionsFromDb(productLine)
  if (fromDb && fromDb.length > 0) return fromDb
  return getStaticQuestions(productLine)
}

/**
 * Get flashcards — from DB if available, else from static imports.
 */
export async function getAllFlashcardsAsync(
  productLine: ProductLine
): Promise<Flashcard[]> {
  const fromDb = await getFlashcardsFromDb(productLine)
  if (fromDb && fromDb.length > 0) return fromDb
  return getStaticFlashcards(productLine)
}

/**
 * Get study materials — from DB if available, else from static imports.
 */
export async function getAllStudyMaterialsAsync(
  productLine: ProductLine
): Promise<StudyMaterial[]> {
  const fromDb = await getStudyMaterialsFromDb(productLine)
  if (fromDb && fromDb.length > 0) return fromDb
  return getStaticStudyMaterials(productLine)
}
