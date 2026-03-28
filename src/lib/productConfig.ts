/**
 * Product configuration — delegates to @apracademy/core-domain.
 * This file adds content-aware helpers that combine domain config with data packs.
 */
import { getProductConfig, getDefaultDomains, getDomainName } from '@apracademy/core-domain'
import { comprehensiveContent } from '@/data/comprehensive'
import { nursingContent } from '@/data/nursing'
import type { ProductLine, PracticeQuestion, Flashcard, StudyMaterial } from '@apracademy/contracts'

export type { DomainConfig, ProductConfig } from '@apracademy/contracts'
export { getProductConfig, getDefaultDomains, getDomainName }

export function getAllPracticeQuestions(productLine: ProductLine): PracticeQuestion[] {
  if (productLine === 'nursing') return Object.values(nursingContent.practiceQuestions).flat()
  return Object.values(comprehensiveContent.practiceQuestions).flat()
}

export function getAllFlashcards(productLine: ProductLine): Flashcard[] {
  if (productLine === 'nursing') return Object.values(nursingContent.flashcards).flat()
  return Object.values(comprehensiveContent.flashcards).flat()
}

export function getAllStudyMaterials(productLine: ProductLine): StudyMaterial[] {
  if (productLine === 'nursing') return Object.values(nursingContent.studyMaterials).flat()
  return Object.values(comprehensiveContent.studyMaterials).flat()
}
