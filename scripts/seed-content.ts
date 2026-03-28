/**
 * Seed content (questions, flashcards, study materials) from TS files into the database.
 * Run after prisma migrate/deploy: npx tsx scripts/seed-content.ts
 *
 * Requires DATABASE_URL in .env
 */
import 'dotenv/config'
import { prisma } from '../src/lib/prisma'
import { getPrismaInitError } from '../src/lib/prisma'
import { allPracticeQuestions } from '../src/data/comprehensive'
import { comprehensiveContent } from '../src/data/comprehensive'
import { nursingAllPracticeQuestions, nursingAllFlashcards, nursingAllStudyMaterials } from '../src/data/nursing'
import type { PracticeQuestion, Flashcard, StudyMaterial } from '@apracademy/contracts'

const PRODUCT_LINES = ['psychology', 'nursing'] as const

function toQuestionRow(q: PracticeQuestion, productLine: string) {
  return {
    productLine,
    externalId: q.id,
    domain: q.domain,
    category: q.category,
    difficulty: q.difficulty,
    question: q.question,
    options: q.options as object,
    correctAnswer: q.correctAnswer,
    caseStudy: q.caseStudy ?? null,
    distractorRationale: (q.distractorRationale ?? []) as object,
    explanation: q.explanation,
    references: (q.references ?? []) as object,
    clinicalPearls: q.clinicalPearls ?? null,
    questionType: q.questionType,
  }
}

function toFlashcardRow(f: Flashcard, productLine: string) {
  return {
    productLine,
    externalId: f.id,
    domain: f.domain,
    question: f.question,
    answer: f.answer,
    options: (f.options ?? []) as object | null,
    correctOption: f.correctOption ?? null,
    category: f.category,
    difficulty: f.difficulty,
    explanation: f.explanation ?? null,
    references: (f.references ?? []) as object | null,
    clinicalPearls: f.clinicalPearls ?? null,
  }
}

function toStudyMaterialRow(sm: StudyMaterial, productLine: string) {
  return {
    productLine,
    externalId: sm.id,
    title: sm.title,
    domain: sm.domain,
    category: sm.category,
    content: sm.content,
    type: sm.type,
    lastUpdated: sm.lastUpdated,
    keyPoints: sm.keyPoints as object,
    commonMistakes: sm.commonMistakes as object,
    examTips: sm.examTips as object,
    references: sm.references as object,
  }
}

async function seedQuestions() {
  const psychologyQuestions = allPracticeQuestions
  const nursingQuestions = nursingAllPracticeQuestions

  const rows = [
    ...psychologyQuestions.map((q) => toQuestionRow(q, 'psychology')),
    ...nursingQuestions.map((q) => toQuestionRow(q, 'nursing')),
  ]

  let created = 0
  let updated = 0
  for (const row of rows) {
    const existing = await prisma.practiceQuestionContent.findUnique({
      where: { productLine_externalId: { productLine: row.productLine, externalId: row.externalId } },
    })
    if (existing) {
      await prisma.practiceQuestionContent.update({
        where: { id: existing.id },
        data: row,
      })
      updated++
    } else {
      await prisma.practiceQuestionContent.create({ data: row })
      created++
    }
  }
  return { created, updated, total: rows.length }
}

async function seedFlashcards() {
  const psychologyFlashcards = [
    ...comprehensiveContent.flashcards.ethics,
    ...comprehensiveContent.flashcards.assessment,
    ...comprehensiveContent.flashcards.interventions,
    ...comprehensiveContent.flashcards.communication,
  ]
  const nursingFlashcards = nursingAllFlashcards

  const rows = [
    ...psychologyFlashcards.map((f) => toFlashcardRow(f, 'psychology')),
    ...nursingFlashcards.map((f) => toFlashcardRow(f, 'nursing')),
  ]

  let created = 0
  let updated = 0
  for (const row of rows) {
    const existing = await prisma.flashcardContent.findUnique({
      where: { productLine_externalId: { productLine: row.productLine, externalId: row.externalId } },
    })
    if (existing) {
      await prisma.flashcardContent.update({
        where: { id: existing.id },
        data: row,
      })
      updated++
    } else {
      await prisma.flashcardContent.create({ data: row })
      created++
    }
  }
  return { created, updated, total: rows.length }
}

async function seedStudyMaterials() {
  const psychologyMaterials = [
    ...comprehensiveContent.studyMaterials.ethics,
    ...comprehensiveContent.studyMaterials.assessment,
    ...comprehensiveContent.studyMaterials.interventions,
    ...comprehensiveContent.studyMaterials.communication,
  ]
  const nursingMaterials = nursingAllStudyMaterials

  const rows = [
    ...psychologyMaterials.map((sm) => toStudyMaterialRow(sm, 'psychology')),
    ...nursingMaterials.map((sm) => toStudyMaterialRow(sm, 'nursing')),
  ]

  let created = 0
  let updated = 0
  for (const row of rows) {
    const existing = await prisma.studyMaterialContent.findUnique({
      where: { productLine_externalId: { productLine: row.productLine, externalId: row.externalId } },
    })
    if (existing) {
      await prisma.studyMaterialContent.update({
        where: { id: existing.id },
        data: row,
      })
      updated++
    } else {
      await prisma.studyMaterialContent.create({ data: row })
      created++
    }
  }
  return { created, updated, total: rows.length }
}

async function main() {
  if (!process.env.DATABASE_URL) {
    console.error('❌ DATABASE_URL is required. Add it to your .env file.')
    process.exit(1)
  }

  const initError = getPrismaInitError()
  if (initError) {
    console.error('❌ Prisma failed to initialize:', initError.message)
    process.exit(1)
  }

  console.log('🌱 Seeding content into database...\n')

  try {
    const qResult = await seedQuestions()
    console.log(`✓ Practice questions: ${qResult.created} created, ${qResult.updated} updated (${qResult.total} total)`)

    const fResult = await seedFlashcards()
    console.log(`✓ Flashcards: ${fResult.created} created, ${fResult.updated} updated (${fResult.total} total)`)

    const sResult = await seedStudyMaterials()
    console.log(`✓ Study materials: ${sResult.created} created, ${sResult.updated} updated (${sResult.total} total)`)

    console.log('\n✅ Seed complete.')
  } catch (err) {
    console.error('❌ Seed failed:', err)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()
