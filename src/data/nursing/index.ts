import { managementOfCareQuestions, managementOfCareFlashcards } from './managementOfCare'
import { safetyInfectionQuestions, safetyInfectionFlashcards } from './safetyInfection'
import { healthPromotionQuestions, healthPromotionFlashcards } from './healthPromotion'
import { psychosocialQuestions, psychosocialFlashcards } from './psychosocial'
import { basicCareQuestions, basicCareFlashcards } from './basicCare'
import { pharmacologyQuestions, pharmacologyFlashcards } from './pharmacology'
import { riskReductionQuestions, riskReductionFlashcards } from './riskReduction'
import { physiologicalQuestions, physiologicalFlashcards } from './physiological'
import { osceSkillsQuestions, osceSkillsFlashcards } from './osceSkills'
import { nursingStudyMaterials } from './studyMaterials'
import { allGeneratedNursingQuestions, allGeneratedNursingFlashcards } from './generated'

export const nursingContent = {
  practiceQuestions: {
    'management-of-care': [...managementOfCareQuestions, ...allGeneratedNursingQuestions.filter((item) => item.domain === 'management-of-care')],
    'safety-infection': [...safetyInfectionQuestions, ...allGeneratedNursingQuestions.filter((item) => item.domain === 'safety-infection')],
    'health-promotion': [...healthPromotionQuestions, ...allGeneratedNursingQuestions.filter((item) => item.domain === 'health-promotion')],
    psychosocial: [...psychosocialQuestions, ...allGeneratedNursingQuestions.filter((item) => item.domain === 'psychosocial')],
    'basic-care': [...basicCareQuestions, ...allGeneratedNursingQuestions.filter((item) => item.domain === 'basic-care')],
    pharmacology: [...pharmacologyQuestions, ...allGeneratedNursingQuestions.filter((item) => item.domain === 'pharmacology')],
    'risk-reduction': [...riskReductionQuestions, ...allGeneratedNursingQuestions.filter((item) => item.domain === 'risk-reduction')],
    physiological: [...physiologicalQuestions, ...allGeneratedNursingQuestions.filter((item) => item.domain === 'physiological')],
    'osce-skills': [...osceSkillsQuestions, ...allGeneratedNursingQuestions.filter((item) => item.domain === 'osce-skills')],
  },
  flashcards: {
    'management-of-care': [...managementOfCareFlashcards, ...allGeneratedNursingFlashcards.filter((item) => item.domain === 'management-of-care')],
    'safety-infection': [...safetyInfectionFlashcards, ...allGeneratedNursingFlashcards.filter((item) => item.domain === 'safety-infection')],
    'health-promotion': [...healthPromotionFlashcards, ...allGeneratedNursingFlashcards.filter((item) => item.domain === 'health-promotion')],
    psychosocial: [...psychosocialFlashcards, ...allGeneratedNursingFlashcards.filter((item) => item.domain === 'psychosocial')],
    'basic-care': [...basicCareFlashcards, ...allGeneratedNursingFlashcards.filter((item) => item.domain === 'basic-care')],
    pharmacology: [...pharmacologyFlashcards, ...allGeneratedNursingFlashcards.filter((item) => item.domain === 'pharmacology')],
    'risk-reduction': [...riskReductionFlashcards, ...allGeneratedNursingFlashcards.filter((item) => item.domain === 'risk-reduction')],
    physiological: [...physiologicalFlashcards, ...allGeneratedNursingFlashcards.filter((item) => item.domain === 'physiological')],
    'osce-skills': [...osceSkillsFlashcards, ...allGeneratedNursingFlashcards.filter((item) => item.domain === 'osce-skills')],
  },
  studyMaterials: {
    'management-of-care': nursingStudyMaterials.filter((item) => item.domain === 'management-of-care'),
    'safety-infection': nursingStudyMaterials.filter((item) => item.domain === 'safety-infection'),
    'health-promotion': nursingStudyMaterials.filter((item) => item.domain === 'health-promotion'),
    psychosocial: nursingStudyMaterials.filter((item) => item.domain === 'psychosocial'),
    'basic-care': nursingStudyMaterials.filter((item) => item.domain === 'basic-care'),
    pharmacology: nursingStudyMaterials.filter((item) => item.domain === 'pharmacology'),
    'risk-reduction': nursingStudyMaterials.filter((item) => item.domain === 'risk-reduction'),
    physiological: nursingStudyMaterials.filter((item) => item.domain === 'physiological'),
    'osce-skills': nursingStudyMaterials.filter((item) => item.domain === 'osce-skills'),
  },
}

export const nursingAllPracticeQuestions = Object.values(nursingContent.practiceQuestions).flat()
export const nursingAllFlashcards = Object.values(nursingContent.flashcards).flat()
export const nursingAllStudyMaterials = nursingStudyMaterials
