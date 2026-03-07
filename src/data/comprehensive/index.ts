import { ethicsFlashcards } from './ethicsFlashcards'
import { confidentialityExceptionsFlashcards } from './confidentialityExceptions'
import { practiceQuestions } from './practiceQuestions'
import { studyMaterials } from './studyMaterials'
import { extendedEthicsQuestions } from './extended/ethicsQuestions'
import { assessmentQuestions, assessmentFlashcards } from './extended/assessmentContent'
import { interventionsQuestions, interventionsFlashcards } from './extended/interventionsContent'
import { communicationQuestions, communicationFlashcards } from './extended/communicationContent'
import { officialSampleQuestions, officialSampleFlashcards } from './extended/officialSamples'
import { uiQuestions } from './extended/uiQuestions'
import { uiFlashcards } from './extended/uiFlashcards'
import { extraQuestions } from './extended/extraQuestions'
import { extraQuestions2 } from './extended/extraQuestions2'
import { extraQuestions3 } from './extended/extraQuestions3'
import { extraQuestions4 } from './extended/extraQuestions4'
import { extraQuestions5 } from './extended/extraQuestions5'
import { extraFlashcards } from './extended/extraFlashcards'

export const comprehensiveContent = {
  flashcards: {
    ethics: [
      ...ethicsFlashcards,
      ...confidentialityExceptionsFlashcards,
      ...officialSampleFlashcards.filter(f => f.domain === 'ethics'),
      ...uiFlashcards.filter(f => f.domain === 'ethics'),
      ...extraFlashcards.filter(f => f.domain === 'ethics')
    ],
    assessment: [
      ...assessmentFlashcards,
      ...officialSampleFlashcards.filter(f => f.domain === 'assessment'),
      ...uiFlashcards.filter(f => f.domain === 'assessment'),
      ...extraFlashcards.filter(f => f.domain === 'assessment')
    ],
    interventions: [
      ...interventionsFlashcards,
      ...officialSampleFlashcards.filter(f => f.domain === 'interventions'),
      ...uiFlashcards.filter(f => f.domain === 'interventions'),
      ...extraFlashcards.filter(f => f.domain === 'interventions')
    ],
    communication: [
      ...communicationFlashcards,
      ...officialSampleFlashcards.filter(f => f.domain === 'communication'),
      ...uiFlashcards.filter(f => f.domain === 'communication'),
      ...extraFlashcards.filter(f => f.domain === 'communication')
    ]
  },

  practiceQuestions: {
    ethics: [
      ...practiceQuestions.filter(q => q.domain === 'ethics'),
      ...extendedEthicsQuestions,
      ...officialSampleQuestions.filter(q => q.domain === 'ethics'),
      ...uiQuestions.filter(q => q.domain === 'ethics'),
      ...extraQuestions.filter(q => q.domain === 'ethics'),
      ...extraQuestions2.filter(q => q.domain === 'ethics'),
      ...extraQuestions3.filter(q => q.domain === 'ethics'),
      ...extraQuestions4.filter(q => q.domain === 'ethics'),
      ...extraQuestions5.filter(q => q.domain === 'ethics')
    ],
    assessment: [
      ...practiceQuestions.filter(q => q.domain === 'assessment'),
      ...assessmentQuestions,
      ...officialSampleQuestions.filter(q => q.domain === 'assessment'),
      ...uiQuestions.filter(q => q.domain === 'assessment'),
      ...extraQuestions.filter(q => q.domain === 'assessment'),
      ...extraQuestions2.filter(q => q.domain === 'assessment'),
      ...extraQuestions3.filter(q => q.domain === 'assessment'),
      ...extraQuestions4.filter(q => q.domain === 'assessment'),
      ...extraQuestions5.filter(q => q.domain === 'assessment')
    ],
    interventions: [
      ...practiceQuestions.filter(q => q.domain === 'interventions'),
      ...interventionsQuestions,
      ...officialSampleQuestions.filter(q => q.domain === 'interventions'),
      ...uiQuestions.filter(q => q.domain === 'interventions'),
      ...extraQuestions.filter(q => q.domain === 'interventions'),
      ...extraQuestions2.filter(q => q.domain === 'interventions'),
      ...extraQuestions3.filter(q => q.domain === 'interventions'),
      ...extraQuestions4.filter(q => q.domain === 'interventions'),
      ...extraQuestions5.filter(q => q.domain === 'interventions')
    ],
    communication: [
      ...practiceQuestions.filter(q => q.domain === 'communication'),
      ...communicationQuestions,
      ...officialSampleQuestions.filter(q => q.domain === 'communication'),
      ...uiQuestions.filter(q => q.domain === 'communication'),
      ...extraQuestions.filter(q => q.domain === 'communication'),
      ...extraQuestions2.filter(q => q.domain === 'communication'),
      ...extraQuestions3.filter(q => q.domain === 'communication'),
      ...extraQuestions4.filter(q => q.domain === 'communication'),
      ...extraQuestions5.filter(q => q.domain === 'communication')
    ]
  },

  studyMaterials: {
    ethics: studyMaterials.filter(sm => sm.domain === 'ethics'),
    assessment: studyMaterials.filter(sm => sm.domain === 'assessment'),
    interventions: studyMaterials.filter(sm => sm.domain === 'interventions'),
    communication: studyMaterials.filter(sm => sm.domain === 'communication')
  }
}

export {
  ethicsFlashcards,
  confidentialityExceptionsFlashcards,
  practiceQuestions,
  studyMaterials,
  extendedEthicsQuestions,
  assessmentQuestions,
  assessmentFlashcards,
  interventionsQuestions,
  interventionsFlashcards,
  communicationQuestions,
  communicationFlashcards
}

const allPracticeQuestions = [
  ...practiceQuestions,
  ...extendedEthicsQuestions,
  ...assessmentQuestions,
  ...interventionsQuestions,
  ...communicationQuestions,
  ...officialSampleQuestions,
  ...uiQuestions,
  ...extraQuestions,
  ...extraQuestions2,
  ...extraQuestions3,
  ...extraQuestions4,
  ...extraQuestions5
]

const allFlashcards = [
  ...ethicsFlashcards,
  ...confidentialityExceptionsFlashcards,
  ...assessmentFlashcards,
  ...interventionsFlashcards,
  ...communicationFlashcards,
  ...officialSampleFlashcards,
  ...uiFlashcards,
  ...extraFlashcards
]

export const contentStats = {
  totalFlashcards: allFlashcards.length,
  totalPracticeQuestions: allPracticeQuestions.length,
  totalStudyMaterials: studyMaterials.length,

  flashcardsByDomain: {
    ethics: allFlashcards.filter(f => f.domain === 'ethics').length,
    assessment: allFlashcards.filter(f => f.domain === 'assessment').length,
    interventions: allFlashcards.filter(f => f.domain === 'interventions').length,
    communication: allFlashcards.filter(f => f.domain === 'communication').length
  },

  practiceQuestionsByDomain: {
    ethics: allPracticeQuestions.filter(q => q.domain === 'ethics').length,
    assessment: allPracticeQuestions.filter(q => q.domain === 'assessment').length,
    interventions: allPracticeQuestions.filter(q => q.domain === 'interventions').length,
    communication: allPracticeQuestions.filter(q => q.domain === 'communication').length
  }
}
