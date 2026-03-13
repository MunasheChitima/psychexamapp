import { PracticeQuestion, Flashcard, NursingDomain } from '../../../types'
import { generatedQuestions_20260311 as q_0 } from './genQuestions_20260311'
import { generatedQuestions_20260311 as q_1 } from './genQuestions_20260311_105244_risk-reduction'
import { generatedQuestions_20260311 as q_2 } from './genQuestions_20260311_134583_management-of-care'
import { generatedQuestions_20260311 as q_3 } from './genQuestions_20260311_162566_safety-infection'
import { generatedQuestions_20260311 as q_4 } from './genQuestions_20260311_176017_all'
import { generatedQuestions_20260311 as q_5 } from './genQuestions_20260311_231573_safety-infection'
import { generatedQuestions_20260311 as q_6 } from './genQuestions_20260311_311742_pharmacology'
import { generatedQuestions_20260311 as q_7 } from './genQuestions_20260311_311742_physiological'
import { generatedQuestions_20260311 as q_8 } from './genQuestions_20260311_319850_all'
import { generatedQuestions_20260311 as q_9 } from './genQuestions_20260311_325151_psychosocial'
import { generatedQuestions_20260311 as q_10 } from './genQuestions_20260311_385535_psychosocial'
import { generatedQuestions_20260311 as q_11 } from './genQuestions_20260311_509544_basic-care'
import { generatedQuestions_20260311 as q_12 } from './genQuestions_20260311_548280_osce-skills'
import { generatedQuestions_20260311 as q_13 } from './genQuestions_20260311_581683_pharmacology'
import { generatedQuestions_20260311 as q_14 } from './genQuestions_20260311_599095_osce-skills'
import { generatedQuestions_20260311 as q_15 } from './genQuestions_20260311_621430_health-promotion'
import { generatedQuestions_20260311 as q_16 } from './genQuestions_20260311_702682_risk-reduction'
import { generatedQuestions_20260311 as q_17 } from './genQuestions_20260311_723298_health-promotion'
import { generatedQuestions_20260311 as q_18 } from './genQuestions_20260311_830140_physiological'
import { generatedQuestions_20260311 as q_19 } from './genQuestions_20260311_957963_basic-care'
import { generatedQuestions_20260311 as q_20 } from './genQuestions_20260311_965369_management-of-care'
import { generatedFlashcards_20260311 as f_0 } from './genFlashcards_20260311_013920_psychosocial'
import { generatedFlashcards_20260311 as f_1 } from './genFlashcards_20260311_140763_management-of-care'
import { generatedFlashcards_20260311 as f_2 } from './genFlashcards_20260311_224549_safety-infection'
import { generatedFlashcards_20260311 as f_3 } from './genFlashcards_20260311_298546_all'
import { generatedFlashcards_20260311 as f_4 } from './genFlashcards_20260311_470986_basic-care'
import { generatedFlashcards_20260311 as f_5 } from './genFlashcards_20260311_503983_risk-reduction'
import { generatedFlashcards_20260311 as f_6 } from './genFlashcards_20260311_565499_health-promotion'
import { generatedFlashcards_20260311 as f_7 } from './genFlashcards_20260311_611669_health-promotion'
import { generatedFlashcards_20260311 as f_8 } from './genFlashcards_20260311_620918_psychosocial'
import { generatedFlashcards_20260311 as f_9 } from './genFlashcards_20260311_670180_basic-care'
import { generatedFlashcards_20260311 as f_10 } from './genFlashcards_20260311_729100_pharmacology'
import { generatedFlashcards_20260311 as f_11 } from './genFlashcards_20260311_769145_pharmacology'
import { generatedFlashcards_20260311 as f_12 } from './genFlashcards_20260311_796774_risk-reduction'
import { generatedFlashcards_20260311 as f_13 } from './genFlashcards_20260311_875627_osce-skills'

const rawGeneratedNursingQuestions: PracticeQuestion[] = [
  ...q_0,
  ...q_1,
  ...q_2,
  ...q_3,
  ...q_4,
  ...q_5,
  ...q_6,
  ...q_7,
  ...q_8,
  ...q_9,
  ...q_10,
  ...q_11,
  ...q_12,
  ...q_13,
  ...q_14,
  ...q_15,
  ...q_16,
  ...q_17,
  ...q_18,
  ...q_19,
  ...q_20,
]

const rawGeneratedNursingFlashcards: Flashcard[] = [
  ...f_0,
  ...f_1,
  ...f_2,
  ...f_3,
  ...f_4,
  ...f_5,
  ...f_6,
  ...f_7,
  ...f_8,
  ...f_9,
  ...f_10,
  ...f_11,
  ...f_12,
  ...f_13,
]

const FLASHCARD_CAPS: Record<NursingDomain, number> = {
  'management-of-care': 300,
  'safety-infection': 220,
  'health-promotion': 170,
  psychosocial: 170,
  'basic-care': 170,
  pharmacology: 290,
  'risk-reduction': 220,
  physiological: 170,
  'osce-skills': 90,
}

const normalize = (value: unknown) => String(value ?? '').toLowerCase().replace(/\s+/g, ' ').trim()

export const allGeneratedNursingQuestions: PracticeQuestion[] = rawGeneratedNursingQuestions

export const allGeneratedNursingFlashcards: Flashcard[] = (() => {
  const seen = new Set<string>()
  const domainCounts: Record<NursingDomain, number> = {
    'management-of-care': 0,
    'safety-infection': 0,
    'health-promotion': 0,
    psychosocial: 0,
    'basic-care': 0,
    pharmacology: 0,
    'risk-reduction': 0,
    physiological: 0,
    'osce-skills': 0,
  }

  return rawGeneratedNursingFlashcards.filter((card) => {
    if (!(card.domain in FLASHCARD_CAPS)) return false
    if (!card.question || !card.answer) return false
    const domain = card.domain as NursingDomain
    const key = `${domain}::${normalize(card.question)}::${normalize(card.answer)}`
    if (seen.has(key)) return false
    if (domainCounts[domain] >= FLASHCARD_CAPS[domain]) return false
    seen.add(key)
    domainCounts[domain] += 1
    return true
  })
})()
