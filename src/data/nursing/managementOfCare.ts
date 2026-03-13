import { buildNursingContent } from './base'

const seed = [
  {
    id: 'n-moc-001',
    domain: 'management-of-care' as const,
    category: 'Delegation and Scope',
    caseStudy: 'A busy surgical ward has one RN, one EN, and one AIN on shift. A patient has rising pain, another needs routine observations, and a third requires discharge education before transfer.',
    question: 'Which delegation plan best reflects safe Australian RN practice?',
    options: [
      'Assign discharge education to the AIN and observations to the EN',
      'Assign routine observations to the AIN and retain discharge education under RN oversight',
      'Assign medication chart review to the EN without RN review',
      'Ask the AIN to complete all tasks while RN covers admissions',
      'Delegate pain reassessment to family carers with RN phone follow-up',
    ],
    correctAnswer: 1,
    explanation: 'RN remains accountable for complex education and clinical judgement while delegating predictable tasks within scope to support staff.',
    references: ['NMBA RN Standards for Practice', 'NSQHS Communicating for Safety Standard'],
    flashcardQ: 'In Australian wards, what is the RN delegation principle?',
    flashcardA: 'Delegate predictable tasks within scope, retain accountability for assessment, judgement, and care planning.',
  },
  {
    id: 'n-moc-002',
    domain: 'management-of-care' as const,
    category: 'Clinical Handover',
    caseStudy: 'You are handing over a deteriorating patient to the rapid response team and incoming night RN. Important findings include hypotension, reduced urine output, and new confusion.',
    question: 'Which handover structure should be used in Australian clinical settings?',
    options: ['SOAP', 'PIE', 'ISBAR', 'DAR', 'SBM-R'],
    correctAnswer: 2,
    explanation: 'ISBAR is the standard structured communication framework widely used in Australian hospitals.',
    references: ['ACSQHC Clinical Handover resources'],
    flashcardQ: 'What does ISBAR stand for?',
    flashcardA: 'Introduction, Situation, Background, Assessment, Recommendation.',
  },
]

export const { practiceQuestions: managementOfCareQuestions, flashcards: managementOfCareFlashcards } = buildNursingContent(seed)
